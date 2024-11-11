import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchBookmarks, fetchBooks, fetchNotes, handleActionDialog, handleAddDialog, handleDeleteDialog, handleDetailDialog, handleEditDialog, handleReadingBook, handleSelectBook, handleSelectedBooks } from "../../../store/slices";
import BookModel from "../../../models/Book"
import { MoreActionProps } from "./interface";
import React from "react";
import MoreActionDialog from "./component";

interface MoreActionContainerProps {
  left: number;
  top: number;
  isShowExport: boolean;
  // isShowDetail: boolean;
  isExceed: boolean;
  handleMoreAction: (isShow: boolean) => void;
}

const MoreActionContainer: React.FC<MoreActionContainerProps> = ({
  left,
  top,
  isShowExport,
  // isShowDetail,
  isExceed,
  handleMoreAction,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    mode: state.sidebar.mode,
    currentBook: state.book.currentBook,
    books: state.manager.books,
    notes: state.reader.notes,
    isSelectBook: state.manager.isSelectBook,

    deletedBooks: state.manager.deletedBooks,
  }))
  const actionCreator = {
    handleEditDialog: (isEdit: boolean) => dispatch(handleEditDialog(isEdit)),
    handleAddDialog: (isAdd: boolean) => dispatch(handleAddDialog(isAdd)),
    handleDeleteDialog: (isDelete: boolean) => dispatch(handleDeleteDialog(isDelete)),
    handleReadingBook: (book: BookModel) => dispatch(handleReadingBook(book)),
    handleActionDialog: (isAction: boolean) => dispatch(handleActionDialog(isAction)),
    handleFetchBooks: () => dispatch(fetchBooks()),
    handleDetailDialog: (isDetail: boolean) => dispatch(handleDetailDialog(isDetail)),
    handleSelectBook: (isSelected: boolean) => {dispatch(handleSelectBook(isSelected))},
    handleSelectedBooks: (selectedBooks: string[]) => {dispatch(handleSelectedBooks(selectedBooks))},
    handleFetchBookmarks: () => {dispatch(fetchBookmarks())},
    handleFetchNotes: () => {dispatch(fetchNotes())},
  }
  const props: MoreActionProps = {
    ...state,
    ...actionCreator,
    left,
    top,
    isShowExport,
    // isShowDetail,
    isExceed,
    handleMoreAction,
  }
  return <MoreActionDialog {...props} />
}
export default MoreActionContainer;