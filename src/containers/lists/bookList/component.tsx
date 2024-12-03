import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './booklist.css';
import BookCardItem from '../../../components/bookCardItem';
import BookListItem from '../../../components/bookListItem';
import BookCoverItem from '../../../components/bookCoverItem';
import AddFavorite from '../../../utils/readUtils/addFavorite';
import ShelfUtil from '../../../utils/readUtils/shelfUtil';
import SortUtil from '../../../utils/readUtils/sortUtil';
import BookModel from '../../../models/Book';
import StorageUtil from '../../../utils/serviceUtils/storageUtil';
import ViewMode from '../../../components/viewMode';
import { backup } from '../../../utils/syncUtils/backupUtil';
import { isElectron } from 'react-device-detect';
import SelectBook from '../../../components/selectBook';
import DeletePopup from '../../../components/dialogs/deletePopup';
import { BookListProps } from './interface';

declare var window: any;


const BookList: React.FC<BookListProps> = ({
  books,
  isSearch,
  searchResults,
  shelfIndex,
  bookSortCode,
  mode,
  viewMode,
  selectedBooks,
  isCollapsed,
  isSelectBook,
  handleFetchBooks,
  handleShelfIndex,
  handleMode,
  notes,
  bookmarks,
}) => {
  const navigate = useNavigate();

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [favoriteBooks, setFavoriteBooks] = useState(Object.keys(AddFavorite.getAllFavorites()).length);
  const [isHideShelfBook, setIsHideShelfBook] = useState(StorageUtil.getReaderConfig('isHideShelfBook') === 'yes');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    handleFetchBooks();
  }, [handleFetchBooks]);

  useEffect(() => {
    if (!books || !books[0]) {
      navigate('/manager/empty');
      return;
    }

    const lazyLoadHandler = () => {
      lazyLoad();
    };

    setTimeout(() => {
      lazyLoad();
      window.addEventListener('scroll', lazyLoadHandler);
      window.addEventListener('resize', lazyLoadHandler);
    }, 0);

    return () => {
      window.removeEventListener('scroll', lazyLoadHandler);
      window.removeEventListener('resize', lazyLoadHandler);
    };
  }, [books, navigate]);

  useEffect(() => {
    if (isElectron) {
      window.localStorage.getItem(books[0].key).then((result) => {
        if (result) {
          backup(books, notes, bookmarks, false);
        }
      });
    }

    StorageUtil.setReaderConfig('totalBooks', books.length.toString());
  }, [books, notes, bookmarks]);

  const handleKeyFilter = useCallback((items: any[], arr: string[]) => {
    return arr.map(key => items.find(item => item.key === key)).filter(Boolean);
  }, []);

  const handleShelf = useCallback((items: any, index: number) => {
    if (index < 1) return items;
    const shelfTitles = Object.keys(ShelfUtil.getShelf());
    const currentShelfTitle = shelfTitles[index];
    if (!currentShelfTitle) return items;
    const currentShelfList = ShelfUtil.getShelf()[currentShelfTitle];
    return items.filter((item: { key: number }) => currentShelfList.includes(item.key));
  }, []);

  const handleIndexFilter = useCallback((items: any, arr: number[]) => {
    return arr.map(index => items[index]).filter(Boolean);
  }, []);

  const handleFilterShelfBook = useCallback((items: BookModel[]) => {
    return items.filter(item => ShelfUtil.getBookPosition(item.key).length === 0);
  }, []);

  const renderBookList = useCallback(() => {
    let filteredBooks = books;

    if (isSearch) {
      filteredBooks = handleIndexFilter(books, searchResults);
    } else if (shelfIndex > 0) {
      filteredBooks = handleIndexFilter(
        handleShelf(books, shelfIndex),
        SortUtil.sortBooks(handleShelf(books, shelfIndex), bookSortCode) || []
      );
    } else if (mode === 'favorite') {
      filteredBooks = handleIndexFilter(
        handleKeyFilter(books, AddFavorite.getAllFavorites()),
        SortUtil.sortBooks(handleKeyFilter(books, AddFavorite.getAllFavorites()), bookSortCode) || []
      );
    } else if (isHideShelfBook) {
      filteredBooks = handleIndexFilter(
        handleFilterShelfBook(books),
        SortUtil.sortBooks(handleFilterShelfBook(books), bookSortCode) || []
      );
    } else {
      filteredBooks = handleIndexFilter(
        books,
        SortUtil.sortBooks(books, bookSortCode) || []
      );
    }

    if (filteredBooks.length === 0 && !isSearch) {
      navigate('/manager/empty');
      return null;
    }

    setTimeout(lazyLoad, 0);

    return filteredBooks.map((item: BookModel, index: number) => {
      const props = {
        key: index,
        book: item,
        isSelected: selectedBooks.includes(item.key),
      };

      switch (viewMode) {
        case 'list':
          return <BookListItem {...props} />;
        case 'card':
          return <BookCardItem {...props} />;
        default:
          return <BookCoverItem {...props} />;
      }
    });
  }, [books, isSearch, searchResults, shelfIndex, mode, isHideShelfBook, bookSortCode, viewMode, selectedBooks, navigate, handleIndexFilter, handleShelf, handleKeyFilter, handleFilterShelfBook]);

  const handleDeleteShelf = useCallback(() => {
    if (shelfIndex < 1) return;
    const shelfTitles = Object.keys(ShelfUtil.getShelf());
    const currentShelfTitle = shelfTitles[shelfIndex];
    ShelfUtil.removeShelf(currentShelfTitle);
    handleShelfIndex(-1);
    handleMode('home');
  }, [shelfIndex, handleShelfIndex, handleMode]);

  const lazyLoad = useCallback(() => {
    const lazyImages: NodeListOf<HTMLImageElement> = document.querySelectorAll('.lazy-image');
    lazyImages.forEach((lazyImage) => {
      if (isElementInViewport(lazyImage) && lazyImage.dataset.src) {
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove('lazy-image');
      }
    });
  }, []);

  const isElementInViewport = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, []);

  if ((favoriteBooks === 0 && mode === 'favorite') || !books || !books[0]) {
    return null; // Redirect is handled by useEffect
  }

  const deletePopupProps = {
    mode: 'shelf',
    name: Object.keys(ShelfUtil.getShelf())[shelfIndex],
    title: 'Delete this shelf',
    description: 'This action will clear and remove this shelf',
    handleDeletePopup: setIsOpenDelete,
    handleDeleteOpearion: handleDeleteShelf,
  };

  return (
    <>
      {isOpenDelete && <DeletePopup {...deletePopupProps} />}
      <div
        className="book-list-header"
        style={isCollapsed ? { width: 'calc(100% - 70px)', left: '70px' } : {}}
      >
        <SelectBook />
        {shelfIndex > -1 && !isSelectBook && (
          <div
            className="booklist-delete-container"
            onClick={() => setIsOpenDelete(true)}
          >
            {'删除书架'}
          </div>
        )}
        <div style={isSelectBook ? { display: 'none' } : {}}>
          <ViewMode />
        </div>
      </div>
      <div
        className="book-list-container-parent"
        style={isCollapsed ? { width: 'calc(100vw - 70px)', left: '70px' } : {}}
      >
        <div className="book-list-container">
          <ul className="book-list-item-box" onScroll={lazyLoad}>
            {!isRefreshing && renderBookList()}
          </ul>
        </div>
      </div>
    </>
  );
};

export default BookList;