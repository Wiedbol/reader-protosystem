import toast from "react-hot-toast";
import { DeletePopupProps } from "./interface"
import React from "react";

export function DeletePopup(props:DeletePopupProps) {
  const handleCancel = () => {
    props.handleDeletePopup(false);
  };
  const handleConfirm = () => {
    props.handleDeletePopup(false);
    props.handleDeleteOperation();
    toast.success("删除成功")
  }
  return (
    <div className="delete-dialog-container">
      <div className="delete-dialog-title">
        {props.title}
      </div>

      <div className="delete-dialog-book">
        <div className="delete-dialog-book-title">{props.name}</div>
      </div>
      <div className="delete-dialog-other-operation">
        {props.description}
      </div>
      <div className="add-dialog-button-container">
        <div
          className="add-dialog-cancel"
          onClick={() => {
            handleCancel();
          }}
        >取消</div>

        <div
          className="add-dialog-confirm"
          onClick={() => {
            handleConfirm();
          }}
        >确认删除</div>
      </div>
    </div>
  )
}

export default DeletePopup;