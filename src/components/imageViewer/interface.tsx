import BookModel from "../../models/Book";
export interface ImageViewerProps {
  rendition: any;
  isShow: boolean;
  handleLeaveReader: (position: string) => void;
  handleEnterReader: (position: string) => void;
  currentBook: BookModel;
}