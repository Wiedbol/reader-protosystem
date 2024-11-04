import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { isElectron } from 'react-device-detect';
import BookModel from '../../models/Book';
import { fetchMD5 } from '../../utils/fileUtils/md5Util';
import RecordRecent from '../../utils/readUtils/recordRecent';
import BookUtil from '../../utils/fileUtils/bookUtil';
import { fetchFileFromPath } from '../../utils/fileUtils/fileUtil';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import ShelfUtil from '../../utils/readUtils/shelfUtil';
import './importLocal.css';
import { ImportLocalProps } from './interface';

declare var window: any;
let clickFilePath = '';

const ImportLocal: React.FC<ImportLocalProps> = ({
  books,
  deletedBooks,
  handleReadingBook,
  handleFetchBooks,
  handleDrag,
  mode,
  shelfIndex,
  isCollapsed,
}) => {
  const navigate = useNavigate();
  const [isOpenFile, setIsOpenFile] = useState(false);
  const [width, setWidth] = useState(document.body.clientWidth);

  useEffect(() => {
    const handleResize = () => setWidth(document.body.clientWidth);
    window.addEventListener('resize', handleResize);

    if (isElectron) {
      setupElectron();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const setupElectron = () => {
    const { ipcRenderer } = window.require('electron');
    if (!localStorage.getItem('storageLocation')) {
      localStorage.setItem('storageLocation', ipcRenderer.sendSync('storage-location', 'ping'));
    }

    const filePath = ipcRenderer.sendSync('get-file-data');
    if (filePath && filePath !== '.') {
      handleFilePath(filePath);
    }

    window.addEventListener('focus', () => {
      const _filePath = ipcRenderer.sendSync('get-file-data');
      if (_filePath && _filePath !== '.') {
        handleFilePath(_filePath);
      }
    });
  };

  const handleFilePath = useCallback(async (filePath: string) => {
    clickFilePath = filePath;
    const file = await fetchFileFromPath(filePath);
    const md5 = await fetchMD5(file);

    const existingBook = [...books, ...deletedBooks].find((item) => item.md5 === md5);
    if (existingBook) {
      handleJump(existingBook);
      return;
    }

    setIsOpenFile(true);
    await getMd5WithBrowser(file);
  }, [books, deletedBooks]);

  const handleJump = useCallback((book: BookModel) => {
    localStorage.setItem('tempBook', JSON.stringify(book));
    BookUtil.RedirectBook(book, navigate);
    navigate('/manager/home');
  }, [navigate]);

  const handleAddBook = useCallback(async (book: BookModel, buffer: ArrayBuffer) => {
    if (isOpenFile) {
      if (StorageUtil.getReaderConfig('isImportPath') !== 'yes' && StorageUtil.getReaderConfig('isPreventAdd') !== 'yes') {
        BookUtil.addBook(book.key, buffer);
      }
      if (StorageUtil.getReaderConfig('isPreventAdd') === 'yes') {
        handleJump(book);
        setIsOpenFile(false);
        return;
      }
    } else if (StorageUtil.getReaderConfig('isImportPath') !== 'yes') {
      BookUtil.addBook(book.key, buffer);
    }

    const updatedBooks = [...books, ...deletedBooks, book];
    handleReadingBook(book);
    RecordRecent.setRecent(book.key);

    try {
      await window.localforage.setItem('books', updatedBooks);
      handleFetchBooks();
      if (mode === 'shelf') {
        const shelfTitles = Object.keys(ShelfUtil.getShelf());
        ShelfUtil.setShelf(shelfTitles[shelfIndex], book.key);
      }
      toast.success('添加成功');
      
      setTimeout(() => {
        if (isOpenFile) {
          handleJump(book);
        }
        if (StorageUtil.getReaderConfig('isOpenInMain') === 'yes' && isOpenFile) {
          setIsOpenFile(false);
          return;
        }
        setIsOpenFile(false);
        navigate('/manager/home');
      }, 100);
    } catch (error) {
      toast.error('导入失败');
    }
  }, [books, deletedBooks, handleReadingBook, handleFetchBooks, mode, shelfIndex, isOpenFile, navigate]);

  const getMd5WithBrowser = useCallback(async (file: File) => {
    const md5 = await fetchMD5(file);
    if (!md5) {
      toast.error('导入失败');
      return;
    }
    
    try {
      await handleBook(file, md5);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleBook = useCallback(async (file: File, md5: string) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const bookName = file.name.slice(0, -(extension.length + 1));

    const isRepeat = [...books, ...deletedBooks].some(
      (item) => item.md5 === md5 && item.size === file.size
    );

    if (isRepeat) {
      toast.error('重复书籍');
      return;
    }

    const fileContent = await file.arrayBuffer();
    let result: BookModel | string;

    try {
      result = await BookUtil.generateBook(
        bookName,
        extension,
        md5,
        file.size,
        clickFilePath,
        fileContent
      );
    } catch (error) {
      console.error(error);
      throw error;
    }

    clickFilePath = '';

    if (result === 'get_metadata_error') {
      toast.error('导入失败');
      return;
    }

    await handleAddBook(result as BookModel, fileContent);
  }, [books, deletedBooks, handleAddBook]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    handleDrag(false);
    for (let item of acceptedFiles) {
      await getMd5WithBrowser(item);
    }
  }, [handleDrag, getMd5WithBrowser]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/x-mobipocket-ebook': ['.mobi', '.azw', '.azw3'],
      'text/html': ['.htm', '.html', '.xhtml', '.mhtml'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'application/x-fictionbook+xml': ['.fb2'],
      'application/x-cbz': ['.cbz'],
      'application/x-cbt': ['.cbt'],
      'application/x-cbr': ['.cbr'],
      'application/x-cb7': ['.cb7'],
    },
    multiple: true,
  });

  return (
    <div
      className="import-from-local"
      {...getRootProps()}
      style={isCollapsed && width < 950 ? { width: '42px' } : {}}
    >
      <div className="animation-mask-local"></div>
      {isCollapsed && width < 950 ? (
        <span className="icon-folder" style={{ fontSize: '15px', fontWeight: 500 }}></span>
      ) : (
        <span>{'导入'}</span>
      )}
      <input {...getInputProps()} />
    </div>
  );
};

export default ImportLocal;