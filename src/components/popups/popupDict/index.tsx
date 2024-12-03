import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { handleMenuMode, handleOpenMenu } from "../../../store/slices"
import { PopupDictProps } from "./interface"
import PopupDict from './component'

interface PopupDictContainerProps {

}
const PopupDictContainer: React.FC<PopupDictContainerProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector((state: RootState) => ({
    originalText: state.reader.originalText,
    currentBook: state.book.currentBook,
  }))
  const actionCreator = {
    handleOpenMenu: (menu: boolean) => handleOpenMenu(menu),
    handleMenuMode: (mode: string) => handleMenuMode(mode),
  }
  const props: PopupDictProps = {
    ...state,
    ...actionCreator,
  }
  return <PopupDict {...props} />
}
export default PopupDictContainer;