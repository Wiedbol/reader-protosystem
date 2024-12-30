import { connect } from "react-redux";
import {
  handleDeleteDialog,
  handleSelectBook,
  handleAddDialog,
  handleSelectedBooks,
} from "../../store/actions";
import { stateType } from "../../store";
import { withTranslation } from "react-i18next";
import SelectBook from "./component";

const mappropsToProps = (state: stateType) => {
  return {
    books: state.manager.books,
    notes: state.reader.notes,
    deletedBooks: state.manager.deletedBooks,
    selectedBooks: state.manager.selectedBooks,
    isCollapsed: state.sidebar.isCollapsed,
    shelfIndex: state.sidebar.shelfIndex,
    isSelectBook: state.manager.isSelectBook,
    isAdmin: state.user.isAdmin,
  };
};
const actionCreator = {
  handleDeleteDialog,
  handleSelectBook,
  handleAddDialog,
  handleSelectedBooks,
};
export default connect(
  mappropsToProps,
  actionCreator
)(withTranslation()(SelectBook as any) as any);
