import React, { useState } from "react";
import "./deleteIcon.css";
import { DeleteIconProps } from "./interface";
import TagUtil from "../../utils/readUtils/tagUtil";
import DeletePopup from "../dialogs/deletePopup";
import toast from "react-hot-toast";
declare var window: any;

const DeleteIcon: React.FC<DeleteIconProps> = (props) => {
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const handleDelete = () => {
    const deleteItems =
      props.mode === "notes"
        ? props.notes
        : props.mode === "tags"
        ? TagUtil.getAllTags()
        : props.bookmarks;
    const deleteFunc =
      props.mode === "notes" ? props.handleFetchNotes : props.handleFetchBookmarks;

    deleteItems.forEach((item: any, index: number) => {
      if (props.mode === "tags") {
        if (item === props.tagName) {
          TagUtil.clear(item);
          handleDeleteTagFromNote(item);
        }
        return;
      }
      if (item.key === props.itemKey) {
        deleteItems.splice(index, 1);
        const localforageKey = props.mode;
        if (deleteItems.length === 0) {
          window.localforage
            .removeItem(localforageKey)
            .then(() => {
              deleteFunc();
              toast.success(props.t("Deletion successful"));
            })
            .catch(() => {
              console.error("delete failed");
            });
        } else {
          window.localforage
            .setItem(localforageKey, deleteItems)
            .then(() => {
              deleteFunc();
              toast.success(props.t("Deletion successful"));
            })
            .catch(() => {
              console.error("modify failed");
            });
        }
      }
    });
  };

  const handleDeleteTagFromNote = (tagName: string) => {
    const updatedNotes = props.notes.map((item) => ({
      ...item,
      tag: item.tag.filter((subitem) => subitem !== tagName),
    }));
    window.localforage.setItem("notes", updatedNotes).then(() => {
      props.handleFetchNotes();
    });
  };

  const handleDeletePopup = (isOpen: boolean) => {
    setIsOpenDelete(isOpen);
    if (!isOpen) {
      props.handleChangeTag(props.index);
    }
  };

  const deletePopupProps = {
    name: props.tagName,
    title: "Delete this tag",
    description: "This action will clear and remove this tag",
    handleDeletePopup: handleDeletePopup,
    handleDeleteOpearion: handleDelete,
  };

  return (
    <>
      {isOpenDelete && <DeletePopup {...deletePopupProps} />}
      <div
        className="delete-digest-button"
        onClick={() => {
          props.mode === "tags" ? handleDeletePopup(true) : handleDelete();
        }}
      >
        <span className="icon-close delete-digest-icon"></span>
      </div>
    </>
  );
};

export default DeleteIcon;

