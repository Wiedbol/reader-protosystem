import React, { useState, useEffect, useCallback } from "react";
import "./popupTrans.css";
import { PopupTransProps } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import axios from "axios";
import toast from "react-hot-toast";
import PluginList from "../../../utils/readUtils/pluginList";
import Plugin from "../../../models/Plugin";
import { openExternalUrl } from "../../../utils/serviceUtils/urlUtil";

declare var window: any;

const PopupTrans: React.FC<PopupTransProps> = ({ originalText}) => {
  const [translatedText, setTranslatedText] = useState("");
  const [processedOriginalText, setProcessedOriginalText] = useState("");
  const [transService, setTransService] = useState(StorageUtil.getReaderConfig("transService") || "");
  const [transTarget, setTransTarget] = useState(StorageUtil.getReaderConfig("transTarget"));
  const [transSource, setTransSource] = useState(StorageUtil.getReaderConfig("transSource"));
  const [isAddNew, setIsAddNew] = useState(false);

  useEffect(() => {
    const processed = originalText.replace(/(\r\n|\n|\r)/gm, "");
    setProcessedOriginalText(processed);
    if (!transService) {
      setIsAddNew(true);
    }
    if (PluginList.getAllPlugins().findIndex((item) => item.identifier === transService) === -1) {
      setIsAddNew(true);
      return;
    }
    handleTrans(processed);
  }, [originalText, transService]);

  const handleTrans = useCallback((text: string) => {
    const plugin = PluginList.getPluginById(transService);
    const translateFunc = plugin.script;
    // eslint-disable-next-line no-eval
    eval(translateFunc);
    window
      .translate(
        text,
        StorageUtil.getReaderConfig("transSource") || "",
        StorageUtil.getReaderConfig("transTarget") || "en",
        axios,
        plugin.config
      )
      .then((res: string) => {
        if (res.startsWith("https://")) {
          window.open(res);
        } else {
          setTranslatedText(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [transService]);

  const handleChangeService = useCallback((target: string) => {
    setTransService(target);
    StorageUtil.setReaderConfig("transService", target);
    const autoValue = PluginList.getPluginById(target).autoValue;
    setTransSource(autoValue);
    setTransTarget("en");
    StorageUtil.setReaderConfig("transTarget", "en");
    StorageUtil.setReaderConfig("transSource", autoValue);
    handleTrans(processedOriginalText);
  }, [handleTrans, processedOriginalText]);

  const renderNoteEditor = () => {
    return (
      <div className="trans-container">
        <div className="trans-service-selector-container">
          {PluginList.getAllPlugins()
            .filter((item) => item.type === "translation")
            .map((item) => (
              <div
                key={item.identifier}
                className={transService === item.identifier ? "trans-service-selector" : "trans-service-selector-inactive"}
                onClick={() => {
                  setIsAddNew(false);
                  handleChangeService(item.identifier);
                }}
              >
                <span className={`icon-${item.icon} trans-icon`}></span>
                {item.displayName}
              </div>
            ))}
          <div
            className="trans-service-selector-inactive"
            onClick={() => setIsAddNew(true)}
          >
            <span className="icon-add trans-add-icon"></span>
            添加
          </div>
        </div>
        {isAddNew && (
          <div className="trans-add-new-container" style={{ fontWeight: 500 }}>
            <textarea
              name="url"
              placeholder={"将插件的代码粘贴到这里，查看文档以了解如何获取更多插件"}
              id="trans-add-content-box"
              className="trans-add-content-box"
            />
            <div className="trans-add-button-container">
              <div
                className="trans-add-cancel"
                style={{ color: "#f16464" }}
                onClick={() => {
                  const lang = StorageUtil.getReaderConfig("lang");
                  const url = lang === "zhCN" || lang === "zhTW" || lang === "zhMO"
                    ? "https://www.koodoreader.com/zh/plugin"
                    : "https://www.koodoreader.com/en/plugin";
                  openExternalUrl(url);
                }}
              >
                文件
              </div>
              <div
                className="trans-add-cancel"
                onClick={() => setIsAddNew(false)}
              >
                取消
              </div>
              <div
                className="trans-add-confirm"
                onClick={() => {
                  const value = (document.querySelector("#trans-add-content-box") as HTMLTextAreaElement).value;
                  if (value) {
                    const plugin: Plugin = JSON.parse(value);
                    const isSuccess = PluginList.addPlugin(plugin);
                    if (!isSuccess) {
                      toast.error("插件验证失败");
                      return;
                    }
                    setTransService(plugin.identifier);
                    toast.success("添加成功");
                    handleChangeService(plugin.identifier);
                  }
                  setIsAddNew(false);
                }}
              >
                确认
              </div>
            </div>
          </div>
        )}
        {!isAddNew && (
          <>
            <div className="trans-lang-selector-container">
              <div className="original-lang-box">
                <select
                  className="original-lang-selector"
                  style={{ maxWidth: "120px", margin: 0 }}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    const targetLang = event.target.value;
                    StorageUtil.setReaderConfig("transSource", targetLang);
                    handleTrans(processedOriginalText);
                  }}
                >
                  {PluginList.getPluginById(transService).langList &&
                    Object.entries(PluginList.getPluginById(transService).langList).map(([key, value]) => (
                      <option
                        value={key}
                        key={key}
                        className="add-dialog-shelf-list-option"
                        selected={StorageUtil.getReaderConfig("transSource") === key}
                      >
                        {value}
                      </option>
                    ))}
                </select>
              </div>
              <div className="trans-lang-box">
                <select
                  className="trans-lang-selector"
                  style={{ maxWidth: "120px", margin: 0 }}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    const targetLang = event.target.value;
                    StorageUtil.setReaderConfig("transTarget", targetLang);
                    handleTrans(processedOriginalText);
                  }}
                >
                  {PluginList.getPluginById(transService).langList &&
                    Object.entries(PluginList.getPluginById(transService).langList).map(([key, value]) => (
                      <option
                        value={key}
                        key={key}
                        className="add-dialog-shelf-list-option"
                        selected={StorageUtil.getReaderConfig("transTarget") === key}
                      >
                        {value}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="trans-box">
              <div className="original-text-box">
                <div className="original-text">{processedOriginalText}</div>
              </div>
              <div className="trans-text-box">
                <div className="trans-text">{translatedText}</div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return renderNoteEditor();
};

export default PopupTrans;

