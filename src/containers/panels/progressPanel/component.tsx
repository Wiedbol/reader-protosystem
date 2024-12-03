import React, { useState, useEffect, useCallback } from 'react';
import StorageUtil from '../../../utils/serviceUtils/storageUtil';
import './progressPanel.css';
import { ProgressPanelProps } from './interface';


const ProgressPanel: React.FC<ProgressPanelProps> = ({ htmlBook, percentage }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [targetChapterIndex, setTargetChapterIndex] = useState(0);
  const [targetPage, setTargetPage] = useState('');
  const [isEntered, setIsEntered] = useState(false);
  const [isSingle, setIsSingle] = useState(
    StorageUtil.getReaderConfig('readerMode') &&
    StorageUtil.getReaderConfig('readerMode') !== 'double'
  );

  const handlePageNum = useCallback(async (rendition) => {
    const pageInfo = await rendition.getProgress();
    setCurrentPage(isSingle ? pageInfo.currentPage : pageInfo.currentPage * 2 - 1);
    setTotalPage(isSingle ? pageInfo.totalPage : (pageInfo.totalPage - 1) * 2);
  }, [isSingle]);

const handleCurrentChapterIndex = useCallback((rendition) => {
  const position = rendition.getPosition();
  const href = position.chapterHref;
  if (!href || !htmlBook) return; // 增加对 htmlBook 的判空检查
  const chapterIndex = (window as any)._.findIndex(htmlBook.flattenChapters, { href });
  setTargetChapterIndex(chapterIndex + 1);
}, [htmlBook]);
 

  useEffect(() => {
    if (htmlBook && htmlBook.rendition) {
      handlePageNum(htmlBook.rendition);
      handleCurrentChapterIndex(htmlBook.rendition);

      const handlePageChanged = async () => {
        await handlePageNum(htmlBook.rendition);
        handleCurrentChapterIndex(htmlBook.rendition);
      };

      htmlBook.rendition.on('page-changed', handlePageChanged);
      htmlBook.rendition.on('rendered', handlePageChanged);

      return () => {
        htmlBook.rendition.off('page-changed', handlePageChanged);
        htmlBook.rendition.off('rendered', handlePageChanged);
      };
    }
  }, [htmlBook, handlePageNum, handleCurrentChapterIndex]);

  const onProgressChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const percentage = parseFloat(event.target.value) / 100;
    if (htmlBook && htmlBook.rendition){
      await htmlBook.rendition.goToPercentage(percentage);
    }
    }, [htmlBook]);
    
    const nextChapter = useCallback(async () => {
      if (htmlBook) {
        if (htmlBook.flattenChapters.length > 0) {
          await htmlBook.rendition.nextChapter();
        }
      }
    }, [htmlBook]);
    
    const prevChapter = useCallback(async () => {
      if (htmlBook) {
        if (htmlBook.flattenChapters.length > 0) {
          await htmlBook.rendition.prevChapter();
        }
      }
    }, [htmlBook]);
    
    const handleJumpChapter = useCallback(async (event: React.FocusEvent<HTMLInputElement>) => {
      const targetChapterIndex = parseInt(event.target.value.trim()) - 1;
      if (htmlBook) {
        await htmlBook.rendition.goToChapterIndex(targetChapterIndex);
      }
    }, [htmlBook]);

  if (!htmlBook) {
    return <div className="progress-panel">Loading</div>;
  }

  return (
    <div className="progress-panel">
      <p className="progress-text" style={{ marginTop: 10 }}>
        <span>
          {'进度'}: {Math.round(percentage > 1 ? 100 : percentage * 100)}%&nbsp;&nbsp;&nbsp;
        </span>
      </p>

      <p className="progress-text" style={{ marginTop: 0 }}>
        {'页码'}
        <input
          type="text"
          name="jumpPage"
          id="jumpPage"
          value={targetPage || currentPage}
          onFocus={() => setTargetPage(' ')}
          onChange={(event) => setTargetPage(event.target.value)}
          onBlur={() => setTargetPage('')}
          disabled
        />
        <span>/ {totalPage}</span>
        &nbsp;&nbsp;&nbsp;
        {'章节'}
        <input
          type="text"
          name="jumpChapter"
          id="jumpChapter"
          value={targetChapterIndex}
          onFocus={() => setTargetChapterIndex(0)}
          onChange={(event) => setTargetChapterIndex(parseInt(event.target.value))}
          onBlur={(event) => {
            if (!isEntered) {
              if (event.target.value.trim()) {
                handleJumpChapter(event);
                setTargetChapterIndex(0);
              } else {
                setTargetChapterIndex(0);
              }
            } else {
              setIsEntered(false);
            }
          }}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
              setIsEntered(true);
              if (event.currentTarget.value.trim()) {
                handleJumpChapter(event as any);
                setTargetChapterIndex(0);
              } else {
                setTargetChapterIndex(0);
              }
            }
          }}
        />
        <span>/ {htmlBook.flattenChapters.length}</span>
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '90%',
          marginLeft: '5%',
        }}
      >
        <div className="previous-chapter" onClick={prevChapter}>
          <span className="icon-dropdown previous-chapter-icon"> </span>
        </div>
        <input
          className="input-progress"
          defaultValue={Math.round(percentage * 100)}
          type="range"
          max="100"
          min="0"
          step="1"
          // onMouseUp={onProgressChange}
          // onTouchEnd={onProgressChange}
          style={{ width: '80%' }}
        />
        <div className="next-chapter" onClick={nextChapter}>
          <span className="icon-dropdown next-chapter-icon"></span>
        </div>
      </div>
    </div>
  );
};

export default ProgressPanel;