import { configureStore } from "@reduxjs/toolkit";
import bookReducer from  "./slices/bookSlice"
import managerReducer from "./slices/managerSlice";
import progressPanelReducer from "./slices/progressPanelSlice";
import readerReducer from "./slices/readerSlice";
import viewAreaReducer from "./slices/viewAreaSlice";
import sidebarReducer from "./slices/sidebarSlice";
import backupPageReducer from "./slices/backupPageSlice";
import BookModel from "../models/Book"
import NoteModel from "../models/Note"
import BookmarkModel from "../models/Bookmark"
import HtmlBookModel from "../models/HtmlBook"


const store = configureStore({
  reducer: {
    book: bookReducer,
    manager: managerReducer,
    progressPanel: progressPanelReducer,
    reader: readerReducer,
    viewArea: viewAreaReducer,
    sidebar: sidebarReducer,
    backupPage: backupPageReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

// Define your state types
export interface stateType {
  managerState: ManagerState;
  backupPageState: BackupPageState;
  progressPanelState: ProgressPanelState;
  readerState: ReaderState;
  sidebarState: SidebarState;
  viewAreaState: ViewAreaState;
}
export interface ManagerState {
  books: BookModel[];
  deletedBooks: BookModel[];
  searchResults: number[];
  isSearch: boolean;
  isBookSort: boolean;
  isSettingOpen: boolean;
  viewMode: string;
  isSortDisplay: boolean;
  isAboutOpen: boolean;
  isShowLoading: boolean;
  isShowNew: boolean;
  isNewWarning: boolean;
  isSelectBook: boolean;
  selectedBooks: string[];
  isTipDialog: boolean;
  isDetailDialog: boolean;
  isOpenFeedbackDialog: boolean;
  bookSortCode: { sort: number; order: number };
  noteSortCode: { sort: number; order: number };
  tip: string;
}

export interface BookState {
  isOpenEditDialog: boolean;
  isDetailDialog: boolean;
  isOpenDeleteDialog: boolean;
  isOpenAddDialog: boolean;
  isOpenActionDialog: boolean;
  isReading: boolean;
  dragItem: string;
  currentBook: BookModel;
  renderBookFunc: () => void;
  renderNoteFunc: () => void;
}

export interface BackupPageState {
  isBackup: boolean;
  isOpenTokenDialog: boolean;
}

export interface ProgressPanelState {
  percentage: number;
  locations: any[];
}

export interface ReaderState {
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  digests: NoteModel[];
  color: number;
  chapters: any[];
  noteKey: string;
  currentChapter: string;
  currentChapterIndex: number;
  originalText: string;
  htmlBook: HtmlBookModel;
}

export interface SidebarState {
  mode: string;
  shelfIndex: number;
  isCollapsed: boolean;
}

export interface ViewAreaState {
  selection: string;
  menuMode: string;
  isOpenMenu: boolean;
  isChangeDirection: boolean;
  isShowBookmark: boolean;
}