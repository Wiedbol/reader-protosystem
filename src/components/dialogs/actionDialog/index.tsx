import { connect } from "react-redux";
import {
  handleEditDialog,
  handleDeleteDialog,
  handleSelectBook,
  handleAddDialog,
  handleSelectedBooks,
  handleActionDialog,
  handleReadingBook,
  handleFetchBooks,
  handleDetailDialog,
} from "../../../store/actions";

import { stateType } from "../../../store";
import { withTranslation } from "react-i18next";
import ActionDialog from "./component";
import { withRouter } from "react-router-dom";

const mapStateToProps = (state: stateType) => {
  return {
    mode: state.sidebar.mode,
    currentBook: state.book.currentBook,
    books: state.manager.books,
    notes: state.reader.notes,
    isSelectBook: state.manager.isSelectBook,

    deletedBooks: state.manager.deletedBooks,

    isAdmin: state.user.isAdmin,
  };
};
const actionCreator = {
  handleEditDialog,
  handleAddDialog,
  handleDeleteDialog,
  handleReadingBook,
  handleActionDialog,
  handleFetchBooks,
  handleDetailDialog,
  handleSelectBook,
  handleSelectedBooks,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(withRouter(ActionDialog as any) as any)as any);
