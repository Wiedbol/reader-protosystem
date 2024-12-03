import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { handleSearch, handleSearchResults } from "../../store/slices";
import { NoteTagProps } from "./interface";
import NoteTag from "./component";
import React from "react";

interface NoteTagContainerProps {
  isCard: boolean;
  tag: string[];
  handleTag: (tag: string[]) => void;
}

const NoteTagContainer: React.FC<NoteTagContainerProps> = ({
  isCard,
  tag,
  handleTag,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    isReading: state.book.isReading,
    noteKey: state.reader.noteKey,
  }))
  const actionCreator = {
    handleSearch: (payload: boolean) => dispatch(handleSearch(payload)),
    handleSearchResults: (payload: number[]) => dispatch(handleSearchResults(payload)),
  }

  const props: NoteTagProps = {
    ...state,
    ...actionCreator,
    isCard,
    tag,
    handleTag,
  }
  return <NoteTag {...props} />
}
export default NoteTagContainer;