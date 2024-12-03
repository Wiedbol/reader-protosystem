import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { handleAddDialog, handleDeleteDialog, handleSelectBook, handleSelectedBooks } from "../../store/slices";
import { BookListProps } from "./interface";
import React from "react";
import SelectBook from "./component";

interface SelectBookContainerProps {

}

const SelectBookContainer: React.FC<SelectBookContainerProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    books: state.manager.books,
    notes: state.reader.notes,
    deletedBooks: state.manager.deletedBooks,
    selectedBooks: state.manager.selectedBooks,
    isCollapsed: state.sidebar.isCollapsed,
    shelfIndex: state.sidebar.shelfIndex,
    isSelectBook: state.manager.isSelectBook,
  }))
  const actionCreator = {
    handleDeleteDialog: (payload: boolean) => dispatch(handleDeleteDialog(payload)),
    handleSelectBook: (payload: boolean) => dispatch(handleSelectBook(payload)),
    handleAddDialog: (payload: boolean) => dispatch(handleAddDialog(payload)),
    handleSelectedBooks: (payload: string[]) => dispatch(handleSelectedBooks(payload)),
  }
  const props: BookListProps = {
    ...state,
    ...actionCreator,
  }
  return <SelectBook {...props} />
}
export default SelectBookContainer;