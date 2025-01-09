import React, { memo, useEffect, useState } from 'react';
import Styles from './Styles';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { errorNotify, statuses, successNotify, warehouseList, warningNotify } from '../../Helper';
import arrowDown from '../../../assets/images/arrow-down.svg';
import CloseFilter from '../../../assets/images/close.svg'
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FadeLoader } from 'react-spinners';
import { Spinner } from '../..';


import moment from 'moment';
import formatterCurrency from '../../../helpers/currency';
import { Switch } from 'antd';
let url = process.env.REACT_APP_API_URL

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    width: "900px",
    height: "600px",
    padding: `30px 15px`,
    overflow: 'none',
    borderRadius: 0,
    overflow: 'auto'
  },
  overlay: {
    background: '#0000008D',
    zIndex: '1000'
  },
};



const override = {
  position: "absolute",
  left: "50%",
  top: "50%",
};
const ImageModal = ({ getRef }) => {
  const { t } = useTranslation();
  const { getMe } = useSelector(state => state.main);

  const [main, setMain] = useState({})

  const [isOpenModal, setIsOpenModal] = useState(false);


  useEffect(() => {
    const ref = {
      open: async ({ item }) => {
        setIsOpenModal(true)
        setMain(item)
      },
      close: () => {
        setIsOpenModal(false)
      },
    };
    getRef(ref);


  }, []);


  const handleDoubleClick = () => {
    const imageUrl = `${url}/${get(main, 'PicturName')}`;
    window.open(imageUrl, '_blank'); // Yangi vkladkada ochadi
  };


  return (
    <Modal
      isOpen={isOpenModal}
      onRequestClose={() => {
        setIsOpenModal(false)
      }}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}>
      <Styles>
        <div>
          <button onClick={() => {
            setIsOpenModal(false)
          }} className='close-filter'>
            <img src={CloseFilter} alt="close" />
          </button>
        </div>
        <div style={{ display: 'flex' }}>
          {get(main, 'PicturName') && (
            <img
              width={500}
              height={488}
              src={`${url}/${get(main, 'PicturName')}`}
              alt=""
              onDoubleClick={handleDoubleClick} // Double-click event
              style={{ cursor: 'pointer' }} // Ko'rsatkichni o'zgartiradi
            />
          )}
          <p style={{ marginLeft: '20px' }}>{get(main, 'UserText')}</p>
        </div>
      </Styles>
    </Modal>
  );
};

export default memo(ImageModal);
