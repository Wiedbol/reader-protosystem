import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BackupPageState {
  isBackup: boolean;
  isOpenTokenDialog: boolean;
};
const initialState: BackupPageState = {
  isBackup: false,
  isOpenTokenDialog: false,
};
const backupPageSlice = createSlice({
  name: "backupPage",
  initialState,
  reducers: {
    handleBackupDialog: (state, action: PayloadAction<boolean>) => {
      state.isBackup = action.payload;
    },
    handleTokenDialog: (state, action: PayloadAction<boolean>) => {
      state.isOpenTokenDialog = action.payload;
    }
  }
})

export const {
  handleBackupDialog,
  handleTokenDialog,
} = backupPageSlice.actions;

export default backupPageSlice.reducer;




