import React, { memo, useEffect, useState } from 'react';
import Styles from './Styles';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { errorNotify, statuses, successNotify, warehouseList } from '../../Helper';
import arrowDown from '../../../assets/images/arrow-down.svg';
import CloseFilter from '../../../assets/images/close.svg'
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FadeLoader } from 'react-spinners';
import { Spinner } from '../../../components';


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
    padding: `30px 15px`,
    overflow: 'none',
    borderRadius: 0
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
const IncomingPayment = ({ getRef, getOrders, limit, search, filterProperty }) => {
  const { t } = useTranslation();
  const { getMe } = useSelector(state => state.main);

  const [isOpenModal, setIsOpenModal] = useState(false);


  const [clone, setClone] = useState({})
  const [disCount, setDiscount] = useState([])
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [value, setValue] = useState('');

  const handleChange = nextChecked => {
    setClone({ ...clone, U_flayer2: nextChecked })
    setChecked(nextChecked);
  };
  const handleChange2 = nextChecked => {
    setClone({ ...clone, U_vulkanizatsiya2: nextChecked })
    setChecked2(nextChecked);
  };


  useEffect(() => {
    const ref = {
      open: (data, discount) => {
        setDiscount(discount)
        setIsOpenModal(true)

        setClone({ ...data })
      },
      close: () => {
        setIsOpenModal(false)
      },
    };
    getRef(ref);
  }, []);


  let addInvoice = async () => {
    try {
      setUpdateLoading(true)
      let result = await axios.post(url + `/api/invoices`, { ...clone, value }, {
        headers: {
          'Authorization': `Bearer ${get(getMe, 'token')}`,
        },
      });

      setUpdateLoading(false)
      successNotify("Muvaffaqiyatli qo'shildi")
      getOrders({ page: 1, limit, value: search, filterProperty })
      setIsOpenModal(false)

      return
    } catch (err) {
      setUpdateLoading(false)

      errorNotify("Business Partner qo'shishda muomo yuzaga keldi");
    }
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
        <h3>Входящий платеж</h3>
        <div style={{ marginTop: '20px' }}>
          <div className="order-head-data d-flex align">
            <div>
              <input value={get(clone, 'CardName', '')} disabled={true} type="text" className='order-inp' />
            </div>

            <div className='right-limit' style={{ marginLeft: '20px' }}>
              <button className='right-dropdown'>
                <p className='right-limit-text'>{get(clone, 'U_car', '-') || '-'}</p>
              </button>
            </div>

            <div className='right-limit' style={{ marginLeft: '20px' }}>
              <button style={{ width: '150px' }} className='right-dropdown'>
                <p className='right-limit-text'>{get(clone, 'U_merchantturi', 'Naqd') || 'Naqd'} - {get(clone, 'U_merchantfoizi', 0) || 0} %</p>
              </button>
            </div>

            <div className='right-limit' style={{ marginLeft: '20px' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '7px' }} className='table-head-item'>Flayer - {formatterCurrency(Number(get(disCount.find(item => item.U_name_disc == 'FLAYER'), 'U_sum_disc', 0) || 0), 'UZS')}</span>
                <Switch
                  onChange={handleChange}
                  checked={checked}
                  disabled={get(clone, 'U_flayer') == 'Да'}
                  className="react-switch"
                />
              </label>
            </div>
            <div className='right-limit' style={{ marginLeft: '20px' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '7px' }} className='table-head-item'>Vulkanizatisya - {formatterCurrency(Number(get(disCount.find(item => item.U_name_disc == 'VULKANIZATSIYA'), 'U_sum_disc', 0) || 0), 'UZS')}</span>
                <Switch
                  onChange={handleChange2}
                  checked={checked2}
                  disabled={get(clone, 'U_vulkanizatsiya') == 'Да'}
                  className="react-switch"
                />
              </label>
            </div>
          </div>
        </div>

        <div style={{ margin: '20px 0', display: "flex", alignItems: "center" }}>
          <div className='right-head' style={{ justifyContent: 'end' }}>
            <div className='footer-block' style={{ display: 'inline', background: `#F7F8F9` }}>
              <p style={{ display: 'inline' }} className='footer-text'>Сумма сделки : <span className='footer-text-spn'>{formatterCurrency(Number(get(clone, 'DocTotal', 0) || 0) - (get(clone, 'U_flayer2') ? 30000 : 0), 'UZS')}</span></p>
            </div>
            <div style={{ display: 'inline', margin: '20px 0', background: `#F7F8F9` }} className='footer-block'>
              <p style={{ display: 'inline' }} className='footer-text'>
                Закрытая сумма : <span className='footer-text-spn'>{formatterCurrency(Number(get(clone, 'PaidToDate', 0) || 0) + Number(value), 'UZS')}</span></p>
            </div>
            <div style={{ display: 'inline', background: `#F7F8F9` }} className='footer-block'>
              <p style={{ display: 'inline' }} className='footer-text'>
                Открытая сумма : <span className='footer-text-spn'>{formatterCurrency(Number((get(clone, 'DocTotal', 0) || 0) - (get(clone, 'U_flayer2') ? 30000 : 0)) - get(clone, 'PaidToDate', 0) - value, 'UZS')}</span></p>
            </div>
          </div>
          <div className='d-flex align' style={{ marginLeft: '70px' }}>
            <input
              type="text" // 'search' o'rniga 'text' ishlatiladi, chunki raqamlar va formatlash ustidan boshqaruv kerak.
              value={value}
              disabled={updateLoading}
              className={`table-body-inp bg-white`}
              onChange={(e) => {
                const newValue = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
                setValue(newValue);
              }}
              placeholder="Введите число" // kerakli placeholder
            />


            <button disabled={updateLoading} onClick={addInvoice} style={{ marginLeft: '20px' }} className='btn-head'>
              {updateLoading ? <Spinner /> : `Добавить`}
            </button>
          </div>
        </div>

        <div className='table tab-table'>
          <div className='table-head'>
            <ul className='table-head-list d-flex align justify'>
              <li className='table-head-item w-50'>Код</li>
              <li className='table-head-item w-70'>Продукция</li>
              <li className='table-head-item w-50'>Общая сумма</li>
              <li className='table-head-item w-70'>Количество</li>
            </ul>
          </div>
          <div className='table-body'>
            <ul className='table-body-list'>
              {get(clone, 'Items', []).map((item, i) => (
                <li key={i} className='table-body-item'>
                  <div className='table-item-head d-flex align justify'>
                    <div className='w-50 p-16'>
                      <p className='table-body-text' >
                        {get(item, 'ItemCode', '')}
                      </p>
                    </div>
                    <div className='w-70 p-16' >
                      <p className='table-body-text truncated-text' title={get(item, 'Dscription', '')}>
                        {get(item, 'Dscription', '') || '-'}
                      </p>
                    </div>
                    <div className='w-50 p-16' >
                      <p className='table-body-text 50'>
                        {formatterCurrency(Number(get(item, 'Price', 0)), 'UZS')}
                      </p>
                    </div>
                    <div className='w-70 p-16'>
                      <p className='table-body-text'>
                        <input
                          disabled={true}
                          value={get(item, 'Quantity', '')}
                          type="text"
                          className={`table-body-inp bg-white`}
                          placeholder='-' />
                      </p>
                    </div>

                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Styles>
    </Modal>
  );
};

export default memo(IncomingPayment);
