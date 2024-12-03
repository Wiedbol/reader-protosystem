
import React, { useState, useEffect, useCallback } from "react";
import "./operationPanel.css";
import Bookmark from "../../../models/Bookmark";
import RecordLocation from "../../../utils/readUtils/recordLocation";
import { OperationPanelProps } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import ReadingTime from "../../../utils/readUtils/readingTime";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HtmlMouseEvent } from "../../../utils/serviceUtils/mouseEvent";
import { isElectron } from "react-device-detect";
import {
  handleExitFullScreen,
  handleFullScreen,
} from "../../../utils/commonUtil";

declare var window: any;

const OperationPanel: React.FC<OperationPanelProps> = ({
  currentBook,
  htmlBook,
  handleReadingState,
  handleSearch,
  time,
  handleHtmlBook,
  bookmarks,
  handleBookmarks,
  handleShowBookmark,
}) => {
  const navigate = useNavigate();

  const [isBookmark, setIsBookmark] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(
    RecordLocation.getHtmlLocation(currentBook.key)?.percentage || 0
  );
  const [timeLeft, setTimeLeft] = useState(0);

  const timeStamp = React.useRef(Date.now());
  const speed = React.useRef(30000);

  useEffect(() => {
    if (htmlBook && htmlBook.rendition) {
      htmlBook.rendition.on("page-changed", handlePageChanged);
    }

    return () => {
      if (htmlBook && htmlBook.rendition) {
        htmlBook.rendition.off("page-changed", handlePageChanged);
      }
    };
  }, [htmlBook]);

  const handlePageChanged = useCallback(async () => {
    speed.current = Date.now() - timeStamp.current;
    timeStamp.current = Date.now();
    let pageProgress = await htmlBook.rendition.getProgress();
    setTimeLeft(
      ((pageProgress.totalPage - pageProgress.currentPage) * speed.current) /
        1000
    );
    handleDisplayBookmark();

    HtmlMouseEvent(
      htmlBook.rendition,
      currentBook.key,
      StorageUtil.getReaderConfig("readerMode")
    );
  }, [htmlBook, currentBook.key]);

  const handleScreen = useCallback(() => {
    const isFullscreen = StorageUtil.getReaderConfig("isFullscreen") === "yes";
    if (isFullscreen) {
      handleExitFullScreen();
      StorageUtil.setReaderConfig("isFullscreen", "no");
    } else {
      handleFullScreen();
      StorageUtil.setReaderConfig("isFullscreen", "yes");
    }
  }, []);

  const handleExit = useCallback(() => {
    StorageUtil.setReaderConfig("isFullscreen", "no");
    handleReadingState(false);
    handleSearch(false);
    window.speechSynthesis && window.speechSynthesis.cancel();
    // TTSUtil.pauseAudio();
    ReadingTime.setTime(currentBook.key, time);
    handleExitFullScreen();
    if (htmlBook) {
      handleHtmlBook(null);
    }

    if (isElectron) {
      if (StorageUtil.getReaderConfig("isOpenInMain") === "yes") {
        window.require("electron").ipcRenderer.invoke("exit-tab", "ping");
      } else {
        window.close();
      }
    } else {
      window.close();
    }
  }, [currentBook.key, handleHtmlBook, handleReadingState, handleSearch, htmlBook, time]);

  const handleAddBookmark = useCallback(() => {
    let bookKey = currentBook.key;
    let bookLocation = RecordLocation.getHtmlLocation(bookKey);
    let text = bookLocation.text;
    let chapter = bookLocation.chapterTitle;
    let percentage = bookLocation.percentage;

    let cfi = JSON.stringify(bookLocation);
    if (!text) {
      text = htmlBook.rendition.visibleText().join(" ");
    }
    text = text
      .replace(/\s\s/g, "")
      .replace(/\r/g, "")
      .replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/\f/g, "");

    let bookmark = new Bookmark(
      bookKey,
      cfi,
      text.substr(0, 200),
      percentage,
      chapter
    );
    let bookmarkArr = [...bookmarks, bookmark];
    handleBookmarks(bookmarkArr);
    window.localforage.setItem("bookmarks", bookmarkArr);
    setIsBookmark(true);
    toast.success("添加成功");
    handleShowBookmark(true);
  }, [bookmarks, currentBook.key, handleBookmarks, handleShowBookmark, htmlBook.rendition]);

  const handleDisplayBookmark = useCallback(() => {
    handleShowBookmark(false);
    let bookLocation = RecordLocation.getHtmlLocation(currentBook.key);
    bookmarks.forEach((item) => {
      if (item.cfi === JSON.stringify(bookLocation)) {
        handleShowBookmark(true);
      }
    });
  }, [bookmarks, currentBook.key, handleShowBookmark]);

  return (
    <div className="book-operation-panel">
      <div className="book-opeartion-info">
        <span>
          <span>
            阅读时间：
            {
              Math.abs(Math.floor(time / 60))
            }
            min
          </span>
        </span>
        &nbsp;&nbsp;&nbsp;
        <span>
          <span>
            预计剩余阅读时间：
            {
              Math.ceil(timeLeft / 60)
            }
            min
          </span>
        </span>
      </div>
      <div className="exit-reading-button" onClick={handleExit}>
        <div className="operation-button-container">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="icon-exit exit-reading-icon"></span>
            <span className="exit-reading-text">
            <span>退出</span>
            </span> </div>
        </div>
      </div>
      <div className="add-bookmark-button" onClick={handleAddBookmark}>
        <div className="operation-button-container">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="icon-add add-bookmark-icon"></span>
            <span className="add-bookmark-text">
            <span>添加书签</span>
            </span>
          </div>
        </div>
      </div>
      <div
        className="enter-fullscreen-button"
        onClick={() => {
          if (isElectron) {
            handleScreen();
          } else {
            toast(
              
                "网页版受浏览器限制"
              
            );
          }
        }}
      >
        <div className="operation-button-container">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="icon-fullscreen enter-fullscreen-icon"></span>
            <span className="enter-fullscreen-text">
            <span>全屏</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationPanel;

