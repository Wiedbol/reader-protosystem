import BookModel from "../../../models/Book";
import NoteModel from "../../../models/Note";

export interface MoreActionProps {
  books: BookModel[];
  deletedBooks: BookModel[];
  notes: NoteModel[];
  currentBook: BookModel;
  left: number;
  top: number;
  mode: string;
  isSelectBook: boolean;
  isShowExport: boolean;
  // isShowDetail: boolean;
  isExceed: boolean;
  handleFetchBooks: () => void;
  handleDeleteDialog: (isShow: boolean) => void;
  handleMoreAction: (isShow: boolean) => void;
  handleFetchBookmarks: () => void;
  handleFetchNotes: () => void;
  handleActionDialog: (isShow: boolean) => void;

}