import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { handleChangeDirection, handleMenuMode, handleNoteKey, handleOpenMenu, handleRenderNoteFunc, handleSelection } from "../../../store/slices";
import { PopupBoxProps } from "./interface";
import React from "react";
import PopupBox from "./component";
import Note from "../../../models/Note";

interface PopupBoxContainerProps {
  digests: Note[];
  rendition: any;
  rect: any;
  chapterDocIndex: number;
  chapter: string;
}

const PopupBoxContainer: React.FC<PopupBoxContainerProps> = ({
  digests,
  rendition,
  rect,
  chapterDocIndex,
  chapter,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    digests: state.reader.digests,
    notes: state.reader.notes,
    noteKey: state.reader.noteKey,
    currentBook: state.book.currentBook,
    isOpenMenu: state.viewArea.isOpenMenu,
    menuMode: state.viewArea.menuMode,
    color: state.reader.color,
    isChangeDirection: state.viewArea.isChangeDirection,
  }))
  const actionCreator = {
    handleSelection: (selection: string) => dispatch(handleSelection(selection)),
    handleOpenMenu: (payload: boolean) => dispatch(handleOpenMenu(payload)),
    handleMenuMode: (payload: string) => dispatch(handleMenuMode(payload)),
    handleChangeDirection: (payload: boolean) => dispatch(handleSelection(payload)),
    handleNoteKey: (payload: string) => dispatch(handleNoteKey(payload)),
    handleRenderNoteFunc: (payload: () => void) => dispatch(handleRenderNoteFunc(payload)),
  }
  const props: PopupBoxProps = {
    ...state,
    ...actionCreator,
    digests,
    rendition,
    rect,
    chapterDocIndex,
    chapter,
  }
  return <PopupBox {...props} />
}
export default PopupBoxContainer;