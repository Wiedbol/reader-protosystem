import React, { useState, useEffect } from "react";
import "./popupMenu.css";
import PopupNote from "../popupNote";
import PopupTrans from "../popupTrans";
import PopupDict from "../popupDict";
import { PopupBoxProps } from "./interface";
import { getIframeDoc } from "../../../utils/serviceUtils/docUtil";

const PopupBox: React.FC<PopupBoxProps> = ({
  rect,
  isOpenMenu,
  menuMode,
  chapterDocIndex,
  chapter,
  handleOpenMenu,
  handleNoteKey,
  handleMenuMode
}) => {
  const [deleteKey, setDeleteKey] = useState("");

  const handleClose = () => {
    handleOpenMenu(false);
    handleNoteKey("");
    handleMenuMode("");
    let doc = getIframeDoc();
    if (!doc) return;
    doc.getSelection()?.empty();
  };

  const PopupProps = {
    chapterDocIndex,
    chapter,
  };

  return (
    <>
      <div className="popup-box-container">
        {menuMode === "note" ? (
          <PopupNote {...PopupProps} />
        ) : menuMode === "trans" ? (
          <PopupTrans {...PopupProps} />
        ) : menuMode === "dict" ? (
          <PopupDict {...PopupProps} />
        ) : null}
        <span
          className="icon-close popup-close"
          onClick={handleClose}
          style={{ top: "-30px", left: "calc(50% - 10px)" }}
        ></span>
      </div>
      <div className="drag-background" onClick={handleClose}></div>
    </>
  );
};

export default PopupBox;

