import { useLocation, useNavigate } from "react-router";
import { HeaderProps } from "./interface";
import { useEffect, useState } from "react";
import { isElectron } from "react-device-detect";
import StorageUtil from "../../utils/serviceUtils/storageUtil";

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

  return (
    
  )
}