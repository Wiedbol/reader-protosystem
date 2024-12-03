import React, { useCallback } from 'react';
import './popupOption.css';
import Note from '../../../models/Note';
import ColorOption from '../../colorOption';
import RecordLocation from '../../../utils/readUtils/recordLocation';
import { popupList } from '../../../constants/popupList';
import StorageUtil from '../../../utils/serviceUtils/storageUtil';
import toast from 'react-hot-toast';
import { getSelection } from '../../../utils/serviceUtils/mouseEvent';
import copy from 'copy-text-to-clipboard';
import { getHightlightCoords } from '../../../utils/fileUtils/pdfUtil';
import { getIframeDoc } from '../../../utils/serviceUtils/docUtil';
import { openExternalUrl } from '../../../utils/serviceUtils/urlUtil';
import { isElectron } from 'react-device-detect';
import { createOneNote } from '../../../utils/serviceUtils/noteUtil';
import { PopupOptionProps } from './interface';

declare var window: any;

const PopupOption: React.FC<PopupOptionProps> = ({
  currentBook,
  chapter,
  chapterDocIndex,
  notes,
  color,
  handleMenuMode,
  handleOpenMenu,
  handleFetchNotes,
  handleNoteKey,
  handleOriginalText,
}) => {

  const handleNote = useCallback(() => {
    handleMenuMode('note');
  }, [handleMenuMode]);

  const handleCopy = useCallback(() => {
    const text = getSelection();
    if (!text) return;
    copy(text);
    handleOpenMenu(false);
    const doc = getIframeDoc();
    if (!doc) return;
    doc.getSelection()?.empty();
    toast.success('复制成功');
  }, [handleOpenMenu]);

  const handleTrans = useCallback(() => {
    if (!isElectron) {
      toast("本应用仅支持电脑网页版本");
      return;
    }
    handleMenuMode('trans');
    handleOriginalText(getSelection() || '');
  }, [handleMenuMode, handleOriginalText]);

  const handleDict = useCallback(() => {
    if (!isElectron) {
      toast("本应用仅支持电脑网页版本");
      return;
    }
    handleMenuMode('dict');
    handleOriginalText(getSelection() || '');
  }, [handleMenuMode, handleOriginalText]);

  const handleDigest = useCallback(() => {
    const bookKey = currentBook.key;
    const cfi = currentBook.format === 'PDF'
      ? JSON.stringify(RecordLocation.getPDFLocation(currentBook.md5.split('-')[0]))
      : JSON.stringify(RecordLocation.getHtmlLocation(currentBook.key));
    const percentage = RecordLocation.getHtmlLocation(currentBook.key).percentage || 0;
    const pageArea = document.getElementById('page-area');
    if (!pageArea) return;
    const iframe = pageArea.getElementsByTagName('iframe')[0];
    if (!iframe) return;
    const doc = getIframeDoc();
    if (!doc) return;
    const charRange = currentBook.format !== 'PDF'
      ? window.rangy.getSelection(iframe).saveCharacterRanges(doc.body)[0]
      : null;
    const range = currentBook.format === 'PDF'
      ? JSON.stringify(getHightlightCoords())
      : JSON.stringify(charRange);
    let text = doc.getSelection()?.toString();
    if (!text) return;
    text = text.replace(/\s\s/g, '').replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\f/g, '');
    const digest = new Note(
      bookKey,
      chapter,
      chapterDocIndex,
      text,
      cfi,
      range,
      '',
      percentage,
      color,
      []
    );
    const noteArr = [...notes, digest];
    window.localforage.setItem('notes', noteArr).then(() => {
      handleOpenMenu(false);
      toast.success('添加成功');
      handleFetchNotes();
      handleMenuMode('');
      createOneNote(digest, currentBook.format, handleNoteClick);
    });
  }, [currentBook, chapter, chapterDocIndex, notes, color, handleOpenMenu, handleFetchNotes, handleMenuMode]);

  const handleNoteClick = useCallback((event: Event) => {
    handleNoteKey((event.target as any).dataset.key);
    handleMenuMode('note');
    handleOpenMenu(true);
  }, [handleNoteKey, handleMenuMode, handleOpenMenu]);

  const handleJump = useCallback((url: string) => {
    openExternalUrl(url);
  }, []);

  const handleSearchInternet = useCallback(() => {
    const searchEngine = StorageUtil.getReaderConfig('searchEngine');
    const selection = getSelection();
    let url;
    switch (searchEngine) {
      case 'google':
        url = `https://www.google.com/search?q=${selection}`;
        break;
      case 'baidu':
        url = `https://www.baidu.com/s?wd=${selection}`;
        break;
      // ... (other search engines)
      default:
        url = navigator.language === 'zh-CN'
          ? `https://www.baidu.com/s?wd=${selection}`
          : `https://www.google.com/search?q=${selection}`;
    }
    handleJump(url);
  }, [handleJump]);

  const handleSearchBook = useCallback(() => {
    const leftPanel = document.querySelector('.left-panel');
    const searchBox: HTMLInputElement | null = document.querySelector('.header-search-box');
    const searchIcon = document.querySelector('.header-search-icon');

    if (leftPanel) {
      leftPanel.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }

    if (searchBox) {
      searchBox.dispatchEvent(new MouseEvent('focus', { bubbles: true, cancelable: true }));
      searchBox.value = getSelection() || '';
      searchBox.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13 } as any));
    }

    if (searchIcon) {
      searchIcon.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }

    handleOpenMenu(false);
  }, [handleOpenMenu]);

  const handleSpeak = useCallback(() => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = getSelection() || '';
    if (window.speechSynthesis && window.speechSynthesis.getVoices) {
      msg.voice = window.speechSynthesis.getVoices()[0];
      window.speechSynthesis.speak(msg);
    }
  }, []);

  const renderMenuList = () => (
    <>
      <div className="menu-list">
        {popupList.map((item, index) => (
          <div
            key={item.name}
            className={`${item.name}-option`}
            onClick={() => {
              const actions = [handleNote, handleDigest, handleTrans, handleCopy, handleSearchBook, handleDict, handleSearchInternet, handleSpeak];
              actions[index]();
            }}
          >
            <span
              data-tooltip-id="my-tooltip"
              data-tooltip-content={item.title}
            >
              <span className={`icon-${item.icon} ${item.name}-icon`}></span>
            </span>
          </div>
        ))}
      </div>
      <ColorOption handleDigest={handleDigest} />
    </>
  );

  return renderMenuList();
};

export default PopupOption;