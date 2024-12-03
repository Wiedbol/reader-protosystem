import React, { useState, useEffect, useCallback } from "react";
import { dropdownList } from "../../../constants/dropdownList";
import "./dropdownList.css";
import { DropdownListProps } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import { isElectron } from "react-device-detect";

const DropdownList: React.FC<DropdownListProps> = ({ renderBookFunc }) => {

  const [currentFontFamilyIndex, setCurrentFontFamilyIndex] = useState(
    dropdownList[0].option.findIndex((item: any) => 
      item === (StorageUtil.getReaderConfig("fontFamily") || "Built-in font")
    )
  );

  const [currentLineHeightIndex, setCurrentLineHeightIndex] = useState(
    dropdownList[1].option.findIndex((item: any) => 
      item === (StorageUtil.getReaderConfig("lineHeight") || "Default")
    )
  );

  const [currentTextAlignIndex, setCurrentTextAlignIndex] = useState(
    dropdownList[2].option.findIndex((item: any) => 
      item === (StorageUtil.getReaderConfig("textAlign") || "Default")
    )
  );

  const [chineseConversionIndex, setChineseConversionIndex] = useState(
    dropdownList[3].option.findIndex((item: any) => 
      item === (StorageUtil.getReaderConfig("convertChinese") || "Default")
    )
  );

  useEffect(() => {
    if (isElectron) {
      const fontList = window.require("font-list");
      fontList.getFonts({ disableQuoting: true }).then((result: string[]) => {
        if (!result || result.length === 0) return;
        dropdownList[0].option = result;
        dropdownList[0].option.push("Built-in font");
        setCurrentFontFamilyIndex(
          dropdownList[0].option.findIndex((item: any) => 
            item === (StorageUtil.getReaderConfig("fontFamily") || "Built-in font")
          )
        );
      });
    }
  }, []);

  const handleView = useCallback((event: React.ChangeEvent<HTMLSelectElement>, option: string) => {
    let [value, index] = event.target.value.split(",");
    StorageUtil.setReaderConfig(option, value);
    switch (option) {
      case "fontFamily":
        setCurrentFontFamilyIndex(Number(index));
        break;
      case "lineHeight":
        setCurrentLineHeightIndex(Number(index));
        break;
      case "textAlign":
        setCurrentTextAlignIndex(Number(index));
        break;
      case "convertChinese":
        setChineseConversionIndex(Number(index));
        break;
      default:
        break;
    }
    renderBookFunc();
  }, [renderBookFunc]);

  const renderParagraphCharacter = () => {
    return dropdownList.map((item) => (
      <li className="paragraph-character-container" key={item.id}>
        <p className="general-setting-title">
          {item.title}
        </p>
        <select
          className="general-setting-dropdown"
          onChange={(event) => handleView(event, item.value)}
        >
          {item.option.map((subItem: string, index: number) => (
            <option
              value={[subItem, index.toString()]}
              key={index}
              className="general-setting-option"
              selected={
                index ===
                (item.value === "lineHeight"
                  ? currentLineHeightIndex
                  : item.value === "textAlign"
                  ? currentTextAlignIndex
                  : item.value === "convertChinese"
                  ? chineseConversionIndex
                  : currentFontFamilyIndex)
              }
            >
              {subItem}
            </option>
          ))}
        </select>
      </li>
    ));
  };

  return (
    <ul className="paragraph-character-setting">
      {renderParagraphCharacter()}
    </ul>
  );
};

export default DropdownList;

