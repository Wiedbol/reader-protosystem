import BookModel from "../../../models/Book";
export interface PopupDictProps {
  originalText: string;
  currentBook: BookModel;
  handleOpenMenu: (isOpenMenu: boolean) => void;
  handleMenuMode: (menu: string) => void;
}