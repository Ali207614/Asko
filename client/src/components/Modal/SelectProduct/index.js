import React, { memo, useEffect, useState } from 'react';
import Styles from './Styles';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import api from '../../../api';
import { get } from 'lodash';
import { AiOutlineReload } from 'react-icons/ai';
import colors from '../../../assets/style/colors';

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

const SelectProductModal = ({ getRef, onConfirm = () => { } }) => {
  const { t } = useTranslation();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [index, setIndex] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const ref = {
      open: i => {
        setIsOpenModal(true);
        setIndex(i);
      },
      close: () => setIsOpenModal(false),
    };
    getRef(ref);
    getAllProduct();
  }, []);

  const getAllProduct = () => {
    setIsLoading(true);
    api
      .get(
        `Items?$filter=contains(ItemCode,'${itemCode}') and contains(ItemName,'${itemName}')`,
        {
          headers: {
            Prefer: 'odata.maxpagesize=50',
          },
        },
      )
      .then(res => {
        const resData = get(JSON.parse(res.data), 'value', []);
        setData(resData);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const delay = 1000;
    let timeoutId;

    if (itemName || itemCode) {
      timeoutId = setTimeout(() => {
        getAllProduct();
      }, delay);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [itemName, itemCode]);

  return (
    <Modal
      isOpen={isOpenModal}
      onRequestClose={() => setIsOpenModal(false)}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}>
      <Styles>
        <div className="card">
          <p className="mainTitle"> {t('Mahsulot tanlash')}</p>
          <div className="between">
            <div>
              <input
                className="input"
                placeholder={t('Mahsulot kodi')}
                onChange={v => setItemCode(v.target.value)}
                style={{ marginRight: 10 }}
              />
              <input
                className="input"
                placeholder={t('Mahsulot nomi')}
                onChange={v => setItemName(v.target.value)}
              />
            </div>
          </div>
          <div className="mainConatiner">
            {isLoading ? (
              <div className="loadingCard">
                <AiOutlineReload size={30} color={colors.darkGray} />
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>{t('Mahsulot kodi')}</th>
                    <th>{t('Mahsulot nomi')}</th>
                    <th>{t('Series')}</th>
                    <th>{t('Type')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((v, i) => {
                    return (
                      <tr
                        key={i}
                        className={'bottomTr'}
                        onClick={() => {
                          onConfirm(index, v);
                          setIsOpenModal(false);
                          setItemCode('');
                          setItemName('');
                        }}>
                        <td>{get(v, 'ItemCode', '')}</td>
                        <td>{get(v, 'ItemName', '')}</td>
                        <td>{get(v, 'Series', '')}</td>
                        <td>{get(v, 'PurchaseUnit', '')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Styles>
    </Modal>
  );
};

export default memo(SelectProductModal);
