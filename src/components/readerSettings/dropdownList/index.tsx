import { useSelector } from "react-redux"
import { RootState } from "../../../store"
import { DropdownListProps } from "./interface"
import DropdownList from "./component"
import React from "react"

const DropdownListContainer: React.FC = () => {
  const state = useSelector((state: RootState) => ({
    renderBookFunc: state.book.renderBookFunc,
  }))
  const props: DropdownListProps = {
    ...state,
  }
  return <DropdownList {...props} />
}
export default DropdownListContainer;