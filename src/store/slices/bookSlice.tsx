import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BookModel from "../../models/Book";

interface BookState {
  isOpenEditDialog: boolean,
  isOpenDeleteDialog: boolean,
  isOpenAddDialog: boolean,
  isOpenActionDialog: boolean,
  isReading: boolean,
  isRedirect: Boolean
  dragItem: string,
  currentBook: BookModel,
  renderBookFunc: () => void,
  renderNoteFunc: () => void,
}
const initialState: BookState = {
  isOpenEditDialog: false,
  isOpenDeleteDialog: false,
  isOpenAddDialog: false,
  isOpenActionDialog: false,
  isReading: false,
  isRedirect: false,
  dragItem: "",
  currentBook: {} as BookModel,
  renderBookFunc: () => {},
  renderNoteFunc: () => {},
};
const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    handleEditDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenEditDialog = action.payload;
    },
    handleDeleteDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenDeleteDialog = action.payload;
    },
    handleAddDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenAddDialog = action.payload;
    },
    handleActionDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenActionDialog = action.payload;
    },
    handleReadingState: (state, action: PayloadAction<boolean>) => {
      state.isReading = action.payload;
    },
    handleDragItem: (state, action: PayloadAction<string>) => {
      state.dragItem = action.payload;
    },
    handleRenderBookFunc: (state, action: PayloadAction<() => void>) => {
      state.renderBookFunc = action.payload;
    },
    handleRenderNoteFunc: (state, action: PayloadAction<() => void>) => {
      state.renderNoteFunc = action.payload;
    },
    handleReadingBook: (state, action: PayloadAction<BookModel>) => {
      state.currentBook = action.payload;
    },
    handleRedirect: (state) => {
      state.isRedirect = true;
    },

  }
})

export const {
  handleEditDialog,
  handleDeleteDialog,
  handleAddDialog,
  handleActionDialog,
  handleReadingState,
  handleDragItem,
  handleRenderBookFunc,
  handleRenderNoteFunc,
  handleReadingBook,
  handleRedirect,
} = bookSlice.actions;

export default bookSlice.reducer;
