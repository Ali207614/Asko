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
    width: "900px",
    padding: 0,
    overflow: 'none',
    borderRadius: 0
  },
  overlay: {
    background: '#0000008D',
    zIndex: '1000'
  },
};
let carBrand = ['Chevrolet', 'Toyota', 'Volkswagen', 'Mercedes-Benz', 'BMW', 'Tesla', 'Honda', 'Ford', 'Hyundai', 'Nissan', 'BYD'].map((item, i) => {
  return { id: i + 1, name: item }
})

const override = {
  position: "absolute",
  left: "50%",
  top: "50%",
};
const BusinessPartner = ({ getRef }) => {
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showDropDownCarBrand, setShowDropDownCarBrand] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState('1'.repeat(20).split('').map(item => {
    return { U_car_name: '', U_car_code: '' }
  }));
  let [color, setColor] = useState("#3C3F47");
  const [partner, setPartner] = useState({ CardCode: '', CardName: "", Phone: '' })


  const [clone, setClone] = useState()

  useEffect(() => {
    const ref = {
      open: (setCustomerDataInvoice, customerDataInvoice) => {
        setIsOpenModal(true);
        setCars([
          ...get(customerDataInvoice, 'Cars', []), // Mavjud mashinalarni qo'shamiz
          ...Array(20 - get(customerDataInvoice, 'Cars', []).length).fill({ U_car_name: '', U_car_code: '' }) // Bo'sh elementlar bilan to'ldiramiz
        ]);
        setClone({ ...customerDataInvoice })
        setPartner({ ...customerDataInvoice })
      },
      close: () => {
        setIsOpenModal(false)
        setShowDropDownCarBrand('')
      },
    };
    getRef(ref);
  }, []);



  let addBusinessPartner = () => {
    if (get(clone, 'CardName') != get(partner, 'CardName') || get(clone, 'Phone1') != get(partner, 'Phone1') || get(clone, 'Phone2') != get(partner, 'Phone2')) {
      console.log('partnerga boradi')
    }

    console.log(cars.filter(item => item.U_car_code || item.U_car_name))
    console.log(clone.Cars)

  }



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
            <button className='btn-head' onClick={addBusinessPartner}>
              {get(partner, 'CardCode', '') ? 'Обновить' : 'Добавить'}
            </button>
          </div>
          <div className='d-flex align  justify'>
            <div className='partner-item'>
              <input value={partner.CardName} onChange={(e) => setPartner({ ...partner, CardName: e.target.value })} type="text" className='order-inp' placeholder='CardName' />
            </div>
            <div className='partner-item'>
              <input value={partner.Phone1} onChange={(e) => setPartner({ ...partner, Phone1: e.target.value })} type="text" className='order-inp' placeholder='Phone1' />
            </div>
            <div className='partner-item'>
              <input value={partner.Phone2} onChange={(e) => setPartner({ ...partner, Phone2: e.target.value })} type="text" className='order-inp' placeholder='Phone2' />
            </div>
          </div>

          <div className='table' >
            <div className='table-head'>
              <ul className='table-head-list d-flex align  justify'>
                <li className='table-head-item '>N</li>
                <li className='table-head-item '>Название</li>
                <li className='table-head-item '>Номер машина</li>
                <li className='table-head-item '>Марка автомобиля</li>
                <li className='table-head-item '>Пробег автомобиля</li>
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
                                  value={cars[i]?.U_car_name || ''}
                                  onChange={(e) => {
                                    const updatedCars = cars.map((car, index) =>
                                      index === i ? { ...car, U_car_name: e.target.value } : car
                                    );
                                    setCars(updatedCars);
                                  }}
                                  type="text"
                                  className='table-body-inp'
                                  placeholder='-' />
                              </div>

                              <div className='table-item-child  p-16' >
                                <input
                                  value={cars[i]?.U_car_code || ''}
                                  onChange={(e) => {
                                    const updatedCars = cars.map((car, index) =>
                                      index === i ? { ...car, U_car_code: e.target.value } : car
                                    );
                                    setCars(updatedCars);
                                  }}
                                  type="text"
                                  className='table-body-inp'
                                  placeholder='-' />
                              </div>
                              <div className='table-item-child  p-16' >
                                <div className='right-limit' >
                                  <button onClick={() => setShowDropDownCarBrand(showDropDownCarBrand === i ? '' : i)} className={`right-dropdown`}>
                                    <p className='right-limit-text'>{carBrand.find(item => item.id == cars[i]?.U_MARKA)?.name || '-'}</p>
                                    <img src={arrowDown} className={showDropDownCarBrand === i ? "up-arrow" : ""} alt="arrow-down-img" />
                                  </button>
                                  <ul style={{ zIndex: 1 }} className={`dropdown-menu  ${(showDropDownCarBrand === i && carBrand.length) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                                    {
                                      carBrand.map((item, ind) => {
                                        return (<li key={ind} onClick={() => {
                                          if (cars[i]?.U_MARKA != get(item, 'id')) {
                                            const updatedCars = cars.map((car, index) =>
                                              index === i ? { ...car, U_MARKA: get(item, 'id') } : car
                                            );
                                            setCars(updatedCars);
                                          }
                                          setShowDropDownCarBrand('')
                                          return
                                        }} className={`dropdown-li ${cars[i]?.U_MARKA === i ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'name')}</a></li>)
                                      })
                                    }
                                  </ul>
                                </div>
                                {/* <input
                                  value={cars[i]?.U_MARKA || ''}
                                  onChange={(e) => {
                                    const updatedCars = cars.map((car, index) =>
                                      index === i ? { ...car, U_MARKA: e.target.value } : car
                                    );
                                    setCars(updatedCars);
                                  }}
                                  type="text"
                                  className='table-body-inp'
                                  placeholder='-' /> */}
                              </div>
                              <div className='table-item-child  p-16' >
                                <input
                                  value={cars[i]?.U_km || ''}
                                  onChange={(e) => {
                                    const updatedCars = cars.map((car, index) =>
                                      index === i ? { ...car, U_km: e.target.value } : car
                                    );
                                    setCars(updatedCars);
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
