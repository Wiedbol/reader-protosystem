import React, { useEffect, useState }  from "react";
import "./sidebar.css";
import { SidebarProps } from "./interface";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import { openExternalUrl } from "../../utils/serviceUtils/urlUtil";
import ShelfUtil from "../../utils/readUtils/shelfUtil";
import { sideMenu } from "../../constants/sideMenu";
import DeletePopup from "../../components/dialogs/deletePopup"
import { useNavigate, useLocation } from "react-router-dom";

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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    props.handleMode(
      location.pathname.split("/").reverse()[0] === "empty"
        ? "home"
        : location.pathname.split("/").reverse()[0]
    );
  }, [props, location]);
  const handleSidebar = (mode: string, index: number) => {
    setState({ ...state, index: index })
    props.handleSelectBook(false);
    navigate(`/manager/${mode}`);
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
  const handleCollapse = (isCollapsed:  boolean) => {
    setState({ ...state, isCollapsed: isCollapsed})
  }
  const handleJump = (url: string) => {
    openExternalUrl(url);
  };
  const handleDeleteShelf = () => {
    if (state.shelfIndex < 1) return;
    let shelfTitles = Object.keys(ShelfUtil.getShelf());
    let currentShelfTitle = shelfTitles[state.shelfIndex];
    ShelfUtil.removeShelf(currentShelfTitle);
    setState({ ...state, shelfIndex: 0 })
    props.handleShelfIndex(0);
    props.handleMode("home");
  };
  const handleDeletePopup = () => {
    setState({ ...state, isOpenDelete: !state.isOpenDelete });
  };

  const renderSideMenu = () => {
    return sideMenu.map((item, index) => {
      return (
        <li
          key = {item.name}
          className = {
            index === index && props.mode !== "shelf"
              ? "active side-menu-item"
              : "side-menu-item"
          }
          id = {`sidebar-${item.icon}`}
          onClick={() => {
            handleSidebar(item.name, index);
          }}
          onMouseEnter={() => {
            setState({ ...state, hoverIndex: index });
          }}
          onMouseLeave={() => {
            setState({ ...state, hoverIndex: -1 });
          }}
          style = {props.isCollapsed? { width: 40, marginLeft: 15 } : {}}
        >
          {state.index === index &&  props.mode !== "shelf" 
            ?  (<div className = "side-menu-selector-container"></div>) 
            : null}
          {state.hoverIndex === index
            ? (<div className = "side-menu-hover-container"></div>)
            : null}
          <div
            className = {
              index === index && props.mode !== "shelf"
                ? "side-menu-selector active-selector"
                : "side-menu-selector"
            }
          >
            <div
              className = "side-menu-icon"
              style = {props.isCollapsed ? {} : { marginLeft: "38px" }}
            >
              <span
                className = {
                  index === index && props.mode !== "shelf"
                    ? `icon-${item.icon} active-icon`
                    : `icon-${item.icon}`
                }
                style={
                  props.isCollapsed
                    ? { position: "relative", marginLeft: "-9px" }
                    : {}
                }
              ></span>
            </div>
            <span
              style = {
                props.isCollapsed
                  ? { display: "none", width: "70%" }
                  : { width: "60%"}
              }
            >
              {item.name}
            </span>
          </div>
        </li>
      );
    });
  };
  const renderSideShelf = () => {
    let shelfList = ShelfUtil.getShelf();
    let shelfTitle = Object.keys(shelfList);
    return shelfTitle.map((item, index) => {
      return (
        <li
          key = {item}
          className = {
            props.shelfIndex === index
              ? "active side-menu-item"
              : "side-menu-item"
          }
          id = {`sidebar-${index}`}
          onClick={() => {
            props.handleShelfIndex(index);
            if (index > 0) {
              props.handleMode("shelf");
            } else {
              props.handleMode("home")
            }
            setState({ ...state, index: -1 })
            navigate("manager/shelf")
          }}
          onMouseEnter={() => {
            handleShelfHover(index);
          }}
          onMouseLeave={() => {
            handleShelfHover(-1);
          }}
          style={
            index === 0
              ? { display: "none" }
              : props.isCollapsed
                ? { width: 40, marginLeft: 15 }
                : {}
          }
        >
          {props.shelfIndex === index ? (
            <div className="side-menu-selector-container"></div>
          ) : null}
          {state.hoverShelfIndex === index ? (
            <div className="side-menu-hover-container"></div>
          ) : null}
          <div
            className={
              props.shelfIndex === index
                ? "side-menu-selector active-selector"
                : "side-menu-selector"
            }
          >
            <div
              className="side-menu-icon"
              style={props.isCollapsed ? {} : { marginLeft: "38px" }}
            >
              <span
                className={
                  props.shelfIndex === index
                    ? `icon-bookshelf-line active-icon sidebar-shelf-icon`
                    : `icon-bookshelf-line sidebar-shelf-icon`
                }
                style={
                  props.isCollapsed
                    ? { position: "relative", marginLeft: "-8px" }
                    : {}
                }
              ></span>
            </div>

            <span
              style={
                props.isCollapsed
                  ? { display: "none", width: "70%" }
                  : { width: "60%" }
              }
            >
              {item}
            </span>
          </div>
        </li>
      )
    })
  }
  const deletePopupProps = {
    mode: "shelf",
    name: Object.keys(ShelfUtil.getShelf())[state.shelfIndex],
    title: "Delete this shelf",
    description: "This action will clear and remove this shelf",
    handleDeletePopup: handleDeletePopup,
    handleDeleteOperation: handleDeleteShelf,
  }
  return (
    <>
      <div className = "sidebar">
        <div
          className = "sidebar-list-icon"
          onClick={() => {
            handleCollapse(!state.isCollapsed);
          }}
        >
          <span className="icon-menu sidebar-list"></span>
        </div>
        <img
          src = {
            StorageUtil.getReaderConfig("appSkin") === "night" ||
            (StorageUtil.getReaderConfig("appSkin") === "system" &&
              StorageUtil.getReaderConfig("isOSNight") === "yes")
              ? "./assets/label_light.png"
              : "./assets/label.png"
          }
          alt=""
          onClick={() => {}}//点击label图标
          style={state.isCollapsed ? { display: "none" } : {}}
          className="logo"
        />
        <div 
          className="side-menu-container-parent"
          style={state.isCollapsed ? { width: "70px" }: {}}
          >
            <ul className="side-menu-container">{renderSideMenu()}</ul>
            <div
              className="side-shelf-title-container"
              style={
                state.isCollapsed
                  ? { display: "none"}
                  : state.isCollapseShelf
                    ? {}
                    : { border: "none"}
              }
            >
              <div className="side-shelf-title">
                我的书架
              </div>
              <span
                className="icon-dropdown side-shelf-title-icon"
                onClick={() => {
                  setState({ ...state, isCollapseShelf: !state.isCollapseShelf})
                }}
                style={
                  state.isCollapseShelf
                    ? { transform: "rotate(-90deg"}
                    : {}
                }
              ></span>
            </div>
            {!state.isCollapseShelf && (
              <ul className="side-shelf-container">{renderSideShelf()}</ul>
            )}
          </div>
      </div>
      {state.isOpenDelete && <DeletePopup {...deletePopupProps} />}
    </>
  )
}

export default Sidebar;