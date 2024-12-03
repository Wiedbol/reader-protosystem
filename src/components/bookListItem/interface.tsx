import BookModel from "../../models/Book"


export interface BookItemProps {
  book: BookModel;
  percentage: number;
  currentBook: BookModel;
  dragItem: string;
  mode: string;
  isOpenActionDialog: boolean;

  isSelectBook: boolean;
  isSelected: boolean;
  selectedBooks: string[];
  handleSelectBook: (isSelectBook: boolean) => void;

  handleReadingBook: (book: BookModel) => void;
  handleEditDialog: (isShow: boolean) => void;
  handleDeleteDialog: (isShow: boolean) => void;
  handleAddDialog: (isShow: boolean) => void;
  handleActionDialog: (isShowActionDialog: boolean) => void;

  handleDragItem: (key: string) => void;
  handleFetchBooks: () => void;
  handleSelectedBooks: (selectedBooks: string[]) => void;
}