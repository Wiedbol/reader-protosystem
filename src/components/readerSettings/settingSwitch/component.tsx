import React, { useState, useCallback } from "react";
import { SettingSwitchProps } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import { readerSettingList } from "../../../constants/settingList";
import toast from "react-hot-toast";
import BookUtil from "../../../utils/fileUtils/bookUtil";

const SettingSwitch: React.FC<SettingSwitchProps> = ({ renderBookFunc }) => {
  const [settings, setSettings] = useState({
    isBold: StorageUtil.getReaderConfig("isBold") === "yes",
    isIndent: StorageUtil.getReaderConfig("isIndent") === "yes",
    isSliding: StorageUtil.getReaderConfig("isSliding") === "yes",
    isUnderline: StorageUtil.getReaderConfig("isUnderline") === "yes",
    isShadow: StorageUtil.getReaderConfig("isShadow") === "yes",
    isItalic: StorageUtil.getReaderConfig("isItalic") === "yes",
    isInvert: StorageUtil.getReaderConfig("isInvert") === "yes",
    isBionic: StorageUtil.getReaderConfig("isBionic") === "yes",
    isHideBackground: StorageUtil.getReaderConfig("isHideBackground") === "yes",
    isHideFooter: StorageUtil.getReaderConfig("isHideFooter") === "yes",
    isHideHeader: StorageUtil.getReaderConfig("isHideHeader") === "yes",
    isHidePageButton: StorageUtil.getReaderConfig("isHidePageButton") === "yes",
    isHideMenuButton: StorageUtil.getReaderConfig("isHideMenuButton") === "yes",
  });

  const handleRest = useCallback(() => {
    BookUtil.reloadBooks();
  }, []);

  const handleChange = useCallback((stateName: string) => {
    setSettings(prevSettings => {
      const newValue = !prevSettings[stateName];
      StorageUtil.setReaderConfig(stateName, newValue ? "yes" : "no");
      toast("更改成功");
      setTimeout(async () => {
        await renderBookFunc();
      }, 500);
      return { ...prevSettings, [stateName]: newValue };
    });
  }, [renderBookFunc]);

  const handleChangeWithRest = useCallback((stateName: string) => {
    setSettings(prevSettings => {
      const newValue = !prevSettings[stateName];
      StorageUtil.setReaderConfig(stateName, newValue ? "yes" : "no");
      toast("更改成功");
      setTimeout(() => {
        handleRest();
      }, 500);
      return { ...prevSettings, [stateName]: newValue };
    });
  }, [handleRest]);

  return (
    <>
      {/* <TextToSpeech /> */}
      {readerSettingList.map((item) => (
        <div className="single-control-switch-container" key={item.title}>
          <span className="single-control-switch-title">
            <span>{item.title}</span>
          </span>

          <span
            className="single-control-switch"
            onClick={() => {
              switch (item.propName) {
                case "isHideFooter":
                case "isHideHeader":
                case "isHideBackground":
                case "isHidePageButton":
                case "isHideMenuButton":
                  handleChangeWithRest(item.propName);
                  break;
                default:
                  handleChange(item.propName);
                  break;
              }
            }}
            style={settings[item.propName] ? {} : { opacity: 0.6 }}
          >
            <span
              className="single-control-button"
              style={{
                transform: settings[item.propName] ? "translateX(20px)" : "translateX(0px)",
                transition: "transform 0.5s ease",
              }}
            ></span>
          </span>
        </div>
      ))}
    </>
  );
};

export default SettingSwitch;

