import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { handleCollapse, handleMode, handleSearch, handleSelectBook, handleShelfIndex, handleSortDisplay } from "../../store/slices";
import Sidebar from "./component";
import React from "react";

const SidebarContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mode, isCollapsed, shelfIndex } = useSelector((state: RootState) => state.sidebar);
  const actionCreators = {
    handleMode: (mode: string) => dispatch(handleMode(mode)),
    handleSearch: (isSearch: boolean) => dispatch(handleSearch(isSearch)),
    handleSortDisplay: (isSortDisplay: boolean) => dispatch(handleSortDisplay(isSortDisplay)),
    handleCollapse: (isCollapsed: boolean) => dispatch(handleCollapse(isCollapsed)),
    handleSelectBook: (isSelectBook: boolean) => dispatch(handleSelectBook(isSelectBook)),
    handleShelfIndex: (shelfIndex: number) => dispatch(handleShelfIndex(shelfIndex)),
  };

  return (
    <Sidebar
      mode={mode}
      isCollapsed={isCollapsed}
      shelfIndex={shelfIndex}
      {...actionCreators}
    />
  )
}

export default SidebarContainer;