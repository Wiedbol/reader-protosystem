import BookModel from "../../models/Book";

export interface BookCoverProps {
  book: BookModel;
  currentBook: BookModel;
  isOpenActionDialog: boolean;
  isCollapsed: boolean;
  dragItem: string;
  mode: string;

  isSelectBook: boolean;
  isSelected: boolean;
  selectedBooks: string[];
  handleSelectBook: (isSelectBook: boolean) => void;

  handleReadingBook: (book: BookModel) => void;
  handleActionDialog: (isShowActionDialog: boolean) => void;
  handleDragItem: (key: string) => void;
  handleSelectedBooks: (selectedBooks: string[]) => void;
  handleDeleteDialog: (isShow: boolean) => void;
}