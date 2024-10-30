import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { handleSearch, handleSearchResults } from "../../store/slices";
import SearchBox from "./component";
import type { SearchBoxProps } from "./interface";

interface SearchBoxContainerProps {
  isNavSearch: boolean;
  mode: string;
  width: string;
  height: string;
  handleNavSearchState: (state: string) => void;
  handleSearchList: (searchList: any) => void;
}

const SearchBoxContainer: React.FC<SearchBoxContainerProps> = ({
  isNavSearch,
  mode,
  width,
  height,
  handleNavSearchState,
  handleSearchList,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    books: state.manager.books,
    notes: state.reader.notes,
    htmlBook: state.reader.htmlBook,
    digests: state.reader.digests,
    isSearch: state.manager.isSearch,
    isReading: state.book.isReading,
    currentBook: state.book.currentBook,
    tabMode: state.sidebar.mode,
    shelfIndex: state.sidebar.shelfIndex,
  }));

  const actionCreators = {
    handleSearchResults: (result: number[]) => dispatch(handleSearchResults(result)),
    handleSearch: (isSearch: boolean) => dispatch(handleSearch(isSearch)),
    
  };

  const props: SearchBoxProps = {
    ...state,
    ...actionCreators,
    isNavSearch,
    mode,
    width,
    height,
    handleNavSearchState,
    handleSearchList,
  };

  return <SearchBox {...props} />;
};

export default SearchBoxContainer;