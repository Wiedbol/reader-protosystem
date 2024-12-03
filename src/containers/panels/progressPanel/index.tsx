import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store'
import { ProgressPanelProps } from './interface';
import ProgressPanel from './component';

interface ProgressPanelContainerProps {

}

const ProgressPanelContainer: React.FC<ProgressPanelContainerProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    isReading: state.book.isReading,
    percentage: state.progressPanel.percentage,
    htmlBook: state.reader.htmlBook,
    currentChapterIndex: state.reader.currentChapterIndex,
    currentChapter: state.reader.currentChapter,
    renderBookFunc: state.book.renderBookFunc,
  }))
  const actionCreator = {

  }
  const props: ProgressPanelProps = {
    ...state,
    ...actionCreator,
  }
  return <ProgressPanel {...props} />
}

export default ProgressPanelContainer;