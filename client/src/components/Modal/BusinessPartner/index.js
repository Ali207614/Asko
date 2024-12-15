import React, { memo, useEffect, useState } from 'react';
import Styles from './Styles';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { errorNotify, statuses, warehouseList } from '../../Helper';
import arrowDown from '../../../assets/images/arrow-down.svg';
import CloseFilter from '../../../assets/images/close.svg'
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FadeLoader } from 'react-spinners';
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
    width: "700px",
    padding: 0,
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
const BusinessPartner = ({ getRef }) => {
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState('1'.repeat(20).split('').map(item => {
    return { U_car_name: '', U_car_code: '' }
  }));
  let [color, setColor] = useState("#3C3F47");
  const [partner, setPartner] = useState({ CardCode: '', CardName: "", Phone: '' })

  useEffect(() => {
    const ref = {
      open: (setCustomerDataInvoice, customerDataInvoice) => {
        setIsOpenModal(true);
        console.log([
          ...get(customerDataInvoice, 'Cars', []), // Mavjud mashinalarni qo'shamiz
          ...Array(20 - get(customerDataInvoice, 'Cars', []).length).fill({ U_car_name: '', U_car_code: '' }) // Bo'sh elementlar bilan to'ldiramiz
        ])
        setCars([
          ...get(customerDataInvoice, 'Cars', []), // Mavjud mashinalarni qo'shamiz
          ...Array(20 - get(customerDataInvoice, 'Cars', []).length).fill({ U_car_name: '', U_car_code: '' }) // Bo'sh elementlar bilan to'ldiramiz
        ]);
        setPartner({ CardCode: '', CardName: "", Phone: '' })
      },
      close: () => setIsOpenModal(false),
    };
    getRef(ref);
  }, []);







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
        <div className="card ">
          <button onClick={() => {
            setIsOpenModal(false)
          }} className='close-filter'>
            <img src={CloseFilter} alt="close" />
          </button>
          <div style={{ marginBottom: '20px' }} className='d-flex align  justify'>
            <h3>Business Partner</h3>
            <button className='btn-head'>
              Добавить
            </button>
          </div>
          <div className='d-flex align  justify'>
            <div className='partner-item'>
              <input value={partner.CardName} onChange={(e) => setPartner({ ...partner, CardName: e.target.value })} type="text" className='order-inp' placeholder='CardName' />
            </div>
            <div className='partner-item'>
              <input value={partner.Phone} onChange={(e) => setPartner({ ...partner, Phone: e.target.value })} type="text" className='order-inp' placeholder='Phone1' />
            </div>
            <div className='partner-item'>
              <input value={partner.Phone} onChange={(e) => setPartner({ ...partner, Phone: e.target.value })} type="text" className='order-inp' placeholder='Phone2' />
            </div>
          </div>

          <div className='table' >
            <div className='table-head'>
              <ul className='table-head-list d-flex align  justify'>
                <li className='table-head-item '>N</li>
                <li className='table-head-item '>Название</li>
                <li className='table-head-item '>Номер машина</li>
              </ul>
            </div>
            <div className='table-body'>
              {
                !loading ? (
                  <ul className='table-body-list'>
                    {
                      cars.map((item, i) => {
                        return (
                          <li key={i} className={`table-body-item`}>
                            <div className='table-item-head d-flex align  justify'>
                              <div className='table-item-child p-16'>
                                <p className='table-body-text' >
                                  {i + 1}
                                </p>
                              </div>
                              <div className='table-item-child  p-16' >
                                <input
                                  value={get(item, 'U_car_name', '')}
                                  onChange={(e) => {
                                    cars[i].U_car_name = e.target.value
                                    setCars([...cars])
                                  }}
                                  type="text"
                                  className='table-body-inp'
                                  placeholder='-' />
                              </div>
                              <div className='table-item-child  p-16' >
                                <input
                                  value={get(item, 'U_car_code', '')}
                                  onChange={(e) => {
                                    cars[i].U_car_code = e.target.value
                                    setCars([...cars])
                                  }}
                                  type="text"
                                  className='table-body-inp'
                                  placeholder='-' />
                              </div>
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>) :
                  <FadeLoader color={color} loading={loading} cssOverride={override} size={100} />
              }
            </div>
          </div>
        </div>
      </Styles>
    </Modal>
  );
};

export default memo(BusinessPartner);
