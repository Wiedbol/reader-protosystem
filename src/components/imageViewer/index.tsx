import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { current } from '@reduxjs/toolkit';
import { ImageViewerProps } from './interface';
import ImageViewer from './component';

interface ImageViewerContainerProps {
  rendition: any;
  isShow: boolean;
  handleLeaveReader: (position: string) => void;
  handleEnterReader: (position: string) => void;
}

const ImageViewerContainer: React.FC<ImageViewerContainerProps> = ({
  rendition,
  isShow,
  handleLeaveReader,
  handleEnterReader,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => ({
    currentBook: state.book.currentBook,
  }))
  const actionCreator = {};
  const props: ImageViewerProps = {
    ...state,
    ...actionCreator,
    rendition,
    isShow,
    handleLeaveReader,
    handleEnterReader,
  }
  return <ImageViewer {...props} />
}

export default ImageViewerContainer;