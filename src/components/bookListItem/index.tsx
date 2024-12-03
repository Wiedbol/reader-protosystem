import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { fetchBooks, handleActionDialog, handleAddDialog, handleDeleteDialog, handleDragItem, handleEditDialog, handleReadingBook, handleSelectBook, handleSelectedBooks } from "../../store/slices";
import Book from "../../models/Book";
import { BookItemProps } from "./interface";
import BookListItem from "./component";
import React from "react";

interface BookListItemContainerProps {
  book: Book;
  isSelected: boolean;
}

const BookListItemContainer: React.FC<BookListItemContainerProps> = ({
  book,
  isSelected,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    isReading: state.book.isReading,
    percentage: state.progressPanel.percentage,
    currentBook: state.book.currentBook,
    dragItem: state.book.dragItem,
    mode: state.sidebar.mode,
    isSelectBook: state.manager.isSelectBook,
    selectedBooks: state.manager.selectedBooks,
    isOpenActionDialog: state.book.isOpenActionDialog,
  }))
  const actionCreator = {
    handleReadingBook: (payload: Book) => dispatch(handleReadingBook(payload)),
    handleEditDialog: (payload: boolean) => dispatch(handleEditDialog(payload)),
    handleDeleteDialog: (payload: boolean) => dispatch(handleDeleteDialog(payload)),
    handleAddDialog: (payload: boolean) => dispatch(handleAddDialog(payload)),
    handleActionDialog: (payload: boolean) => dispatch(handleActionDialog(payload)),
    handleDragItem: (payload: string) => dispatch(handleDragItem(payload)),
    handleSelectBook: (payload: boolean) => dispatch(handleSelectBook(payload)),
    handleFetchBooks: () => dispatch(fetchBooks()),
    handleSelectedBooks: (payload: string[]) => dispatch(handleSelectedBooks(payload)),
  }
  const props: BookItemProps = {
    ...state,
    ...actionCreator,
    book,
    isSelected,
  }
  return <BookListItem {...props} />
}

export default BookListItemContainer;