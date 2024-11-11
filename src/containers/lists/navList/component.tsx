import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DeleteIcon from '../../../components/deleteIcon';
import RecordLocation from '../../../utils/readUtils/recordLocation';
import './navList.css';
import { NavListProps } from './interface';


const NavList: React.FC<NavListProps> = ({
  htmlBook,
  currentBook,
  bookmarks,
  notes,
  digests,
  currentTab,
  handleShowBookmark,
}) => {
  const [deleteIndex, setDeleteIndex] = useState(-1);

  const handleDisplayBookmark = useCallback(() => {
    handleShowBookmark(false);
    const bookLocation = RecordLocation.getHtmlLocation(currentBook.key);
    bookmarks.forEach((item) => {
      if (item.cfi === JSON.stringify(bookLocation)) {
        handleShowBookmark(true);
      }
    });
  }, [bookmarks, currentBook.key, handleShowBookmark]);

  useEffect(() => {
    const handleRendered = () => {
      handleDisplayBookmark();
    };

    htmlBook.rendition.on('rendered', handleRendered);

    return () => {
      htmlBook.rendition.off('rendered', handleRendered);
    };
  }, [htmlBook.rendition, handleDisplayBookmark]);

  const handleJump = useCallback(async (cfi: string) => {
    if (!cfi) {
      toast('书签出问题了');
      return;
    }

    let bookLocation;
    try {
      bookLocation = JSON.parse(cfi) || {};
    } catch (error) {
      bookLocation = { cfi };
    }

    await htmlBook.rendition.goToPosition(
      JSON.stringify({
        text: bookLocation.text,
        chapterTitle: bookLocation.chapterTitle,
        chapterDocIndex: bookLocation.chapterDocIndex,
        chapterHref: bookLocation.chapterHref,
        count: bookLocation.hasOwnProperty('cfi') ? 'ignore' : bookLocation.count,
        percentage: bookLocation.percentage,
        cfi: bookLocation.cfi,
        page: bookLocation.page,
      })
    );
  }, [htmlBook.rendition]);


  const handleShowDelete = useCallback((index: number) => {
    setDeleteIndex(index);
  }, []);

  const getCurrentData = useCallback(() => {
    let data;
    switch (currentTab) {
      case 'bookmarks':
        data = bookmarks;
        break;
      case 'notes':
        data = notes.filter((item) => item.notes !== '');
        break;
      default:
        data = digests;
    }
    return data.filter((item) => item.bookKey === currentBook.key).reverse();
  }, [currentTab, bookmarks, notes, digests, currentBook.key]);

  const renderBookNavList = () => {
    const currentData = getCurrentData();

    if (!currentData[0]) {
      return (
        <div className="navigation-panel-empty-bookmark">
          {'空'}
        </div>
      );
    }

    return (
      <div className="book-bookmark-container">
        <ul className="book-bookmark">
          {currentData.map((item: any, index: number) => {
            const bookmarkProps = {
              itemKey: item.key,
              mode: currentTab === 'bookmarks' ? 'bookmarks' : 'notes',
            };

            return (
              <li
                className="book-bookmark-list"
                key={item.key}
                onMouseEnter={() => handleShowDelete(index)}
                onMouseLeave={() => handleShowDelete(-1)}
              >
                <p className="book-bookmark-digest">
                  {currentTab === 'bookmarks'
                    ? item.label
                    : currentTab === 'notes'
                    ? item.notes
                    : item.text}
                </p>
                <div className="bookmark-page-list-item-title">
                  {item.chapter}
                </div>
                <div className="book-bookmark-progress">
                  {Math.floor(item.percentage * 100)}%
                </div>
                {deleteIndex === index && <DeleteIcon {...bookmarkProps} />}
                <div
                  className="book-bookmark-link"
                  onClick={() => handleJump(item.cfi)}
                  style={{ cursor: 'pointer' }}
                >
                  {'点击前往'}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return renderBookNavList();
};

export default NavList;