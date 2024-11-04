import React from'react';
import bookModel from '../../models/Book';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchBooks, handleLoadingDialog, handleReadingBook } from '../../store/slices';
import { ImportLocalProps } from './interface';
import ImportLocal from './component';

interface ImportLocalContainerProps {
  handleDrag: (isDrag: boolean) => void;
}

const ImportLocalContainer: React.FC<ImportLocalContainerProps> = ({
  handleDrag,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    books: state.manager.books,
    notes: state.reader.notes,
    bookmarks: state.reader.bookmarks,
    isCollapsed: state.sidebar.isCollapsed,
    deletedBooks: state.manager.deletedBooks,
    mode: state.sidebar.mode,
    shelfIndex: state.sidebar.shelfIndex,
  }))

  const handleFetchBooks = () => {
    dispatch(fetchBooks())
  }

  const actionCreater = {
    handleFetchBooks: () => dispatch(fetchBooks()),
    handleReadingBook: (book: bookModel) => dispatch(handleReadingBook(book)),
    handleLoadingDialog: (isShow: boolean) => dispatch(handleLoadingDialog(isShow)),
  }

  const props: ImportLocalProps = {
    ...state,
    ...actionCreater,
    handleDrag,
  }
  return <ImportLocal {...props} />
}

export default ImportLocalContainer;