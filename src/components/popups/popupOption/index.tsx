import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { fetchNotes, handleChangeDirection, handleMenuMode, handleNoteKey, handleOpenMenu, handleOriginalText } from "../../../store/slices";
import { PopupOptionProps } from "./interface";
import HtmlBook from "../../../models/HtmlBook";
import NoteModel from "../../../models/Note"
import PopupOption from "./component";
import React from "react";

interface PopupOptionContainerProps {
  chapterDocIndex: number;
  chapter: string;
  rect: DOMRect;
  // cfiRange: string;
  // htmlBook: HtmlBook;
  // digests: NoteModel[];
  // noteKey: string;
}

const PopupOptionContainer: React.FC<PopupOptionContainerProps> = ({
  chapterDocIndex,
  chapter,
  rect,
  // cfiRange,
  // htmlBook,
  // digests,
  // noteKey,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    selection: state.viewArea.selection,
    notes: state.reader.notes,
    color: state.reader.color,
    htmlBook: state.reader.htmlBook,
  }))
  const actionCreator = {
    handleOpenMenu: (payload: boolean) => dispatch(handleOpenMenu(payload)),
    handleMenuMode: (payload: string) => dispatch(handleMenuMode(payload)),
    handleFetchNotes: () => dispatch(fetchNotes()),
    handleOriginalText: (payload: string) => dispatch(handleOriginalText(payload)),
    handleChangeDirection: (payload: boolean) => dispatch(handleChangeDirection(payload)),
    handleNoteKey: (payload: string) => dispatch(handleNoteKey(payload)),
  }
  const props: PopupOptionProps = {
    ...state,
    ...actionCreator,
    rect,
    chapterDocIndex,
    chapter,
    // cfiRange,
    // htmlBook,
    // digests,
    // noteKey,
  }
  return <PopupOption {...props} />
}
export default PopupOptionContainer;