import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import React from "react";
import SelectBook from "./component";
import { fetchBooks, fetchViewMode, handleDeleteDialog, handleMode, handleShelfIndex } from "../../store/slices";
import { ShelfSelectorProps } from "./interface";
import ShelfSelector from "./component";

interface ShelfSelectorContainerProps {

}

const ShelfSelectorContainer: React.FC<ShelfSelectorContainerProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    books: state.manager.books,
    mode: state.sidebar.mode,
    bookmarks: state.reader.bookmarks,
    notes: state.reader.notes,
    selectedBooks: state.manager.selectedBooks,
    shelfIndex: state.sidebar.shelfIndex,
    isCollapsed: state.sidebar.isCollapsed,
    searchResults: state.manager.searchResults,
    isSearch: state.manager.isSearch,
    isSelectBook: state.manager.isSelectBook,
    isBookSort: state.manager.isBookSort,
    viewMode: state.manager.viewMode,
    bookSortCode: state.manager.bookSortCode,
    noteSortCode: state.manager.noteSortCode,
  }))
  const actionCreator = {
    handleFetchList: () => dispatch(fetchViewMode()),
    handleMode: (payload: string) => dispatch(handleMode(payload)),
    handleShelfIndex: (payload: number) => dispatch(handleShelfIndex(payload)),
    handleDeleteDialog: (payload: boolean) => dispatch(handleDeleteDialog(payload)),
    handleFetchBooks: () => dispatch(fetchBooks()),
  }
  const props: ShelfSelectorProps = {
    ...state,
    ...actionCreator,
  }
  return <ShelfSelector {...props} />
}
export default ShelfSelectorContainer;