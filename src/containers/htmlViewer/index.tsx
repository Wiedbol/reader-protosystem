import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { fetchBookmarks, fetchBooks, fetchNotes, fetchPercentage, handleActionDialog, handleCurrentChapter, handleCurrentChapterIndex, handleHtmlBook, handleMenuMode, handleNoteKey, handleOpenMenu, handleReadingBook, handleReadingState, handleRenderBookFunc } from '../../store/slices';
import BookModel from '../../models/Book'
import { ViewerProps } from './interface';
import Viewer from './component';
import HtmlBook from '../../models/HtmlBook';

interface HtmlViewerContainerProps {
  isShow: boolean;
  handleLeaveReader: () => void;
  handleEnterReader: () => void;
}


const HtmlViewerContainer: React.FC<HtmlViewerContainerProps> = ({
  isShow,
  handleLeaveReader,
  handleEnterReader
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    isOpenActionDialog: state.book.isOpenActionDialog,
    currentBook: state.book.currentBook,
    isReading: state.book.isReading,
    renderNoteFunc: state.book.renderNoteFunc,
    htmlBook: state.reader.htmlBook,
    isOpenMenu: state.viewArea.isOpenMenu,
    books: state.manager.books,
    notes: state.reader.notes,
    menuMode: state.viewArea.menuMode,
  }))
  const actionCreator = {
    handleReadingState: (payload: boolean) => dispatch(handleReadingState(payload)),
    handleReadingBook: (payload: BookModel) => dispatch(handleReadingBook(payload)),
    handleActionDialog: (payload: boolean) => dispatch(handleActionDialog(payload)),
    handleHtmlBook: (payload: HtmlBook | null) => dispatch(handleHtmlBook(payload as HtmlBook)),
    handleRenderBookFunc: (payload: () => void) => dispatch(handleRenderBookFunc(payload)),
    handleFetchBooks: () => dispatch(fetchBooks()),
    handleOpenMenu: (payload: boolean) => dispatch(handleOpenMenu(payload)),
    handleCurrentChapter: (payload: string) => dispatch(handleCurrentChapter(payload)),
    handleNoteKey: (payload: string) => dispatch(handleNoteKey(payload)),
    handleCurrentChapterIndex: (payload: number) => dispatch(handleCurrentChapterIndex(payload)),
    handleFetchNotes: () => dispatch(fetchNotes()),
    handleFetchBookmarks: () => dispatch(fetchBookmarks()),
    handleFetchPercentage: (payload: BookModel) => dispatch(fetchPercentage(payload)),
    handleMenuMode: (payload: string) => dispatch(handleMenuMode(payload)),
  }
  const props: ViewerProps = {
    ...state,
    ...actionCreator,
    isShow,
    handleLeaveReader,
    handleEnterReader
  }
  return <Viewer {...props} />
}

export default HtmlViewerContainer