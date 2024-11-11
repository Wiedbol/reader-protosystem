import React, { useState, useEffect, useCallback } from 'react';
import Parser from 'html-react-parser';
import * as DOMPurify from 'dompurify';
import ContentList from '../../lists/contentList';
import BookNavList from '../../lists/navList';
import SearchBox from '../../../components/searchBox';
import EmptyCover from '../../../components/emptyCover';
import StorageUtil from '../../../utils/serviceUtils/storageUtil';
import './navigationPanel.css';
import { NavigationPanelProps } from './interface';


const NavigationPanel: React.FC<NavigationPanelProps> = ({
  currentBook,
  htmlBook,
  handleFetchBookmarks,
  handleSearch,
  time,
}) => {
  const [currentTab, setCurrentTab] = useState('contents');
  const [searchState, setSearchState] = useState('');
  const [searchList, setSearchList] = useState<any[] | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavLocked, setIsNavLocked] = useState(StorageUtil.getReaderConfig('isNavLocked') === 'yes');

  useEffect(() => {
    handleFetchBookmarks();
  }, [handleFetchBookmarks]);

  const handleNavSearchState = useCallback((state: string) => {
    setSearchState(state);
  }, []);

  const handleSearchList = useCallback((list: any) => {
    setSearchList(list);
  }, []);

  const handleLock = useCallback(() => {
    setIsNavLocked((prev) => {
      const newState = !prev;
      StorageUtil.setReaderConfig('isNavLocked', newState ? 'yes' : 'no');
      return newState;
    });
  }, []);

  const renderBeforeSearch = () => {
    if (searchState === 'searching') {
      return (
        <div className="loading-animation search-animation">
          <div className="loader"></div>
        </div>
      );
    }
    return null;
  };

  const renderSearchList = () => {
    if (!searchList || searchList.length === 0) {
      return (
        <div className="navigation-panel-empty-bookmark">
          {'空'}
        </div>
      );
    }

    return searchList
      .slice(currentIndex * 10, Math.min((currentIndex + 1) * 10, searchList.length))
      .map((item: any, index: number) => (
        <li
          className="nav-search-list-item"
          key={index}
          onClick={async () => {
            const bookLocation = JSON.parse(item.cfi) || {};
            await htmlBook.rendition.goToPosition(JSON.stringify({
              text: bookLocation.text,
              chapterTitle: bookLocation.chapterTitle,
              chapterDocIndex: bookLocation.chapterDocIndex,
              chapterHref: bookLocation.chapterHref,
              count: bookLocation.hasOwnProperty('cfi') ? 'ignore' : bookLocation.count,
              percentage: bookLocation.percentage,
              cfi: bookLocation.cfi,
              page: bookLocation.page,
            }));
            const style = 'background: #f3a6a68c';
            htmlBook.rendition.highlightNode(bookLocation.text, style);
          }}
        >
          {Parser(DOMPurify.sanitize(item.excerpt))}
        </li>
      ));
  };

  const renderSearchPage = () => {
    if (!searchList) return null;

    const total = Math.ceil(searchList.length / 10);
    const pageList: JSX.Element[] = [];

    if (total <= 5) {
      for (let i = 0; i < total; i++) {
        pageList.push(
          <li
            key={i}
            className={currentIndex === i ? 'nav-search-page-item active-page' : 'nav-search-page-item'}
            onClick={() => setCurrentIndex(i)}
          >
            {i + 1}
          </li>
        );
      }
    } else {
      const displayCount = Math.min(5, total - startIndex);
      for (let i = 0; i < displayCount; i++) {
        const pageIndex = startIndex + i;
        const isActive = currentIndex > 2 ? i === 2 : currentIndex === pageIndex;
        pageList.push(
          <li
            key={pageIndex}
            className={isActive ? 'nav-search-page-item active-page' : 'nav-search-page-item'}
            onClick={() => {
              if (i === 3 && startIndex === 0) {
                setStartIndex(1);
                setCurrentIndex(3);
              } else {
                setStartIndex(currentIndex > 2 ? pageIndex - 2 : 0);
                setCurrentIndex(pageIndex);
              }
            }}
          >
            {pageIndex + 1}
          </li>
        );
      }
      if (total - startIndex < 5) {
        for (let i = 0; i < 6 - pageList.length; i++) {
          pageList.push(<li key={`eof-${i}`} className="nav-search-page-item">EOF</li>);
        }
      }
    }
    return pageList;
  };

  const searchProps = {
    mode: searchState ? '' : 'nav',
    width: '100px',
    height: '35px',
    isNavSearch: Boolean(searchState),
    handleNavSearchState,
    handleSearchList,
  };

  const bookmarkProps = {
    currentTab,
  };

  return (
    <div className="navigation-panel">
      {searchState ? (
        <>
          <div
            className="nav-close-icon"
            onClick={() => {
              handleNavSearchState('');
              handleSearch(false);
              setSearchList(null);
            }}
          >
            <span className="icon-close"></span>
          </div>
          <div className="header-search-container">
            <div className="navigation-search-title" style={{ height: '20px', margin: '0px 25px 13px' }}>
              {'在书中搜索'}
            </div>
            <SearchBox {...searchProps} />
          </div>
          <ul className="nav-search-list">
            {searchState === 'searching' ? (
              <div className="loading-animation search-animation">
                <div className="loader"></div>
              </div>
            ) : (
              renderSearchList()
            )}
          </ul>
          <ul className="nav-search-page">{renderSearchPage()}</ul>
        </>
      ) : (
        <>
          <div className="navigation-header">
            <span
              className={isNavLocked ? 'icon-lock nav-lock-icon' : 'icon-unlock nav-lock-icon'}
              onClick={handleLock}
            ></span>
            {currentBook.cover && currentBook.cover !== 'noCover' ? (
              <img className="book-cover" src={currentBook.cover} alt="" />
            ) : (
              <div className="book-cover">
                <EmptyCover
                  format={currentBook.format}
                  title={currentBook.name}
                  scale={0.86}
                />
              </div>
            )}
            <p className="book-title">{currentBook.name}</p>
            <p className="book-arthur">
              {'作者'}: {currentBook.author ? currentBook.author : '未知作者'}
            </p>
            <span className="reading-duration">
              {'阅读时长'}: {Math.floor(time / 60)} min
            </span>
            <div className="navigation-search-box">
              <SearchBox {...searchProps} />
            </div>
            <div className="navigation-navigation">
              {['contents', 'bookmarks', 'notes', 'digests'].map((tab) => (
                <span
                  key={tab}
                  className="book-bookmark-title"
                  onClick={() => setCurrentTab(tab)}
                  style={currentTab === tab ? {} : { opacity: 0.5 }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              ))}
            </div>
          </div>
          <div className="navigation-body-parent">
            <div className="navigation-body">
              {currentTab === 'contents' ? <ContentList /> : <BookNavList {...bookmarkProps} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationPanel;