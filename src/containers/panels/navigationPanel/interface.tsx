import BookModel from "../../../models/Book";
import BookmarkModel from "../../../models/Bookmark";
import HtmlBookModel from "../../../models/HtmlBook";

export interface NavigationPanelProps {
  currentBook: BookModel;
  htmlBook: any;
  bookmarks: BookmarkModel[];
  time: number;
  handleFetchBookmarks: () => void;
  handleSearch: (isSearch: boolean) => void;
}
