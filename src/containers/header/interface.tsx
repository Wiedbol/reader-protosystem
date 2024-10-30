import BookModel from "../../models/Book"
import NoteModel from "../../models/Note"
import BookmarkModel from "../../models/Bookmark"

export interface HeaderProps {
  isSearch: boolean;
  isSortDisplay: boolean;
  isAboutOpen: boolean;
  isCollapsed: boolean;
  isNewWarning: boolean;

  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  books: BookModel[];
  handleSortDisplay: (isSortDisplay: boolean) => void;
  handleSetting: (isSettingOpen: boolean) => void;
  handleAbout: (isAboutOpen: boolean) => void;
  handleBackupDialog: (isBackup: boolean) => void;
  handleFeedbackDialog: (isShow: boolean) => void;

  handleDrag: (isDrag: boolean) => void;
  handleTipDialog: (isTipDialog: boolean) => void;
  handleTip: (tip: string) => void;
  handleFetchBooks: () => void;
  handleFetchNotes: () => void;
  handleFetchBookmarks: () => void;
}

export interface HeaderState {
  isOnlyLocal: boolean;
  width: number;
  isNewVersion: boolean;
  isDataChange: boolean;
  isDeveloperVer: boolean;
}