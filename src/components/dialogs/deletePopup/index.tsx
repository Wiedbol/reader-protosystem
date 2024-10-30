import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchBooks } from '../../../store/slices/managerSlice';
import DeletePopup from './component';

const DeletePopupContainer: React.FC = () => {
  const dispatch = useDispatch();


  const handleFetchBooks = () => {
    dispatch(fetchBooks());
  };

  return (
    <DeletePopup
      
      handleFetchBooks={handleFetchBooks}
    />
  );
};

export default DeletePopupContainer;