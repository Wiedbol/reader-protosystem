import BookModel from "../../models/Book";
import NoteModel from "../../models/Note";
import BookmarkModel from "../../models/Bookmark";
import { RouteComponentProps } from "react-router";
export interface ImportLocalProps extends RouteComponentProps<any> {
  books: BookModel[];
  deletedBooks: BookModel[];
  dragItem: string;
  notes: NoteModel[];
  isCollapsed: boolean;
  mode: string;
  shelfIndex: number;
  bookmarks: BookmarkModel[];
  handleFetchBooks: () => void;
  handleDrag: (isDrag: boolean) => void;
  handleReadingBook: (book: BookModel) => void;
  t: (title: string) => string;
}
export interface ImportLocalState {
  isOpenFile: boolean;
  width: number;
}
