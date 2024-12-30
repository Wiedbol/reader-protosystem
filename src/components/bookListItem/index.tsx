import { connect } from "react-redux";
import {
  handleEditDialog,
  handleDeleteDialog,
  handleAddDialog,
  handleReadingBook,
  handleDragItem,
  handleFetchBooks,
  handleSelectedBooks,
  handleSelectBook,
  handleActionDialog,
} from "../../store/actions";
import { withTranslation } from "react-i18next";

import { stateType } from "../../store";
import BookListItem from "./component";
const mapStateToProps = (state: stateType) => {
  return {
    isReading: state.book.isReading,
    percentage: state.progressPanel.percentage,
    currentBook: state.book.currentBook,
    dragItem: state.book.dragItem,
    mode: state.sidebar.mode,
    isSelectBook: state.manager.isSelectBook,
    selectedBooks: state.manager.selectedBooks,
    isOpenActionDialog: state.book.isOpenActionDialog,
    isAdmin: state.user.isAdmin,
  };
};
const actionCreator = {
  handleReadingBook,
  handleEditDialog,
  handleDeleteDialog,
  handleAddDialog,
  handleActionDialog,
  handleDragItem,
  handleSelectBook,
  handleFetchBooks,
  handleSelectedBooks,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(BookListItem as any) as any);
