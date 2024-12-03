import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import SettingPanel from '../../containers/panels/settingPanel';
import NavigationPanel from '../../containers/panels/navigationPanel';
import OperationPanel from '../../containers/panels/operationPanel';
import ProgressPanel from '../../containers/panels/progressPanel';
import Viewer from '../../containers/htmlViewer';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import ReadingTime from '../../utils/readUtils/readingTime';
import RecordLocation from '../../utils/readUtils/recordLocation';
import './htmlReader.css';
declare var window: any;
interface ReaderProps {
  currentBook: any;
  htmlBook: any;
  handleFetchBooks: () => void;
  handleReadingBook: (book: any) => void;
  handleFetchPercentage: (book: any) => void;
}

const Reader: React.FC<ReaderProps> = ({
  currentBook,
  htmlBook,
  handleFetchBooks,
  handleReadingBook,
  handleFetchPercentage,
}) => {
  const [isOpenRightPanel, setIsOpenRightPanel] = useState(StorageUtil.getReaderConfig('isSettingLocked') === 'yes');
  const [isOpenLeftPanel, setIsOpenLeftPanel] = useState(StorageUtil.getReaderConfig('isNavLocked') === 'yes');
  const [isOpenTopPanel, setIsOpenTopPanel] = useState(false);
  const [isOpenBottomPanel, setIsOpenBottomPanel] = useState(false);
  const [hoverPanel, setHoverPanel] = useState('');
  const [time, setTime] = useState(0);
  const [isTouch] = useState(StorageUtil.getReaderConfig('isTouch') === 'yes');
  const [isPreventTrigger] = useState(StorageUtil.getReaderConfig('isPreventTrigger') === 'yes');

  const location = useLocation();
  const { key } = useParams<{ key: string }>();

  useEffect(() => {
    if (StorageUtil.getReaderConfig('isMergeWord') === 'yes') {
      document.querySelector('body')?.setAttribute('style', 'background-color: rgba(0,0,0,0)');
    }

    handleFetchBooks();
    window.localforage.getItem('books').then((result: any) => {
      let book = result[window._.findIndex(result, { key })] || JSON.parse(localStorage.getItem('tempBook') || '{}');
      handleReadingBook(book);
      handleFetchPercentage(book);
    });

    let readingTime = ReadingTime.getTime(currentBook.key) || 0;
    const timer = setInterval(() => {
      if (currentBook.key) {
        readingTime += 1;
        setTime(readingTime);
        ReadingTime.setTime(currentBook.key, readingTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentBook.key, handleFetchBooks, handleReadingBook, handleFetchPercentage, key]);

  const handleEnterReader = useCallback((position: string) => {
    switch (position) {
      case 'right':
        setIsOpenRightPanel(prev => !prev);
        break;
      case 'left':
        setIsOpenLeftPanel(prev => !prev);
        break;
      case 'top':
        setIsOpenTopPanel(prev => !prev);
        break;
      case 'bottom':
        setIsOpenBottomPanel(prev => !prev);
        break;
    }
  }, []);

  const handleLeaveReader = useCallback((position: string) => {
    switch (position) {
      case 'right':
        if (StorageUtil.getReaderConfig('isSettingLocked') !== 'yes') {
          setIsOpenRightPanel(false);
        }
        break;
      case 'left':
        if (StorageUtil.getReaderConfig('isNavLocked') !== 'yes') {
          setIsOpenLeftPanel(false);
        }
        break;
      case 'top':
        setIsOpenTopPanel(false);
        break;
      case 'bottom':
        setIsOpenBottomPanel(false);
        break;
    }
  }, []);

  const handleLocation = useCallback(() => {
    if (htmlBook && htmlBook.rendition) {
      let position = htmlBook.rendition.getPosition();
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
  }, [currentBook.key, htmlBook]);

  const throttleTime = StorageUtil.getReaderConfig('isSliding') === 'yes' ? 1000 : 200;
  const [lock, setLock] = useState(false);

  const handlePageChange = useCallback(async (direction: 'prev' | 'next') => {
    if (lock || !htmlBook || !htmlBook.rendition) return;
    setLock(true);
    if (direction === 'prev') {
      await htmlBook.rendition.prev();
    } else {
      await htmlBook.rendition.next();
    }
    handleLocation();
    setTimeout(() => setLock(false), throttleTime);
  }, [htmlBook, handleLocation, throttleTime]);

  const renditionProps = {
    handleLeaveReader,
    handleEnterReader,
    isShow: isOpenLeftPanel || isOpenTopPanel || isOpenBottomPanel || isOpenRightPanel,
  };

  return (
    <div className="viewer">
      <Tooltip id="my-tooltip" style={{ zIndex: 25 }} />
      {StorageUtil.getReaderConfig('isHidePageButton') !== 'yes' && (
        <>
          <div className="previous-chapter-single-container" onClick={() => handlePageChange('prev')}>
            <span className="icon-dropdown previous-chapter-single"></span>
          </div>
          <div className="next-chapter-single-container" onClick={() => handlePageChange('next')}>
            <span className="icon-dropdown next-chapter-single"></span>
          </div>
        </>
      )}
      {StorageUtil.getReaderConfig('isHideMenuButton') !== 'yes' && (
        <div
          className="reader-setting-icon-container"
          onClick={() => {
            handleEnterReader('left');
            handleEnterReader('right');
            handleEnterReader('bottom');
            handleEnterReader('top');
          }}
        >
          <span className="icon-grid reader-setting-icon"></span>
        </div>
      )}
      <Toaster />

      {['left', 'right', 'top', 'bottom'].map((position) => (
        <div
          key={position}
          className={`${position}-panel`}
          onMouseEnter={() => {
            if (isTouch || (position === 'left' ? isOpenLeftPanel : position === 'right' ? isOpenRightPanel : position === 'top' ? isOpenTopPanel : isOpenBottomPanel) || isPreventTrigger) {
              setHoverPanel(position);
              return;
            }
            handleEnterReader(position);
          }}
          onMouseLeave={() => setHoverPanel('')}
          style={hoverPanel === position ? { opacity: 0.5 } : {}}
          onClick={() => handleEnterReader(position)}
        >
          <span className="icon-grid panel-icon"></span>
        </div>
      ))}

      <div
        className="setting-panel-container"
        onMouseLeave={() => handleLeaveReader('right')}
        style={isOpenRightPanel ? {} : { transform: 'translateX(309px)' }}
      >
        <SettingPanel />
      </div>
      <div
        className="navigation-panel-container"
        onMouseLeave={() => handleLeaveReader('left')}
        style={isOpenLeftPanel ? {} : { transform: 'translateX(-309px)' }}
      >
        <NavigationPanel time={time} />
      </div>
      <div
        className="progress-panel-container"
        onMouseLeave={() => handleLeaveReader('bottom')}
        style={isOpenBottomPanel ? {} : { transform: 'translateY(110px)' }}
      >
        <ProgressPanel />
      </div>
      <div
        className="operation-panel-container"
        onMouseLeave={() => handleLeaveReader('top')}
        style={isOpenTopPanel ? {} : { transform: 'translateY(-110px)' }}
      >
        {htmlBook && <OperationPanel time={time} />}
      </div>

      {currentBook.key && <Viewer {...renditionProps} />}
    </div>
  );
};

export default Reader;