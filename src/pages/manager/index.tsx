import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchBookmarks, fetchBooks, fetchBookSortCode, fetchNotes, fetchNoteSortCode, fetchViewMode, handleAddDialog, handleBackupDialog, handleDeleteDialog, handleDetailDialog, handleEditDialog, handleFeedbackDialog, handleLoadingDialog, handleNewDialog, handleReadingState, handleSetting, handleTip, handleTipDialog } from "../../store/slices";
import { Manager } from "./component";
import React from "react";

const ManagerContainer: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const state = useSelector((state: RootState) => ({
		books: state.manager.books,
    notes: state.reader.notes,
    digests: state.reader.digests,
    bookmarks: state.reader.bookmarks,
    isReading: state.book.isReading,
    mode: state.sidebar.mode,
    dragItem: state.book.dragItem,
    shelfIndex: state.sidebar.shelfIndex,
    isOpenEditDialog: state.book.isOpenEditDialog,
    isDetailDialog: state.manager.isDetailDialog,
    isOpenDeleteDialog: state.book.isOpenDeleteDialog,
    isOpenAddDialog: state.book.isOpenAddDialog,
    isSettingOpen: state.manager.isSettingOpen,
    isOpenFeedbackDialog: state.manager.isFeedbackDialogOpen,
    isAboutOpen: state.manager.isAboutOpen,
    isBookSort: state.manager.isBookSort,
    isSortDisplay: state.manager.isSortDisplay,
    isShowLoading: state.manager.isShowLoading,
    isShowNew: state.manager.isShowNew,
    isTipDialog: state.manager.isTipDialog,
    DetailDialog: state.manager.isDetailDialog,
    isBackup: state.backupPage.isBackup,
	}))
	const actionCreator = {
		handleFetchBooks: () => dispatch(fetchBooks()),
		handleFetchNotes: () => dispatch(fetchNotes()),
    handleSetting: (payload: boolean) => dispatch(handleSetting(payload)),
    handleFetchBookmarks: () => dispatch(fetchBookmarks()),
    handleFetchBookSortCode: () => dispatch(fetchBookSortCode()),
    handleFetchNoteSortCode: () => dispatch(fetchNoteSortCode()),
    handleFetchViewMode: () => dispatch(fetchViewMode()),
    handleEditDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleDeleteDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleAddDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleFeedbackDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleTipDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleDetailDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleLoadingDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleNewDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleBackupDialog: (payload: boolean) => dispatch(handleSetting(payload)),
    handleReadingState: (payload: boolean) => dispatch(handleReadingState(payload)),
	}

  return (
    <Manager
      {...state}
      {...actionCreator}
    />
  )
}

export default ManagerContainer;