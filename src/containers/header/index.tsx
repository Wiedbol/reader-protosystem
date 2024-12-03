import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { fetchBookmarks, fetchBooks, fetchNotes, handleAbout, handleBackupDialog, handleFeedbackDialog, handleSetting, handleSortDisplay, handleTipDialog } from "../../store/slices";
import { HeaderProps } from "./interface";
import { Header } from "./component";
import React from "react";

interface HeaderContainerProps {

  handleDrag: (isDrag: boolean) => void;
  handleTip: (tip: string) => void;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
  handleDrag,
  handleTip,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    isSearch: state.manager.isSearch,
    isAboutOpen: state.manager.isAboutOpen,
    bookmarks: state.reader.bookmarks,
    books: state.manager.books,
    isCollapsed: state.sidebar.isCollapsed,
    isNewWarning: state.manager.isNewWarning,
    notes: state.reader.notes,

    isSortDisplay: state.manager.isSortDisplay,
  }))
  const actionCreator = {
    handleSortDisplay: (isSortDisplay: boolean) => dispatch(handleSortDisplay(isSortDisplay)),
    handleBackupDialog: (isBackup: boolean) => dispatch(handleBackupDialog(isBackup)),
    handleSetting: (isSettingOpen: boolean) => dispatch(handleSetting(isSettingOpen)),
    handleAbout: (isAboutOpen: boolean) => dispatch(handleAbout(isAboutOpen)),
    handleFeedbackDialog: (isFeedbackOpen: boolean) => dispatch(handleFeedbackDialog(isFeedbackOpen)),
    handleTipDialog: (isTipOpen: boolean) => dispatch(handleTipDialog(isTipOpen)),
    handleFetchBooks: () => dispatch(fetchBooks()),
    handleFetchNotes: () => dispatch(fetchNotes()),
    handleFetchBookmarks: () => dispatch(fetchBookmarks()),
  }
  const props: HeaderProps = {
    ...state,
    ...actionCreator,
    handleDrag,
    handleTip,
  }
  return <Header {...props} />
}
export default HeaderContainer;