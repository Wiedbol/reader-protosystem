import React, { useState, useEffect} from'react';
import "./manager.css"
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router';
import { ManagerProps } from './interface';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import AddFavorite from '../../utils/readUtils/addFavorite';


export function Manager(props: ManagerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    totleBooks: parseInt(StorageUtil.getReaderConfig("totleBooks")) || 0,
    favoriteBooks: Object.keys(AddFavorite.getAllFavorites()).length,
    isAuthed: false,
    isError: false,
    isCopied: false,
    isUpdated: false,
    isDrag: false,
    token: "",
  });

  useEffect(() => {
    props.handleFetchBooks();
    props.handleFetchNotes();
    props.handleFetchBookmarks();
    props.handleFetchBookSortCode();
    props.handleFetchNoteSortCode();
    props.handleFetchList();
    props.handleReadingState(false);
  })
}