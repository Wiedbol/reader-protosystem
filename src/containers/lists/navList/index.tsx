import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { handleShowBookmark } from "../../../store/slices";
import { NavListProps } from "./interface";
import NavList from './component';

interface NavListContainerProps {
  currentTab: string;
}

const NavListContainer: React.FC<NavListContainerProps> = ({
  currentTab
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    htmlBook: state.reader.htmlBook,

    bookmarks: state.reader.bookmarks,
    notes: state.reader.notes,
    digests: state.reader.digests,
  }))

  const actionCreator = {
    handleShowBookmark: (isShow: boolean) => dispatch(handleShowBookmark(isShow))
  }
  const props: NavListProps = {
    ...state,
    ...actionCreator,
    currentTab,

  }
  return <NavList {...props} />
}

export default NavListContainer;