import React from "react";
import { DeletePopup } from "./component";
import { DeletePopupProps } from "./interface";

const DeletePopupContainer: React.FC<DeletePopupProps> = (props) => {
  return<DeletePopup {...props} />
}

export default DeletePopupContainer;