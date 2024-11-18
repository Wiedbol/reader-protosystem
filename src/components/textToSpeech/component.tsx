import React, { useState, useEffect, useCallback } from "react";
import { TextToSpeechProps } from "./interface";
import { Trans } from "react-i18next";
import { speedList } from "../../constants/dropdownList";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import { sleep } from "../../utils/commonUtil";
import { isElectron } from "react-device-detect";
import toast from "react-hot-toast";
import RecordLocation from "../../utils/readUtils/recordLocation";
import TTSUtil from "../../utils/serviceUtils/ttsUtil";
import "./textToSpeech.css";
import PluginList from "../../utils/readUtils/pluginList";
import { openExternalUrl } from "../../utils/serviceUtils/urlUtil";

const TextToSpeech: React.FC<TextToSpeechProps> = (props) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [nodeList, setNodeList] = useState<string[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [nativeVoices, setNativeVoices] = useState<any[]>([]);
  const [customVoices, setCustomVoices] = useState<any[]>([]);

  const setSpeech = useCallback(async () => {
    return new Promise<any[]>((resolve, reject) => {
      let synth = window.speechSynthesis;
      let id;
      if (synth) {
        id = setInterval(() => {
          if (synth.getVoices().length !== 0) {
            resolve(synth.getVoices());
            clearInterval(id);
          } else {
            setIsSupported(false);
          }
        }, 10);
      }
    });
  }, []);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      setIsSupported(true);
    }
    if (isAudioOn) {
      window.speechSynthesis && window.speechSynthesis.cancel();
      setIsAudioOn(false);
    }
    const initVoices = async () => {
      const voices = await setSpeech();
      setNativeVoices(voices);
    };
    initVoices();
  }, [isAudioOn, setSpeech]);

  const handleChangeAudio = () => {
    setIsAddNew(false);
    if (isAudioOn) {
      window.speechSynthesis && window.speechSynthesis.cancel();
      TTSUtil.pauseAudio();
      setIsAudioOn(false);
    } else {
      if (isElectron) {
        const customVoiceList = TTSUtil.getVoiceList();
        setCustomVoices(customVoiceList);
        setVoices([...nativeVoices, ...customVoiceList]);
      } else {
        setVoices(nativeVoices);
      }
      if (voices.length === 0 && PluginList.getAllVoices().length === 0) {
        setIsAddNew(true);
        return;
      }
      handleStartSpeech();
    }
  };

  const handleStartSpeech = () => {
    setIsAudioOn(true);
    handleAudio();
  };

  const handleAudio = async () => {
    const textList = await handleGetText();
    let voiceIndex = parseInt(StorageUtil.getReaderConfig("voiceIndex")) || 0;
    if (voiceIndex > nativeVoices.length - 1 && PluginList.getAllVoices().length > 0) {
      await handleRead();
    } else {
      await handleSystemRead(0);
    }
  };

  const handleGetText = async () => {
    if (StorageUtil.getReaderConfig("isSliding") === "yes") {
      await sleep(1000);
    }
    let text = props.htmlBook.rendition.audioText().filter((item: string) => item && item.trim());
    if (text.length === 0) {
      await props.htmlBook.rendition.next();
      text = await handleGetText();
    }
    setNodeList(text);
    return text;
  };

  const handleRead = async () => {
    let voiceIndex = parseInt(StorageUtil.getReaderConfig("voiceIndex")) || 0;
    let speed = parseFloat(StorageUtil.getReaderConfig("voiceSpeed")) || 1;

    TTSUtil.setAudioPaths();
    await TTSUtil.cacheAudio([nodeList[0]], voiceIndex - nativeVoices.length, speed * 100 - 100);

    setTimeout(async () => {
      await TTSUtil.cacheAudio(nodeList.slice(1), voiceIndex - nativeVoices.length, speed * 100 - 100);
    }, 1);

    for (let index = 0; index < nodeList.length; index++) {
      let currentText = nodeList[index];
      let style = "background: #f3a6a68c";
      props.htmlBook.rendition.highlightNode(currentText, style);

      const res = await handleSpeech(index, voiceIndex, speed);
      if (nodeList[index] === props.htmlBook.rendition.visibleText()[props.htmlBook.rendition.visibleText().length - 1]) {
        await props.htmlBook.rendition.next();
      }
      if (res === "end") {
        break;
      }
    }
    if (isAudioOn && props.isReading) {
      if (isElectron) {
        await window.require("electron").ipcRenderer.invoke("clear-tts");
      }
      const position = props.htmlBook.rendition.getPosition();
      RecordLocation.recordHtmlLocation(position.text, position.chapterTitle, position.chapterDocIndex, position.chapterHref, position.count, position.percentage, position.cfi, position.page);
      setNodeList([]);
      await handleAudio();
    }
  };

  const handleSystemRead = async (index: number) => {
    const currentText = nodeList[index];
    let style = "background: #f3a6a68c";
    props.htmlBook.rendition.highlightNode(currentText, style);

    const res = await handleSystemSpeech(index, parseInt(StorageUtil.getReaderConfig("voiceIndex")) || 0, parseFloat(StorageUtil.getReaderConfig("voiceSpeed")) || 1);

    if (res === "start") {
      index++;
      if (nodeList[index] === props.htmlBook.rendition.visibleText()[props.htmlBook.rendition.visibleText().length - 1]) {
        await props.htmlBook.rendition.next();
      }
      if (isAudioOn && props.isReading && index === nodeList.length) {
        const position = props.htmlBook.rendition.getPosition();
        RecordLocation.recordHtmlLocation(position.text, position.chapterTitle, position.chapterDocIndex, position.chapterHref, position.count, position.percentage, position.cfi, position.page);
        setNodeList([]);
        await handleAudio();
        return;
      }
      await handleSystemRead(index);
    } else if (res === "end") {
      return;
    }
  };

  const handleSpeech = async (index: number, voiceIndex: number, speed: number) => {
    return new Promise<string>(async (resolve, reject) => {
      let res = await TTSUtil.readAloud(index);
      if (res === "loaderror") {
        resolve("start");
      } else {
        let player = TTSUtil.getPlayer();
        player.on("end", async () => {
          if (!(isAudioOn && props.isReading)) {
            resolve("end");
          }
          resolve("start");
        });
      }
    });
  };

  const handleSystemSpeech = async (index: number, voiceIndex: number, speed: number) => {
    return new Promise<string>(async (resolve, reject) => {
      var msg = new SpeechSynthesisUtterance();
      msg.text = nodeList[index].replace(/\s\s/g, "").replace(/\r/g, "").replace(/\n/g, "").replace(/\t/g, "").replace(/&/g, "").replace(/\f/g, "");

      msg.voice = nativeVoices[voiceIndex];
      msg.rate = speed;
      window.speechSynthesis && window.speechSynthesis.cancel();
      window.speechSynthesis.speak(msg);
      msg.onerror = (err) => {
        console.log(err);
        resolve("end");
      };

      msg.onend = async (event) => {
        if (!(isAudioOn && props.isReading)) {
          resolve("end");
        }
        resolve("start");
      };
    });
  };

  return (
    <>
      <div className="single-control-switch-container">
        <span className="single-control-switch-title">
          <Trans>Turn on text-to-speech</Trans>
        </span>

        <span
          className="single-control-switch"
          onClick={handleChangeAudio}
          style={isAudioOn ? {} : { opacity: 0.6 }}
        >
          <span
            className="single-control-button"
            style={isAudioOn ? { transform: "translateX(20px)", transition: "transform 0.5s ease" } : { transform: "translateX(0px)", transition: "transform 0.5s ease" }}
          ></span>
        </span>
      </div>
      {isAudioOn && (
        <div
          className="setting-dialog-new-title"
          style={{
            marginLeft: "20px",
            width: "88%",
            marginTop: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            paddingTop: "0",
            marginBottom: "0",
          }}
        >
          <Trans>Choose a Voice</Trans>
        </div>
      )}
      {isAddNew && (
        <div
          className="setting-dialog-item-wrapper"
          style={{
            marginTop: "10px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #e9e9e9",
            padding: "0 10px",
          }}
        >
          <div
            style={{
              paddingTop: "6px",
              paddingBottom: "6px",
              color: "rgba(0, 0, 0, 0.4)",
              fontSize: "16px",
            }}
          >
            <Trans>Add more voices via an external plugin</Trans>
          </div>
          <div
            className="setting-dialog-item-new"
            onClick={() => openExternalUrl("https://example.com")}
            style={{ fontSize: "14px", color: "#0066FF", cursor: "pointer" }}
          >
            <Trans>Click here to add new voices</Trans>
          </div>
        </div>
      )}
    </>
  );
};

export default TextToSpeech;

