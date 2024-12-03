import React, { useState, useEffect, useCallback } from 'react';
import './background.css';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import RecordLocation from '../../utils/readUtils/recordLocation';

interface BackgroundProps {
  htmlBook: any;
  currentBook: any;
  currentChapter: string;
  isShowBookmark: boolean;
}

const Background: React.FC<BackgroundProps> = ({ htmlBook, currentBook, currentChapter, isShowBookmark }) => {
  const [isSingle, setIsSingle] = useState(
    StorageUtil.getReaderConfig('readerMode') &&
    StorageUtil.getReaderConfig('readerMode') !== 'double'
  );
  const [prevPage, setPrevPage] = useState(0);
  const [nextPage, setNextPage] = useState(0);
  const [scale] = useState(StorageUtil.getReaderConfig('scale') || 1);
  const [isHideFooter] = useState(StorageUtil.getReaderConfig('isHideFooter') === 'yes');
  const [isHideHeader] = useState(StorageUtil.getReaderConfig('isHideHeader') === 'yes');

  const handleLocation = useCallback(() => {
    if (htmlBook && htmlBook.rendition) {
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
    }
  }, [htmlBook, currentBook]);

  const handlePageNum = useCallback(async (rendition) => {
    const pageInfo = await rendition.getProgress();
    setPrevPage(isSingle ? pageInfo.currentPage : pageInfo.currentPage * 2 - 1);
    setNextPage(isSingle ? pageInfo.currentPage : pageInfo.currentPage * 2);
  }, [isSingle]);

  useEffect(() => {
    if (htmlBook && htmlBook.rendition) {
      handlePageNum(htmlBook.rendition);
      const pageChangedHandler = async () => {
        await handlePageNum(htmlBook.rendition);
        handleLocation();
      };
      htmlBook.rendition.on('page-changed', pageChangedHandler);

      return () => {
        htmlBook.rendition.off('page-changed', pageChangedHandler);
      };
    }
  }, [htmlBook, handlePageNum, handleLocation]);

  return (
    <div
      className="background"
      style={{
        color: StorageUtil.getReaderConfig('textColor') || '',
      }}
    >
      <div className="header-container">
        {!isHideHeader && currentChapter && (
          <p
            className="header-chapter-name"
            style={
              isSingle
                ? {
                    left: 'calc(50vw - 270px)',
                  }
                : {}
            }
          >
            {currentChapter}
          </p>
        )}
        {!isHideHeader && currentChapter && !isSingle && (
          <p
            className="header-book-name"
            style={
              isSingle
                ? {
                    right: 'calc(50vw - 270px)',
                  }
                : {}
            }
          >
            {currentBook.name}
          </p>
        )}
      </div>
      <div className="footer-container">
        {!isHideFooter && prevPage > 0 && (
          <p
            className="background-page-left"
            style={
              isSingle
                ? {
                    left: 'calc(50vw - 270px)',
                  }
                : {}
            }
          >
            {'Book page' + { count: prevPage }}
          </p>
        )}
        {!isHideFooter && nextPage > 0 && !isSingle && (
          <p className="background-page-right">
            {'Book page' + { count: nextPage }}
          </p>
        )}
      </div>
      {isShowBookmark && <div className="bookmark"></div>}
    </div>
  );
};

export default Background;