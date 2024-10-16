import BookModel from "../../models/Book"
import NoteModel from "../../models/Note"
import BookmarkModel from "../../models/Bookmarks"
import { NavigateFunction, Params } from "react-router-dom";
export interface ManagerProps {
  books: BookModel[];
  notes: NoteModel[];
  digests: NoteModel[];
  bookmarks: BookmarkModel[];
  isReading: boolean;
  mode: string;
  shelfIndex: number;
  isOpenEditDialog: boolean;
  isOpenDeleteDialog: boolean;
  isTipDialog: boolean;
  isDetailDialog: boolean;
  isOpenAddDialog: boolean;
  isBookSort: boolean;
  isSortDisplay: boolean;
  isBackup: boolean;
  isSettingOpen: boolean;
  isAboutOpen: boolean;
  isShowLoading: boolean;
  isShowNew: boolean;
  isOpenFeedbackDialog: boolean;
  dragItem: string;

  handleFetchBooks: () => void;
  handleFetchNotes: () => void;
  handleFetchBookmarks: () => void;
  handleFetchBookSortCode: () => void;
  handleFetchNoteSortCode: () => void;
  handleFetchList: () => void;
  handleEditDialog: (isOpenEditDialog: boolean) => void;
  handleDeleteDialog: (isOpenDeleteDialog: boolean) => void;
  handleAddDialog: (isOpenAddDialog: boolean) => void;
  handleTipDialog: (isTipDialog: boolean) => void;
  handleDetailDialog: (isDetailDialog: boolean) => void;
  handleFeedbackDialog: (isShow: boolean) => void;
  handleLoadingDialog: (isShowLoading: boolean) => void;
  handleNewDialog: (isShowNew: boolean) => void;
  handleBackupDialog: (isBackup: boolean) => void;
  handleReadingState: (isReading: boolean) => void;
  handleSetting: (isSettingOpen: boolean) => void;

//将原有的类组件变为函数组件，并添加props类型定义
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void;
  location: {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
  }
}

export interface ManagerState {
  totleBooks: number;
  favoriteBooks: number;
  isAuthed: boolean;
  isError: boolean;
  isCopied: boolean;
  isUpdated: boolean;
  isDrag: boolean;
  token: string;
}