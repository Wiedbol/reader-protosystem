import React, { useState } from "react";
import AddFavorite from "../../utils/readUtils/addFavorite";
import BookModel from "../../models/Book";
import "./selectBook.css";
import { Trans } from "react-i18next";
import { BookListProps } from "./interface";
import { withRouter } from "react-router-dom";
import toast from "react-hot-toast";
import {
  exportBooks,
  exportDictionaryHistory,
  exportHighlights,
  exportNotes,
} from "../../utils/syncUtils/exportUtil";
import BookUtil from "../../utils/fileUtils/bookUtil";
import ShelfUtil from "../../utils/readUtils/shelfUtil";
import StorageUtil from "../../utils/serviceUtils/storageUtil";
declare var window: any;

const SelectBook: React.FC<BookListProps> = (props) => {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isShowExport, setIsShowExport] = useState(false);
  const [favoriteBooks, setFavoriteBooks] = useState(
    Object.keys(AddFavorite.getAllFavorite()).length
  );

  const handleFilterShelfBook = (items: BookModel[]) => {
    if (props.shelfIndex > 0) {
      if (props.shelfIndex < 1) return items;
      let shelfTitle = Object.keys(ShelfUtil.getShelf());
      let currentShelfTitle = shelfTitle[props.shelfIndex];
      if (!currentShelfTitle) return items;
      let currentShelfList = ShelfUtil.getShelf()[currentShelfTitle];
      return items.filter((item: BookModel) => currentShelfList.includes(item.key));
    } else {
      if (StorageUtil.getReaderConfig("isHideShelfBook") === "yes") {
        return items.filter((item) => ShelfUtil.getBookPosition(item.key).length === 0);
      }
      return items;
    }
  };

  const handleShelf = (items: any, index: number) => {
    if (index < 1) return items;
    let shelfTitle = Object.keys(ShelfUtil.getShelf());
    let currentShelfTitle = shelfTitle[index];
    if (!currentShelfTitle) return items;
    let currentShelfList = ShelfUtil.getShelf()[currentShelfTitle];
    return items.filter((item: { key: number }) => currentShelfList.includes(item.key));
  };

  return (
    <div className="booklist-manage-container" style={props.isCollapsed ? { left: "75px" } : {}}>
      {props.isSelectBook && (
        <>
          <span
            onClick={() => {
              props.handleSelectBook(!props.isSelectBook);
              if (props.isSelectBook) {
                props.handleSelectedBooks([]);
              }
            }}
            className="book-manage-title"
            style={{ color: "rgb(231, 69, 69)" }}
          >
            <Trans>Cancel</Trans>
          </span>

          <span
            className="book-manage-title"
            onClick={() => {
              const selectedBooks = props.books.filter(
                (item: BookModel) => props.selectedBooks.includes(item.key)
              );
              if (selectedBooks.length > 0) {
                AddFavorite.setFavorites(selectedBooks);
                props.handleSelectBook(!props.isSelectBook);
                if (props.isSelectBook) {
                  props.handleSelectedBooks([]);
                }
                toast.success(props.t("Add successful"));
              } else {
                toast(props.t("Nothing to add"));
              }
            }}
          >
            <Trans>Add to favorite</Trans>
          </span>

          <span
            className="book-manage-title"
            onClick={() => {
              props.handleAddDialog(true);
            }}
          >
            <Trans>Add to shelf</Trans>
          </span>

          <span
            className="book-manage-title"
            onClick={() => {
              props.handleDeleteDialog(true);
            }}
          >
            <Trans>Delete</Trans>
          </span>

          <div className="select-more-actions-container">
            <span
              className="book-manage-title"
              onMouseEnter={() => setIsShowExport(true)}
              onMouseLeave={() => setIsShowExport(false)}
            >
              <Trans>More actions</Trans>
            </span>

            <div
              className="select-more-actions"
              style={isShowExport ? {} : { display: "none" }}
              onMouseLeave={() => setIsShowExport(false)}
              onMouseEnter={() => setIsShowExport(true)}
            >
              <span
                className="book-manage-title select-book-action"
                onClick={async () => {
                  const selectedBooks = props.books.filter(
                    (item: BookModel) => props.selectedBooks.includes(item.key)
                  );
                  if (selectedBooks.length > 0) {
                    await exportBooks(selectedBooks);
                    toast.success(props.t("Export successful"));
                  } else {
                    toast(props.t("Nothing to export"));
                  }
                }}
              >
                <Trans>Export books</Trans>
              </span>
              {/* Additional Export Options */}
              {/* Similar refactoring can be done for other export actions */}
            </div>
          </div>

          <span
            className="book-manage-title select-book-action"
            onClick={() => {
              if (
                props.selectedBooks.length === handleFilterShelfBook(props.books).length
              ) {
                props.handleSelectedBooks([]);
              } else {
                props.handleSelectedBooks(
                  handleFilterShelfBook(props.books).map((item) => item.key)
                );
              }
            }}
          >
            {props.selectedBooks.length === handleFilterShelfBook(props.books).length ? (
              <Trans>Deselect all</Trans>
            ) : (
              <Trans>Select all</Trans>
            )}
          </span>
        </>
      )}
    </div>
  );
};

export default withRouter(SelectBook);

