import React from 'react';
import toast from 'react-hot-toast';
import BookUtil from '../../../utils/fileUtils/bookUtil';
import {
  exportDictionaryHistory,
  exportHighlights,
  exportNotes,
} from '../../../utils/syncUtils/exportUtil';
import StorageUtil from '../../../utils/serviceUtils/storageUtil';
import './moreAction.css';
import { MoreActionProps } from './interface';
declare var window: any;

const MoreActionDialog: React.FC<MoreActionProps> = ({
  isShowExport,
  isExceed,
  left,
  top,
  currentBook,
  notes,
  books,
  deletedBooks,
  handleMoreAction,
  handleActionDialog,
}) => {

  const handleExportBook = async () => {
    try {
      const result = await BookUtil.fetchBook(currentBook.key, true, currentBook.path);
      toast.success('导出成功');
      window.saveAs(
        new Blob([result]),
        `${currentBook.name}.${currentBook.format.toLowerCase()}`
      );
    } catch (error) {
      console.error('Error exporting book:', error);
      toast.error('导出失败');
    }
  };

  const handleExportNotes = () => {
    const bookNotes = notes.filter(
      (item) => item.bookKey === currentBook.key && item.notes !== ''
    );
    if (bookNotes.length > 0) {
      exportNotes(bookNotes, [...books, ...deletedBooks]);
      toast.success('导出成功');
    } else {
      toast('导出数据为空');
    }
  };

  const handleExportHighlights = () => {
    const bookHighlights = notes.filter(
      (item) => item.bookKey === currentBook.key && item.notes === ''
    );
    if (bookHighlights.length > 0) {
      exportHighlights(bookHighlights, [...books, ...deletedBooks]);
      toast.success('导出成功');
    } else {
      toast('导出数据为空');
    }
  };

  const handleExportDictionaryHistory = async () => {
    const dictHistory = (await window.localforage.getItem('words')) || [];
    const bookDictHistory = dictHistory.filter(
      (item) => item.bookKey === currentBook.key
    );
    if (bookDictHistory.length > 0) {
      exportDictionaryHistory(dictHistory, [...books, ...deletedBooks]);
      toast.success('导出成功');
    } else {
      toast('导出数据为空');
    }
  };

  const handlePreCache = async () => {
    if (currentBook.format === 'PDF') {
      toast('尚不支持');
      return;
    }
    toast('预缓存中');
    try {
      const result = await BookUtil.fetchBook(currentBook.key, true, currentBook.path);
      const rendition = BookUtil.getRendtion(
        result,
        currentBook.format,
        '',
        currentBook.charset,
        StorageUtil.getReaderConfig('isSliding') === 'yes' ? 'sliding' : ''
      );
      const cache = await rendition.preCache(result);
      if (cache !== 'err') {
        BookUtil.addBook(`cache-${currentBook.key}`, cache);
        toast.success('预缓存成功');
      } else {
        toast.error('预缓存失败');
      }
    } catch (error) {
      console.error('Error pre-caching:', error);
      toast.error('预缓存失败');
    }
  };

  const handleDeletePreCache = async () => {
    try {
      await BookUtil.deleteBook(`cache-${currentBook.key}`);
      toast.success('删除成功');
    } catch (error) {
      console.error('Error deleting pre-cache:', error);
      toast.error('删除失败');
    }
  };

  if (!isShowExport) {
    return null;
  }

  return (
    <div
      className="action-dialog-container"
      onMouseLeave={() => {
        handleMoreAction(false);
        handleActionDialog(false);
      }}
      onMouseEnter={(event) => {
        handleMoreAction(true);
        handleActionDialog(true);
        event?.stopPropagation();
      }}
      style={{
        position: 'fixed',
        left: left + (isExceed ? -195 : 195),
        top: top + 70,
      }}
    >
      <div className="action-dialog-actions-container">
        <div className="action-dialog-edit" style={{ paddingLeft: '0px' }} onClick={handleExportBook}>
          <p className="action-name">{'导出书籍'}</p>
        </div>
        <div className="action-dialog-edit" style={{ paddingLeft: '0px' }} onClick={handleExportNotes}>
          <p className="action-name">{'导出笔记'}</p>
        </div>
        <div className="action-dialog-edit" style={{ paddingLeft: '0px' }} onClick={handleExportHighlights}>
          <p className="action-name">{'导出高亮'}</p>
        </div>
        <div className="action-dialog-edit" style={{ paddingLeft: '0px' }} onClick={handleExportDictionaryHistory}>
          <p className="action-name">{'导出所有查词历史'}</p>
        </div>
        <div className="action-dialog-edit" style={{ paddingLeft: '0px' }} onClick={handlePreCache}>
          <p className="action-name">{'预缓存'}</p>
        </div>
        <div className="action-dialog-edit" style={{ paddingLeft: '0px' }} onClick={handleDeletePreCache}>
          <p className="action-name">{'删除预缓存'}</p>
        </div>
      </div>
    </div>
  );
};

export default MoreActionDialog;