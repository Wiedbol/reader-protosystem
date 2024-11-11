import React, { useState, useEffect} from'react';
import "./manager.css"
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router';
import { ManagerProps } from './interface';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import AddFavorite from '../../utils/readUtils/addFavorite';
import { isMobile } from 'react-device-detect';
import { Tooltip } from 'react-tooltip';
import Arrow from '../../components/arrow';


export function Manager(props: ManagerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    totleBooks: parseInt(StorageUtil.getReaderConfig("totleBooks")) || 0,
    favoriteBooks: Object.keys(AddFavorite.getAllFavorites()).length,
    isAuthed: false,
    isError: false,
    isCopied: false,
    isUpdated: false,
    isDrag: false,
    token: "",
  });

  useEffect(() => {
    props.handleFetchBooks();
    props.handleFetchNotes();
    props.handleFetchBookmarks();
    props.handleFetchBookSortCode();
    props.handleFetchNoteSortCode();
    props.handleFetchViewMode();
    props.handleReadingState(false);
  },[]);

  useEffect(() => {
    if (props.books && state.totleBooks !== props.books.length) {
      setState(prevState => ({
        ...prevState,
        totleBooks: props.books.length,
      }))
      StorageUtil.setReaderConfig("totleBooks", props.books.length.toString());
    }
    if (props.books && props.books.length === 1) {
      navigate("/manager/home");
    }
  }, [props.books]);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      favoriteBooks: Object.keys(AddFavorite.getAllFavorites()).length,
    }));
  }, [props.mode]);
  const handleDrag = (isDrag: boolean) => {
    setState(prevState => ({ ...prevState, isDrag }));
  };

  if (isMobile && document.location.href.indexOf("192.168") === -1) {
    return (
      <>
        <p className='warnig-title'>友情提示</p>
        <div className="mobile-warning">
          <span>
            本应用未适配移动端，请在电脑上打开此网站
          </span>
        </div>
        <div>
          <img 
            src={
              StorageUtil.getReaderConfig("appSkin") === "night" ||
              (StorageUtil.getReaderConfig("appSkin") === "system" &&
              StorageUtil.getReaderConfig("isOSNight") === "yes")
              ? "./assets/empty_light.svg"
              : "./assets/empty.svg"
            } 
            alt=""
            className='warning-pic'
          />
        </div>
      </>
    )
  }
  
  
  return (
    <div
      className='manager'
      onDragEnter={() => {
        !props.dragItem && handleDrag(true);
        (
          document.getElementsByClassName("import-from-local")[0] as HTMLElement
        ).style.zIndex = "50";
      }}
    >
      <Tooltip id='my-tooltip' style={{ zIndex: 25 }} />
      {
        !props.dragItem && (
          <div
            className='drag-background'
            onClick={() => {
              props.handleEditDialog(false);
              props.handleDeleteDialog(false);
              props.handleAddDialog(false);
              props.handleTipDialog(false);
              props.handleDetailDialog(false);
              props.handleLoadingDialog(false);
              props.handleNewDialog(false);
              props.handleBackupDialog(false);
              props.handleSetting(false);
              props.handleFeedbackDialog(false);
              handleDrag(false);
            }}
            style={
              
              props.isSettingOpen ||
              props.isOpenFeedbackDialog ||
              props.isBackup ||
              props.isShowNew ||
              props.isOpenDeleteDialog ||
              props.isOpenEditDialog ||
              props.isDetailDialog ||
              props.isOpenAddDialog ||
              props.isTipDialog ||
              props.isShowLoading ||
              state.isDrag
                ? {}
                : {
                    display: "none",
                  }
            }
          >
            {state.isDrag && (
              <div className="drag-info">
                <Arrow />
                <p className="arrow-text">拖拽图书到此处</p>
              </div>
            )}
          </div>
        )}
        //todo:添加container中的内容
    </div>
  )
}