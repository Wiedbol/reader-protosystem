import BookModel from "../../../models/Book";
import HtmlBookModel from "../../../models/HtmlBook";

export interface ProgressPanelProps {
  currentBook: BookModel;
  isReading: boolean;
  currentChapter: string;
  currentChapterIndex: number;
  percentage: number;
  htmlBook: HtmlBookModel;
  renderBookFunc: (id: string) => void;
}