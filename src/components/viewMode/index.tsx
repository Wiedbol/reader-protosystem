import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { viewMode } from "../../constants/viewMode";
import { fetchViewMode } from "../../store/slices";
import { ViewModeProps } from "./interface";
import ViewMode from "./component";
import React from "react";

interface ViewModeContainerProps {

}

const ViewModeContainer: React.FC<ViewModeContainerProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    viewMode: state.manager.viewMode,
  }))
  const actionCreator = {
    handleFetchList: () => dispatch(fetchViewMode()),
  }
  const props: ViewModeProps = {
    ...state,
    ...actionCreator,
  }
  return <ViewMode {...props} />
}
export default ViewModeContainer;