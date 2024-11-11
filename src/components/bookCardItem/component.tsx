import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./bookCardItem.css";
import { BookCardProps } from "./interface";
import RecentBooks from "../../utils/readUtils/recordRecent";
import AddFavorite from "../../utils/readUtils/addFavorite";
import ActionDialog from "../dialogs/actionDialog";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import RecordLocation from "../../utils/readUtils/recordLocation";
import { isElectron } from "react-device-detect";
import EmptyCover from "../emptyCover";
import BookUtil from "../../utils/fileUtils/bookUtil";

declare var window: any;

const BookCardItem: React.FC<BookCardProps> = ({
  book,
  currentBook,
  isSelectBook,
  selectedBooks,
  isSelected,
  isOpenActionDialog,
  handleReadingBook,
  handleDeleteDialog,
  handleActionDialog,
  handleSelectedBooks,
  handleSelectBook,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [direction, setDirection] = useState("horizontal");
  const [isHover, setIsHover] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsFavorite(AddFavorite.getAllFavorites().indexOf(book.key) > -1);

    let filePath = "";
    if (isElectron) {
      const { ipcRenderer } = window.require("electron");
      filePath = ipcRenderer.sendSync("get-file-data");
    }

    if (
      StorageUtil.getReaderConfig("isOpenBook") === "yes" &&
      RecentBooks.getAllRecent()[0] === book.key &&
      !currentBook.key &&
      !filePath
    ) {
      handleReadingBook(book);
      BookUtil.RedirectBook(book, navigate);
    }
  }, [book, currentBook, handleReadingBook, navigate]);

  const handleMoreAction = (event: React.MouseEvent) => {
    event.preventDefault();
    const x = event.clientX > document.body.clientWidth - 300 ? event.clientX - 190 : event.clientX - 10;
    const y = document.body.clientHeight - event.clientY > 250 ? event.clientY - 10 : event.clientY - 220;
    
    setLeft(x);
    setTop(y);
    handleActionDialog(true);
    handleReadingBook(book);
  };

  const handleDeleteBook = () => {
    handleReadingBook(book);
    handleDeleteDialog(true);
    handleActionDialog(false);
  };

  const handleJump = () => {
    if (isSelectBook) {
      handleSelectedBooks(
        isSelected
          ? selectedBooks.filter((item) => item !== book.key)
          : [...selectedBooks, book.key]
      );
      return;
    }
    RecentBooks.setRecent(book.key);
    handleReadingBook(book);
    BookUtil.RedirectBook(book, navigate);
  };

  const getPercentage = () => {
    if (book.format === "PDF") {
      const pdfLocation = RecordLocation.getPDFLocation(book.md5.split("-")[0]);
      return pdfLocation && pdfLocation.page && book.page
        ? pdfLocation.page / book.page
        : "0";
    } else {
      const htmlLocation = RecordLocation.getHtmlLocation(book.key);
      return htmlLocation && htmlLocation.percentage
        ? htmlLocation.percentage
        : "0";
    }
  };

  const percentage = getPercentage();
  const actionProps = { left, top };

  return (
    <>
      <div className="book-list-item" onContextMenu={handleMoreAction}>
        <div
          className="book-item-cover"
          onClick={handleJump}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={
            StorageUtil.getReaderConfig("isDisableCrop") === "yes"
              ? {
                  height: "168px",
                  alignItems: "flex-end",
                  background: "rgba(255, 255,255, 0)",
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0)",
                }
              : {
                  height: "137px",
                  alignItems: "center",
                  overflow: "hidden",
                }
          }
        >
          {!book.cover ||
          book.cover === "noCover" ||
          (book.format === "PDF" &&
            StorageUtil.getReaderConfig("isDisablePDFCover") === "yes") ? (
            <div className="book-item-image">
              <EmptyCover
                format={book.format}
                title={book.name}
                scale={1}
              />
            </div>
          ) : (
            <img
              data-src={book.cover}
              alt=""
              className="lazy-image book-item-image"
              style={
                direction === "horizontal" ||
                StorageUtil.getReaderConfig("isDisableCrop") === "yes"
                  ? { width: "100%" }
                  : { height: "100%" }
              }
              onLoad={(event: React.SyntheticEvent<HTMLImageElement>) => {
                const target = event.target as HTMLImageElement;
                if (target.naturalHeight / target.naturalWidth > 137 / 105) {
                  setDirection("horizontal");
                } else {
                  setDirection("vertical");
                }
              }}
            />
          )}
        </div>
        {isSelectBook || isHover ? (
          <span
            className="icon-message book-selected-icon"
            onMouseEnter={() => setIsHover(true)}
            onClick={(event) => {
              if (isSelectBook) {
                handleSelectedBooks(
                  isSelected
                    ? selectedBooks.filter((item) => item !== book.key)
                    : [...selectedBooks, book.key]
                );
              } else {
                handleSelectBook(true);
                handleSelectedBooks([book.key]);
              }
              setIsHover(false);
              event.stopPropagation();
            }}
            style={
              isSelected
                ? { opacity: 1 }
                : {
                    color: "#eee",
                  }
            }
          />
        ) : null}

        <p className="book-item-title">{book.name}</p>
        <div className="reading-progress-icon">
          <div style={{ position: "relative", left: "4px" }}>
            {percentage && !isNaN(parseFloat(percentage))
              ? Math.floor(parseFloat(percentage) * 100) === 0
                ? "New"
                : Math.floor(parseFloat(percentage) * 100) < 10
                ? Math.floor(parseFloat(percentage) * 100)
                : Math.floor(parseFloat(percentage) * 100) === 100
                ? "Done"
                : Math.floor(parseFloat(percentage) * 100)
              : "0"}
            {Math.floor(parseFloat(percentage) * 100) > 0 &&
              Math.floor(parseFloat(percentage) * 100) < 100 && (
                <span>%</span>
              )}
          </div>
        </div>
        <span
          className="icon-more book-more-action"
          onClick={handleMoreAction}
        />
      </div>

      {isOpenActionDialog && book.key === currentBook.key && (
        <div className="action-dialog-parent">
          <ActionDialog {...actionProps} />
        </div>
      )}
    </>
  );
};

export default BookCardItem;