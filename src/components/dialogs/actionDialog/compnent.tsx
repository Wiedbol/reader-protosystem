import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddTrash from '../../../utils/readUtils/addTrash';
import AddFavorite from '../../../utils/readUtils/addFavorite';
import MoreAction from '../moreAction';
import './actionDialog.css';

interface ActionDialogProps {
  mode: string;
  left: number;
  top: number;
  currentBook: any;
  handleReadingBook: (book: any) => void;
  handleDeleteDialog: (isOpen: boolean) => void;
  handleActionDialog: (isOpen: boolean) => void;
  handleEditDialog: (isOpen: boolean) => void;
  handleDetailDialog: (isOpen: boolean) => void;
  handleAddDialog: (isOpen: boolean) => void;
  handleFetchBooks: () => void;
  handleSelectBook: (isSelected: boolean) => void;
  handleSelectedBooks: (books: string[]) => void;
}

const ActionDialog: React.FC<ActionDialogProps> = ({
  mode,
  left,
  top,
  currentBook,
  handleReadingBook,
  handleDeleteDialog,
  handleActionDialog,
  handleEditDialog,
  handleDetailDialog,
  handleAddDialog,
  handleFetchBooks,
  handleSelectBook,
  handleSelectedBooks,
}) => {
  const navigate = useNavigate();
  const [isShowExport, setIsShowExport] = useState(false);
  const [isExceed, setIsExceed] = useState(false);

  const handleDeleteBook = useCallback(() => {
    handleReadingBook(currentBook);
    handleDeleteDialog(true);
    handleActionDialog(false);
  }, [currentBook, handleReadingBook, handleDeleteDialog, handleActionDialog]);

  const handleEditBook = useCallback(() => {
    handleEditDialog(true);
    handleReadingBook(currentBook);
    handleActionDialog(false);
  }, [currentBook, handleEditDialog, handleReadingBook, handleActionDialog]);

  const handleDetailBook = useCallback(() => {
    handleDetailDialog(true);
    handleReadingBook(currentBook);
    handleActionDialog(false);
  }, [currentBook, handleDetailDialog, handleReadingBook, handleActionDialog]);

  const handleAddShelf = useCallback(() => {
    handleAddDialog(true);
    handleReadingBook(currentBook);
    handleActionDialog(false);
  }, [currentBook, handleAddDialog, handleReadingBook, handleActionDialog]);

  const handleRestoreBook = useCallback(() => {
    AddTrash.clear(currentBook.key);
    handleActionDialog(false);
    toast.success('恢复成功');
    handleFetchBooks();
  }, [currentBook, handleActionDialog, handleFetchBooks]);

  const handleLoveBook = useCallback(() => {
    AddFavorite.setFavorite(currentBook.key);
    toast.success('添加成功');
    handleActionDialog(false);
  }, [currentBook, handleActionDialog]);

  const handleMultiSelect = useCallback(() => {
    handleSelectBook(true);
    handleSelectedBooks([currentBook.key]);
    handleActionDialog(false);
  }, [currentBook, handleSelectBook, handleSelectedBooks, handleActionDialog]);

  const handleCancelLoveBook = useCallback(() => {
    AddFavorite.clear(currentBook.key);
    if (Object.keys(AddFavorite.getAllFavorites()).length === 0 && mode === 'favorite') {
      navigate('/manager/empty');
    }
    toast.success('取消成功');
    handleActionDialog(false);
    handleFetchBooks();
  }, [currentBook, mode, handleActionDialog, handleFetchBooks, navigate]);

  const handleMoreAction = useCallback((isShow: boolean) => {
    setIsShowExport(isShow);
  }, []);

  const moreActionProps = {
    left,
    top,
    isShowExport,
    isExceed,
    handleMoreAction,
  };

  if (mode === 'trash') {
    return (
      <div
        className="action-dialog-container"
        onMouseLeave={() => handleActionDialog(false)}
        onMouseEnter={() => handleActionDialog(true)}
        style={{ left, top }}
      >
        <div className="action-dialog-actions-container">
          <div className="action-dialog-add" onClick={handleRestoreBook}>
            <span className="icon-clockwise view-icon"></span>
            <span className="action-name">{'恢复'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="action-dialog-container"
        onMouseLeave={() => handleActionDialog(false)}
        onMouseEnter={() => handleActionDialog(true)}
        style={{ left, top }}
      >
        <div className="action-dialog-actions-container">
          <div
            className="action-dialog-add"
            onClick={() => {
              if (AddFavorite.getAllFavorites().indexOf(currentBook.key) > -1) {
                handleCancelLoveBook();
              } else {
                handleLoveBook();
              }
            }}
          >
            <span className="icon-heart view-icon"></span>
            <p className="action-name">
              {AddFavorite.getAllFavorites().indexOf(currentBook.key) > -1
                ? '从收藏中移除'
                : '添加到收藏'}
            </p>
          </div>
          <div className="action-dialog-add" onClick={handleAddShelf}>
            <span className="icon-bookshelf-line view-icon"></span>
            <p className="action-name">{'添加到书架'}</p>
          </div>
          <div className="action-dialog-add" onClick={handleMultiSelect}>
            <span className="icon-select view-icon"></span>
            <p className="action-name">{'多选'}</p>
          </div>
          <div className="action-dialog-delete" onClick={handleDeleteBook}>
            <span className="icon-trash-line view-icon"></span>
            <p className="action-name">{'删除'}</p>
          </div>
          <div className="action-dialog-edit" onClick={handleEditBook}>
            <span className="icon-edit-line view-icon"></span>
            <p className="action-name">{'编辑'}</p>
          </div>
          <div className="action-dialog-edit" onClick={handleDetailBook}>
            <span className="icon-idea-line view-icon" style={{ fontSize: '17px' }}></span>
            <p className="action-name" style={{ marginLeft: '12px' }}>{'详情'}</p>
          </div>
          <div
            className="action-dialog-edit"
            onMouseEnter={(event) => {
              setIsShowExport(true);
              const x = event.clientX;
              setIsExceed(x > document.body.clientWidth - 300);
            }}
            onMouseLeave={(event) => {
              setIsShowExport(false);
              event.stopPropagation();
            }}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <p className="action-name" style={{ marginLeft: '0px' }}>
              <span
                className="icon-more view-icon"
                style={{
                  display: 'inline-block',
                  marginRight: '12px',
                  marginLeft: '3px',
                  transform: 'rotate(90deg)',
                  fontSize: '12px',
                }}
              ></span>
              {'更多'}
            </p>
            <span className="icon-dropdown icon-export-all" style={{ left: '95px' }}></span>
          </div>
        </div>
      </div>
      <MoreAction {...moreActionProps} />
    </>
  );
};

export default ActionDialog;