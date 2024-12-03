import React, { useEffect, useCallback } from "react";
import { ViewModeProps } from "./interface";
import "./viewMode.css";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import { viewMode } from "../../constants/viewMode";

const ViewMode: React.FC<ViewModeProps> = (props) => {
  
  const handleChange = useCallback((mode: string) => {
    StorageUtil.setReaderConfig("viewMode", mode);
    props.handleFetchList();
    setTimeout(() => {
      lazyLoad();
    }, 0);
  }, [props]);

  const lazyLoad = useCallback(() => {
    const lazyImages: any = document.querySelectorAll(".lazy-image");

    lazyImages.forEach((lazyImage) => {
      if (isElementInViewport(lazyImage) && lazyImage.dataset.src) {
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove("lazy-image");
      }
    });
  }, []);

  const isElementInViewport = useCallback((element: any) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, []);

  useEffect(() => {
    lazyLoad();
  }, [lazyLoad]);

  return (
    <div className="book-list-view">
      {viewMode.map((item) => (
        <div
          className="card-list-mode"
          onClick={() => {
            handleChange(item.mode);
          }}
          style={props.viewMode !== item.mode ? { opacity: 0.5 } : {}}
          key={item.mode}
        >
          <span
            data-tooltip-id="my-tooltip"
            data-tooltip-content={item.name}
          >
            <span className={`icon-${item.icon}`}></span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default ViewMode;

