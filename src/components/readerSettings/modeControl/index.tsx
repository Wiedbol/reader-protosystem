import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import ModeControl from './component';

const ModeControlContainer: React.FC = () => {
  const state = useSelector((state: RootState) => ({
    renderBookFunc: state.book.renderBookFunc,
  }))
  return <ModeControl renderBookFunc={state.renderBookFunc} />
}
export default ModeControlContainer;