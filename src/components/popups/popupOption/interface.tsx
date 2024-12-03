import BookModel from "../../../models/Book";
import HtmlBook from "../../../models/HtmlBook";
import NoteModel from "../../../models/Note";
export interface PopupOptionProps {
  currentBook: BookModel;
  selection: string;
  notes: NoteModel[];
  color: number;
  // digests: NoteModel[];
  // noteKey: string;
  rect: DOMRect;
  // cfiRange: string;
  // htmlBook: HtmlBook;
  chapter: string;
  chapterDocIndex: number;
  handleOpenMenu: (isOpenMenu: boolean) => void;
  handleNoteKey: (key: string) => void;
  handleMenuMode: (menu: string) => void;
  handleFetchNotes: () => void;
  handleOriginalText: (originalText: string) => void;
  handleChangeDirection: (isChangeDirection: boolean) => void;
}
