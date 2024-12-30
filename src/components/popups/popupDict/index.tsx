import { connect } from "react-redux";
import { handleOpenMenu, handleMenuMode } from "../../../store/actions";
import { stateType } from "../../../store";
import { withTranslation } from "react-i18next";
import PopupTrans from "./component";
const mapStateToProps = (state: stateType) => {
  return {
    originalText: state.reader.originalText,
    currentBook: state.book.currentBook,
  };
};
const actionCreator = {
  handleOpenMenu,
  handleMenuMode,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(PopupTrans as any) as any);
