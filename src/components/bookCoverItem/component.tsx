import React, { useState, useEffect } from "react";
import RecentBooks from "../../utils/readUtils/recordRecent";
import "./bookCoverItem.css";
import { BookCoverProps } from "./interface";
import AddFavorite from "../../utils/readUtils/addFavorite";
import ActionDialog from "../dialogs/actionDialog";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import { useNavigate } from "react-router-dom";
import RecordLocation from "../../utils/readUtils/recordLocation";
import { isElectron } from "react-device-detect";
import EmptyCover from "../emptyCover";
import BookUtil from "../../utils/fileUtils/bookUtil";
import toast from "react-hot-toast";

const BookCoverItem: React.FC<BookCoverProps> = (props) => {
  const [isFavorite, setIsFavorite] = useState(
    AddFavorite.getAllFavorites().includes(props.book.key)
  );
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [direction, setDirection] = useState("horizontal");
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

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
      BookUtil.RedirectBook(props.book, navigate);
    }
  }, [props, navigate]);

  useEffect(() => {
    setIsFavorite(AddFavorite.getAllFavorites().includes(props.book.key));
  }, [props.book.key]);

  const handleMoreAction = (event) => {
    event.preventDefault();
    const x = event.clientX > document.body.clientWidth - 300 && !props.isCollapsed
      ? event.clientX - 180
      : event.clientX;
    const y = document.body.clientHeight - event.clientY > 250
      ? event.clientY
      : event.clientY - 200;

    setPosition({ left: x, top: y });
    props.handleActionDialog(true);
    props.handleReadingBook(props.book);
  };

  const handleDeleteBook = () => {
    props.handleReadingBook(props.book);
    props.handleDeleteDialog(true);
    props.handleActionDialog(false);
  };

  const handleLoveBook = () => {
    AddFavorite.setFavorite(props.book.key);
    setIsFavorite(true);
    toast.success("添加成功");
  };

  const handleCancelLoveBook = () => {
    AddFavorite.clear(props.book.key);
    setIsFavorite(false);
    if (Object.keys(AddFavorite.getAllFavorites()).length === 0 && props.mode === "favorite") {
      navigate("/manager/empty");
    }
    toast.success("取消成功");
  };

  const handleJump = () => {
    if (props.isSelectBook) {
      props.handleSelectedBooks(
        props.isSelected
          ? props.selectedBooks.filter((item) => item !== props.book.key)
          : [...props.selectedBooks, props.book.key]
      );
    } else {
      RecentBooks.setRecent(props.book.key);
      props.handleReadingBook(props.book);
      BookUtil.RedirectBook(props.book, navigate);
    }
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

  const htmlString = props.book.description;
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  const textContent = div.textContent || div.innerText;

  return (
    <>
      <div className="book-list-cover-item" onContextMenu={handleMoreAction}>
        <div className="book-cover-item-header">
          <div className="reading-progress-icon">
            <div style={{ position: "relative", left: "4px" }}>
              {getReadingPercentage()}%
            </div>
          </div>
          <span className="icon-more book-more-action" onClick={handleMoreAction}></span>
        </div>

        <div
          className="book-cover-item-cover"
          onClick={handleJump}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={
            StorageUtil.getReaderConfig("isDisableCrop") === "yes"
              ? {
                  height: "195px",
                  alignItems: "flex-start",
                  background: "rgba(255, 255,255, 0)",
                  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0)",
                }
              : {
                  height: "170px",
                  alignItems: "center",
                  overflow: "hidden",
                }
          }
        >
          {!props.book.cover || props.book.cover === "noCover" || (props.book.format === "PDF" && StorageUtil.getReaderConfig("isDisablePDFCover") === "yes") ? (
            <div className="book-item-image" style={{ width: "120px", height: "170px" }}>
              <EmptyCover format={props.book.format} title={props.book.name} scale={1.14} />
            </div>
          ) : (
            <img
              data-src={props.book.cover}
              alt=""
              style={direction === "horizontal" || StorageUtil.getReaderConfig("isDisableCrop") === "yes"
                ? { width: "100%" }
                : { height: "100%" }}
              className="lazy-image book-item-image"
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                setDirection(img.naturalHeight / img.naturalWidth > 170 / 120
                  ? "horizontal"
                  : "vertical");
              }}
            />
          )}
        </div>

        <p className="book-cover-item-title">{props.book.name}</p>
        <p className="book-cover-item-author">
          作者: {props.book.author}
        </p>
        <p className="book-cover-item-author">
          出版社: {props.book.publisher}
        </p>
        <div className="book-cover-item-desc">
          概要: <div className="book-cover-item-desc-detail">{props.book.description ? textContent : "空"}</div>
        </div>
      </div>

      {props.isOpenActionDialog && props.book.key === props.currentBook.key && (
        <ActionDialog left={position.left} top={position.top} />
      )}
    </>
  );
};

export default BookCoverItem;
