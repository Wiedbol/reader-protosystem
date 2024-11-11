import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { handleActionDialog, handleDeleteDialog, handleDragItem, handleReadingBook, handleSelectBook, handleSelectedBooks } from "../../store/slices";
import bookModel from "../../models/Book";
import { isAction } from "@reduxjs/toolkit";
import { BookCardProps } from "./interface";
import React from "react";
import BookCardItem from "./component";

interface BookCardItemContainerProps {
  book: bookModel;
  isSelected: boolean;
}


const BookCardItemContainer: React.FC<BookCardItemContainerProps> = ({
  book,
  isSelected,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    mode: state.sidebar.mode,
    isOpenActionDialog: state.book.isOpenActionDialog,
    dragItem: state.book.dragItem,
    currentBook: state.book.currentBook,
    isSelectBook: state.manager.isSelectBook,
    selectedBooks: state.manager.selectedBooks,
  }))
  const actionCreator = {
    handleReadingBook: (book: bookModel) => dispatch(handleReadingBook(book)),
    handleActionDialog: (isActionDialogOpen: boolean) => dispatch(handleActionDialog(isActionDialogOpen)),
    handleDragItem: (item: string) => dispatch(handleDragItem(item)),
    handleSelectBook: (isSelectBook: boolean) => dispatch(handleSelectBook(isSelectBook)),
    handleDeleteDialog: (isDeleteDialogOpen: boolean) => dispatch(handleDeleteDialog(isDeleteDialogOpen)),
    handleSelectedBooks: (selectedBooks: string[]) => dispatch(handleSelectedBooks(selectedBooks)),
  }
  const props: BookCardProps = {
    ...state,
    ...actionCreator,
    book,
    isSelected,
  }
  return <BookCardItem {...props} />
}

export default BookCardItemContainer;