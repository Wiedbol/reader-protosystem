import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { current } from "@reduxjs/toolkit";
import { handleColor, handleSelection } from "../../store/slices";
import { ColorProps } from "./interface";
import ColorOption from './component';

interface ColorContainerProps {
  handleDigest: () => void;
}
const ColorContainer: React.FC<ColorContainerProps> = ({
  handleDigest
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    color: state.reader.color,
    currentBook: state.book.currentBook,
  }))
  const actionCreator = {
    handleColor: (payload: number) => dispatch(handleColor(payload)),
    handleSelection: (payload: number) => dispatch(handleSelection(payload))
  }
  const props: ColorProps = {
    ...state,
    ...actionCreator,
    handleDigest
  }
  return <ColorOption {...props} />
}

export default ColorContainer;