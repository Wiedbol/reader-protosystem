
import BookModel from "../../models/Book";
import HtmlBookModel from "../../models/HtmlBook";
export interface BackgroundProps {
  currentBook: BookModel;
  locations: any;
  currentChapter: string;
  currentChapterIndex: number;
  htmlBook: HtmlBookModel;
  isShowBookmark: boolean;
  handleCurrentChapter: (currentChapter: string) => void;
  handleCurrentChapterIndex: (currentChapterIndex: number) => void;
}