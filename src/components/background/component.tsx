import React, { useEffect, useState } from 'react';
import './background.css'
import { BackgroundProps, BackgroundState } from './interface';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import { useLocation, useNavigate } from 'react-router';

export function Background(props: BackgroundProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState<BackgroundState>({
    isSingle:
      StorageUtil.getReaderConfig("readerMode") &&
      StorageUtil.getReaderConfig("readerMode") !== "double",
    scale: StorageUtil.getReaderConfig("scale") || 1,
  })

  //todo:将更改背景的代码改在这里，尝试支持用户自定义背景图片
  useEffect(() => {
    let background = document.querySelector(".background");
    if(!background) return;
    background?.setAttribute(
      "style",
      `background-color:${
        StorageUtil.getReaderConfig("backgroundColor")
          ? StorageUtil.getReaderConfig("backgroundColor")
          : StorageUtil.getReaderConfig("appSkin") === "night" ||
            (StorageUtil.getReaderConfig("appSkin") === "system" &&
              StorageUtil.getReaderConfig("isOSNight") === "yes")
          ? "rgba(44,47,49,1)"
          : "rgba(255,255,255,1"
      };filter: brightness(${
        StorageUtil.getReaderConfig("brightness") || 1
      }) invert(${StorageUtil.getReaderConfig("isInvert") === "yes" ? 1 : 0})`
    );
  }, [])

  return(
    <>
      <div 
        className="background-box2"
        style={
          document.body.clientWidth < 570
            ? { left: 5, right: 8}
            : state.isSingle
            ? {
                left: `calc(50vw - ${
                  270 * parseFloat(state.scale)
                }px - ${state.isSingle ? "9" : "5"}px)`,
                right: `calc(50vw - ${
                  270 * parseFloat(state.scale)
                }px - 7px)`,
                boxShadow: "0 0 0px rgba(191, 191, 191, 1)",
            }
            : {}
        }
      ></div>

      <div
        className="background-box3"
        style={
          document.body.clientWidth < 570
            ? { left: 5, right: 10 }
            : state.isSingle
            ? {
                left: `calc(50vw - ${
                  270 * parseFloat(state.scale)
                }px - 9px)`,
                right: `calc(50vw - ${
                  270 * parseFloat(state.scale)
                }px - 9px)`,
              }
            : {}
        }
      >
        {(!StorageUtil.getReaderConfig("backgroundColor") &&
          (StorageUtil.getReaderConfig("appSkin") === "night" ||
            (StorageUtil.getReaderConfig("appSkin") === "system" &&
              StorageUtil.getReaderConfig("isOSNight") === "yes"))) ||
        StorageUtil.getReaderConfig("backgroundColor") ===
          "rgba(44,47,49,1)" ? (
          <div
            className="spine-shadow-left"
            style={
              state.isSingle
                ? { display: "none", opacity: 0.5 }
                : { opacity: 0.5 }
            }
          ></div>
        ) : (
          <div
            className="spine-shadow-left"
            style={state.isSingle ? { display: "none" } : {}}
          ></div>
        )}
        <div
          className="book-spine"
          style={state.isSingle ? { display: "none" } : {}}
        ></div>
        {(!StorageUtil.getReaderConfig("backgroundColor") &&
          (StorageUtil.getReaderConfig("appSkin") === "night" ||
            (StorageUtil.getReaderConfig("appSkin") === "system" &&
              StorageUtil.getReaderConfig("isOSNight") === "yes"))) ||
        StorageUtil.getReaderConfig("backgroundColor") ===
          "rgba(44,47,49,1)" ? (
          <div
            className="spine-shadow-right"
            style={
              state.isSingle
                ? {
                    position: "relative",
                    right: 0,
                    opacity: 0.5,
                  }
                : { opacity: 0.5 }
            }
          ></div>
        ) : (
          <div
            className="spine-shadow-right"
            style={
              state.isSingle
                ? {
                    position: "relative",
                    right: 0,
                  }
                : {}
            }
          ></div>
        )}
      </div>
      <div
        className="background-box1"
        style={
          document.body.clientWidth < 570
            ? { left: 5, right: 6 }
            : state.isSingle
            ? {
                left: `calc(50vw - ${
                  270 * parseFloat(state.scale)
                }px - ${state.isSingle ? "9" : "5"}px)`,
                right: `calc(50vw - ${
                  270 * parseFloat(state.scale)
                }px - 5px)`,
                boxShadow: "0 0 0px rgba(191, 191, 191, 1)",
              }
            : {}
        }
      ></div>
    </>
  )
}

