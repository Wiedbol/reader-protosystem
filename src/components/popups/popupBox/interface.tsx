import BookModel from "../../../models/Book";
import NoteModel from "../../../models/Note";

export interface PopupBoxProps {
  currentBook: BookModel;
  isOpenMenu: boolean;
  isChangeDirection: boolean;
  menuMode: string;
  notes: NoteModel[];
  color: number;
  noteKey: string;
  // cfiRange: any;
  digests: NoteModel[];
  rendition: any;
  rect: any;
  chapterDocIndex: number;
  chapter: string;
  handleNoteKey: (key: string) => void;
  handleOpenMenu: (isOpenMenu: boolean) => void;
  handleMenuMode: (menu: string) => void;
  handleChangeDirection: (isChangeDirection: boolean) => void;
  handleRenderNoteFunc: (renderNoteFunc: () => void) => void;
}