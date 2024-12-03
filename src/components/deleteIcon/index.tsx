import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { fetchBookmarks, fetchNotes, handleShowBookmark } from "../../store/slices";
import { DeleteIconProps } from "./interface";
import DeleteIcon from "./component";
import React from "react";

interface DeleteIconContainerProps {
  mode: string;
  index?: number;
  tagName?: string;
  itemKey?: string;
  renderHighlighters?: () => void;
  handleChangeTag?: (index: number) => void;
  handleShowDelete?: (DeleteKey: string) => void;
}

const DeleteIconContainer: React.FC<DeleteIconContainerProps> = ({
  mode,
  index,
  tagName,
  itemKey,
  renderHighlighters,
  handleChangeTag,
  handleShowDelete,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    digests: state.reader.digests,
    bookmarks: state.reader.bookmarks,
    notes: state.reader.notes,
    isReading: state.book.isReading,
  }))
  const actionCreator = {
    handleFetchBookmarks: () => dispatch(fetchBookmarks()),
    handleFetchNotes: () => dispatch(fetchNotes()),
    handleShowBookmark: (isShow: boolean) => dispatch(handleShowBookmark(isShow)),
  }
  const props: DeleteIconProps = {
    ...state,
    ...actionCreator,
    mode,
    ...(index !== undefined && { index }),
    ...(tagName !== undefined && { tagName }),
    ...(itemKey !== undefined && { itemKey }),
    ...(renderHighlighters !== undefined && { renderHighlighters }),
    ...(handleShowDelete !== undefined && { handleShowDelete }),
    ...(handleChangeTag !== undefined && { handleChangeTag }),
  }
  return <DeleteIcon {...props} />
}
export default DeleteIconContainer;