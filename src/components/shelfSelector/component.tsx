import React, { useState, useEffect } from "react";
import ShelfUtil from "../../utils/readUtils/shelfUtil";
import { Trans } from "react-i18next";
import { ShelfSelectorProps } from "./interface";
import DeletePopup from "../dialogs/deletePopup";
import { withRouter } from "react-router-dom";
import { backup } from "../../utils/syncUtils/backupUtil";
import { isElectron } from "react-device-detect";
declare var window: any;

const ShelfSelector: React.FC<ShelfSelectorProps> = (props) => {
  const [shelfIndex, setShelfIndex] = useState(0);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  // Effect hook to handle the backup in Electron
  useEffect(() => {
    if (isElectron) {
      window.localforage.getItem(props.books[0].key).then((result) => {
        if (result) {
          backup(props.books, props.notes, props.bookmarks, false);
        }
      });
    }
  }, [props.books, props.notes, props.bookmarks]);

  const handleShelfItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = event.target.value.split(",")[1];
    setShelfIndex(Number(index));
    props.handleShelfIndex(index);
    if (index > 0) {
      props.handleMode("shelf");
    } else {
      props.handleMode("home");
    }
  };

  const handleDeleteShelf = () => {
    if (shelfIndex < 1) return;
    const shelfTitles = Object.keys(ShelfUtil.getShelf());
    const currentShelfTitle = shelfTitles[shelfIndex];
    ShelfUtil.removeShelf(currentShelfTitle);
    setShelfIndex(0);
    props.handleShelfIndex(0);
    props.handleMode("shelf");
  };

  const handleDeletePopup = (isOpen: boolean) => {
    setIsOpenDelete(isOpen);
  };

  const renderShelfList = () => {
    const shelfList = ShelfUtil.getShelf();
    const shelfTitle = Object.keys(shelfList);

    return shelfTitle.map((item, index) => (
      <option
        value={[item, index.toString()]}
        key={index}
        className="add-dialog-shelf-list-option"
        selected={props.shelfIndex === index}
      >
        {props.t(item === "New" ? "Books" : item)}
      </option>
    ));
  };

  const deletePopupProps = {
    mode: "shelf",
    name: Object.keys(ShelfUtil.getShelf())[shelfIndex],
    title: "Delete this shelf",
    description: "This action will clear and remove this shelf",
    handleDeletePopup,
    handleDeleteOpearion: handleDeleteShelf,
  };

  return (
    <>
      {isOpenDelete && <DeletePopup {...deletePopupProps} />}
      <div className="booklist-shelf-container">
        <p className="general-setting-title" style={{ float: "left", height: "100%" }}>
          <Trans>Shelf</Trans>
        </p>
        <select
          className="booklist-shelf-list"
          onChange={handleShelfItem}
        >
          {renderShelfList()}
        </select>
        {shelfIndex > 0 && (
          <span
            className="icon-trash delete-shelf-icon"
            onClick={() => handleDeletePopup(true)}
          ></span>
        )}
      </div>
    </>
  );
};

export default withRouter(ShelfSelector);

