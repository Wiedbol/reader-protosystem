import { connect } from "react-redux";
import {
  handleActionDialog,
  handleReadingBook,
  handleDragItem,
  handleDeleteDialog,
  handleSelectedBooks,
  handleSelectBook,
} from "../../store/actions";
import BookCoverItem from "./component";
import { stateType } from "../../store";
import { withTranslation } from "react-i18next";

const mapStateToProps = (state: stateType) => {
  return {
    mode: state.sidebar.mode,

    isOpenActionDialog: state.book.isOpenActionDialog,
    isCollapsed: state.sidebar.isCollapsed,
    dragItem: state.book.dragItem,
    currentBook: state.book.currentBook,
    isSelectBook: state.manager.isSelectBook,
    selectedBooks: state.manager.selectedBooks,

    isAdmin: state.user.isAdmin,
  };
};
const actionCreator = {
  handleReadingBook,
  handleActionDialog,
  handleDragItem,
  handleDeleteDialog,
  handleSelectBook,
  handleSelectedBooks,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(BookCoverItem as any) as any);
