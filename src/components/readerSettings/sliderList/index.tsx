import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { SliderListProps } from "./interface";
import SliderList from "./component";
import React from "react";

interface SliderListContainerProps {
  maxValue: number;
  minValue: number;
  mode: string;
  step: number;
  title: string;
  minLabel: string;
  maxLabel: string;
}

const SliderListContainer: React.FC<SliderListContainerProps> = ({
  maxValue,
  minValue,
  mode,
  step,
  title,
  minLabel,
  maxLabel,
}) => {
  const state = useSelector((state: RootState) => ({
    renderBookFunc: state.book.renderBookFunc,
  }))
  const props: SliderListProps = {
    ...state,
    maxValue,
    minValue,
    mode,
    step,
    title,
    minLabel,
    maxLabel,
  }
  return <SliderList {...props} />
}
export default SliderListContainer;