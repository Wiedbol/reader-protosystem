import BookModel from "../../models/Book";

export interface BookCardProps {
  book: BookModel;
  currentBook: BookModel;
  isOpenActionDialog: boolean;
  isSelectBook: boolean;
  isSelected: boolean;
  dragItem: string;
  selectedBooks: string[];
  mode: string;
  handleSelectBook: (isSelectBook: boolean) => void;
  handleReadingBook: (book: BookModel) => void;
  handleActionDialog: (isShowActionDialog: boolean) => void;
  handleDragItem: (key: string) => void;
  handleSelectedBooks: (selectedBooks: string[]) => void;
  handleDeleteDialog: (isShow: boolean) => void;
}