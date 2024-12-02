import React, { memo, useEffect, useState } from 'react';
import Styles from './Styles';
import confirmImg from '../../../assets/images/confirmRed.svg';
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
    width: "302px",
  },
  overlay: {
    background: '#0000008D',
    zIndex: '1000'
  },
};

const ConfirmModal = ({ getRef, fn }) => {
  const { t } = useTranslation();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [titleS, setTitleS] = useState('');
  useEffect(() => {
    const ref = {
      open: (item) => {
        setIsOpenModal(true);
        setTitleS(item);
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
          <img src={confirmImg} alt="confirm image" className="img" />
          <p className="title">{titleS}</p>
          <div className="centerCard">
            <button className="btn yesBtn" onClick={() => {
              setIsOpenModal(false)
              fn()
            }}>
              Да
            </button>
            <button className="btn noBtn" onClick={() => setIsOpenModal(false)}>
              Нет
            </button>
          </div>
        </div>
      </Styles>
    </Modal>
  );
};

export default memo(ConfirmModal);
