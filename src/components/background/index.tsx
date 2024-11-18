import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { Background } from "./component";
import React from "react";

const BackgroundContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentBook } = useSelector((state: RootState) => state.book)
  const actionCreators = {};
  return(
    <Background
      currentBook={currentBook}
      {...actionCreators}
    />
  )
}

export default BackgroundContainer;