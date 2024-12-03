import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { fetchBookmarks, fetchBooks, fetchNotes, handleActionDialog, handleMenuMode, handleNoteKey, handleOpenMenu, handleReadingBook, handleReadingState } from '../../store/slices'
import Book from '../../models/Book'
import { ViewerProps } from './interface'
import Viewer from './cmponent'

interface PdfReaderContainerProps {
  book: Book
}

const PdfReaderContainer: React.FC<PdfReaderContainerProps> = ({
  book,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector((state: RootState) => ({
    isOpenActionDialog: state.book.isOpenActionDialog,
    currentBook: state.book.currentBook,
    isReading: state.book.isReading,
    isOpenMenu: state.viewArea.isOpenMenu,
    menuMode: state.viewArea.menuMode,
    notes: state.reader.notes,
  }))
  const actionCreator = {
    handleReadingState: (payload: boolean) => dispatch(handleReadingState(payload)),
    handleReadingBook: (payload: Book) => dispatch(handleReadingBook(payload)),
    handleActionDialog: (payload: boolean) => dispatch(handleActionDialog(payload)),
    handleFetchNotes: () => dispatch(fetchNotes()),
    handleFetchBookmarks: () => dispatch(fetchBookmarks()),
    handleFetchBooks: () => dispatch(fetchBooks()),
    handleMenuMode: (payload: string) => dispatch(handleMenuMode(payload)),
    handleNoteKey: (payload: string) => dispatch(handleNoteKey(payload)),
    handleOpenMenu: (payload: boolean) => dispatch(handleOpenMenu(payload)),
  }
  const props: ViewerProps = {
    ...state,
    ...actionCreator,
    book,
  }
  return <Viewer {...props} />
}
export default PdfReaderContainer