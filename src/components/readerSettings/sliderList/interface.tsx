export interface SliderListProps {
  maxValue: number;
  minValue: number;
  mode: string;
  step: number;
  title: string;
  minLabel: string;
  maxLabel: string;
  renderBookFunc: () => void;
}