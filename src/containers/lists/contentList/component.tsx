import React, { useState, useEffect, useCallback } from 'react';
import './contentList.css';
import StorageUtil from '../../../utils/serviceUtils/storageUtil';
import RecordLocation from '../../../utils/readUtils/recordLocation';
import { scrollContents } from '../../../utils/commonUtil';
import { ContentListProps } from './interface';


const ContentList: React.FC<ContentListProps> = ({
  htmlBook,
  currentBook,
  handleCurrentChapter,
  handleCurrentChapterIndex,
}) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isExpandContent] = useState(StorageUtil.getReaderConfig('isExpandContent') === 'yes');

  useEffect(() => {
    if (htmlBook) {
      setChapters(htmlBook.chapters);
      const bookLocation = RecordLocation.getHtmlLocation(currentBook.key);
      const chapter =
        bookLocation.chapterTitle ||
        (htmlBook.flattenChapters[0] ? htmlBook.flattenChapters[0].label : 'Unknown chapter');
      scrollContents(chapter, bookLocation.chapterHref);
    }
  }, [htmlBook, currentBook.key]);

  const handleJump = useCallback(async (item: any) => {
    await htmlBook.rendition.goToChapter(item.index, item.href, item.label);
    handleCurrentChapter(item.label);
    handleCurrentChapterIndex(item.index);
  }, [htmlBook, handleCurrentChapter, handleCurrentChapterIndex]);

  const renderContentList = useCallback((items: any[], level: number) => {
    level++;
    const bookLocation = RecordLocation.getHtmlLocation(currentBook.key);

    return items.map((item: any, index: number) => (
      <li key={index} className="book-content-list">
        {item.subitems &&
          item.subitems.length > 0 &&
          level <= 2 &&
          !isExpandContent && (
            <span
              className="icon-dropdown content-dropdown"
              onClick={() => setCurrentIndex(currentIndex === index ? -1 : index)}
              style={
                currentIndex === index ||
                item.subitems.some((subitem: any) => subitem.href === bookLocation.chapterHref)
                  ? {}
                  : { transform: 'rotate(-90deg)' }
              }
            />
          )}

        <span
          onClick={() => handleJump(item)}
          className="book-content-name"
        >
          {item.label}
        </span>
        {item.subitems &&
          item.subitems.length > 0 &&
          (currentIndex === index ||
            level > 2 ||
            isExpandContent ||
            item.subitems.some((subitem: any) => subitem.href === bookLocation.chapterHref)) && (
            <ul>{renderContentList(item.subitems, level)}</ul>
          )}
      </li>
    ));
  }, [currentIndex, isExpandContent, currentBook.key, handleJump]);

  return (
    <div className="book-content-container">
      <ul className="book-content">
        {chapters && renderContentList(chapters, 1)}
      </ul>
    </div>
  );
};

export default ContentList;