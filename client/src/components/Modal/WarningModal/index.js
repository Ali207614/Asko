import React, { memo, useEffect, useState } from 'react';
import Styles from './Styles';
import SuccessImage from '../../../assets/images/warning.png';
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

const WarningModal = ({ getRef }) => {
  const { t } = useTranslation();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [titleS, setTitleS] = useState('');
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
      <Styles>
        <div className="card">
          <img width={150} height={150} src={SuccessImage} alt="warning image" className="img" />
          <p className="mainTitle">{t('Внимание')}</p>
          <p className="title">{titleS}</p>
          <div className="centerCard">
            <button className="btnY" onClick={() => setIsOpenModal(false)}>
              {t('Понятно')}
            </button>
          </div>
        </div>

      </Styles>
    </Modal>
  );
};

export default memo(WarningModal);
