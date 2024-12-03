import BookModel from "../../../models/Book";
export interface SettingPanelProps {
  currentBook: BookModel;
  locations: any;
  isReading: boolean;
}
export interface SettingPanelState {
  readerMode: string;
  isSettingLocked: boolean;
}
