import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import RecordLocation from "../../utils/readUtils/recordLocation";
import type BookModel from "../../models/Book";

interface ProgressPanelState {
  locations: any[];
  percentage: number;
}

const initialState: ProgressPanelState = {
  locations: [],
  percentage: 0,
};

export const fetchPercentage = createAsyncThunk(
  'progressPanel/fetchPercentage',
  async (book: BookModel) => {
    const percentage = RecordLocation.getHtmlLocation(book.key).percentage || 0;
    return percentage;
  }
);

const progressPanelSlice = createSlice({
  name: 'progressPanel',
  initialState,
  reducers: {
    handleLocations: (state, action: PayloadAction<any[]>) => {
      state.locations = action.payload;
    },
    handlePercentage: (state, action: PayloadAction<number>) => {
      state.percentage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPercentage.fulfilled, (state, action) => {
      state.percentage = action.payload;
    });
  },
});

export const { handleLocations, handlePercentage } = progressPanelSlice.actions;

export default progressPanelSlice.reducer;