import React from "react";
import "./booklist.css";
import BookCardItem from "../../../components/bookCardItem";
import BookCoverItem from "../../../components/bookCoverItem";
import BookListItem from "../../../components/bookListItem";
import AddTrash from "../../../utils/readUtils/addTrash";
import RecordRecent from "../../../utils/readUtils/recordRecent";
import SortUtil from "../../../utils/readUtils/sortUtil";
import BookModel from "../../../models/Book";
import { Trans } from "react-i18next";
import { BookListProps, BookListState } from "./interface";
import { Redirect, withRouter } from "react-router-dom";
import ViewMode from "../../../components/viewMode";

class BookList extends React.Component<BookListProps, BookListState> {
  constructor(props: BookListProps) {
    super(props);
    this.state = { isRefreshing: false };
  }
  componentDidMount() {
    setTimeout(() => {
      this.lazyLoad();
      window.addEventListener("scroll", this.lazyLoad);
      window.addEventListener("resize", this.lazyLoad);
    }, 0);
  }
  UNSAFE_componentWillMount() {
    this.props.handleFetchBooks();
  }
  UNSAFE_componentWillReceiveProps() {
    this.setState({ isRefreshing: true }, () => {
      this.setState({ isRefreshing: false });
    });
  }
  lazyLoad = () => {
    const lazyImages: any = document.querySelectorAll(".lazy-image");

    lazyImages.forEach((lazyImage) => {
      if (this.isElementInViewport(lazyImage) && lazyImage.dataset.src) {
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove("lazy-image");
      }
    });
  };
  isElementInViewport = (element) => {
    const rect = element.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
  handleKeyFilter = (items: any[], arr: string[]) => {
    let itemArr: any[] = [];
    arr.forEach((item) => {
      items.forEach((subItem: any) => {
        if (subItem.key === item) {
          itemArr.push(subItem);
        }
      });
    });

    return itemArr;
  };

  //get the searched book according to the index
  handleIndexFilter = (items: any, arr: number[]) => {
    let itemArr: any[] = [];
    arr.forEach((item) => {
      items[item] && itemArr.push(items[item]);
    });

    return itemArr;
  };
  renderBookList = () => {
    //get the book data according to different scenarios
    let books = !this.props.isBookSort
      ? this.handleKeyFilter(this.props.deletedBooks, AddTrash.getAllTrash())
      : this.props.isBookSort
      ? this.handleIndexFilter(
          this.handleKeyFilter(this.props.deletedBooks, AddTrash.getAllTrash()),
          //return the sorted book index
          SortUtil.sortBooks(
            this.props.deletedBooks,
            this.props.bookSortCode
          ) || []
        )
      : this.props.isBookSort
      ? this.handleIndexFilter(
          this.props.deletedBooks,
          //return the sorted book index
          SortUtil.sortBooks(
            this.props.deletedBooks,
            this.props.bookSortCode
          ) || []
        )
      : this.handleKeyFilter(
          this.props.deletedBooks,
          RecordRecent.getAllRecent()
        );
    if (books.length === 0) {
      return <Redirect to="/manager/empty" />;
    }
    setTimeout(() => {
      this.lazyLoad();
    }, 0);
    let listElements = document.querySelector(".book-list-item-box");
    let covers = listElements?.querySelectorAll("img");
    covers?.forEach((cover) => {
      if (!cover.classList.contains("lazy-image")) {
        cover.classList.add("lazy-image");
      }
    });
    return books.map((item: BookModel, index: number) => {
      return this.props.viewMode === "list" ? (
        <BookListItem
          {...{
            key: index,
            book: item,
          }}
        />
      ) : this.props.viewMode === "card" ? (
        <BookCardItem
          {...{
            key: index,
            book: item,
            isSelected: this.props.selectedBooks.indexOf(item.key) > -1,
          }}
        />
      ) : (
        <BookCoverItem
          {...{
            key: index,
            book: item,
            isSelected: this.props.selectedBooks.indexOf(item.key) > -1,
          }}
        />
      );
    });
  };

  render() {
    return (
      <>
        <div
          className="book-list-container-parent"
          style={
            this.props.isCollapsed
              ? { width: "calc(100vw - 70px)", left: "70px" }
              : {}
          }
        >
          <div className="book-list-container">
            <ul
              className="book-list-item-box"
              onScroll={() => {
                this.lazyLoad();
              }}
            >
              {!this.state.isRefreshing && this.renderBookList()}
            </ul>
          </div>
        </div>
        <div
          className="book-list-header"
          style={
            this.props.isCollapsed
              ? { width: "calc(100% - 70px)", left: "70px" }
              : {}
          }
        >
          <div></div>
          <div
            className="booklist-delete-container"
            onClick={() => {
              this.props.handleDeleteDialog(true);
            }}
            style={this.props.isCollapsed ? { left: "calc(50% - 60px)" } : {}}
          >
            <Trans>Delete all books</Trans>
          </div>
          <ViewMode />
        </div>
      </>
    );
  }
}

export default withRouter(BookList as any);
