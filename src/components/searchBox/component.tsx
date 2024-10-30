import React, { useEffect, useRef } from "react";
import "./searchBox.css";
import { SearchBoxProps } from "./interface";
import SearchUtil from "../../utils/serviceUtils/searchUtil";
import StorageUtil from "../../utils/serviceUtils/storageUtil";


export function SearchBox(props: SearchBoxProps) {
  const searchBoxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (props.isNavSearch) {
      searchBoxRef.current?.focus();
    }
  }, [props.isNavSearch]);

  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code !== "Enter") {
      return;
    }
    const value = searchBoxRef.current?.value;
    if (props.isNavSearch || props.isReading) {
      value && search(value);
    }
  }

  const handleMouse = () => {
    const value = searchBoxRef.current?.value;
    if (props.isNavSearch) {
      value && search(value);
    }
    if (props.mode === "nav") {
      props.handleNavSearchState("searching");
    }
    let results =
      props.tabMode === "note"
        ? SearchUtil.mouseNoteSearch(
            props.notes.filter((item) => item.notes !== "")
          )
        : props.tabMode === "digest"
        ? SearchUtil.mouseNoteSearch(props.digests)
        : SearchUtil.mouseSearch(props.books);
    if (results) {
      props.handleSearchResults(results);
      props.handleSearch(true);
    }
  };

  const search = async (q: string) => {
    props.handleNavSearchState("searching");
    let searchList = await props.htmlBook?.rendition?.doSearch(q);
    props.handleNavSearchState("pending");
    props.handleSearchList(
      searchList.map((item: any) => {
        item.excerpt = item.excerpt.replace(
          q,
          `<span class="content-search-text">${q}</span>`
        );
        return item;
      })
    );
  };

  const handleCancel = () => {
    if (props.isNavSearch) {
      props.handleSearchList(null);
    }
    props.handleSearch(false);
    if (searchBoxRef.current) {
      searchBoxRef.current.value = "";
    }
  }


  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        ref="searchBox"
        className="header-search-box"
        onKeyDown={handleKey}
        onFocus={() => {
          if (props.mode === "nav") {
            props.handleNavSearchState("focused");
          }
        }}
        placeholder={
          props.isNavSearch || props.mode === "nav"
            ? "全书搜索"
            : props.tabMode === "note"
            ? "搜索我的笔记"
            : props.tabMode === "digest"
            ? "搜索我的高亮"
            : "搜索我的书库"
        }
        style={
          props.mode === "nav"
            ? {
              width: props.width,
              height: props.height,
              paddingRight: "30px"
            }
            : {}
        }
        onCompositionStart={() => {
          if (StorageUtil.getReaderConfig("isNavLocked") === "yes") {
            return;
          } else {
            StorageUtil.setReaderConfig("isTempLocked", "yes");
            StorageUtil.setReaderConfig("isNavLocked", "yes");
          }
        }}
        onCompositionEnd={() => {
          if (StorageUtil.getReaderConfig("isTempLocked") === "yes") {
            StorageUtil.setReaderConfig("isNavLocked", "");
            StorageUtil.setReaderConfig("isTempLocked", "");
          }
        }}
      />
      {props.isSearch ? (
        <span className="header-search-text" onClick={handleCancel}>
          <span className="icon-close"></span>
        </span>
      ): (
        <span className="header-search-text">
          <span className="icon-search header-search-icon" onClick={handleMouse}></span>
        </span>
      )}
    </div>
  );
};

export default SearchBox;