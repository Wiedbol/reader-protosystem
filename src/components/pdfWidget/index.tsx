import React, { useState } from "react";
import "./style.css";
import { stateType } from "../../store";
import { connect } from "react-redux";
import { handleReadingState } from "../../store/slices";
import { isElectron } from "react-device-detect";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import { PDFWidgetProps } from "./interface";
import { useNavigate } from "react-router";

const PDFWidget: React.FC<PDFWidgetProps> = (props) => {
  const [isHover, setIsHover] = useState(false);

  const navigate = useNavigate()

  const handleHomeClick = () => {
    if (isElectron && StorageUtil.getReaderConfig("isOpenInMain") !== "yes") {
      const electron = window.require("electron");
      if (electron.ipcRenderer.sendSync("check-main-open", "ping")) {
        electron.ipcRenderer.invoke("focus-on-main", "ping");
        window.close();
      } else {
        electron.ipcRenderer.invoke("create-new-main", "ping");
        window.close();
      }
    } else {
      navigate("/manager/home")
      document.title = "Koodo Reader";
      props.handleReadingState(false);
    }
  };

  const handleDayModeClick = () => {
    document.querySelector(".ebook-viewer")?.setAttribute("style", "height:100%; overflow: hidden;");
  };

  const handleNightModeClick = () => {
    document
      .querySelector(".ebook-viewer")
      ?.setAttribute("style", "height:100%; overflow: hidden; filter: invert(100%) !important;");
  };

  const handleSepiaModeClick = () => {
    document.querySelector(".ebook-viewer")?.setAttribute("style", "height:100%; overflow: hidden; filter: sepia(100%);");
  };

  return (
    <div
      className="back-main-container"
      style={isHover ? {} : { width: "30px", left: "-41px", animation: "shrink 0.2s forwards" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <span
        className="icon-home back-home-home"
        onClick={handleHomeClick}
        style={isHover ? {} : { display: "none" }}
      ></span>
      <span
        className="icon-day back-home-day"
        onClick={handleDayModeClick}
        style={isHover ? {} : { display: "none" }}
      ></span>
      <span
        className="icon-night back-home-night"
        onClick={handleNightModeClick}
        style={isHover ? {} : { display: "none" }}
      ></span>
      <span
        className="icon-eye back-home-eye"
        onClick={handleSepiaModeClick}
        style={isHover ? {} : { display: "none" }}
      ></span>
      <span
        className="icon-dropdown back-home-dropdown"
        onClick={handleSepiaModeClick}
        style={isHover ? { display: "none" } : {}}
      ></span>
    </div>
  );
};

const mapStateToProps = (state: stateType) => ({});
const actionCreator = { handleReadingState };

export default connect(mapStateToProps, actionCreator)(PDFWidget);

