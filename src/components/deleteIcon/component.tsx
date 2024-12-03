import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import TagUtil from '../../utils/readUtils/tagUtil';
import DeletePopup from '../dialogs/deletePopup';
import './deleteIcon.css';
import { DeleteIconProps } from './interface';
declare var window: any;

const DeleteIcon: React.FC<DeleteIconProps> = ({
  mode,
  itemKey,
  tagName,
  index,
  notes = [],
  bookmarks = [],
  handleFetchNotes,
  handleFetchBookmarks,
  handleChangeTag,
}) => {
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const handleDelete = useCallback(() => {
    let deleteItems = mode === 'notes' ? notes : mode === 'tags' ? TagUtil.getAllTags() : bookmarks;
    let deleteFunc = mode === 'notes' ? handleFetchNotes : handleFetchBookmarks;

    if (mode === 'tags') {
      TagUtil.clear(tagName!);
      handleDeleteTagFromNote(tagName!);
      return;
    }

    const updatedItems = deleteItems.filter((item: any) => item.key !== itemKey);

    if (updatedItems.length === 0) {
      window.localforage.removeItem(mode)
        .then(() => {
          deleteFunc?.();
          toast.success('删除成功');
        })
        .catch(() => {
          console.log('delete failed');
        });
    } else {
      window.localforage.setItem(mode, updatedItems)
        .then(() => {
          deleteFunc?.();
          toast.success('删除成功');
        })
        .catch(() => {
          console.log('modify failed');
        });
    }
  }, [mode, itemKey, tagName, notes, bookmarks, handleFetchNotes, handleFetchBookmarks]);

  const handleDeleteTagFromNote = useCallback((tagName: string) => {
    const noteList = notes.map((item) => ({
      ...item,
      tag: item.tag.filter((subitem: string) => subitem !== tagName),
    }));

    window.localforage.setItem('notes', noteList).then(() => {
      handleFetchNotes?.();
    });
  }, [notes, handleFetchNotes]);

  const handleDeletePopup = useCallback((isOpen: boolean) => {
    setIsOpenDelete(isOpen);
    if (!isOpen && handleChangeTag && typeof index === 'number') {
      handleChangeTag(index);
    }
  }, [handleChangeTag, index]);

  const deletePopupProps = {
    name: tagName,
    title: 'Delete this tag',
    description: 'This action will clear and remove this tag',
    handleDeletePopup,
    handleDeleteOperation: handleDelete,
  };

  return (
    <>
      {isOpenDelete && <DeletePopup {...deletePopupProps} />}
      <div
        className="delete-digest-button"
        onClick={() => {
          mode === 'tags' ? handleDeletePopup(true) : handleDelete();
        }}
      >
        <span className="icon-close delete-digest-icon"></span>
      </div>
    </>
  );
};

export default DeleteIcon;