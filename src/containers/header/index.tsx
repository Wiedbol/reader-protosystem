import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  handleSortDisplay,
  handleSetting,
  handleAbout,
  handleTipDialog,
  handleTip,
  handleBackupDialog,
  handleFeedbackDialog,
  handleFetchBooks,
  handleFetchNotes,
  handleFetchBookmarks,
} from "../../store/actions";
import { stateType } from "../../store";
import Header from "./component";
import { handleAdmin } from "../../store/actions/user";

const mapStateToProps = (state: stateType) => {
  return {
    isSearch: state.manager.isSearch,
    isAboutOpen: state.manager.isAboutOpen,
    bookmarks: state.reader.bookmarks,
    books: state.manager.books,
    isCollapsed: state.sidebar.isCollapsed,
    isNewWarning: state.manager.isNewWarning,
    notes: state.reader.notes,

    isSortDisplay: state.manager.isSortDisplay,
    isAdmin: state.user.isAdmin,
  };
};
const actionCreator = {
  handleSortDisplay,
  handleBackupDialog,
  handleSetting,
  handleAbout,
  handleFeedbackDialog,
  handleTipDialog,
  handleTip,
  handleFetchBooks,
  handleFetchNotes,
  handleFetchBookmarks,

};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(Header as any) as any);
