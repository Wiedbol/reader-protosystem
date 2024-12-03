import React, { useState, useCallback, useMemo } from "react";
import { backgroundList, textList } from "../../../constants/themeList";
import StyleUtil from "../../../utils/readUtils/styleUtil";
import "./themeList.css";
import { ThemeListProps } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import { Panel as ColorPickerPanel } from "rc-color-picker";
import "rc-color-picker/assets/index.css";
import ThemeUtil from "../../../utils/readUtils/themeUtil";
import BookUtil from "../../../utils/fileUtils/bookUtil";

const ThemeList: React.FC<ThemeListProps> = ({ renderBookFunc }) => {

  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(
    backgroundList.concat(ThemeUtil.getAllThemes()).findIndex((item) => 
      item === (StorageUtil.getReaderConfig("backgroundColor") || "rgba(255,255,255,1)")
    )
  );

  const [currentTextIndex, setCurrentTextIndex] = useState(
    textList.concat(ThemeUtil.getAllThemes()).findIndex((item) => 
      item === (StorageUtil.getReaderConfig("textColor") || "rgba(0,0,0,1)")
    )
  );

  const [isShowTextPicker, setIsShowTextPicker] = useState(false);
  const [isShowBgPicker, setIsShowBgPicker] = useState(false);

  const handleChangeBgColor = useCallback((color: string, index: number = -1) => {
    StorageUtil.setReaderConfig("backgroundColor", color);
    setCurrentBackgroundIndex(index);
    if (index === 1) {
      StorageUtil.setReaderConfig("textColor", "rgba(255,255,255,1)");
    } else if (
      index === 0 &&
      StorageUtil.getReaderConfig("backgroundColor") === "rgba(255,255,255,1)"
    ) {
      StorageUtil.setReaderConfig("textColor", "rgba(0,0,0,1)");
    }
    BookUtil.reloadBooks();
  }, []);

  const handleChooseBgColor = useCallback((color) => {
    StorageUtil.setReaderConfig("backgroundColor", color.color);
    StyleUtil.addDefaultCss();
  }, []);

  const handleColorTextPicker = useCallback((showPicker: boolean) => {
    if (
      !showPicker &&
      textList.concat(ThemeUtil.getAllThemes()).findIndex((item) => 
        item === (StorageUtil.getReaderConfig("textColor") || "rgba(0,0,0,1)")
      ) === -1
    ) {
      ThemeUtil.setThemes(StorageUtil.getReaderConfig("textColor"));
    }
    setIsShowTextPicker(showPicker);
  }, []);

  const handleColorBgPicker = useCallback((showPicker: boolean) => {
    if (
      !showPicker &&
      backgroundList.concat(ThemeUtil.getAllThemes()).findIndex((item) => 
        item === (StorageUtil.getReaderConfig("backgroundColor") || "rgba(255,255,255,1)")
      ) === -1
    ) {
      ThemeUtil.setThemes(StorageUtil.getReaderConfig("backgroundColor"));
    }
    setIsShowBgPicker(showPicker);
  }, []);

  const handleChooseTextColor = useCallback((color) => {
    if (typeof color !== "object") {
      setCurrentTextIndex(
        textList.concat(ThemeUtil.getAllThemes()).indexOf(color)
      );
    }
    StorageUtil.setReaderConfig(
      "textColor",
      typeof color === "object" ? color.color : color
    );
    renderBookFunc();
  }, [renderBookFunc]);

  const renderBackgroundColorList = useMemo(() => {
    return backgroundList.concat(ThemeUtil.getAllThemes()).map((item, index) => (
      <li
        key={item + index}
        className={
          index === currentBackgroundIndex
            ? "active-color background-color-circle"
            : "background-color-circle"
        }
        onClick={() => handleChangeBgColor(item, index)}
        style={{ backgroundColor: item }}
      >
        {index > 3 && index === currentBackgroundIndex && (
          <span
            className="icon-close"
            onClick={(e) => {
              e.stopPropagation();
              ThemeUtil.clear(item);
            }}
          ></span>
        )}
      </li>
    ));
  }, [currentBackgroundIndex, handleChangeBgColor]);

  const renderTextColorList = useMemo(() => {
    return textList.concat(ThemeUtil.getAllThemes()).map((item, index) => (
      <li
        key={item + index}
        className={
          index === currentTextIndex
            ? "active-color background-color-circle"
            : "background-color-circle"
        }
        onClick={() => handleChooseTextColor(item)}
        style={{ backgroundColor: item }}
      >
        {index > 3 && index === currentTextIndex && (
          <span
            className="icon-close"
            onClick={(e) => {
              e.stopPropagation();
              ThemeUtil.clear(item);
            }}
          ></span>
        )}
      </li>
    ));
  }, [currentTextIndex, handleChooseTextColor]);

  return (
    <div className="background-color-setting">
      <div className="background-color-text">
      <span>背景颜色</span>
      </div>
      <ul className="background-color-list">
        <li
          className="background-color-circle"
          onClick={() => handleColorBgPicker(!isShowBgPicker)}
        >
          <span className={isShowBgPicker ? "icon-check" : "icon-more"}></span>
        </li>
        {renderBackgroundColorList}
      </ul>
      {isShowBgPicker && (
        <ColorPickerPanel
          enableAlpha={false}
          color={StorageUtil.getReaderConfig("backgroundColor")}
          onChange={handleChooseBgColor}
          mode="RGB"
          style={{
            margin: 20,
            animation: "fade-in 0.2s ease-in-out 0s 1",
          }}
        />
      )}
      <div className="background-color-text">
      <span>文字颜色</span>
      </div>
      <ul className="background-color-list">
        <li
          className="background-color-circle"
          onClick={() => handleColorTextPicker(!isShowTextPicker)}
        >
          <span className={isShowTextPicker ? "icon-check" : "icon-more"}></span>
        </li>
        {renderTextColorList}
      </ul>
      {isShowTextPicker && (
        <ColorPickerPanel
          enableAlpha={false}
          color={StorageUtil.getReaderConfig("textColor")}
          onChange={handleChooseTextColor}
          mode="RGB"
          style={{
            margin: 20,
            animation: "fade-in 0.2s ease-in-out 0s 1",
          }}
        />
      )}
    </div>
  );
};

export default ThemeList;

