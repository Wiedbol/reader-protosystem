import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { handleChangeDirection, handleMenuMode, handleNoteKey, handleOpenMenu, handleRenderNoteFunc, handleSelection } from "../../../store/slices";
import { PopupMenuProps } from "./interface";
import PopupMenu from "./component";
import React from "react";

interface PopupMenuContainerProps {
  rendition: any;
  // cfiRange: any;
  rect: any;
  noteKey: string;
  chapterDocIndex: number;
  chapter: string;
}

const PopupMenuContainer: React.FC<PopupMenuContainerProps> = ({
  rendition,
  // cfiRange,
  rect,
  noteKey,
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
    handleSelection: (payload: any) => dispatch(handleSelection(payload)),
    handleOpenMenu: (payload: boolean) => dispatch(handleOpenMenu(payload)),
    handleMenuMode: (payload: string) => dispatch(handleMenuMode(payload)),
    handleChangeDirection: (payload: boolean) => dispatch(handleChangeDirection(payload)),
    handleNoteKey: (payload: string) => dispatch(handleNoteKey(payload)),
    handleRenderNoteFunc: (payload: () => void) => dispatch(handleRenderNoteFunc(payload)),
  }
  const props: PopupMenuProps = {
    ...state,
    ...actionCreator,
    rendition,
    // cfiRange,
    rect,
    noteKey,
    chapterDocIndex,
    chapter,
  }
  return <PopupMenu {...props} />
}
export default PopupMenuContainer;