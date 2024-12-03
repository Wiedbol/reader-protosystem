import React, { useState, useEffect, useCallback } from 'react';
import './popupMenu.css';
import PopupOption from '../popupOption';
import { getIframeDoc, getPDFIframeDoc } from '../../../utils/serviceUtils/docUtil';
import { PopupMenuProps } from './interface';


const PopupMenu: React.FC<PopupMenuProps> = ({
  rect,
  currentBook,
  handleOpenMenu,
  handleChangeDirection,
  handleMenuMode,
  handleNoteKey,
  isOpenMenu,
  menuMode,
  isChangeDirection,
  rendition,
  chapterDocIndex,
  chapter,
}) => {
  const [deleteKey, setDeleteKey] = useState('');
  const [currentRect, setCurrentRect] = useState<DOMRect | null>(rect);
  const [isRightEdge, setIsRightEdge] = useState(false);

  useEffect(() => {
    if (rect !== currentRect) {
      setCurrentRect(rect);
      openMenu();
    }
  }, [rect]);

  const handleShowDelete = useCallback((key: string) => {
    setDeleteKey(key);
  }, []);

  const getPdfPosition = useCallback((rect: DOMRect) => {
    let posY = rect.bottom;
    let posX = rect.left + rect.width / 2;
    document
      .querySelector('.ebook-viewer')
      ?.setAttribute('style', 'height:100%; overflow: hidden;');

    let doc: any = getPDFIframeDoc();
    if (
      doc.document.body.scrollHeight - rect.top - rect.height < 188 &&
      rect.top < 188
    ) {
      handleChangeDirection(true);
      posY = rect.top + 16;
    } else if (rect.bottom < doc.document.body.scrollHeight - 188) {
      handleChangeDirection(true);
      posY = posY + 16;
    } else {
      posY = posY - rect.height - 188;
    }
    posX = posX - 80;
    return { posX, posY };
  }, [handleChangeDirection]);

  const getHtmlPosition = useCallback((rect: DOMRect) => {
    let posY = rect.bottom - rendition.getPageSize().scrollTop;
    let posX = rect.left + rect.width / 2;
    if (rect.width > rendition.getPageSize().sectionWidth) {
      posX = rect.left + rect.width - rendition.getPageSize().sectionWidth / 2;
    }
    if (rendition.getPageSize().height - rect.height < 188) {
      handleChangeDirection(true);
      posY = rect.top + 16 + rendition.getPageSize().top;
    } else if (
      posY <
      rendition.getPageSize().height - 188 + rendition.getPageSize().top
    ) {
      handleChangeDirection(true);
      posY = posY + 16 + rendition.getPageSize().top;
    } else {
      posY = posY - rect.height - 188 + rendition.getPageSize().top;
    }
    posX = posX - 80 + rendition.getPageSize().left;
    return { posX, posY };
  }, [handleChangeDirection, rendition]);

  const showMenu = useCallback(() => {
    if (!currentRect) return;
    setIsRightEdge(false);
    const { posX, posY } =
      currentBook.format !== 'PDF'
        ? getHtmlPosition(currentRect)
        : getPdfPosition(currentRect);
    handleOpenMenu(true);
    const popupMenu = document.querySelector('.popup-menu-container');
    popupMenu?.setAttribute('style', `left:${posX}px;top:${posY}px`);
  }, [currentRect, currentBook.format, getHtmlPosition, getPdfPosition, handleOpenMenu]);

  const openMenu = useCallback(() => {
    setDeleteKey('');
    const doc = getIframeDoc();
    if (!doc) return;
    const sel = doc.getSelection();
    handleChangeDirection(false);
    if (isOpenMenu) {
      handleMenuMode('');
      handleOpenMenu(false);
      handleNoteKey('');
    }
    if (!sel) return;
    if (sel.isCollapsed) {
      isOpenMenu && handleOpenMenu(false);
      handleMenuMode('menu');
      handleNoteKey('');
      return;
    }
    showMenu();
    handleMenuMode('menu');
  }, [handleChangeDirection, handleMenuMode, handleNoteKey, handleOpenMenu, isOpenMenu, showMenu]);

  const PopupProps = {
    chapterDocIndex,
    chapter,
    rect,
    
  };

  return (
    <div>
      <div
        className="popup-menu-container"
        style={isOpenMenu ? {} : { display: 'none' }}
      >
        <div className="popup-menu-box">
          {menuMode === 'menu' && <PopupOption {...PopupProps} />}
        </div>
        {menuMode === 'menu' && (
          isChangeDirection ? (
            <span className="icon-popup popup-menu-triangle-up"></span>
          ) : (
            <span className="icon-popup popup-menu-triangle-down"></span>
          )
        )}
      </div>
    </div>
  );
};

export default PopupMenu;