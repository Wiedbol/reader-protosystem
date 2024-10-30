import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
interface SidebarState {
  mode: string;
  shelfIndex: number;
  isCollapsed: boolean;
}
const initialState: SidebarState = {
  mode: "home",
  shelfIndex: -1,
  isCollapsed: StorageUtil.getReaderConfig("isCollapsed") === "yes",
}
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    handleMode: (state, action: PayloadAction<string>) => {
      state.mode = action.payload;
    },
    handleShelfIndex: (state, action: PayloadAction<number>) => {
      state.shelfIndex = action.payload;
    },
    handleCollapse: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    }
  }
})
export const {
  handleMode,
  handleShelfIndex,
  handleCollapse,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;