import React, {memo, useEffect, useState} from 'react';
import Styles from './Styles';
import SuccessImage from '../../../assets/images/warning.png';
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

const LogoutModal = ({getRef, onConfirm = () => {}}) => {
  const {t} = useTranslation();

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
          <img src={SuccessImage} alt="warning image" className="img" />
          <h2> {t('Вы уверены, что хотите выйти')}!</h2>

          <p className="title">{titleS}</p>
          <div className="centerCard">
            <button className="btnN" onClick={() => setIsOpenModal(false)}>
              {t('No')}
            </button>
            <button
              className="btnY"
              onClick={() => {
                setIsOpenModal(false);
                onConfirm();
              }}>
              {t('Yes')}
            </button>
          </div>
        </div>
      </Styles>
    </Modal>
  );
};

export default LogoutModal;
