import React from "react";
import "./contentList.css";
import { ContentListProps, ContentListState } from "./interface";
import StorageUtil from "../../../utils/serviceUtils/storageUtil";
import RecordLocation from "../../../utils/readUtils/recordLocation";
import { scrollContents } from "../../../utils/commonUtil";

class ContentList extends React.Component<ContentListProps, ContentListState> {
  constructor(props: ContentListProps) {
    super(props);
    this.state = {
      chapters: [],
      isCollapsed: true,
      currentIndex: -1,
      isExpandContent: StorageUtil.getReaderConfig("isExpandContent") === "yes",
    };
    this.handleJump = this.handleJump.bind(this);
  }
  componentDidMount() {
    if (this.props.htmlBook) {
      this.setState(
        {
          chapters: this.props.htmlBook.chapters,
        },
        () => {
          let bookLocation: {
            text: string;
            count: string;
            chapterTitle: string;
            chapterDocIndex: string;
            chapterHref: string;
          } = RecordLocation.getHtmlLocation(this.props.currentBook.key);

          let chapter =
            bookLocation.chapterTitle ||
            (this.props.htmlBook && this.props.htmlBook.flattenChapters[0]
              ? this.props.htmlBook.flattenChapters[0].label
              : "Unknown chapter");
          scrollContents(
            chapter,
            bookLocation.chapterHref,
          );
        }
      );
    }
  }
  async handleJump(item: any) {
    await this.props.htmlBook.rendition.goToChapter(
      item.index,
      item.href,
      item.label
    );
    this.props.handleCurrentChapter(item.label);
    this.props.handleCurrentChapterIndex(item.index);
  }
  UNSAFE_componentWillReceiveProps(nextProps: ContentListProps) {
    if (nextProps.htmlBook && nextProps.htmlBook !== this.props.htmlBook) {
      this.setState({ chapters: nextProps.htmlBook.chapters });
    }
  }
  render() {
    let bookLocation: {
      text: string;
      count: string;
      chapterTitle: string;
      chapterDocIndex: string;
      chapterHref: string;
      percentage: string;
      cfi: string;
      page: string;
    } = RecordLocation.getHtmlLocation(this.props.currentBook.key);
    const renderContentList = (items: any, level: number) => {
      level++;
      return items.map((item: any, index: number) => {
        return (
          <li key={index} className="book-content-list">
            {item.subitems &&
              item.subitems.length > 0 &&
              level <= 2 &&
              !this.state.isExpandContent && (
                <span
                  className="icon-dropdown content-dropdown"
                  onClick={() => {
                    this.setState({
                      currentIndex:
                        this.state.currentIndex === index ? -1 : index,
                    });
                  }}
                  style={
                    this.state.currentIndex === index ||
                    item.subitems.filter(
                      (item) => item.href === bookLocation.chapterHref
                    ).length > 0
                      ? {}
                      : { transform: "rotate(-90deg)" }
                  }
                ></span>
              )}

            <span
              onClick={() => {
                this.handleJump(item);
              }}
              className="book-content-name"
            >
              {item.label}
            </span>
            {item.subitems &&
            item.subitems.length > 0 &&
            (this.state.currentIndex === index ||
              level > 2 ||
              this.state.isExpandContent ||
              item.subitems.filter(
                (item) => item.href === bookLocation.chapterHref
              ).length > 0) ? (
              <ul>{renderContentList(item.subitems, level)}</ul>
            ) : null}
          </li>
        );
      });
    };

    return (
      <div className="book-content-container">
        <ul className="book-content">
          {this.state.chapters && renderContentList(this.state.chapters, 1)}
        </ul>
      </div>
    );
  }
}

export default ContentList;
