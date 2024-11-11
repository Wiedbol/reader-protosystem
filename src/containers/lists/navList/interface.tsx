import BookmarkModel from "../../../models/Bookmark";
import BookModel from "../../../models/Book";
import HtmlBookModel from "../../../models/HtmlBook";
import NoteModel from "../../../models/Note";

export interface NavListProps {
  currentBook: BookModel;
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  htmlBook: any;
  digests: NoteModel[];
  currentTab: string;
  handleShowBookmark: (isShowBookmark: boolean) => void;
}