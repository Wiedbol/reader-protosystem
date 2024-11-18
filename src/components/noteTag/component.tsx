import React, { useState, useEffect } from "react";
import "./noteTag.css";
import { NoteTagProps } from "./interface";
import TagUtil from "../../utils/readUtils/tagUtil";
import DeleteIcon from "../deleteIcon";
import { Trans } from "react-i18next";

const NoteTag: React.FC<NoteTagProps> = (props) => {
  const [tagIndex, setTagIndex] = useState<number[]>([]);
  const [isInput, setIsInput] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [isShowTags, setIsShowTags] = useState(false);

  useEffect(() => {
    if (props.isReading) {
      setTagIndex(tagToIndex(props.tag));
    }
  }, [props.isReading, props.tag]);

  const tagToIndex = (tag: string[]) => {
    if (!tag) return [];
    return TagUtil.getAllTags().reduce((acc: number[], item: string, i: number) => {
      if (tag.includes(item)) acc.push(i);
      return acc;
    }, []);
  };

  const indextoTag = (tagIndex: number[]) => {
    return tagIndex.map((index) => TagUtil.getAllTags()[index]);
  };

  const handleChangeTag = (index: number) => {
    let updatedTags = [...tagIndex];
    const tagExists = tagIndex.includes(index);
    if (tagExists) {
      updatedTags = updatedTags.filter((i) => i !== index);
    } else {
      updatedTags.push(index);
    }
    setTagIndex(updatedTags);
    props.handleTag(indextoTag(updatedTags));
  };

  const handleAddTag = (event: any) => {
    setIsInput(false);
    if (!event.target.value) return;
    TagUtil.setTags(event.target.value);
    setTagIndex([]);
    props.handleTag(indextoTag([]));
  };

  const handleInput = () => {
    setIsInput(true);
    setTimeout(() => {
      document.getElementById("newTag")?.focus();
    }, 0);
  };

  const handleShowTags = (show: boolean) => {
    setIsShowTags(show);
    if (document.querySelector(".card-list-container")) {
      const container = document.querySelector(".card-list-container") as HTMLElement;
      container.style.height = `calc(100% - ${container.offsetTop}px)`;
    }
  };

  const renderTag = () => {
    const noteTags = props.isCard ? props.tag : TagUtil.getAllTags();
    return noteTags.map((item, index) => (
      <li
        key={item}
        className={`tag-list-item ${tagIndex.includes(index) && !props.isCard ? "active-tag" : ""}`}
      >
        <div className="delete-tag-container">
          {tagIndex.includes(index) && !props.isReading && !props.isCard && (
            <DeleteIcon
              tagName={item}
              mode="tags"
              index={index}
              handleChangeTag={handleChangeTag}
            />
          )}
        </div>
        <div className="center" onClick={() => handleChangeTag(index)}>
          <Trans>{item}</Trans>
        </div>
      </li>
    ));
  };

  return (
    <div className="note-tag-container" style={props.isReading ? { width: "1999px" } : {}}>
      {(!props.isReading && !props.isCard) && (
        <div className="tag-title">
          <Trans>All tags</Trans>
          <div className="note-tag-show-icon" style={!isShowTags ? { transform: "rotate(-90deg)" } : {}}>
            <span
              className="icon-dropdown tag-dropdown-icon"
              onClick={() => handleShowTags(!isShowTags)}
              style={{ float: "unset", margin: "0px" }}
            ></span>
          </div>
        </div>
      )}
      {(isShowTags || props.isReading || props.isCard) && (
        <ul className="tag-container">
          {!props.isCard && (
            <li
              className="tag-list-item-new"
              onClick={handleInput}
              style={isInput ? { width: "80px" } : {}}
            >
              <div className="center">
                {isInput ? (
                  <input
                    type="text"
                    name="newTag"
                    id="newTag"
                    onBlur={(event) => {
                      if (!isEntered) {
                        handleAddTag(event);
                      } else {
                        setIsEntered(false);
                      }
                    }}
                    onKeyDown={(event: React.KeyboardEvent) => {
                      if (event.key === "Enter") {
                        setIsEntered(true);
                        handleAddTag(event);
                      }
                    }}
                  />
                ) : (
                  <span className="icon-add"></span>
                )}
              </div>
            </li>
          )}
          {renderTag()}
        </ul>
      )}
    </div>
  );
};

export default NoteTag;

