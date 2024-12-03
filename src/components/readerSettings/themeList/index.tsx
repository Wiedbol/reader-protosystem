import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { ThemeListProps } from './interface'
import ThemeList from './component'
const ThemeListContainer: React.FC = () => {
  const state = useSelector((state: RootState) => ({
    renderBookFunc: state.book.renderBookFunc,
  }))
  const props: ThemeListProps = {
    ...state,
  }
  return <ThemeList {...props} />
}
export default ThemeListContainer;