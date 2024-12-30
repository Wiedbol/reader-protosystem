import { connect } from "react-redux";
import {
  handleActionDialog,
  handleReadingBook,
  handleDragItem,
  handleDeleteDialog,
  handleSelectBook,
  handleSelectedBooks,
} from "../../store/actions";
import { withTranslation } from "react-i18next";
import BookCardItem from "./component";
import { stateType } from "../../store";

const mapStateToProps = (state: stateType) => {
  return {
    mode: state.sidebar.mode,

    isOpenActionDialog: state.book.isOpenActionDialog,
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
  handleSelectBook,
  handleDeleteDialog,
  handleSelectedBooks,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(BookCardItem as any) as any);
