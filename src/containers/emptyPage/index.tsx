import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import EmptyPage from "./component";
import React from "react";

const EmptyPageContainer: React.FC = () => {
  const { mode, isCollapsed } = useSelector((state: RootState) => state.sidebar);
  const actionCreators = {};
  return (
    <EmptyPage
      mode={mode}
      isCollapsed={isCollapsed}
      {...actionCreators}
    />
  )
}

export default EmptyPageContainer;