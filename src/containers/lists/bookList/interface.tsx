
import BookModel from "../../../models/Book";
import NoteModel from "../../../models/Note";
import BookmarkModel from "../../../models/Bookmark";
export interface BookListProps {
  books: BookModel[];
  mode: string;
  shelfIndex: number;
  searchResults: number[];
  isSearch: boolean;
  isCollapsed: boolean;
  isBookSort: boolean;
  isSelectBook: boolean;
  viewMode: string;
  selectedBooks: string[];
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  bookSortCode: { sort: number; order: number };
  noteSortCode: { sort: number; order: number };
  handleFetchList: () => void;
  handleAddDialog: (isShow: boolean) => void;
  handleMode: (mode: string) => void;
  handleFetchBooks: () => void;
  handleShelfIndex: (index: number) => void;
  handleDeleteDialog: (isShow: boolean) => void;
}