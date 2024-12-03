import BookModel from "../../../models/Book";
import HtmlBookModel from "../../../models/HtmlBook";
export interface SettingSwitchProps {
  currentBook: BookModel;
  locations: any;
  isReading: boolean;
  // htmlBook: HtmlBookModel;
  renderBookFunc: () => void;
}