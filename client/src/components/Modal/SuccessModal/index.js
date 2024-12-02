import React, {memo, useEffect, useState} from 'react';
import SuccessModalStyle from './SuccessModalStyle';
import SuccessImage from '../../../assets/images/success.png';
import Modal from 'react-modal';
import {useTranslation} from 'react-i18next';

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
    width: '40%',
    minHeight: '50%',
  },
  overlay: {
    background: '#0000008D',
  },
};

const SuccessModal = ({title = '', getRef}) => {
  const {t} = useTranslation();

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
      <SuccessModalStyle>
        <div className="card">
          <div className="cardTop">
            <img src={SuccessImage} alt="error image" className="img" />
            <p className="mainTitle">{t('Процесс успешно завершён')}</p>
            <p className="title">{titleS}</p>
          </div>
          <div className="cardBottom">
            <button className="btnN" onClick={() => setIsOpenModal(false)}>
              {t('Понятно')}
            </button>
          </div>
        </div>
      </SuccessModalStyle>
    </Modal>
  );
};

export default SuccessModal;
