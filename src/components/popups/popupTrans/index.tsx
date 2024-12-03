import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { handleMenuMode, handleOpenMenu } from "../../../store/slices";
import { PopupTransProps } from "./interface";
import PopupTrans from './component';

interface PopupTransContainerProps {

}
const PopupTransContainer: React.FC<PopupTransContainerProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    originalText: state.reader.originalText,
    noteKey: state.reader.noteKey,
  }))
  const actionCreator = {
    handleOpenMenu: (payload: boolean) => handleOpenMenu(payload),
    handleMenuMode: (payload: string) => handleMenuMode(payload),
  }
  const props: PopupTransProps = {
    ...state,
    ...actionCreator,

  }
  return <PopupTrans {...props} />
}

export default PopupTransContainer;