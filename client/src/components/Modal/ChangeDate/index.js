import React, {memo, useEffect, useState} from 'react';
import ChangeDateStyle from './ChangeDateStyle';
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
  },
  overlay: {
    background: '#0000008D',
  },
};

const ChangeDate = ({getRef, onConfirm = () => {}, onClose = () => {}}) => {
  const {t} = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dateValue, setDateValue] = useState(false);
  useEffect(() => {
    const ref = {
      open: () => setIsOpenModal(true),
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
      <ChangeDateStyle>
        <div className="card">
          <h2>{t('Изменить дату')}!</h2>
          <input
            type="text"
            placeholder={t('Цена')}
            className="input"
            defaultValue={dateValue}
            onChange={v => setDateValue(v.target.value)}
          />

          <div className="centerCard">
            <button className="btnN" onClick={() => onClose()}>
              {t('Нет')}
            </button>
            <button className="btnY" onClick={() => onConfirm(dateValue)}>
              {t('Да')}
            </button>
          </div>
        </div>
      </ChangeDateStyle>
    </Modal>
  );
};

export default memo(ChangeDate);
