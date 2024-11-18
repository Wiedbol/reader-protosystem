import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { SettingPanelProps } from "./interface";
import SettingPanel from "./component";
import React from "react";

interface SettingPanelContainerProps {}

const SettingPanelContainer: React.FC<SettingPanelContainerProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState)=> ({
    currentBook: state.book.currentBook,
    locations: state.progressPanel.locations,
    isReading: state.book.isReading,
  }));
  const actionCreator = {

  }
  const props: SettingPanelProps = {
    ...state,
    ...actionCreator
  }

  return <SettingPanel {...props} />
}

export default SettingPanelContainer;