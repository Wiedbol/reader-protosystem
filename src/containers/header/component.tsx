import { useLocation, useNavigate } from "react-router";
import { HeaderProps } from "./interface";
import { useEffect, useState } from "react";
import { isElectron } from "react-device-detect";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import React from "react";
import SearchBox from "../../components/searchBox";
import ImportLocal from "../../components/importLocal";

export function Header(props: HeaderProps) {
  const [ state, setState ] = useState({
    isOnlyLocal: false,
    isNewVersion: false,
    width: document.body.clientWidth,
    isDataChange: false,
    isDeveloperVer: false,
  })

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setState({...state, width: document.body.clientWidth });
    window.addEventListener('resize', handleResize);

    const handleFocus = () => {
      props.handleFetchBooks();
      props.handleFetchNotes();
      props.handleFetchBookmarks();
    };
    window.addEventListener('focus', handleFocus);

    if (isElectron) {
      setupElectron();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const setupElectron = async () => {
    const { ipcRenderer } = window.require('electron');
    const fs = window.require('fs');
    const path = window.require('path');

    const dirPath = ipcRenderer.sendSync('user-data', 'ping');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      fs.mkdirSync(path.join(dirPath, 'data'));
      fs.mkdirSync(path.join(dirPath, 'data', 'book'));
      console.log('folder created');
    } else {
      console.log('folder exist');
    }

    if (StorageUtil.getReaderConfig('storageLocation') && !localStorage.getItem('storageLocation')) {
      localStorage.setItem('storageLocation', StorageUtil.getReaderConfig('storageLocation'));
    }

    checkForDataUpdate(fs, path, ipcRenderer);
  };

  const checkForDataUpdate = (fs: any, path: any, ipcRenderer: any) => {
    const storageLocation = localStorage.getItem('storageLocation') || ipcRenderer.sendSync('storage-location', 'ping');
    const sourcePath = path.join(storageLocation, 'config', 'readerConfig.json');

    fs.readFile(sourcePath, 'utf8', (err: any, data: string) => {
      if (err) {
        console.log(err);
        return;
      }
      const readerConfig = JSON.parse(data);
      if (
        localStorage.getItem('lastSyncTime') &&
        parseInt(readerConfig.lastSyncTime) > parseInt(localStorage.getItem('lastSyncTime')!)
      ) {
        setState({...state, isDataChange: true });
      }
    });
  };
//todo: add header component
  return (
      <div
        className="header"
        style={props.isCollapsed ? { marginLeft: "40px" } : {}}
      >
        <div
          className="header-search-container"
          style={props.isCollapsed ? { width: "369px" } : {}}
        >
          <SearchBox isNavSearch={false} mode={"header"} width={"300"} height={"40"} handleNavSearchState={function (state: string): void {} } handleSearchList={function (searchList: any): void {} } />
        </div>
        <div
          className="setting-icon-parrent"
          style={props.isCollapsed ? { marginLeft: "430px" } : {}}
        >
          <div
            className="setting-icon-container"
            onClick={() => {
              props.handleSortDisplay(!props.isSortDisplay);
            }}
            onMouseLeave={() => {
              props.handleSortDisplay(false);
            }}
            style={{ top: "18px" }}
          >
            <span
              data-tooltip-id="my-tooltip"
              data-tooltip-content={"排序"}
            >
              <span className="icon-sort-desc header-sort-icon"></span>
            </span>
          </div>
          <div
            className="setting-icon-container"
            onClick={() => {
              props.handleAbout(!props.isAboutOpen);
            }}
            onMouseLeave={() => {
              props.handleAbout(false);
            }}
            style={{ marginTop: "2px" }}
          >
            <span
              data-tooltip-id="my-tooltip"
              data-tooltip-content={"设置"}
            >
              <span
                className="icon-setting setting-icon"
                style={
                  props.isNewWarning ? { color: "rgb(35, 170, 242)" } : {}
                }
              ></span>
            </span>
          </div>
          <div
            className="setting-icon-container"
            onClick={() => {
              props.handleBackupDialog(true);
            }}
            onMouseLeave={() => {
              props.handleSortDisplay(false);
            }}
            style={{ marginTop: "1px" }}
          >
            <span
              data-tooltip-id="my-tooltip"
              data-tooltip-content={"备份"}
            >
              <span className="icon-archive header-archive-icon"></span>
            </span>
          </div>
          {isElectron && (
            <div
              className="setting-icon-container"
              onClick={() => {
                // syncFromLocation();
                handleSync();
              }}
              style={{ marginTop: "2px" }}
            >
              <span
                data-tooltip-id="my-tooltip"
                data-tooltip-content={"同步"}
              >
                <span
                  className="icon-sync setting-icon"
                  style={
                    state.isDataChange
                      ? { color: "rgb(35, 170, 242)" }
                      : {}
                  }
                ></span>
              </span>
            </div>
          )}
        </div>
        {state.isDeveloperVer && (
          <div
            className="header-report-container"
            onClick={() => {
              props.handleFeedbackDialog(true);
            }}
          >
            报告
          </div>
        )}
        <ImportLocal
          {...{
            handleDrag: props.handleDrag,
          }}
        />
      </div>
    );
}