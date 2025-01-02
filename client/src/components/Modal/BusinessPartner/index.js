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
import Spinner from '../../Spinner';
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


let gender = [
  {
    id: '01',
    name: 'Мужской'
  },
  {
    id: '02',
    name: 'Женской'
  },
  {
    id: '03',
    name: 'Нет'
  }
]

const override = {
  position: "absolute",
  left: "50%",
  top: "50%",
};
const BusinessPartner = ({ getRef, setCustomerDataInvoice, customerDataInvoice, setCustomerCode, setCustomer }) => {
  const { t } = useTranslation();
  const { getMe } = useSelector(state => state.main);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showDropDownCarBrand, setShowDropDownCarBrand] = useState([]);
  const [showDropDownCarName, setShowDropDownCarName] = useState([]);

  const [showDropWhere, setShowDropWhere] = useState(false);
  const [whereKnow, setWhereKnow] = useState([]);
  const [carBrandList, serCarBrandList] = useState([]);
  const [carBrandListName, serCarBrandListName] = useState([]);

  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [genderState, setShowGenderState] = useState(false);
  const [cars, setCars] = useState('1'.repeat(20).split('').map(item => {
    return { U_car_name: '', U_car_code: '' }
  }));
  let [color, setColor] = useState("#3C3F47");
  const [partner, setPartner] = useState({ CardCode: '', CardName: "", Phone: '' })


  const [clone, setClone] = useState()

  useEffect(() => {
    const ref = {
      open: (setCustomerDataInvoice, customerDataInvoice, whereKnow, carBrandList, carBrandListName) => {
        setWhereKnow(whereKnow.sort((a, b) => a.FldValue.length - b.FldValue.length))
        serCarBrandList(carBrandList)
        serCarBrandListName(carBrandListName)
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

  function findDifferences(oldCar, newCar) {
    const differences = [];

    for (const newObj of newCar) {
      // Old massivdan bir xil Code bo'yicha obyektni topish
      const oldObj = oldCar.find(o => o?.Code == newObj.Code);

      if (oldObj) {
        // Har bir property ni solishtirish
        let hasDifference = false;
        for (const key in newObj) {
          if (newObj[key] != oldObj[key]) {
            hasDifference = true;
            break; // Birinchi farq topilganda davom ettirish shart emas
          }
        }

        if (hasDifference) {
          differences.push({ ...newObj, status: 'update' }); // O'zgargan obyektni saqlash
        }
      } else {
        // Agar eski massivda bo'lmasa, yangi obyekt hisoblanadi
        differences.push({ ...newObj, status: 'create' });
      }
    }

    return differences;
  }

  let addBusinessPartner = async () => {
    try {
      let cardCode = get(partner, 'CardCode')
      if (
        get(clone, 'CardName') != get(partner, 'CardName') ||
        get(clone, 'Phone1') != get(partner, 'Phone1') ||
        get(clone, 'Phone2') != get(partner, 'Phone2') ||
        get(clone, 'U_dateofbirth') != get(partner, 'U_dateofbirth') ||
        get(clone, 'U_whwerasko') != get(partner, 'U_whwerasko') ||
        get(clone, 'U_gender') != get(partner, 'U_gender')
      ) {
        if (!get(clone, 'CardCode')) {
          let result = await createPartner(partner);
          cardCode = get(result, 'CardCode')
        }
        else {
          await updatePartner(partner);
        }
      }
      if (cardCode) {
        const changedObjects = findDifferences(clone?.Cars || [], cars.filter(item => item.U_car_code || item.U_car_name || item.U_car_km || item.U_marka)).map(item => ({
          ...item,
          U_marka: get(item, 'U_marka', '').toString(),
          U_car_code: item?.U_car_code || '',
          U_car_name: item?.U_car_name || '',
          U_car_km: item?.U_car_km || '',
          U_bp_code: cardCode,
        }));

        if (changedObjects.length) {
          let updates = changedObjects.filter(item => item.status == 'update');
          let creates = changedObjects.filter(item => item.status == 'create');

          if (creates.length) {
            try {
              await Promise.all(creates.map(item => createCars(item)));
            } catch (e) {
              console.error(e, 'Mashinalarni qo‘shishda xatolik yuzaga keldi');
            }
          }

          if (updates.length) {
            try {
              await Promise.all(updates.map(item => updateCars(item)));
            } catch (e) {
              console.error(e, 'Mashinalarni yangilashda xatolik yuzaga keldi');
            }
          }

          await getCars(cardCode);
        }
      }


    } catch (err) {
      console.error(err);
    }
  };

  let updateCars = async (data) => {
    try {
      setUpdateLoading(true)

      await axios.put(url + `/api/cars`, data, {
        headers: {
          'Authorization': `Bearer ${get(getMe, 'token')}`,
        },
      });
      setUpdateLoading(false)

      successNotify("Mashinalar yangilandi");
    } catch (err) {
      setUpdateLoading(false)

      errorNotify("Mashinalarni yangilashda muammo yuzaga keldi");
    }
  };

  let createCars = async (data) => {
    try {
      setUpdateLoading(true)

      await axios.post(url + `/api/cars`, data, {
        headers: {
          'Authorization': `Bearer ${get(getMe, 'token')}`,
        },
      });
      setUpdateLoading(false)

      successNotify("Mashinalar qo‘shildi");
    } catch (err) {
      setUpdateLoading(false)

      errorNotify("Mashinalarni qo‘shishda muammo yuzaga keldi");
    }
  };


  let updatePartner = async (data) => {
    try {
      setUpdateLoading(true)

      await axios.put(url + `/api/business-partner`, data, {
        headers: {
          'Authorization': `Bearer ${get(getMe, 'token')}`,
        },
      });
      setClone({ ...clone, ...data });
      setPartner({ ...partner, ...data });
      setCustomerDataInvoice({ ...partner, ...data })
      successNotify("Business Partner update bo'ldi");
      setUpdateLoading(false)

      return get(data, 'CardCode')
    } catch (err) {
      setUpdateLoading(false)

      errorNotify("Business Partner update qilishda muammo yuzaga keldi");
    }
  };

  let createPartner = async (data) => {
    try {
      setUpdateLoading(true)
      let result = await axios.post(url + `/api/business-partner`, data, {
        headers: {
          'Authorization': `Bearer ${get(getMe, 'token')}`,
        },
      });
      let obj = { ...partner, ...data, ...{ CardCode: get(result, 'data.data.CardCode') } }
      setClone(obj);
      setPartner(obj);
      setCustomerDataInvoice(obj)
      successNotify("Business Partner qo'shildi");
      setCustomerCode(get(result, 'data.data.CardCode'))
      setCustomer(get(result, 'data.data.CardName'))
      setUpdateLoading(false)

      return obj
    } catch (err) {
      setUpdateLoading(false)

      errorNotify("Business Partner qo'shishda muomo yuzaga keldi");
    }
  };

  const getCars = async (cardCode) => {
    try {
      setUpdateLoading(true)

      const { data } = await axios.get(url + `/api/cars?cardCode=${cardCode}`, {
        headers: {
          'Authorization': `Bearer ${get(getMe, 'token')}`,
        },
      });
      setCars([
        ...data, // Mavjud mashinalarni qo'shamiz
        ...Array(20 - data.length).fill({ U_car_name: '', U_car_code: '' }), // Bo'sh elementlar bilan to'ldiramiz
      ]);
      setClone({ ...clone, Cars: data, CardCode: cardCode });
      setPartner({ ...partner, Cars: data, CardCode: cardCode });
      setCustomerDataInvoice({ ...partner, Cars: data, CardCode: cardCode })
      setUpdateLoading(false)

    } catch (err) {
      setUpdateLoading(false)

      errorNotify("Mijozlarning mashinalarini yuklashda muammo yuzaga keldi");
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
        <div className="card ">
          <button onClick={() => {
            setIsOpenModal(false)
          }} className='close-filter'>
            <img src={CloseFilter} alt="close" />
          </button>
          <div style={{ marginBottom: '20px' }} className='d-flex align  justify'>
            <h3>Business Partner</h3>
            <button className='btn-head' onClick={addBusinessPartner}>
              {updateLoading ? <Spinner /> : (get(partner, 'CardCode', '') ? 'Обновить' : 'Добавить')}
            </button>
          </div>
          <div className='d-flex align '>
            <div className='partner-item'>
              <input value={partner.CardName} onChange={(e) => setPartner({ ...partner, CardName: e.target.value })} type="text" className='order-inp' placeholder='CardName' />
            </div>
            <div className='partner-item'>
              <input value={partner.Phone1} onChange={(e) => setPartner({ ...partner, Phone1: e.target.value })} type="text" className='order-inp' placeholder='Phone1' />
            </div>
            <div className='partner-item'>
              <input value={partner.Phone2} onChange={(e) => setPartner({ ...partner, Phone2: e.target.value })} type="text" className='order-inp' placeholder='Phone2' />
            </div>
            <div className='right-limit partner-item' >
              <button style={{ height: '45.78px' }} onClick={() => setShowGenderState(!genderState)} className={`right-dropdown`}>
                <p className='right-limit-text'>{gender.find(item => item.id == get(partner, 'U_gender'))?.name}</p>
                <img src={arrowDown} className={genderState ? "up-arrow" : ""} alt="arrow-down-img" />
              </button>
              <ul style={{ zIndex: 1, top: '48px' }} className={`dropdown-menu  ${(genderState) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                {
                  gender.map((item, ind) => {
                    return (<li key={ind} onClick={() => {
                      if (item.id != get(partner, 'U_gender')) {
                        setPartner({ ...partner, U_gender: item.id });
                      }
                      setShowGenderState(false)
                      return
                    }} className={`dropdown-li ${item.id == get(partner, 'U_gender') ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'name')}</a></li>)
                  })
                }
              </ul>
            </div>

          </div>
          <div style={{ margin: '15px 0px' }} className='d-flex align'>
            <div className='partner-item' >
              <input value={partner.U_dateofbirth} onChange={(e) => setPartner({ ...partner, U_dateofbirth: e.target.value })} type="date" className='order-inp' placeholder='Birthday' />
            </div>

            <div className='right-limit partner-item' >
              <button style={{ height: '45.78px' }} onClick={() => setShowDropWhere(!showDropWhere)} className={`right-dropdown`}>
                <p className='right-limit-text'>{get(partner, 'U_whwerasko', '-')}</p>
                <img src={arrowDown} className={showDropWhere ? "up-arrow" : ""} alt="arrow-down-img" />
              </button>
              <ul style={{ zIndex: 1, top: '48px' }} className={`dropdown-menu  ${(showDropWhere) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                {
                  whereKnow.map((item, ind) => {
                    return (<li key={ind} onClick={() => {
                      if (item.FldValue != get(partner, 'U_whwerasko')) {
                        setPartner({ ...partner, U_whwerasko: item.FldValue });
                      }
                      setShowDropWhere(false)
                      return
                    }} className={`dropdown-li ${item.FldValue == get(partner, 'U_whwerasko') ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'Descr')}</a></li>)
                  })
                }
              </ul>
            </div>




          </div>

          <div className='table' >
            <div className='table-head'>
              <ul className='table-head-list d-flex align  justify'>
                <li className='table-head-item '>N</li>
                <li className='table-head-item '>Марка автомобиля</li>
                <li className='table-head-item '>Название</li>
                <li className='table-head-item '>Номер машина</li>
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
                                <div className='right-limit' >
                                  <button onClick={() => setShowDropDownCarBrand(showDropDownCarBrand === i ? '' : i)} className={`right-dropdown`}>
                                    <p className='right-limit-text'>{carBrandList.find(item => item.FldValue == cars[i]?.U_marka)?.Descr || '-'}</p>
                                    <img src={arrowDown} className={showDropDownCarBrand === i ? "up-arrow" : ""} alt="arrow-down-img" />
                                  </button>
                                  <ul style={{ zIndex: 1 }} className={`dropdown-menu  ${(showDropDownCarBrand === i && carBrandList.length) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                                    {
                                      carBrandList.map((item, ind) => {
                                        return (<li key={ind} onClick={() => {
                                          if (cars[i]?.U_marka != get(item, 'FldValue')) {
                                            const updatedCars = cars.map((car, index) =>
                                              index === i ? { ...car, U_marka: get(item, 'FldValue') } : car
                                            );
                                            setCars(updatedCars);
                                          }
                                          setShowDropDownCarBrand('')
                                          return
                                        }} className={`dropdown-li ${cars[i]?.U_marka === i ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'Descr')}</a></li>)
                                      })
                                    }
                                  </ul>
                                </div>
                              </div>
                              <div className='table-item-child  p-16' >
                                <div className='right-limit' >
                                  <button onClick={() => setShowDropDownCarName(showDropDownCarName === i ? '' : i)} className={`right-dropdown`}>
                                    <p className='right-limit-text'>{cars[i]?.U_car_name?.split('.')[1] || '-'}</p>
                                    <img src={arrowDown} className={showDropDownCarName === i ? "up-arrow" : ""} alt="arrow-down-img" />
                                  </button>
                                  <ul style={{ zIndex: 1 }} className={`dropdown-menu  ${(showDropDownCarName === i && carBrandListName.length) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                                    {
                                      carBrandListName.length ? carBrandListName.filter(item => item.FldValue.toLowerCase().includes(carBrandList.find(el => el.FldValue == cars[i]?.U_marka)?.Descr.toLowerCase())).map((item, ind) => {
                                        console.log(carBrandList.find(el => el.FldValue == cars[i]?.U_marka)?.Descr)

                                        return (<li key={ind} onClick={() => {
                                          if (cars[i]?.U_car_name != get(item, 'FldValue')) {
                                            const updatedCars = cars.map((car, index) =>
                                              index === i ? { ...car, U_car_name: get(item, 'FldValue') } : car
                                            );
                                            setCars(updatedCars);
                                          }
                                          setShowDropDownCarName('')
                                          return
                                        }} className={`dropdown-li ${cars[i]?.U_car_name === i ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'Descr')}</a></li>)
                                      })
                                        : ''}
                                  </ul>
                                </div>
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
                                <input
                                  value={cars[i]?.U_car_km || ''}
                                  onChange={(e) => {
                                    const updatedCars = cars.map((car, index) =>
                                      index === i ? { ...car, U_car_km: e.target.value } : car
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
