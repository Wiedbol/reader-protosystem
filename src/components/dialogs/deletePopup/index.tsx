import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchBooks } from '../../../store/slices/managerSlice';
import DeletePopup from './component';
import { AppDispatch } from '../../../store';

interface DeletePopupProps {
  handleDeletePopup: (isOpen: boolean) => void;
  handleDeleteOperation?: () => void;
  title: string;
  name?: string;
  description: string;
}

const DeletePopupContainer: React.FC<DeletePopupProps> = ({
  handleDeletePopup,
  handleDeleteOperation,
  title,
  name,
  description
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleFetchBooks = () => {
    dispatch(fetchBooks());
  };

  return (
    <DeletePopup
      handleDeletePopup={handleDeletePopup}
      handleDeleteOperation={handleDeleteOperation}
      // handleFetchBooks={handleFetchBooks}
      title={title}
      name={name}
      description={description}
    />
  );
};

export default DeletePopupContainer;