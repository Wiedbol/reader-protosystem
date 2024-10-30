import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ViewAreaState {
  selection: any | null; // Replace 'any' with a more specific type if possible
  isOpenMenu: boolean;
  menuMode: string;
  isChangeDirection: boolean;
  isShowBookmark: boolean;
  isOpenHighlight: boolean;
  dialogLocation: any | null; // Replace 'any' with a more specific type if possible
}

const initialState: ViewAreaState = {
  selection: null,
  isOpenMenu: false,
  menuMode: "menu",
  isChangeDirection: false,
  isShowBookmark: false,
  isOpenHighlight: false,
  dialogLocation: null,
};

const viewAreaSlice = createSlice({
  name: 'viewArea',
  initialState,
  reducers: {
    handleOpenMenu: (state, action: PayloadAction<boolean>) => {
      state.isOpenMenu = action.payload;
    },
    handleOpenHighlight: (state, action: PayloadAction<boolean>) => {
      state.isOpenHighlight = action.payload;
    },
    handleShowBookmark: (state, action: PayloadAction<boolean>) => {
      state.isShowBookmark = action.payload;
    },
    handleSelection: (state, action: PayloadAction<any>) => {
      state.selection = action.payload;
    },
    handleDialogLocation: (state, action: PayloadAction<any>) => {
      state.dialogLocation = action.payload;
    },
    handleMenuMode: (state, action: PayloadAction<string>) => {
      state.menuMode = action.payload;
    },
    handleChangeDirection: (state, action: PayloadAction<boolean>) => {
      state.isChangeDirection = action.payload;
    },
  },
});

export const {
  handleOpenMenu,
  handleOpenHighlight,
  handleShowBookmark,
  handleSelection,
  handleDialogLocation,
  handleMenuMode,
  handleChangeDirection,
} = viewAreaSlice.actions;

export default viewAreaSlice.reducer;