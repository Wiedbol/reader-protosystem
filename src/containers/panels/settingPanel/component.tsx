import React, { useState, useCallback } from 'react';
import ThemeList from '../../../components/readerSettings/themeList';
import SliderList from '../../../components/readerSettings/sliderList';
import DropdownList from '../../../components/readerSettings/dropdownList';
import ModeControl from '../../../components/readerSettings/modeControl';
import SettingSwitch from '../../../components/readerSettings/settingSwitch';
import StorageUtil from '../../../utils/serviceUtils/storageUtil';
import './settingPanel.css';
import { SettingPanelProps } from './interface';


const SettingPanel: React.FC<SettingPanelProps> = () => {
  const [readerMode, setReaderMode] = useState(StorageUtil.getReaderConfig('readerMode') || 'double');
  const [isSettingLocked, setIsSettingLocked] = useState(StorageUtil.getReaderConfig('isSettingLocked') === 'yes');

  const handleLock = useCallback(() => {
    setIsSettingLocked(prev => {
      const newValue = !prev;
      StorageUtil.setReaderConfig('isSettingLocked', newValue ? 'yes' : 'no');
      return newValue;
    });
  }, []);

  return (
    <div className="setting-panel-parent">
      <span
        className={isSettingLocked ? 'icon-lock lock-icon' : 'icon-unlock lock-icon'}
        onClick={handleLock}
      ></span>

      <div className="setting-panel-title">
        {'阅读选项'}
      </div>
      <div className="setting-panel">
        <ModeControl />
        <ThemeList />
        <SliderList
          maxValue={40}
          minValue={13}
          mode="fontSize"
          minLabel="13"
          maxLabel="40"
          step={1}
          title={'字体大小'}
        />
        <SliderList
          maxValue={80}
          minValue={0}
          mode="margin"
          minLabel="0"
          maxLabel="80"
          step={5}
          title={'边距'}
        />
        <SliderList
          maxValue={20}
          minValue={0}
          mode="letterSpacing"
          minLabel="0"
          maxLabel="20"
          step={1}
          title={'文字间距'}
        />
        <SliderList
          maxValue={60}
          minValue={0}
          mode="paraSpacing"
          minLabel="0"
          maxLabel="60"
          step={1}
          title={'段落间距'}
        />
        {readerMode && readerMode !== 'double' && (
          <SliderList
            maxValue={3}
            minValue={0.5}
            mode="scale"
            minLabel="0.5"
            maxLabel="3"
            step={0.1}
            title={'页面宽度'}
          />
        )}
        <SliderList
          maxValue={1}
          minValue={0.3}
          mode="brightness"
          minLabel="0.3"
          maxLabel="1"
          step={0.1}
          title={'亮度'}
        />
        <DropdownList />
        <SettingSwitch />
      </div>
    </div>
  );
};

export default SettingPanel;