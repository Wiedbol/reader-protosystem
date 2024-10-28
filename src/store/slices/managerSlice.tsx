import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import SortUtil from "../../utils/readUtils/sortUtil";
import AddTrash from "../../utils/readUtils/addTrash";
import type BookModel from "../../models/Book";
declare var window: any;

interface ManagerState {
  books: BookModel[];
  deletedBooks: BookModel[];
  searchResults: number[];
  isSearch: boolean;
  isTipDialog: boolean;
  isDetailDialog: boolean;
  tip: string;
  isSettingOpen: boolean;
  isAboutOpen: boolean;
  viewMode: string;
  isSortDisplay: boolean;
  isShowLoading: boolean;
  isShowNew: boolean;
  isSelectBook: boolean;
  selectedBooks: string[];
  isNewWarning: boolean;
  isBookSort: boolean;
  isNoteSort: boolean;
  isFeedbackDialogOpen: boolean;
  bookSortCode: { sort: number; order: number };
  noteSortCode: { sort: number; order: number };
}

const initialState: ManagerState = {
  books: [],
  deletedBooks: [],
  searchResults: [],
  isSearch: false,
  isTipDialog: false,
  isDetailDialog: false,
  tip: "",
  isSettingOpen: false,
  isAboutOpen: false,
  viewMode: "card",
  isSortDisplay: false,
  isShowLoading: false,
  isShowNew: false,
  isSelectBook: false,
  selectedBooks: [],
  isNewWarning: false,
  isBookSort: false,
  isNoteSort: false,
  isFeedbackDialogOpen: false,
  bookSortCode: { sort: 1, order: 2 },
  noteSortCode: { sort: 1, order: 2 },
};

const handleKeyRemove = (items: any[], arr: string[]) => {
  if (!items) return [];
  if (!arr[0]) return items;
  return items.filter(item => !arr.includes(item.key));
};

const handleKeyFilter = (items: any[], arr: string[]) => {
  if (!items) return [];
  return items.filter(item => arr.includes(item.key));
};

export const fetchBooks = createAsyncThunk(
  'manager/fetchBooks',
  async (_, { dispatch }) => {
    const books: BookModel[] = await window.localforage.getItem("books");
    const keyArr = AddTrash.getAllTrash();
    dispatch(handleDeletedBooks(handleKeyFilter(books, keyArr)));
    return handleKeyRemove(books, keyArr);
  }
);

export const fetchBookSortCode = createAsyncThunk(
  'manager/fetchBookSortCode',
  async () => {
    return SortUtil.getBookSortCode();
  }
);

export const fetchNoteSortCode = createAsyncThunk(
  'manager/fetchNoteSortCode',
  async () => {
    return SortUtil.getNoteSortCode();
  }
);

export const fetchViewMode = createAsyncThunk(
  'manager/fetchViewMode',
  async () => {
    return StorageUtil.getReaderConfig("viewMode") || "card";
  }
);

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    handleBooks: (state, action: PayloadAction<BookModel[]>) => {
      state.books = action.payload;
    },
    handleDeletedBooks: (state, action: PayloadAction<BookModel[]>) => {
      state.deletedBooks = action.payload;
    },
    handleSearchResults: (state, action: PayloadAction<number[]>) => {
      state.searchResults = action.payload;
    },
    handleSearch: (state, action: PayloadAction<boolean>) => {
      state.isSearch = action.payload;
    },
    handleTipDialog: (state, action: PayloadAction<boolean>) => {
      state.isTipDialog = action.payload;
    },
    handleDetailDialog: (state, action: PayloadAction<boolean>) => {
      state.isDetailDialog = action.payload;
    },
    handleTip: (state, action: PayloadAction<string>) => {
      state.tip = action.payload;
    },
    handleSetting: (state, action: PayloadAction<boolean>) => {
      state.isSettingOpen = action.payload;
    },
    handleAbout: (state, action: PayloadAction<boolean>) => {
      state.isAboutOpen = action.payload;
    },
    handleViewMode: (state, action: PayloadAction<string>) => {
      state.viewMode = action.payload;
    },
    handleSortDisplay: (state, action: PayloadAction<boolean>) => {
      state.isSortDisplay = action.payload;
    },
    handleLoadingDialog: (state, action: PayloadAction<boolean>) => {
      state.isShowLoading = action.payload;
    },
    handleNewDialog: (state, action: PayloadAction<boolean>) => {
      state.isShowNew = action.payload;
    },
    handleSelectBook: (state, action: PayloadAction<boolean>) => {
      state.isSelectBook = action.payload;
    },
    handleSelectedBooks: (state, action: PayloadAction<string[]>) => {
      state.selectedBooks = action.payload;
    },
    handleNewWarning: (state, action: PayloadAction<boolean>) => {
      state.isNewWarning = action.payload;
    },
    handleBookSort: (state, action: PayloadAction<boolean>) => {
      state.isBookSort = action.payload;
    },
    handleNoteSort: (state, action: PayloadAction<boolean>) => {
      state.isNoteSort = action.payload;
    },
    handleFeedbackDialog: (state, action: PayloadAction<boolean>) => {
      state.isFeedbackDialogOpen = action.payload;
    },
    handleBookSortCode: (state, action: PayloadAction<{ sort: number; order: number }>) => {
      state.bookSortCode = action.payload;
    },
    handleNoteSortCode: (state, action: PayloadAction<{ sort: number; order: number }>) => {
      state.noteSortCode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload;
      })
      .addCase(fetchBookSortCode.fulfilled, (state, action) => {
        state.bookSortCode = action.payload;
      })
      .addCase(fetchNoteSortCode.fulfilled, (state, action) => {
        state.noteSortCode = action.payload;
      })
      .addCase(fetchViewMode.fulfilled, (state, action) => {
        state.viewMode = action.payload;
      });
  },
});

export const {
  handleBooks,
  handleDeletedBooks,
  handleSearchResults,
  handleSearch,
  handleTipDialog,
  handleDetailDialog,
  handleTip,
  handleSetting,
  handleAbout,
  handleViewMode,
  handleSortDisplay,
  handleLoadingDialog,
  handleNewDialog,
  handleSelectBook,
  handleSelectedBooks,
  handleNewWarning,
  handleBookSort,
  handleNoteSort,
  handleFeedbackDialog,
  handleBookSortCode,
  handleNoteSortCode,
} = managerSlice.actions;

export default managerSlice.reducer;