import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'react-lottie';
import copy from 'copy-text-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
import { getParamsFromUrl } from '../../utils/syncUtils/common';
import StorageUtil from '../../utils/serviceUtils/storageUtil';
import animationSuccess from '../../assets/lotties/success.json';
import './manager.css';
import { RedirectProps } from './interface';


const successOptions = {
  loop: false,
  autoplay: true,
  animationData: animationSuccess,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const Redirect: React.FC<RedirectProps> = ({ handleLoadingDialog }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthed, setIsAuthed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [token, setToken] = useState('');

  const handleFinish = useCallback(() => {
    handleLoadingDialog(false);
    alert('数据恢复成功');
  }, [handleLoadingDialog]);

  const showMessage = useCallback((message: string) => {
    toast(message);
  }, []);

  useEffect(() => {
    const url = document.location.href;
    if (location.hash === '#/' && url.indexOf('code') === -1) {
      navigate('/manager/home');
    }
    if (url.indexOf('error') > -1) {
      setIsError(true);
      return;
    }
    if (url.indexOf('code') > -1) {
      const params: any = getParamsFromUrl();
      setToken(params.code);
      setIsAuthed(true);
      return;
    }
    if (url.indexOf('access_token') > -1) {
      const params: any = getParamsFromUrl();
      setToken(params.access_token);
      setIsAuthed(true);
      return;
    }
  }, [navigate]);

  const handleCopyToken = useCallback(() => {
    copy(token);
    setIsCopied(true);
  }, [token]);

  if (isError || isAuthed) {
    return (
      <div className="backup-page-finish-container">
        <div className="backup-page-finish">
          {isAuthed ? (
            <Lottie options={successOptions} height={80} width={80} />
          ) : (
            <span className="icon-close auth-page-close-icon"></span>
          )}

          <div className="backup-page-finish-text">
            {isAuthed ? ('授权成功') : ('授权失败')}
          </div>
          {isAuthed && (
            <div
              className="token-dialog-token-text"
              onClick={handleCopyToken}
            >
              {isCopied ? ('已复制') : ('复制令牌')}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="manager">
      <div className="empty-page-info-container" style={{ margin: 100 }}>
        <div className="empty-page-info-main">
          {("你好像迷路了")}
        </div>
        <div
          className="empty-page-info-sub"
          onClick={() => navigate('/manager/home')}
          style={{ marginTop: 10, cursor: 'pointer' }}
        >
          {('回到首页')}
        </div>
      </div>
      <img
        src={
          StorageUtil.getReaderConfig('appSkin') === 'night' ||
          (StorageUtil.getReaderConfig('appSkin') === 'system' &&
            StorageUtil.getReaderConfig('isOSNight') === 'yes')
            ? './assets/empty_light.svg'
            : './assets/empty.svg'
        }
        alt=""
        className="empty-page-illustration"
      />
      <Toaster />
    </div>
  );
};

export default Redirect;