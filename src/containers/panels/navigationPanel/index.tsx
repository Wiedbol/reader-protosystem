import React from'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchBookmarks, handleSearch } from '../../../store/slices';
import { NavigationPanelProps } from './interface';
import NavigationPanel from './component';

interface NavigationPanelContainerProps {
  time: number;
}

const NavigationPanelContainer: React.FC<NavigationPanelContainerProps> = ({
  time,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    bookmarks: state.reader.bookmarks,
    htmlBook: state.reader.htmlBook,
  }));

  const actionCreator = {
    handleFetchBookmarks: () => dispatch(fetchBookmarks()),
    handleSearch: (isSearch: boolean) => dispatch(handleSearch(isSearch)),
  }

  const props: NavigationPanelProps = {
    ...state,
    ...actionCreator,
    time,
  }

  return <NavigationPanel {...props} />
}

export default NavigationPanelContainer;