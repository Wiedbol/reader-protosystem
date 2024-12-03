import React, { useState, useEffect, useCallback } from "react";
import "./popupNote.css";
import Note from "../../../models/Note";
import { PopupNoteProps } from "./interface";
import RecordLocation from "../../../utils/readUtils/recordLocation";
import NoteTag from "../../noteTag";
import NoteModel from "../../../models/Note";
import toast from "react-hot-toast";
import {
  getHightlightCoords,
  removePDFHighlight,
} from "../../../utils/fileUtils/pdfUtil";
import { getIframeDoc } from "../../../utils/serviceUtils/docUtil";
import {
  createOneNote,
  removeOneNote,
} from "../../../utils/serviceUtils/noteUtil";
import { classes } from "../../../constants/themeList";

declare var window: any;

const PopupNote: React.FC<PopupNoteProps> = ({
  noteKey,
  notes,
  currentBook,
  chapter,
  chapterDocIndex,
  color,
  handleOpenMenu,
  handleFetchNotes,
  handleMenuMode,
  handleNoteKey,
}) => {
  const [tag, setTag] = useState<string[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    let textArea: HTMLTextAreaElement | null = document.querySelector(".editor-box");
    textArea && textArea.focus();
    if (noteKey) {
      let noteIndex = window._.findLastIndex(notes, { key: noteKey });
      setText(notes[noteIndex].text);
      if (textArea) textArea.value = notes[noteIndex].notes;
    } else {
      let doc = getIframeDoc();
      if (!doc) return;
      let selectedText = doc.getSelection()?.toString();
      if (!selectedText) return;
      selectedText = selectedText.replace(/\s\s/g, "")
        .replace(/\r/g, "")
        .replace(/\n/g, "")
        .replace(/\t/g, "")
        .replace(/\f/g, "");
      setText(selectedText);
    }
  }, [noteKey, notes]);

  const handleTag = useCallback((newTag: string[]) => {
    setTag(newTag);
  }, []);

  const handleNoteClick = useCallback((event: Event) => {
    handleNoteKey((event.target as HTMLElement).dataset.key || "");
    handleMenuMode("note");
    handleOpenMenu(true);
  }, [handleNoteKey, handleMenuMode, handleOpenMenu]);

  const createNote = () => {
    let notesS = (document.querySelector(".editor-box") as HTMLInputElement)?.value;
    let cfi = "";
    if (currentBook.format === "PDF") {
      cfi = JSON.stringify(RecordLocation.getPDFLocation(currentBook.md5.split("-")[0]));
    } else {
      cfi = JSON.stringify(RecordLocation.getHtmlLocation(currentBook.key));
    }

    if (noteKey) {
      const updatedNotes = notes.map(item => {
        if (item.key === noteKey) {
          item.notes = notesS;
          item.tag = tag;
          item.cfi = cfi;
          return item;
        } else {
          return item;
        }
      }
      );
      window.localforage.setItem("notes", updatedNotes).then(() => {
        handleOpenMenu(false);
        toast.success("添加成功");
        handleFetchNotes();
        handleMenuMode("");
        handleNoteKey("");
      });
    } else {
      let bookKey = currentBook.key;
      let pageArea = document.getElementById("page-area");
      if (!pageArea) return;
      let iframe = pageArea.getElementsByTagName("iframe")[0];
      if (!iframe) return;
      let doc = iframe.contentDocument;
      if (!doc) return;

      let charRange;
      if (currentBook.format !== "PDF") {
        charRange = window.rangy.getSelection(iframe).saveCharacterRanges(doc.body)[0];
      }

      let range = currentBook.format === "PDF"
        ? JSON.stringify(getHightlightCoords())
        : JSON.stringify(charRange);

      let percentage = 0;
      let noteColor = color || 0;

      let newNote = new Note(
        bookKey,
        chapter,
        chapterDocIndex,
        text,
        cfi,
        range,
        notesS,
        percentage,
        noteColor,
        tag
      );

      let noteArr = [...notes, newNote];
      window.localforage.setItem("notes", noteArr).then(() => {
        handleOpenMenu(false);
        toast.success("添加成功");
        handleFetchNotes();
        handleMenuMode("");
        createOneNote(newNote, currentBook.format, handleNoteClick);
      });
    }
  };

  const handleClose = () => {
    if (noteKey) {
      const noteIndex = notes.findIndex(item => item.key === noteKey);
      if (noteIndex > -1) {
        const updatedNotes = [...notes];
        const removedNote = updatedNotes.splice(noteIndex, 1)[0];
        window.localforage.setItem("notes", updatedNotes).then(() => {
          if (currentBook.format === "PDF") {
            removePDFHighlight(
              JSON.parse(removedNote.range),
              classes[removedNote.color],
              removedNote.key
            );
          }
          toast.success("删除成功");
          handleMenuMode("");
          handleFetchNotes();
          handleNoteKey("");
          removeOneNote(removedNote.key, currentBook.format);
          handleOpenMenu(false);
        });
      }
    } else {
      handleOpenMenu(false);
      handleMenuMode("");
      handleNoteKey("");
    }
  };

  const renderNoteEditor = () => {
    const note = noteKey ? notes.find(item => item.key === noteKey) : null;

    return (
      <div className="note-editor">
        <div className="note-original-text">{text}</div>
        <div className="editor-box-parent">
          <textarea className="editor-box" />
        </div>
        <div
          className="note-tags"
          style={{ position: "absolute", bottom: "0px", height: "40px" }}
        >
          <NoteTag
            handleTag={handleTag}
            tag={noteKey && note ? note.tag : []}
            isCard = {false}
          />
        </div>
        <div className="note-button-container">
          <span
            className="book-manage-title"
            onClick={handleClose}
          >
            {noteKey ? "删除" : "取消" }
          </span>
          <span
            className="book-manage-title"
            onClick={createNote}
          >
            确定
          </span>
        </div>
      </div>
    );
  };

  return renderNoteEditor();
};

export default PopupNote;

