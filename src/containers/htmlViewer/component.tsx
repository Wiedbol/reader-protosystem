import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RecentBooks from '../../utils/readUtils/recordRecent';
import BookUtil from '../../utils/fileUtils/bookUtil';
import PopupMenu from '../../components/popups/popupMenu';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import RecordLocation from '../../utils/readUtils/recordLocation';
import Background from '../../components/background';
import toast from 'react-hot-toast';
import StyleUtil from '../../utils/readUtils/styleUtil';
import './index.css';
import { HtmlMouseEvent } from '../../utils/serviceUtils/mouseEvent';
import ImageViewer from '../../components/imageViewer';
import { getIframeDoc } from '../../utils/serviceUtils/docUtil';
import { tsTransform } from '../../utils/serviceUtils/langUtil';
import { binicReadingProcess } from '../../utils/serviceUtils/bionicUtil';
import PopupBox from '../../components/popups/popupBox';
import { renderHighlighters } from '../../utils/serviceUtils/noteUtil';
import PageWidget from '../../containers/pageWidget';
import { scrollContents } from '../../utils/commonUtil';
import { ViewerProps } from './interface';
import _ from 'lodash';



const Viewer: React.FC<ViewerProps> = ({
  currentBook,
  handleFetchBookmarks,
  handleFetchNotes,
  handleFetchBooks,
  handleRenderBookFunc,
  handleHtmlBook,
  handleReadingState,
  handleNoteKey,
  handleMenuMode,
  handleOpenMenu,
  handleCurrentChapter,
  handleCurrentChapterIndex,
  handleFetchPercentage,
  handleLeaveReader,
  handleEnterReader,
  isOpenMenu,
  menuMode,
  isShow,
  htmlBook,
  notes,
}) => {
  const navigate = useNavigate();

  const [cfiRange, setCfiRange] = useState(null);
  const [contents, setContents] = useState(null);
  const [rect, setRect] = useState(null);
  const [key, setKey] = useState('');
  const [isFirst, setIsFirst] = useState(true);
  const [scale, setScale] = useState(StorageUtil.getReaderConfig('scale') || 1);
  const [chapterTitle, setChapterTitle] = useState(
    RecordLocation.getHtmlLocation(currentBook.key).chapterTitle || ''
  );
  const [readerMode, setReaderMode] = useState(
    StorageUtil.getReaderConfig('readerMode') || 'double'
  );
  const [isDisablePopup, setIsDisablePopup] = useState(
    StorageUtil.getReaderConfig('isDisablePopup') === 'yes'
  );
  const [isTouch, setIsTouch] = useState(
    StorageUtil.getReaderConfig('isTouch') === 'yes'
  );
  const [margin, setMargin] = useState(
    parseInt(StorageUtil.getReaderConfig('margin')) || 0
  );
  const [chapterDocIndex, setChapterDocIndex] = useState(
    parseInt(
      RecordLocation.getHtmlLocation(currentBook.key).chapterDocIndex || '0'
    )
  );
  const [pageOffset, setPageOffset] = useState('');
  const [pageWidth, setPageWidth] = useState('');
  const [chapter, setChapter] = useState('');
  const [rendition, setRendition] = useState(null);

  let lock = React.useRef<boolean>(false);

  useEffect(() => {
    handleFetchBookmarks();
    handleFetchNotes();
    handleFetchBooks();
  }, [handleFetchBookmarks, handleFetchNotes, handleFetchBooks]);

  useEffect(() => {
    // window.rangy.init();
    handleRenderBook();
    handlePageWidth();
    handleRenderBookFunc(handleRenderBook);

    const handleResize = () => {
      BookUtil.reloadBooks();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePageWidth = useCallback(() => {
      const findValidMultiple = (limit: number) => {
      let multiple = limit - (limit % 12);

      while (multiple >= 0) {
        if (((multiple - multiple / 12) / 2) % 2 === 0) {
          return multiple;
        }
        multiple -= 12;
      }

      return limit;
    };

    if (document.body.clientWidth < 570) {
      let width = findValidMultiple(document.body.clientWidth - 72);

      // this.setState({
        // pageOffset: `calc(50vw - ${width / 2}px)`,
        // pageWidth: `${width}px`,
      // });
      setPageOffset(`calc(50vw - ${width / 2}px)`);
      setPageWidth(`${width}px`);
    } else if (readerMode === "scroll") {
      let width = findValidMultiple(276 * parseFloat(scale) * 2);
      // this.setState({
        // pageOffset: `calc(50vw - ${width / 2}px)`,
        // pageWidth: `${width}px`,
      // });
      setPageOffset(`calc(50vw - ${width / 2}px)`);
      setPageWidth(`${width}px`);
    } else if (readerMode === "single") {
      let width = findValidMultiple(
        276 * parseFloat(scale) * 2 - 36
      );
      // this.setState({
      //   pageOffset: `calc(50vw - ${width / 2}px)`,
      //   pageWidth: `${width}px`,
      // });
      setPageOffset(`calc(50vw - ${width / 2}px)`);
      setPageWidth(`${width}px`);
    } else if (readerMode === "double") {
      let width = findValidMultiple(
        document.body.clientWidth - 2 * margin - 80
      );
      // this.setState({
      //   pageOffset: `calc(50vw - ${width / 2}px)`,
      //   pageWidth: `${width}px`,
      // });
      setPageOffset(`calc(50vw - ${width / 2}px)`);
      setPageWidth(`${width}px`);
    }
  }, [readerMode, scale, margin]);

  const handleHighlight = useCallback(
    (rendition: any) => {
      if (!notes) return;
      const highlightersByChapter = notes.filter(
        (item: any) =>
          (item.chapter ===
            rendition.getChapterDoc()[chapterDocIndex].label ||
            item.chapterIndex === chapterDocIndex) &&
          item.bookKey === currentBook.key
      );

      renderHighlighters(
        highlightersByChapter,
        currentBook.format,
        handleNoteClick
      );
    },
    [notes, chapterDocIndex, currentBook.key, currentBook.format]
  );

  const handleNoteClick = useCallback(
    (event: Event) => {
      handleNoteKey((event.target as any).dataset.key);
      handleMenuMode('note');
      handleOpenMenu(true);
    },
    [handleNoteKey, handleMenuMode, handleOpenMenu]
  );

  const handleRenderBook = useCallback(async () => {
    if (lock.current) return;
    const { key, path, format, name } = currentBook;
    handleHtmlBook(null);
    const doc = getIframeDoc();
    if (doc && rendition) {
      (rendition as any).removeContent();
    }
    const isCacheExist = await BookUtil.isBookExist('cache-' + key, path);
    BookUtil.fetchBook(isCacheExist ? 'cache-' + key : key, true, path).then(
      async (result: any) => {
        if (!result) {
          toast.error('书籍不存在');
          return;
        }
        const newRendition = BookUtil.getRendtion(
          result,
          isCacheExist ? 'CACHE' : format,
          readerMode,
          currentBook.charset,
          StorageUtil.getReaderConfig('isSliding') === 'yes' ? 'sliding' : ''
        );

        await newRendition.renderTo(
          document.getElementsByClassName('html-viewer-page')[0]
        );
        await handleRest(newRendition);
        handleReadingState(true);

        RecentBooks.setRecent(currentBook.key);
        document.title = name + ' - Koodo Reader';
      }
    );
  }, [currentBook, readerMode, handleHtmlBook, handleReadingState]);

  const handleRest = useCallback(
    async (newRendition: any) => {
        // ... (keep the existing handleRest logic)
      HtmlMouseEvent(
        rendition,
        currentBook.key,
        readerMode
      );
      let chapters = (rendition as any).getChapter();
      let chapterDocs = (rendition as any).getChapterDoc();
      let flattenChapters = (rendition as any).flatChapter(chapters);
      handleHtmlBook({
        key: currentBook.key,
        chapters,
        flattenChapters,
        rendition: rendition,
      });
      setRendition(newRendition);

      StyleUtil.addDefaultCss();
      tsTransform();
      binicReadingProcess();
      // rendition.setStyle(StyleUtil.getCustomCss());
      let bookLocation: {
        text: string;
        count: string;
        chapterTitle: string;
        chapterDocIndex: string;
        chapterHref: string;
        percentage: string;
        cfi: string;
        page: string;
      } = RecordLocation.getHtmlLocation(currentBook.key);
      if (chapterDocs.length > 0) {
        await (rendition as any).goToPosition(
          JSON.stringify({
            text: bookLocation.text || "",
            chapterTitle: bookLocation.chapterTitle || chapterDocs[0].label,
            page: bookLocation.page || "",
            chapterDocIndex: bookLocation.chapterDocIndex || 0,
            chapterHref: bookLocation.chapterHref || chapterDocs[0].href,
            count: bookLocation.hasOwnProperty("cfi")
              ? "ignore"
              : bookLocation.count || 0,
            percentage: bookLocation.percentage,
            cfi: bookLocation.cfi,
            isFirst: true,
          })
        );
      }

      (rendition as any).on("rendered", () => {
        handleLocation();
        let bookLocation: {
          text: string;
          count: string;
          chapterTitle: string;
          chapterDocIndex: string;
          chapterHref: string;
        } = RecordLocation.getHtmlLocation(currentBook.key);

        let chapter =
          bookLocation.chapterTitle ||
          (htmlBook && htmlBook.flattenChapters[0]
            ? htmlBook.flattenChapters[0].label
            : "Unknown chapter");
        let chapterDocIndex = 0;
        if (bookLocation.chapterDocIndex) {
          chapterDocIndex = parseInt(bookLocation.chapterDocIndex);
        } else {
          chapterDocIndex =
            bookLocation.chapterTitle && htmlBook
              ? (window as any)._.findLastIndex(
                  htmlBook.flattenChapters.map((item) => {
                    item.label = item.label.trim();
                    return item;
                  }),
                  {
                    title: bookLocation.chapterTitle.trim(),
                  }
                )
              : 0;
        }
        handleCurrentChapter(chapter);
        handleCurrentChapterIndex(chapterDocIndex);
        handleFetchPercentage(currentBook);
        // setState({
        //   chapter,
        //   chapterDocIndex,
        // });
        setChapter(chapter);
        setChapterDocIndex(chapterDocIndex);
        scrollContents(chapter, bookLocation.chapterHref);
        StyleUtil.addDefaultCss();
        tsTransform();
        binicReadingProcess();
        handleBindGesture();
        handleHighlight(rendition);
          lock.current = true;
        setTimeout(function () {
          lock.current = false;
        }, 1000);
        return false;
      });
    },
    [
      currentBook.key,
      handleHtmlBook,
      handleCurrentChapter,
      handleCurrentChapterIndex,
      handleFetchPercentage,
    ]
  );

  const handleLocation = useCallback(() => {
    if (!htmlBook) {
      return;
    }
    const position = htmlBook.rendition.getPosition();
    RecordLocation.recordHtmlLocation(
      currentBook.key,
      position.text,
      position.chapterTitle,
      position.chapterDocIndex,
      position.chapterHref,
      position.count,
      position.percentage,
      position.cfi,
      position.page
    );
  }, [htmlBook, currentBook.key]);

  const handleBindGesture = useCallback(() => {
    const doc = getIframeDoc();
    if (!doc) return;

    // ... (keep the existing handleBindGesture logic)
  }, [isDisablePopup, isTouch]);

  return (
    <>
      {htmlBook && (
        <PopupMenu
          rendition={htmlBook.rendition}
          rect={rect}
          chapterDocIndex={chapterDocIndex}
          chapter={chapter}
        />
      )}
      {isOpenMenu &&
        htmlBook &&
        (menuMode === 'dict' || menuMode === 'trans' || menuMode === 'note') && (
          <PopupBox
            rendition={htmlBook.rendition}
            rect={rect}
            chapterDocIndex={chapterDocIndex}
            chapter={chapter}
          />
        )}
      {htmlBook && (
        <ImageViewer
          isShow={isShow}
          rendition={htmlBook.rendition}
          handleEnterReader={handleEnterReader}
          handleLeaveReader={handleLeaveReader}
        />
      )}
      <div
        className={
          readerMode === 'scroll'
            ? 'html-viewer-page scrolling-html-viewer-page'
            : 'html-viewer-page'
        }
        id="page-area"
        style={
          readerMode === 'scroll' && document.body.clientWidth >= 570
            ? {
                marginLeft: pageOffset,
                marginRight: pageOffset,
                paddingLeft: '20px',
                paddingRight: '15px',
                left: 0,
                right: 0,
              }
            : {
                left: pageOffset,
                width: pageWidth,
              }
        }
      ></div>
      <PageWidget />
      {StorageUtil.getReaderConfig('isHideBackground') === 'yes' ? null : currentBook.key ? (
        <Background />
      ) : null}
    </>
  );
};

export default Viewer;