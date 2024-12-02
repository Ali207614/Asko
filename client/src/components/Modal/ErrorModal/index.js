import React, { memo, useEffect, useState } from 'react';
import ErrorModalStyle from './ErrorModalStyle';
import ErrorImage from '../../../assets/images/error.png';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 15,
    border: 'none',
    width: '30%',
  },
  overlay: {
    background: '#0000008D',
  },
};

const ErrorModal = ({ title = '', getRef }) => {
  const { t } = useTranslation();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [titleS, setTitleS] = useState(title);
  useEffect(() => {
    const ref = {
      open: soz => {
        setIsOpenModal(true);
        setTitleS(soz);
      },
      close: () => setIsOpenModal(false),
    };
    getRef(ref);
  }, []);

  return (
    <Modal
      isOpen={isOpenModal}
      onRequestClose={() => setIsOpenModal(false)}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}>
      <ErrorModalStyle>
        <div className="card">
          <div className="cardTop">
            <img src={ErrorImage} alt="error image" className="img" />
            <p className="mainTitle">{t('Ошибка')}</p>
            <p className="title">{titleS}</p>
          </div>
          <div className="cardBottom">
            <button className="btnN" onClick={() => setIsOpenModal(false)}>
              {t('Понятно')}
            </button>
          </div>
        </div>
      </ErrorModalStyle>
    </Modal>
  );
};

export default memo(ErrorModal);
