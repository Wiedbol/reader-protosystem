import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type NoteModel from "../../models/Note";
import type BookmarkModel from "../../models/Bookmark";
import type HtmlBookModel from "../../models/HtmlBook";
import AddTrash from "../../utils/readUtils/addTrash";
import localforage from 'localforage';
declare var window: any;
interface ReaderState {
  notes: NoteModel[];
  originalText: string;
  color: number;
  bookmarks: BookmarkModel[];
  digests: NoteModel[];
  htmlBook: HtmlBookModel;
  currentChapter: string;
  currentChapterIndex: number;
  chapters: any[];
  noteKey: string;
}

const initialState: ReaderState = {
  notes: [],
  originalText: '',
  color: 0,
  bookmarks: [],
  digests: [],
  htmlBook: {} as HtmlBookModel,
  currentChapter: '',
  currentChapterIndex: 0,
  chapters: [],
  noteKey: '',
};

const handleKeyRemove = (items: any[], arr: string[]) => {
  if (!arr[0]) return items;
  return items.filter(item => !arr.includes(item.bookKey));
};

export const fetchNotes = createAsyncThunk(
  'reader/fetchNotes',
  async (_, { dispatch }) => {
    const notes: NoteModel[] = await window.localforage.getItem("notes") || [];
    const keyArr = AddTrash.getAllTrash();
    const filteredNotes = handleKeyRemove(notes, keyArr);
    const digests = filteredNotes.filter(item => item.notes === "");
    dispatch(handleDigests(digests));
    return filteredNotes;
  }
);

export const fetchBookmarks = createAsyncThunk(
  'reader/fetchBookmarks',
  async () => {
    const bookmarks: BookmarkModel[] = await window.localforage.getItem("bookmarks") || [];
    const keyArr = AddTrash.getAllTrash();
    return handleKeyRemove(bookmarks, keyArr);
  }
);

const readerSlice = createSlice({
  name: 'reader',
  initialState,
  reducers: {
    handleNotes: (state, action: PayloadAction<NoteModel[]>) => {
      state.notes = action.payload;
    },
    handleOriginalText: (state, action: PayloadAction<string>) => {
      state.originalText = action.payload;
    },
    handleColor: (state, action: PayloadAction<number>) => {
      state.color = action.payload;
    },
    handleBookmarks: (state, action: PayloadAction<BookmarkModel[]>) => {
      state.bookmarks = action.payload;
    },
    handleDigests: (state, action: PayloadAction<NoteModel[]>) => {
      state.digests = action.payload;
    },
    handleHtmlBook: (state, action: PayloadAction<HtmlBookModel>) => {
      state.htmlBook = action.payload;
    },
    handleCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
    },
    handleCurrentChapterIndex: (state, action: PayloadAction<number>) => {
      state.currentChapterIndex = action.payload;
    },
    handleChapters: (state, action: PayloadAction<any[]>) => {
      state.chapters = action.payload;
    },
    handleNoteKey: (state, action: PayloadAction<string>) => {
      state.noteKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      });
  },
});

export const {
  handleNotes,
  handleOriginalText,
  handleColor,
  handleBookmarks,
  handleDigests,
  handleHtmlBook,
  handleCurrentChapter,
  handleCurrentChapterIndex,
  handleChapters,
  handleNoteKey,
} = readerSlice.actions;

export default readerSlice.reducer;