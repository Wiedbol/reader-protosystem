import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { handleActionDialog, handleDeleteDialog, handleDragItem, handleReadingBook, handleSelectBook, handleSelectedBooks } from '../../store/slices';
import Book from '../../models/Book';
import { BookCoverProps } from './interface';
import BookCoverItem from './component';

interface BookCoverItemContainerProps {
  book: Book;
  isSelected: boolean;
}

const BookCoverItemContainer: React.FC<BookCoverItemContainerProps> = ({
  book,
  isSelected,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    mode: state.sidebar.mode,

    isOpenActionDialog: state.book.isOpenActionDialog,
    isCollapsed: state.sidebar.isCollapsed,
    dragItem: state.book.dragItem,
    currentBook: state.book.currentBook,
    isSelectBook: state.manager.isSelectBook,
    selectedBooks: state.manager.selectedBooks,
  }))
  const actionCreator = {
    handleReadingBook: (payload: Book) => dispatch(handleReadingBook(payload)),
    handleActionDialog: (payload: boolean) => dispatch(handleActionDialog(payload)),
    handleDragItem: (payload: string) => dispatch(handleDragItem(payload)),
    handleDeleteDialog: (payload: boolean) => dispatch(handleDeleteDialog(payload)),
    handleSelectBook: (payload: boolean) => dispatch(handleSelectBook(payload)),
    handleSelectedBooks: (payload: string[]) => dispatch(handleSelectedBooks(payload)),
  }
  const props: BookCoverProps = {
    ...state,
    ...actionCreator,
    book,
    isSelected,
  }
  return <BookCoverItem {...props} />
}

export default BookCoverItemContainer;