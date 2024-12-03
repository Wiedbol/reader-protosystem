import BookModel from "../../models/Book";
import NoteModel from "../../models/Note";
import BookmarkModel from "../../models/Bookmark";

export interface ShelfSelectorProps {
  books: BookModel[];
  mode: string;
  shelfIndex: number;
  isCollapsed: boolean;
  viewMode: string;
  selectedBooks: string[];
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  handleFetchList: () => void;
  handleMode: (mode: string) => void;
  handleShelfIndex: (index: number) => void;
  handleDeleteDialog: (isShow: boolean) => void;
  handleFetchBooks: () => void;
}