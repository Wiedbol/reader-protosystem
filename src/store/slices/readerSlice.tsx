import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import type BookmarkModel from "../../models/Bookmark";
import type NoteModel from "../../models/Note";
import type HtmlBookModel from "../../models/HtmlBook";

interface ReaderState {
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  digests: NoteModel[];
  chapters: any[] | null;
  currentChapter: string;
  currentChapterIndex: number;
  color: number;
  noteKey: string;
  originalText: string;
  htmlBook: HtmlBookModel | null;
  readerMode: string;
  section: any; // Add proper type if available
}

const getInitialColor = (): number => {
  const highlightIndex = parseInt(StorageUtil.getReaderConfig("highlightIndex"));
  if (highlightIndex) return highlightIndex;

  const appSkin = StorageUtil.getReaderConfig("appSkin");
  const isOSNight = StorageUtil.getReaderConfig("isOSNight");

  if (appSkin === "night" || (appSkin === "system" && isOSNight === "yes")) {
    return 3;
  }
  return 0;
};

const initialState: ReaderState = {
  bookmarks: [],
  notes: [],
  digests: [],
  chapters: null,
  currentChapter: "",
  currentChapterIndex: 0,
  color: getInitialColor(),
  noteKey: "",
  originalText: "",
  htmlBook: null,
  readerMode: StorageUtil.getReaderConfig("readerMode") || "double",
  section: null,
};

const readerSlice = createSlice({
  name: 'reader',
  initialState,
  reducers: {
    handleBookmarks: (state, action: PayloadAction<BookmarkModel[]>) => {
      state.bookmarks = action.payload;
    },
    handleNotes: (state, action: PayloadAction<NoteModel[]>) => {
      state.notes = action.payload;
    },
    handleCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
    },
    handleCurrentChapterIndex: (state, action: PayloadAction<number>) => {
      state.currentChapterIndex = action.payload;
    },
    handleOriginalText: (state, action: PayloadAction<string>) => {
      state.originalText = action.payload;
    },
    handleHtmlBook: (state, action: PayloadAction<HtmlBookModel>) => {
      state.htmlBook = action.payload;
    },
    handleColor: (state, action: PayloadAction<number>) => {
      state.color = action.payload;
    },
    handleNoteKey: (state, action: PayloadAction<string>) => {
      state.noteKey = action.payload;
    },
    handleDigests: (state, action: PayloadAction<NoteModel[]>) => {
      state.digests = action.payload;
    },
    handleSection: (state, action: PayloadAction<any>) => {
      state.section = action.payload;
    },
    handleChapters: (state, action: PayloadAction<any[] | null>) => {
      state.chapters = action.payload;
    },
  },
});

export const {
  handleBookmarks,
  handleNotes,
  handleCurrentChapter,
  handleCurrentChapterIndex,
  handleOriginalText,
  handleHtmlBook,
  handleColor,
  handleNoteKey,
  handleDigests,
  handleSection,
  handleChapters,
} = readerSlice.actions;

export default readerSlice.reducer;