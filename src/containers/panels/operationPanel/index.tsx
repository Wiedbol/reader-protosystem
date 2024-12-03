import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { fetchBookmarks, handleBookmarks, handleHtmlBook, handleOpenMenu, handleReadingBook, handleReadingState, handleSearch, handleShowBookmark } from '../../../store/slices';
import Bookmark from '../../../models/Bookmark';
import HtmlBook from '../../../models/HtmlBook';
import Book from '../../../models/Book';
import { OperationPanelProps } from './interface';
import OperationPanel from './component';

interface OperationPanelContainerProps {
  rendition: any;
  time: number;
}

const OperationPanelContainer: React.FC<OperationPanelContainerProps> = ({
  rendition,
  time,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    bookmarks: state.reader.bookmarks,
    notes: state.reader.notes,
    books: state.manager.books,
    htmlBook: state.reader.htmlBook,
    locations: state.progressPanel.locations,
  }))
  const actionCreator = {
    handleBookmarks: (payload: Bookmark[]) => dispatch(handleBookmarks(payload)),
    handleReadingState: (payload: boolean) => dispatch(handleReadingState(payload)),
    handleFetchBookmarks: () => dispatch(fetchBookmarks()),
    handleOpenMenu: (payload: boolean) => dispatch(handleOpenMenu(payload)),
    handleShowBookmark: (payload: boolean) => dispatch(handleShowBookmark(payload)),
    handleSearch: (payload: boolean) => dispatch(handleSearch(payload)),
    handleHtmlBook: (payload: HtmlBook | null) => dispatch(handleHtmlBook(payload as HtmlBook)),
    handleReadingBook: (payload: Book) => dispatch(handleReadingBook(payload)),
  }
  const props: OperationPanelProps = {
    ...state,
    ...actionCreator,
    rendition,
    time,
  }
  return <OperationPanel {...props} />
}
export default OperationPanelContainer