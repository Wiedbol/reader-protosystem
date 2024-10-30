import { useState } from "react";
import { EmptyPageProps } from "./interface";
import { emptyList } from "../../constants/emptyList";
import React from "react";

export function EmptyPage(props: EmptyPageProps) {
  const renderEmptyList = () => {
    return emptyList.map((item) => {
      return (
        <div
          className="empty-page-info-container"
          key={item.mode}
          style={
            props.mode === item.mode ? {} : {visibility: "hidden"}
          }
        >
          <div className="empty-page-info-main">
            {item.main}
          </div>
          <div className="empty-page-info-sub">
            {item.sub}
          </div>
        </div>
      );
    });
  };
  return (
    <div 
      className="empty-page-container"
      style={
        props.isCollapsed
          ? { 
              width: "calc(100vw - 100px)", left: "100px" ,
              backgroundImage: `url("./assets/background.jpg")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
          }
          : {
              backgroundImage: `url("./assets/background.jpg")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "100vw",
          }
      }
    >
    {renderEmptyList()}
    </div>
  )
}

export default EmptyPage;