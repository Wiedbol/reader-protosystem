import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./bookListItem.css";
import RecordLocation from "../../utils/readUtils/recordLocation";
import { BookItemProps } from "./interface";
import { Trans } from "react-i18next";
import AddFavorite from "../../utils/readUtils/addFavorite";
import RecentBooks from "../../utils/readUtils/recordRecent";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import AddTrash from "../../utils/readUtils/addTrash";
import EmptyCover from "../emptyCover";
import BookUtil from "../../utils/fileUtils/bookUtil";
import ActionDialog from "../dialogs/actionDialog";
import { isElectron } from "react-device-detect";
import toast from "react-hot-toast";

const BookListItem: React.FC<BookItemProps> = (props) => {
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(
    AddFavorite.getAllFavorite().includes(props.book.key)
  );
  const [direction, setDirection] = useState("horizontal");
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [isHover, setIsHover] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let filePath = "";
    if (isElectron) {
      const { ipcRenderer } = window.require("electron");
      filePath = ipcRenderer.sendSync("get-file-data");
    }

    if (
      StorageUtil.getReaderConfig("isOpenBook") === "yes" &&
      RecentBooks.getAllRecent()[0] === props.book.key &&
      !props.currentBook.key &&
      !filePath
    ) {
      props.handleReadingBook(props.book);
      BookUtil.RedirectBook(props.book, props.t, history);
    }
  }, [props, history]);

  useEffect(() => {
    setIsFavorite(AddFavorite.getAllFavorite().includes(props.book.key));
  }, [props.book.key]);

  const handleDeleteBook = () => {
    props.handleDeleteDialog(true);
    props.handleReadingBook(props.book);
  };

  const handleEditBook = () => {
    props.handleEditDialog(true);
    props.handleReadingBook(props.book);
  };

  const handleAddShelf = () => {
    props.handleAddDialog(true);
    props.handleReadingBook(props.book);
  };

  const handleLoveBook = () => {
    AddFavorite.setFavorite(props.book.key);
    setIsFavorite(true);
    toast.success(props.t("Addition successful"));
  };

  const handleCancelLoveBook = () => {
    AddFavorite.clear(props.book.key);
    setIsFavorite(false);
    if (
      Object.keys(AddFavorite.getAllFavorite()).length === 0 &&
      props.mode === "favorite"
    ) {
      history.push("/manager/empty");
    }
    toast.success(props.t("Cancellation successful"));
  };

  const handleRestoreBook = () => {
    AddTrash.clear(props.book.key);
    toast.success(props.t("Restore successful"));
    props.handleFetchBooks();
  };

  const handleJump = () => {
    if (props.isSelectBook) {
      props.handleSelectedBooks(
        props.isSelected
          ? props.selectedBooks.filter((item) => item !== props.book.key)
          : [...props.selectedBooks, props.book.key]
      );
      return;
    }
    RecentBooks.setRecent(props.book.key);
    props.handleReadingBook(props.book);
    BookUtil.RedirectBook(props.book, props.t, history);
  };

  const handleExportBook = () => {
    BookUtil.fetchBook(props.book.key, true, props.book.path).then((result) => {
      toast.success(props.t("Export successful"));
      window.saveAs(
        new Blob([result]),
        `${props.book.name}.${props.book.format.toLowerCase()}`
      );
    });
  };

  const handleMoreAction = (event) => {
    event.preventDefault();
    const x = event.clientX > document.body.clientWidth - 300
      ? event.clientX - 180
      : event.clientX;
    const y = document.body.clientHeight - event.clientY > 250
      ? event.clientY
      : event.clientY - 200;

    setPosition({ left: x, top: y });
    props.handleActionDialog(true);
    props.handleReadingBook(props.book);
  };

  const getReadingPercentage = () => {
    if (props.book.format === "PDF") {
      const location = RecordLocation.getPDFLocation(props.book.md5.split("-")[0]);
      return location && location.page && props.book.page
        ? `${Math.floor((location.page / props.book.page) * 100)}`
        : "0";
    } else {
      const location = RecordLocation.getHtmlLocation(props.book.key);
      return location?.percentage || "0";
    }
  };

  const percentage = getReadingPercentage();

  return (
    <>
      <div
        className="book-list-item-container"
        onContextMenu={handleMoreAction}
      >
        {!props.book.cover ||
        props.book.cover === "noCover" ||
        (props.book.format === "PDF" &&
          StorageUtil.getReaderConfig("isDisablePDFCover") === "yes") ? (
          <div
            className="book-item-list-cover"
            onClick={handleJump}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <div className="book-item-image" style={{ height: "65px" }}>
              <EmptyCover format={props.book.format} title={props.book.name} scale={0.43} />
            </div>
          </div>
        ) : (
          <div
            className="book-item-list-cover"
            onClick={handleJump}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <img
              data-src={props.book.cover}
              alt=""
              className="lazy-image book-item-image"
              style={{ width: "100%" }}
              onLoad={(res) => {
                setDirection(
                  res.target.naturalHeight / res.target.naturalWidth > 74 / 47
                    ? "horizontal"
                    : "vertical"
                );
              }}
            />
          </div>
        )}
        {props.isSelectBook || isHover ? (
          <span
            className="icon-message book-selected-icon"
            onMouseEnter={() => setIsHover(true)}
            onClick={(event) => {
              if (props.isSelectBook) {
                props.handleSelectedBooks(
                  props.isSelected
                    ? props.selectedBooks.filter((item) => item !== props.book.key)
                    : [...props.selectedBooks, props.book.key]
                );
              } else {
                props.handleSelectBook(true);
                props.handleSelectedBooks([props.book.key]);
              }
              setIsHover(false);
              event?.stopPropagation();
            }}
            style={
              props.isSelected
                ? { left: "18px", bottom: "5px", opacity: 1 }
                : { left: "18px", bottom: "5px", color: "#eee" }
            }
          ></span>
        ) : null}
        <p className="book-item-list-title" onClick={handleJump}>
          <div className="book-item-list-subtitle">
            <div className="book-item-list-subtitle-text">
              {props.book.name}
            </div>
          </div>
          <p className="book-item-list-percentage">
            {percentage === "0"
              ? "New"
              : parseInt(percentage) < 100
              ? `${parseInt(percentage)}%`
              : "Done"}
          </p>
          <div className="book-item-list-author">
            <Trans>{props.book.author || "Unknown author"}</Trans>
          </div>
        </p>
      </div>
      {props.isOpenActionDialog && props.book.key === props.currentBook.key && (
        <div className="action-dialog-parent">
          <ActionDialog left={position.left} top={position.top} />
        </div>
      )}
    </>
  );
};

export default BookListItem;

