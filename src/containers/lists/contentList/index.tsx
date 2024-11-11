import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../store"
import { handleCurrentChapter, handleCurrentChapterIndex } from "../../../store/slices";
import { ContentListProps } from "./interface";
import ContentList from "./component";
import React from "react";

interface ContentListContainerProps {

}

const ContentListContainer: React.FC<ContentListContainerProps> = () => {

  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    chapters: state.reader.chapters,
    htmlBook: state.reader.htmlBook,
    renderBookFunc: state.book.renderBookFunc,
  }))
  const actionCreator = {
    handleCurrentChapter: (chapter: string) => dispatch(handleCurrentChapter(chapter)),
    handleCurrentChapterIndex: (index: number) => dispatch(handleCurrentChapterIndex(index)),
  }
  const props: ContentListProps = {
    ...state,
    ...actionCreator,
  }

  return <ContentList {...props} />
}

export default ContentListContainer;