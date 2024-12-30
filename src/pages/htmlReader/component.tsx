import React from "react";
import SettingPanel from "../../containers/panels/settingPanel";
import NavigationPanel from "../../containers/panels/navigationPanel";
import OperationPanel from "../../containers/panels/operationPanel";
import { Toaster } from "react-hot-toast";
import ProgressPanel from "../../containers/panels/progressPanel";
import { ReaderProps, ReaderState } from "./interface";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
import ReadingTime from "../../utils/readUtils/readingTime";
import Viewer from "../../containers/htmlViewer";
import { Tooltip } from "react-tooltip";
import RecordLocation from "../../utils/readUtils/recordLocation";
import "./index.css";
declare var window: any;

let lock = false; //prevent from clicking too fasts
let throttleTime =
  StorageUtil.getReaderConfig("isSliding") === "yes" ? 1000 : 200;
class Reader extends React.Component<ReaderProps, ReaderState> {
  messageTimer!: NodeJS.Timeout;
  tickTimer!: NodeJS.Timeout;
  constructor(props: ReaderProps) {
    super(props);
    this.state = {
      isOpenRightPanel:
        StorageUtil.getReaderConfig("isSettingLocked") === "yes" ? true : false,
      isOpenTopPanel: false,
      isOpenBottomPanel: false,
      hoverPanel: "",
      isOpenLeftPanel:
        StorageUtil.getReaderConfig("isNavLocked") === "yes" ? true : false,
      time: 0,
      isTouch: StorageUtil.getReaderConfig("isTouch") === "yes",
      isPreventTrigger:
        StorageUtil.getReaderConfig("isPreventTrigger") === "yes",
    };
  }
  componentDidMount() {
    if (StorageUtil.getReaderConfig("isMergeWord") === "yes") {
      document
        .querySelector("body")
        ?.setAttribute("style", "background-color: rgba(0,0,0,0)");
    }
    let time = ReadingTime.getTime(this.props.currentBook.key) || 0;
    this.tickTimer = setInterval(() => {
      if (this.props.currentBook.key) {
        time += 1;
        this.setState({ time });
        ReadingTime.setTime(this.props.currentBook.key, time);
      }
    }, 1000);
  }
  UNSAFE_componentWillMount() {
    let url = document.location.href;
    let firstIndexOfQuestion = url.indexOf("?");
    let lastIndexOfSlash = url.lastIndexOf("/", firstIndexOfQuestion);
    let key = url.substring(lastIndexOfSlash + 1, firstIndexOfQuestion);
    this.props.handleFetchBooks();
    window.localforage.getItem("books").then((result: any) => {
      let book =
        result[window._.findIndex(result, { key })] ||
        JSON.parse(localStorage.getItem("tempBook") || "{}");

      this.props.handleReadingBook(book);
      this.props.handleFetchPercentage(book);
    });
  }

