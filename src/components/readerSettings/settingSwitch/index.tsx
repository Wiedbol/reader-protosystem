import React from 'react'
import HtmlBook from '../../../models/HtmlBook'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { SettingSwitchProps } from './interface';
import SettingSwitch from './component';
interface SettingSwitchContainerProps {
  // htmlBook: HtmlBook;
}

const SettingSwitchContainer: React.FC<SettingSwitchContainerProps> = ({ 
  // htmlBook 
}) => {
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
    locations: state.progressPanel.locations,
    isReading: state.book.isReading,
    renderBookFunc: state.book.renderBookFunc,
  }))
  const props: SettingSwitchProps = {
    // htmlBook,
    ...state,
  }
  return <SettingSwitch {...props} />
}

export default SettingSwitchContainer;