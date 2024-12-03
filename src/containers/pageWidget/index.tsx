import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store"
import { handleCurrentChapter, handleCurrentChapterIndex } from "../../store/slices";
import { BackgroundProps } from "./interface";
import Background from "./component";
import React from "react";

interface PageWidgetContainerProps {

}

const PageWidgetContainer: React.FC<PageWidgetContainerProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    locations: state.progressPanel.locations,
    currentChapter: state.reader.currentChapter,
    currentChapterIndex: state.reader.currentChapterIndex,
    htmlBook: state.reader.htmlBook,
    isShowBookmark: state.viewArea.isShowBookmark,
  }))
  const actionCreator = {
    handleCurrentChapter: (payload: string) => dispatch(handleCurrentChapter(payload)),
    handleCurrentChapterIndex: (payload: number) => dispatch(handleCurrentChapterIndex(payload)),
  }
  const props: BackgroundProps = {
    ...state,
    ...actionCreator,
  }
  return <Background {...props} />
}
export default PageWidgetContainer;