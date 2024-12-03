import { AppDetailsOptions } from "electron"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { fetchNotes, handleMenuMode, handleNoteKey, handleOpenMenu } from "../../../store/slices";
import { PopupNoteProps } from "./interface";
import PopupNote from "./component";
import React from "react";

interface PopupNoteContainerProps {

  chapterDocIndex: number;
  chapter: string;
}
const PopupNoteContainer: React.FC<PopupNoteContainerProps> = ({
  chapterDocIndex,
  chapter,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    notes: state.reader.notes,
    color: state.reader.color,
    htmlBook: state.reader.htmlBook,
    noteKey: state.reader.noteKey,
  }))
  const actionCreator = {
    handleOpenMenu: (payload: boolean) => dispatch(handleOpenMenu(payload)),
    handleMenuMode: (payload: string) => dispatch(handleMenuMode(payload)),
    handleNoteKey: (payload: string) => dispatch(handleNoteKey(payload)),
    handleFetchNotes: () => dispatch(fetchNotes()),
  }
  const props: PopupNoteProps = {
    ...state,
    ...actionCreator,
    chapterDocIndex,
    chapter,
  }
  return <PopupNote {...props} />
}
export default PopupNoteContainer;