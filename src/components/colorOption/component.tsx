import React, { useState, useCallback } from 'react';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import './colorOption.css';
import { ColorProps } from './interface';


const ColorOption: React.FC<ColorProps> = ({ color, handleColor, handleDigest }) => {
  const [isLine, setIsLine] = useState(color > 3);

  const handleChangeOption = useCallback(() => {
    setIsLine(prevIsLine => !prevIsLine);
  }, []);

  const handleColorClick = useCallback((index: number) => {
    handleColor(index);
    StorageUtil.setReaderConfig('highlightIndex', index.toString());
    setTimeout(() => {
      handleDigest();
    }, 100);
  }, [handleColor, handleDigest]);

  const renderLine = () => {
    return ['#FF0000', '#000080', '#0000FF', '#2EFF2E'].map((item, index) => (
      <div
        className="line-option"
        style={{
          border: `${color === index + 4 ? '' : '2px'}`,
        }}
        key={item}
        onClick={() => handleColorClick(index + 4)}
      >
        <div
          className="demo-line"
          style={{ borderBottom: `solid 2px ${item}` }}
        ></div>
      </div>
    ));
  };

  const renderColor = () => {
    return ['#FBF1D1', '#EFEEB0', '#CAEFC9', '#76BEE9'].map((item, index) => (
      <div
        className="color-option"
        style={{
          backgroundColor: item,
          border: `${color === index ? '' : '0px'}`,
        }}
        key={item}
        onClick={() => handleColorClick(index)}
      ></div>
    ));
  };

  return (
    <div className="color-option-container">
      {!isLine && renderColor()}
      <span
        className="icon-sort popup-color-more"
        onClick={handleChangeOption}
      ></span>
      {isLine && renderLine()}
    </div>
  );
};

export default ColorOption;