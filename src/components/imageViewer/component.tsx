import React, { useState, useEffect } from "react";
import "./imageViewer.css";
import { ImageViewerProps } from "./interface";
import { handleLinkJump } from "../../utils/readUtils/linkUtil";
import { getIframeDoc } from "../../utils/serviceUtils/docUtil";
declare var window: any;

const ImageViewer: React.FC<ImageViewerProps> = (props) => {
  const [isShowImage, setIsShowImage] = useState(false);
  const [imageRatio, setImageRatio] = useState("horizontal");
  const [zoomIndex, setZoomIndex] = useState(0);
  const [rotateIndex, setRotateIndex] = useState(0);

  useEffect(() => {
    const onRendered = () => {
      const doc = getIframeDoc();
      if (doc) {
        doc.addEventListener("click", showImage);
      }
    };
    props.rendition.on("rendered", onRendered);

    return () => {
      props.rendition.off("rendered", onRendered);
    };
  }, [props.rendition]);

  const showImage = async (event: any) => {
    event.preventDefault();
    if (props.isShow) {
      ["left", "right", "top", "bottom"].forEach((direction) => {
        props.handleLeaveReader(direction);
      });
    }
    await handleLinkJump(event, props.rendition);

    const target = event.target;
    if (!target.getAttribute("src") || target.getAttribute("href") || target.parentNode.getAttribute("href")) {
      return;
    }

    setIsShowImage((prevShow) => !prevShow);
    setZoomIndex(0);
    setRotateIndex(0);

    const img = new Image();
    img.onload = function () {
      setImageRatio(this.naturalWidth / this.naturalHeight > 1 ? "horizontal" : "vertical");
    };
    img.src = target.src;

    const image = document.querySelector("#selectedImage") as HTMLImageElement | null;
    if (image) {
      image.src = target.src;
      if (imageRatio === "horizontal") {
        image.style.width = "60vw";
      } else {
        image.style.height = "100vh";
      }
    }
  };

  const hideImage = (event: any) => {
    event.preventDefault();
    const image = document.querySelector("#selectedImage") as HTMLImageElement | null;
    if (image) {
      image.src = "";
      image.style.removeProperty("margin-top");
      image.style.removeProperty("transform");
      image.style.removeProperty("width");
      image.style.removeProperty("height");
    }
    setIsShowImage(false);
  };

  const handleZoomIn = () => {
    const image = document.querySelector("#selectedImage") as HTMLImageElement | null;
    if (!image || image.style.width === "200vw" || image.style.height === "200vh") return;
    
    setZoomIndex((prevZoom) => prevZoom + 1);
    const newSize = 60 + zoomIndex * 10;
    if (imageRatio === "horizontal") {
      image.style.width = `${newSize}vw`;
    } else {
      image.style.height = `${newSize}vh`;
    }
  };

  const handleZoomOut = () => {
    const image = document.querySelector("#selectedImage") as HTMLImageElement | null;
    if (!image || image.style.width === "10vw" || image.style.height === "10vh") return;

    setZoomIndex((prevZoom) => prevZoom - 1);
    const newSize = 60 + zoomIndex * 10;
    if (imageRatio === "horizontal") {
      image.style.width = `${newSize}vw`;
    } else {
      image.style.height = `${newSize}vh`;
    }
  };

  const handleSave = async () => {
    const image = document.querySelector("#selectedImage") as HTMLImageElement | null;
    if (image) {
      const blob = await fetch(image.src).then((r) => r.blob());
      window.saveAs(blob, `${new Date().toLocaleDateString()}`);
    }
  };

  const handleClockwise = () => {
    const image = document.querySelector("#selectedImage") as HTMLImageElement | null;
    setRotateIndex((prevRotate) => prevRotate + 1);
    if (image) image.style.transform = `rotate(${rotateIndex * 90}deg)`;
  };

  const handleCounterClockwise = () => {
    const image = document.querySelector("#selectedImage") as HTMLImageElement | null;
    setRotateIndex((prevRotate) => prevRotate - 1);
    if (image) image.style.transform = `rotate(${rotateIndex * 90}deg)`;
  };

  return (
    <div className="image-preview" style={isShowImage ? {} : { display: "none" }}>
      <div
        className="image-background"
        style={isShowImage ? { backgroundColor: "rgba(75,75,75,0.3)" } : {}}
        onClick={hideImage}
      ></div>
      <img
        src=""
        alt=""
        className="image"
        id="selectedImage"
        style={imageRatio === "horizontal" ? { width: "60vw" } : { height: "100vh" }}
      />
      <div className="image-operation">
        <span className="icon-zoom-in zoom-in-icon" onClick={handleZoomIn}></span>
        <span className="icon-zoom-out zoom-out-icon" onClick={handleZoomOut}></span>
        <span className="icon-save save-icon" onClick={handleSave}></span>
        <span className="icon-clockwise clockwise-icon" onClick={handleClockwise}></span>
        <span className="icon-counterclockwise counterclockwise-icon" onClick={handleCounterClockwise}></span>
      </div>
    </div>
  );
};

export default ImageViewer;

