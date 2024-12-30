import { connect } from "react-redux";
import { stateType } from "../../store";
import { withTranslation } from "react-i18next";
import Login from "./component";
import { handleAdmin } from "../../store/actions/user";

const mapStateToProps = (state: stateType) => {
  return {
    isAdmin: state.user.isAdmin,
  };
};
const actionCreator = {
  handleAdmin,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(Login as any) as any);