  handleEnterReader = (position: string) => {
    switch (position) {
      case "right":
        this.setState({
          isOpenRightPanel: this.state.isOpenRightPanel ? false : true,
        });
        break;
      case "left":
        this.setState({
          isOpenLeftPanel: this.state.isOpenLeftPanel ? false : true,
        });
        break;
      case "top":
        this.setState({
          isOpenTopPanel: this.state.isOpenTopPanel ? false : true,
        });
        break;
      case "bottom":
        this.setState({
          isOpenBottomPanel: this.state.isOpenBottomPanel ? false : true,
        });
        break;
      default:
        break;
    }
  };
  handleLeaveReader = (position: string) => {
    switch (position) {
      case "right":
        if (StorageUtil.getReaderConfig("isSettingLocked") === "yes") {
          break;
        } else {
          this.setState({ isOpenRightPanel: false });
          break;
        }

      case "left":
        if (StorageUtil.getReaderConfig("isNavLocked") === "yes") {
          break;
        } else {
          this.setState({ isOpenLeftPanel: false });
          break;
        }
      case "top":
        this.setState({ isOpenTopPanel: false });
        break;
      case "bottom":
        this.setState({ isOpenBottomPanel: false });
        break;
      default:
        break;
    }
  };
  handleLocation = () => {
    let position = this.props.htmlBook.rendition.getPosition();

    RecordLocation.recordHtmlLocation(
      this.props.currentBook.key,
      position.text,
      position.chapterTitle,
      position.chapterDocIndex,
      position.chapterHref,
      position.count,
      position.percentage,
      position.cfi,
      position.page
    );
  };
  render() {
    const renditionProps = {
      handleLeaveReader: this.handleLeaveReader,
      handleEnterReader: this.handleEnterReader,
      isShow:
        this.state.isOpenLeftPanel ||
        this.state.isOpenTopPanel ||
        this.state.isOpenBottomPanel ||
        this.state.isOpenRightPanel,
    };
    return (
      <div className="viewer">
        <Tooltip id="my-tooltip" style={{ zIndex: 25 }} />
        {StorageUtil.getReaderConfig("isHidePageButton") !== "yes" && (
          <>
            <div
              className="previous-chapter-single-container"
              onClick={async () => {
                if (lock) return;
                lock = true;
                await this.props.htmlBook.rendition.prev();
                this.handleLocation();
                setTimeout(() => (lock = false), throttleTime);
              }}
            >
              <span className="icon-dropdown previous-chapter-single"></span>
            </div>
            <div
              className="next-chapter-single-container"
              onClick={async () => {
                if (lock) return;
                lock = true;
                await this.props.htmlBook.rendition.next();
                this.handleLocation();
                setTimeout(() => (lock = false), throttleTime);
              }}
            >
              <span className="icon-dropdown next-chapter-single"></span>
            </div>
          </>
        )}
        {StorageUtil.getReaderConfig("isHideMenuButton") !== "yes" && (
          <div
            className="reader-setting-icon-container"
            onClick={() => {
              this.handleEnterReader("left");
              this.handleEnterReader("right");
              this.handleEnterReader("bottom");
              this.handleEnterReader("top");
            }}
          >
            <span className="icon-grid reader-setting-icon"></span>
          </div>
        )}
        <Toaster />

        <div
          className="left-panel"
          onMouseEnter={() => {
            if (
              this.state.isTouch ||
              this.state.isOpenLeftPanel ||
              this.state.isPreventTrigger
            ) {
              this.setState({ hoverPanel: "left" });
              return;
            }
            this.handleEnterReader("left");
          }}
          onMouseLeave={() => {
            this.setState({ hoverPanel: "" });
          }}
          style={this.state.hoverPanel === "left" ? { opacity: 0.5 } : {}}
          onClick={() => {
            this.handleEnterReader("left");
          }}
        >
          <span className="icon-grid panel-icon"></span>
        </div>
        <div
          className="right-panel"
          onMouseEnter={() => {
            if (
              this.state.isTouch ||
              this.state.isOpenRightPanel ||
              this.state.isPreventTrigger
            ) {
              this.setState({ hoverPanel: "right" });
              return;
            }
            this.handleEnterReader("right");
          }}
          onMouseLeave={() => {
            this.setState({ hoverPanel: "" });
          }}
          style={this.state.hoverPanel === "right" ? { opacity: 0.5 } : {}}
          onClick={() => {
            this.handleEnterReader("right");
          }}
        >
          <span className="icon-grid panel-icon"></span>
        </div>
        <div
          className="top-panel"
          onMouseEnter={() => {
            if (
              this.state.isTouch ||
              this.state.isOpenTopPanel ||
              this.state.isPreventTrigger
            ) {
              this.setState({ hoverPanel: "top" });
              return;
            }
            this.handleEnterReader("top");
          }}
          style={this.state.hoverPanel === "top" ? { opacity: 0.5 } : {}}
          onMouseLeave={() => {
            this.setState({ hoverPanel: "" });
          }}
          onClick={() => {
            this.handleEnterReader("top");
          }}
        >
          <span className="icon-grid panel-icon"></span>
        </div>
        <div
          className="bottom-panel"
          onMouseEnter={() => {
            if (
              this.state.isTouch ||
              this.state.isOpenBottomPanel ||
              this.state.isPreventTrigger
            ) {
              this.setState({ hoverPanel: "bottom" });
              return;
            }
            this.handleEnterReader("bottom");
          }}
          style={this.state.hoverPanel === "bottom" ? { opacity: 0.5 } : {}}
          onMouseLeave={() => {
            this.setState({ hoverPanel: "" });
          }}
          onClick={() => {
            this.handleEnterReader("bottom");
          }}
        >
          <span className="icon-grid panel-icon"></span>
        </div>

        <div
          className="setting-panel-container"
          onMouseLeave={(event) => {
            this.handleLeaveReader("right");
          }}
          style={
            this.state.isOpenRightPanel
              ? {}
              : {
                  transform: "translateX(309px)",
                }
          }
        >
          <SettingPanel />
        </div>
        <div
          className="navigation-panel-container"
          onMouseLeave={(event) => {
            this.handleLeaveReader("left");
          }}
          style={
            this.state.isOpenLeftPanel
              ? {}
              : {
                  transform: "translateX(-309px)",
                }
          }
        >
          <NavigationPanel {...{ time: this.state.time }} />
        </div>
        <div
          className="progress-panel-container"
          onMouseLeave={(event) => {
            this.handleLeaveReader("bottom");
          }}
          style={
            this.state.isOpenBottomPanel
              ? {}
              : {
                  transform: "translateY(110px)",
                }
          }
        >
          <ProgressPanel {...{ time: this.state.time }} />
        </div>
        <div
          className="operation-panel-container"
          onMouseLeave={(event) => {
            this.handleLeaveReader("top");
          }}
          style={
            this.state.isOpenTopPanel
              ? {}
              : {
                  transform: "translateY(-110px)",
                }
          }
        >
          {this.props.htmlBook && (
            <OperationPanel {...{ time: this.state.time }} />
          )}
        </div>

        {this.props.currentBook.key && <Viewer {...renditionProps} />}
      </div>
    );
  }
}

export default Reader;
