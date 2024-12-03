import React, { useState, useEffect } from "react";
import "./popupDict.css";
import { PopupDictProps } from "./interface";
import PluginList from "../../../utils/readUtils/pluginList";
import Plugin from "../../../models/Plugin";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import Parser from "html-react-parser";
import * as DOMPurify from "dompurify";
import axios from "axios";
import RecordLocation from "../../../utils/readUtils/recordLocation";
import DictHistory from "../../../models/DictHistory";
import { openExternalUrl } from "../../../utils/serviceUtils/urlUtil";
import lemmatize from "wink-lemmatizer";
import toast from "react-hot-toast";

declare var window: any;

const PopupDict: React.FC<PopupDictProps> = ({ originalText, currentBook}) => {
  const [dictText, setDictText] = useState("请稍候");
  const [word, setWord] = useState("");
  const [prototype, setPrototype] = useState("");
  const [dictService, setDictService] = useState(StorageUtil.getReaderConfig("dictService"));
  const [dictTarget, setDictTarget] = useState(StorageUtil.getReaderConfig("dictTarget") || "en");
  const [isAddNew, setIsAddNew] = useState(false);

  useEffect(() => {
    handleLookUp();
  }, []);

  const handleLookUp = () => {
    let processedText = originalText.replace(/(\r\n|\n|\r)/gm, "").replace(/-/gm, "");
    setWord(processedText);
    
    let newPrototype = lemmatize.verb(processedText);
    newPrototype = lemmatize.noun(newPrototype);
    newPrototype = lemmatize.adjective(newPrototype);
    setPrototype(newPrototype);

    if (StorageUtil.getReaderConfig("isLemmatizeWord") === "yes") {
      processedText = newPrototype;
    }

    if (!dictService || PluginList.getAllPlugins().findIndex((item) => item.identifier === dictService) === -1) {
      setIsAddNew(true);
    }

    handleDict(processedText);
    handleRecordHistory(processedText);
  };

  const handleRecordHistory = async (text: string) => {
    let bookKey = currentBook.key;
    let bookLocation = RecordLocation.getHtmlLocation(bookKey);
    let chapter = bookLocation.chapterTitle;
    let word = new DictHistory(bookKey, text, chapter);
    let dictHistoryArr = (await window.localforage.getItem("words")) || [];
    dictHistoryArr.push(word);
    window.localforage.setItem("words", dictHistoryArr);
  };

  const handleDict = async (text: string) => {
    try {
      let plugin = PluginList.getPluginById(dictService);
      let dictFunc = plugin.script;
      // eslint-disable-next-line no-eval
      eval(dictFunc);
      let dictText = await window.getDictText(
        text,
        "auto",
        dictTarget,
        axios,
        plugin.config
      );
      if (dictText.startsWith("https://")) {
        window.open(dictText);
      } else {
        setDictText(dictText);
        setTimeout(() => {
          let moreElement = document.querySelector(".dict-learn-more");
          if (moreElement) {
            moreElement.addEventListener("click", () => {
              openExternalUrl(window.learnMoreUrl);
            });
          }
        }, 0);
      }
    } catch (error) {
      console.log(error);
      setDictText("发生错误");
    }
  };

  const handleChangeDictService = (newDictService: string) => {
    setDictService(newDictService);
    setIsAddNew(false);
    StorageUtil.setReaderConfig("dictService", newDictService);
    setDictTarget("en");
    StorageUtil.setReaderConfig("dictTarget", "en");
    handleLookUp();
  };

  // Render function remains mostly the same, converted to JSX
  // ...

  return (
    // JSX from the original render function
        <div className="dict-container">
          <div className="dict-service-container">
            <select
              className="dict-service-selector"
              style={{ margin: 0 }}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                if (event.target.value === "add-new") {
                  setIsAddNew(true);
                  return;
                }
                handleChangeDictService(event.target.value);
              }}
            >
              {PluginList.getAllPlugins()
                .filter((item) => item.type === "dictionary")
                .map((item, index) => {
                  return (
                    <option
                      value={item.identifier}
                      key={item.identifier}
                      className="add-dialog-shelf-list-option"
                      selected={
                        dictService === item.identifier
                          ? true
                          : false
                      }
                    >
                      {item.displayName}
                    </option>
                  );
                })}
              <option
                value={"add-new"}
                key={"add-new"}
                className="add-dialog-shelf-list-option"
              >
                {"添加新插件"}
              </option>
            </select>
          </div>

          <div className="dict-service-container" style={{ right: 150 }}>
            <select
              className="dict-service-selector"
              style={{ margin: 0 }}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                const newDictTarget = event.target.value || "en";
                setDictTarget(newDictTarget);
                StorageUtil.setReaderConfig("dictTarget", newDictTarget);
                handleLookUp();
              }}
            >
              {PluginList.getPluginById(dictService).langList &&
                (
                  PluginList.getPluginById(dictService)
                    .langList as any[]
                ).map((item, index) => {
                  return (
                    <option
                      value={item.code}
                      key={item.code}
                      className="add-dialog-shelf-list-option"
                      selected={
                        dictTarget === item.code ? true : false
                      }
                    >
                      {item["nativeLang"]}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="dict-word">
            {StorageUtil.getReaderConfig("isLemmatizeWord") === "yes"
              ? prototype
              : word}
          </div>
          <div className="dict-original-word">
              原型
            <span>:</span>
            <span>{prototype}</span>
          </div>
          {isAddNew && (
            <div
              className="trans-add-new-container"
              style={{ fontWeight: 500 }}
            >
              <textarea
                name="url"
                placeholder={
                  "将插件的代码粘贴到这里，查看文档以了解如何获取更多插件"
                }
                id="trans-add-content-box"
                className="trans-add-content-box"
              />
              <div className="trans-add-button-container">
                <div
                  className="trans-add-cancel"
                  style={{ color: "#2084e8" }}
                  onClick={() => {
                    if (
                      StorageUtil.getReaderConfig("lang") === "zhCN" ||
                      StorageUtil.getReaderConfig("lang") === "zhTW" ||
                      StorageUtil.getReaderConfig("lang") === "zhMO"
                    ) {
                      openExternalUrl("https://www.koodoreader.com/zh/plugin");
                    } else {
                      openExternalUrl("https://www.koodoreader.com/en/plugin");
                    }
                  }}
                >
                  文件
                </div>
                <div
                  className="trans-add-cancel"
                  onClick={() => {
                    setIsAddNew(false);
                  }}
                >
                  取消
                </div>
                <div
                  className="trans-add-confirm"
                  style={{ backgroundColor: "#2084e8" }}
                  onClick={() => {
                    let value: string = (
                      document.querySelector(
                        "#trans-add-content-box"
                      ) as HTMLTextAreaElement
                    ).value;
                    if (value) {
                      let plugin: Plugin = JSON.parse(value);

                      let isSuccess = PluginList.addPlugin(plugin);
                      if (!isSuccess) {
                        toast.error("插件验证失败");
                        return;
                      }
                      setDictService(plugin.identifier);
                      toast.success("添加成功");
                      handleChangeDictService(plugin.identifier);
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
            <div className="dict-text-box">
              {Parser(
                DOMPurify.sanitize(
                  dictText + "<address></address>"
                ) || " ",
                {
                  replace: (domNode) => {},
                }
              )}
            </div>
          )}
        </div>
  );
};

export default PopupDict;

