import { isElectron } from "react-device-detect"
import StorageUtil from "./storageUtil";
//修改主题为系统主题
export const initTheme = () => {
    const style = document.createElement('link');
    style.rel = "stylesheet";
    let isNight = false;
    if (isElectron) {
        const { ipcRenderer } = window.require('electron');
        isNight = ipcRenderer.sendSync("system-color");
    } else {
        isNight = 
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    StorageUtil.setReaderConfig("isOSNight", isNight ? "yes" : "no");
    if (!StorageUtil.getReaderConfig("appSkin")) {
        StorageUtil.setReaderConfig("appSkin", "system")
        if (isNight) {
        }
    }
    if (
        StorageUtil.getReaderConfig("appSkin") === "night" ||
        (StorageUtil.getReaderConfig("appSkin") === "system" &&
        StorageUtil.getReaderConfig("isOSNight") === "yes")
    ) {
        style.href = "./assets/styles/dark.css";
    } else {
        style.href = "./assets/styles/default.css";
    }
    document.head.appendChild(style);
};
//修改字体为系统字体
export const initSystemFont = () => {
    if (StorageUtil.getReaderConfig("systemFont")) {
        let body = document.getElementsByTagName("body")[0];
        body.setAttribute(
            "style",
            "font-family:" + StorageUtil.getReaderConfig("systemFont") + "!important"
        );
    }
};
