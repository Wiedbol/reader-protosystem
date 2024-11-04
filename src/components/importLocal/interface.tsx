import BookModel from "../../models/Book"
import NoteModel from "../../models/Note"
import BookmarkModel from "../../models/Bookmark"

export interface ImportLocalProps {
  books: BookModel[];
  deletedBooks: BookModel[];
  notes: NoteModel[];
  isCollapsed: boolean;
  mode: string;
  shelfIndex: number;
  bookmarks: BookmarkModel[];

  handleFetchBooks: () => void;
  handleReadingBook: (book: BookModel) => void;
  handleDrag: (isDrag: boolean) => void;
}
