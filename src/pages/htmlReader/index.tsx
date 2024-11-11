import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import bookModel from '../../models/Book'
import { fetchBookmarks, fetchBooks, fetchNotes, fetchPercentage, handleReadingBook } from '../../store/slices'
import { ReaderProps } from './interface'
import Reader from './component'

interface htmlReaderContainerProps {

}

const HtmlReaderContainer: React.FC<htmlReaderContainerProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    percentage: state.progressPanel.percentage,
    htmlBook: state.reader.htmlBook,
  }))

  const actionCreator = {
    handleFetchNotes: () => dispatch(fetchNotes()),
    handleFetchBookmarks: () => dispatch(fetchBookmarks()),
    handleFetchBooks: () => dispatch(fetchBooks()),
    handleReadingBook: (book: bookModel) => dispatch(handleReadingBook(book)),
    handleFetchPercentage: (book: bookModel) => dispatch(fetchPercentage(book)),
  }
  const props: ReaderProps = {
    ...state,
    ...actionCreator,
  }

  return (
    <Reader {...props} />
  )
}

export default HtmlReaderContainer