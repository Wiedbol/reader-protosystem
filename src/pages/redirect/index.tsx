import React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { handleLoadingDialog } from '../../store/slices';
import { RedirectProps } from './interface';
import Redirect from './component';
const RedirectContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const actionCreator = {
    handleLoadingDialog: (payload: boolean) => handleLoadingDialog(payload)
  }
  const props: RedirectProps = {
    ...actionCreator
  }
  return <Redirect {...props} />
}
export default RedirectContainer;