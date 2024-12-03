import React, { useState, useCallback } from "react";
import { SliderListProps } from "./interface";
import "./sliderList.css";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import BookUtil from "../../../utils/fileUtils/bookUtil";

const SliderList: React.FC<SliderListProps> = ({ 
  mode, 
  renderBookFunc, 
  title, 
  minLabel, 
  maxLabel, 
  maxValue, 
  minValue, 
  step 
}) => {

  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isEntered, setIsEntered] = useState(false);
  const [value, setValue] = useState(() => {
    switch (mode) {
      case "fontSize":
        return StorageUtil.getReaderConfig("fontSize") || "17";
      case "scale":
        return StorageUtil.getReaderConfig("scale") || "1";
      case "letterSpacing":
        return StorageUtil.getReaderConfig("letterSpacing") || "0";
      case "paraSpacing":
        return StorageUtil.getReaderConfig("paraSpacing") || "0";
      case "brightness":
        return StorageUtil.getReaderConfig("brightness") || "1";
      default:
        return StorageUtil.getReaderConfig("margin") || "0";
    }
  });

  const handleRest = useCallback(async () => {
    if (mode === "scale" || mode === "margin") {
      BookUtil.reloadBooks();
      return;
    }
    renderBookFunc();
  }, [mode, renderBookFunc]);

  const onValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    if (mode === "brightness" && parseFloat(newValue) < 0.3) {
      newValue = "0.3";
    }
    setValue(newValue);
    StorageUtil.setReaderConfig(mode, newValue);
  }, [mode]);

  const onValueInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleMinus = useCallback((step: number) => {
    const newValue = (parseFloat(value) - step).toString();
    setValue(newValue);
    onValueChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
  }, [value, onValueChange]);

  const handleAdd = useCallback((step: number) => {
    const newValue = (parseFloat(value) + step).toString();
    setValue(newValue);
    onValueChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
  }, [value, onValueChange]);

  return (
    <div className="font-size-setting">
      <div className="font-size-title">
        <span style={{ marginRight: "10px" }}>
          {title}
        </span>

        <input
          className="input-value"
          value={isTyping ? inputValue : value}
          type="number"
          step={title === "Page width" || title === "Brightness" ? "0.1" : "1"}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(event.target.value);
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(event.target.value);
          }}
          onFocus={() => {
            setIsTyping(true);
          }}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            if (!isEntered) {
              let fieldVal = event.target.value;
              if (!fieldVal) return;
              onValueChange(event);
              setIsTyping(false);
              handleRest();
            } else {
              setIsEntered(false);
            }
          }}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              setIsEntered(true);
              let fieldVal = (event.target as HTMLInputElement).value;
              if (!fieldVal) return;
              onValueChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
              setIsTyping(false);
              handleRest();
            }
          }}
        />
        <span style={{ marginLeft: "10px" }}>{value}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <span className="ultra-small-size">{minLabel}</span>
        <div className="font-size-selector">
          <input
            className="input-progress"
            value={value}
            type="range"
            max={maxValue}
            min={minValue}
            step={step}
            onInput={onValueChange}
            onChange={onValueInput}
            onMouseUp={handleRest}
            style={{ position: "absolute", bottom: "11px" }}
          />
        </div>
        <span className="ultra-large-size" style={{ fontSize: "16px" }}>
          {maxLabel}
        </span>
      </div>
    </div>
  );
};

export default SliderList;

