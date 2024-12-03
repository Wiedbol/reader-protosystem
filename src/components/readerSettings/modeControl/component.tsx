import React, { useState, useCallback } from "react";
import "./modeControl.css";
import { ModeControlProps } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import BookUtil from "../../../utils/fileUtils/bookUtil";

const ModeControl: React.FC<ModeControlProps> = () => {
  const [readerMode, setReaderMode] = useState<string>(
    StorageUtil.getReaderConfig("readerMode") || "double"
  );

  const handleChangeMode = useCallback((mode: string) => {
    setReaderMode(mode);
    StorageUtil.setReaderConfig("readerMode", mode);
    BookUtil.reloadBooks();
  }, []);

  return (
    <div className="background-color-setting">
      <div
        className="background-color-text"
        style={{ position: "relative", bottom: "15px" }}
      >
        <span>视图模式</span>
      </div>
      <div className="single-control-container">
        <div
          className="single-mode-container"
          onClick={() => handleChangeMode("single")}
          style={readerMode === "single" ? {} : { opacity: 0.4 }}
        >
          <span className="icon-single-page single-page-icon"></span>
        </div>

        <div
          className="double-mode-container"
          onClick={() => handleChangeMode("double")}
          style={readerMode === "double" ? {} : { opacity: 0.4 }}
        >
          <span className="icon-two-page two-page-icon"></span>
        </div>
        <div
          className="double-mode-container"
          onClick={() => handleChangeMode("scroll")}
          style={readerMode === "scroll" ? {} : { opacity: 0.4 }}
        >
          <span className="icon-scroll two-page-icon"></span>
        </div>
      </div>
    </div>
  );
};

export default ModeControl;

