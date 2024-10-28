import React, { useEffect, useState }  from "react";
import "./sidebar.css";
import { SidebarProps } from "./interface";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import { openExternalUrl } from "../../utils/serviceUtils/urlUtil";

export function Sidebar(props: SidebarProps) {
  const [state, setState] = useState({
    index: 0,
    hoverIndex: -1,
    hoverShelfIndex: -1,
    isCollapseShelf: false,
    isOpenDelete: false,
    shelfIndex: 0,
    isCollapsed:
      StorageUtil.getReaderConfig("isCollapsed") === "yes" || false,
  })

  useEffect(() => {
    props.handleMode(
      document.URL.split("/").reverse()[0] === "empty"
        ? "home"
        : document.URL.split("/").reverse()[0]
    );
  })
  const handleSidebar = (mode: string, index: number) => {
    setState({ ...state, index: index })
    props.handleSelectBook(false);
    props.navigate(`/manager/${mode}`);
    props.handleMode(mode);
    props.handleShelfIndex(-1);
    props.handleSearch(false);
    props.handleSortDisplay(false);
  };
  const handleHover = (index: number) => {
    setState({ ...state, hoverIndex: index });
  }
  const handleShelfHover = (index: number) => {
    setState({ ...state, hoverShelfIndex: index });
  }
  const handleCollapse = (isCollapsed:  boolean) {
    setState({ ...state, isCollapsed: isCollapsed})
  }
  const handleJump = (url: string) => {
    openExternalUrl(url);
  };
  const handleDeleteShelf = () => {
    if (state.shelfIndex < 1) return;
    let shelfTitles = Object.keys()
  }
}