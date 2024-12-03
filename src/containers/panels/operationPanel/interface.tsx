import BookModel from "../../../models/Book";
import NoteModel from "../../../models/Note";
import HtmlBookModel from "../../../models/HtmlBook";
import BookmarkModel from "../../../models/Bookmark";

export interface OperationPanelProps {
  currentBook: BookModel;
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  books: BookModel[];
  htmlBook: HtmlBookModel;
  locations: any;
  rendition: any;
  time: number;
  handleBookmarks: (bookmarks: BookmarkModel[]) => void;
  handleReadingState: (isReading: boolean) => void;
  handleFetchBookmarks: () => void;
  handleSearch: (isSearch: boolean) => void;
  handleOpenMenu: (isOpenMenu: boolean) => void;
  handleShowBookmark: (isShowBookmark: boolean) => void;
  handleReadingBook: (currentBook: BookModel) => void;

  handleHtmlBook: (htmlBook: HtmlBookModel | null) => void;
}