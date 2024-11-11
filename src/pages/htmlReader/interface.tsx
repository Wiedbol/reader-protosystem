import BookModel from "../../models/Book";
import HtmlBookModel from "../../models/HtmlBook";
export interface ReaderProps {
  currentBook: BookModel;
  percentage: number;
  htmlBook: HtmlBookModel | null;
  handleFetchNotes: () => void;
  handleFetchBooks: () => void;
  handleFetchBookmarks: () => void;
  handleFetchPercentage: (currentBook: BookModel) => void;
  handleReadingBook: (book: BookModel) => void;
}

export interface ReaderState {
  isOpenRightPanel: boolean;
  isOpenTopPanel: boolean;
  isOpenBottomPanel: boolean;
  isOpenLeftPanel: boolean;
  isTouch: boolean;
  isPreventTrigger: boolean;
  hoverPanel: string;
  time: number;
}
