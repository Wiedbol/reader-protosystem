import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Toaster } from 'react-hot-toast';
import RecentBooks from '../../utils/readUtils/recordRecent';
import BookUtil from '../../utils/fileUtils/bookUtil';
import PDFWidget from '../../components/pdfWidget';
import PopupMenu from '../../components/popups/popupMenu';
import PopupBox from '../../components/popups/popupBox';
import { handleLinkJump } from '../../utils/readUtils/linkUtil';
import { pdfMouseEvent } from '../../utils/serviceUtils/mouseEvent';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import { renderHighlighters } from '../../utils/serviceUtils/noteUtil';
import { getPDFIframeDoc } from '../../utils/serviceUtils/docUtil';
import RecordLocation from '../../utils/readUtils/recordLocation';
import Note from '../../models/Note';
import { ViewerProps } from './interface';

declare var window: any;

const Viewer: React.FC<ViewerProps> = ({
  currentBook,
  handleFetchBookmarks,
  handleFetchNotes,
  handleFetchBooks,
  handleReadingState,
  handleReadingBook,
  handleNoteKey,
  handleMenuMode,
  handleOpenMenu,
  isOpenMenu,
  menuMode,
  notes,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [href, setHref] = useState('');
  const [title, setTitle] = useState('');
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapterDocIndex, setChapterDocIndex] = useState(
    parseInt(RecordLocation.getHtmlLocation(currentBook.key).chapterDocIndex || '0')
  );
  const [isDisablePopup] = useState(StorageUtil.getReaderConfig('isDisablePopup') === 'yes');
  const [isTouch] = useState(StorageUtil.getReaderConfig('isTouch') === 'yes');

  useEffect(() => {
    handleFetchBookmarks();
    handleFetchNotes();
    handleFetchBooks();
  }, [handleFetchBookmarks, handleFetchNotes, handleFetchBooks]);

  useEffect(() => {
    const url = location.pathname + location.search;
    const firstIndexOfQuestion = url.indexOf('?');
    const lastIndexOfSlash = url.lastIndexOf('/', firstIndexOfQuestion);
    const key = url.substring(lastIndexOfSlash + 1, firstIndexOfQuestion);

    window.localforage.getItem('books').then((result: any) => {
      const book =
        result[window._.findIndex(result, { key })] ||
        JSON.parse(localStorage.getItem('tempBook') || '{}');

      document.title = `${book.name} - Koodo Reader`;
      handleReadingState(true);
      RecentBooks.setRecent(key);
      handleReadingBook(book);
      setTitle(`${book.name} - Koodo Reader`);
      setHref(BookUtil.getPDFUrl(book));
    });

    document
      .querySelector('.ebook-viewer')
      ?.setAttribute('style', 'height:100%; overflow: hidden;');

    return () => {
      // Cleanup if needed
    };
  }, [location, handleReadingState, handleReadingBook]);

  const handleHighlight = useCallback(() => {
    if (!notes) return;
    const highlightersByChapter = notes.filter(
      (item: Note) =>
        item.chapterIndex === chapterDocIndex && item.bookKey === currentBook.key
    );
    renderHighlighters(
      highlightersByChapter,
      currentBook.format,
      handleNoteClick
    );
  }, [notes, chapterDocIndex, currentBook]);

  const handleNoteClick = useCallback((event: Event) => {
    handleNoteKey((event.target as any).dataset.key);
    handleMenuMode('note');
    handleOpenMenu(true);
  }, [handleNoteKey, handleMenuMode, handleOpenMenu]);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
    pdfMouseEvent();

    const doc = getPDFIframeDoc();
    if (!doc) return;

    doc.document.addEventListener('click', async (event: any) => {
      event.preventDefault();
      await handleLinkJump(event);
    });

    doc.document.addEventListener('mouseup', (event) => {
      if (isDisablePopup) {
        if (doc.getSelection()?.toString().trim().length === 0) {
          const newRect = doc.getSelection()?.getRangeAt(0).getBoundingClientRect();
          setRect(newRect);
        }
      }
      if (isDisablePopup) return;
      event.preventDefault();
      const newRect = doc.getSelection()?.getRangeAt(0).getBoundingClientRect();
      setRect(newRect);
    });

    doc.addEventListener('contextmenu', (event) => {
      if (document.location.href.indexOf('localhost') === -1) {
        event.preventDefault();
      }

      if (!isDisablePopup && !isTouch) return;
      if (!doc.getSelection() || doc.getSelection().toString().trim().length === 0) return;

      const newRect = doc.getSelection()?.getRangeAt(0).getBoundingClientRect();
      setRect(newRect);
    });

    setTimeout(() => {
      handleHighlight();
      const iWin = getPDFIframeDoc();
      if (!iWin || !iWin.PDFViewerApplication.eventBus) return;
      iWin.PDFViewerApplication.eventBus.on('pagechanging', handleHighlight);
    }, 3000);
  }, [isDisablePopup, isTouch, handleHighlight]);

  return (
    <div className="ebook-viewer" id="page-area">
      <Tooltip id="my-tooltip" style={{ zIndex: 25 }} />
      {!loading && (
        <PopupMenu
          rendition={{
            on: (status: string, callback: any) => {
              callback();
            },
          }}
          rect={rect}
          chapterDocIndex={0}
          chapter="0"
        />
      )}
      {isOpenMenu && (menuMode === 'dict' || menuMode === 'trans' || menuMode === 'note') && (
        <PopupBox
          rendition={{
            on: (status: string, callback: any) => {
              callback();
            },
          }}
          rect={rect}
          chapterDocIndex={0}
          chapter="0"
        />
      )}
      <iframe
        src={href}
        title={title}
        width="100%"
        height="100%"
        onLoad={handleIframeLoad}
      >
        Loading
      </iframe>
      <PDFWidget />
      <Toaster />
    </div>
  );
};

export default Viewer;