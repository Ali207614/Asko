import React, { memo, useEffect, useState } from 'react';
import Styles from './Styles';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import { statuses, warehouseList } from '../../Helper';
import arrowDown from '../../../assets/images/arrow-down.svg';
import CloseFilter from '../../../assets/images/close.svg'
import { get } from 'lodash';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    width: "927px",
    padding: 0,
    overflow: 'none',
    borderRadius: 0
  },
  overlay: {
    background: '#0000008D',
    zIndex: '1000'
  },
};

const FilterOrderModal = ({ getRef, filterProperty, setFilterProperty, getOrders, arg, setPage,
  setTs }) => {
  const { t } = useTranslation();
  const [showDropDownWarehouse, setShowDropdownWarehouse] = useState(false)
  const [warehouse, setWarehouse] = useState('-')
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [filterData, setFilterData] = useState({});
  useEffect(() => {
    const ref = {
      open: (data) => {
        setIsOpenModal(true);
        setFilterData(data)
        console.log(data, ' bu filter data')
      },
      close: () => setIsOpenModal(false),
    };
    getRef(ref);
  }, []);



  const handleCheckboxChangeSalesPerson = (event, slpCode) => {
    if (event.target.checked) {
      setFilterProperty({ ...filterProperty, SalesPerson: [...get(filterProperty, 'SalesPerson', []), slpCode] });
    } else {
      setFilterProperty({ ...filterProperty, SalesPerson: get(filterProperty, 'SalesPerson', []).filter(code => code != slpCode) });
    }
  };

  const handleCheckboxChangeStatus = (event, statusCode) => {
    if (event.target.checked) {
      setFilterProperty({ ...filterProperty, Status: [...get(filterProperty, 'Status', []), statusCode] });
    } else {
      setFilterProperty({ ...filterProperty, Status: get(filterProperty, 'Status', []).filter(code => code != statusCode) });
    }
  };

  const filterOrder = () => {
    setFilterProperty({ ...filterProperty, click: true })
    getOrders({ ...arg, filterProperty })
    setPage(1)
    setTs(get(arg, 'limit', 10))
    setIsOpenModal(false)
  }

  return (
    <Modal
      isOpen={isOpenModal}
      onRequestClose={() => {
        setIsOpenModal(false)
        if (!get(filterProperty, 'click')) {
          setFilterProperty({})
        }
      }}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}>
      <Styles>
        <div className="card df">
          <div className='card-left'>
            <h2 className='card-left-title'>Фильтр</h2>
          </div>
          <div className='card-right' style={{ position: 'relative' }}>
            <button onClick={() => {
              setIsOpenModal(false)
              if (!get(filterProperty, 'click')) {
                setFilterProperty({})
              }
            }} className='close-filter'>
              <img src={CloseFilter} alt="close" />
            </button>
            <div className='card-filter'>
              <div className='filter-manager'>
                <h3 className='filter-title'>Торговый представитель</h3>
                <div className='filter-wrapper df align'>
                  {
                    get(filterData, 'SalesPerson', []).map(item => {
                      return (
                        <div className='df align mr-24 filter-wrapper-inner'>
                          <input checked={get(filterProperty, 'SalesPerson', []).includes(get(item, 'SlpCode'))} onChange={(e) => handleCheckboxChangeSalesPerson(e, get(item, 'SlpCode'))} className='checkbox-filter' type="checkbox" id={get(item, 'SlpCode')} />
                          <label className='checkbox-label' for={get(item, 'SlpCode')}>{get(item, 'SlpName')}</label>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className='filter-manager'>
                <h3 className='filter-title'>Дата заказа</h3>
                <div className='df align justify'>
                  <input value={get(filterProperty, 'DocDate.start')} onChange={(e) => setFilterProperty({ ...filterProperty, DocDate: { ...get(filterProperty, 'DocDate'), start: e.target.value } })} style={{ width: '48%' }} className='filter-inp' type="date" id='manager' />
                  <input value={get(filterProperty, 'DocDate.end')} onChange={(e) => setFilterProperty({ ...filterProperty, DocDate: { ...get(filterProperty, 'DocDate'), end: e.target.value } })} style={{ width: '48%' }} className='filter-inp' type="date" id='manager' />
                </div>
              </div>
              <div className='filter-manager'>
                <h3 className='filter-title'>Дата создания
                </h3>
                <div className='df align justify'>
                  <input value={get(filterProperty, 'CreationDate.start')} onChange={(e) => setFilterProperty({ ...filterProperty, CreationDate: { ...get(filterProperty, 'CreationDate'), start: e.target.value } })} style={{ width: '48%' }} className='filter-inp' type="date" id='manager' />
                  <input value={get(filterProperty, 'CreationDate.end')} onChange={(e) => setFilterProperty({ ...filterProperty, CreationDate: { ...get(filterProperty, 'CreationDate'), end: e.target.value } })} style={{ width: '48%' }} className='filter-inp' type="date" id='manager' />
                </div>
              </div>
              <div className='filter-manager'>
                <h3 className='filter-title'>Состояние</h3>
                <div className='filter-wrapper df align'>
                  {
                    get(filterData, 'Status', []).map(item => {
                      return (
                        <div className='df align mr-24 filter-wrapper-inner'>
                          <input checked={get(filterProperty, 'Status', []).includes(get(item, 'U_status', ''))} onChange={(e) => handleCheckboxChangeStatus(e, get(item, 'U_status', ''))} className='checkbox-filter' type="checkbox" id={statuses[get(item, 'U_status', '')]?.name} />
                          <label className='checkbox-label' for={statuses[get(item, 'U_status', '')]?.name}>{statuses[get(item, 'U_status', '')]?.name}</label>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className='filter-manager'>
                <h3 className='filter-title'>Склад</h3>
                <div className='right-limit' style={{ width: "110px" }}>
                  <button style={{ width: "110px" }} onClick={() => setShowDropdownWarehouse(!showDropDownWarehouse)} className={`right-dropdown`}>
                    <p className='right-limit-text'>{get(filterProperty, 'WarehouseCode', '-') || '-'}</p>
                    <img src={arrowDown} className={showDropDownWarehouse ? "up-arrow" : ""} alt="arrow-down-img" />
                  </button>
                  <ul style={{ zIndex: 1 }} className={`dropdown-menu  ${(showDropDownWarehouse) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                    {
                      ['-', ...warehouseList, 'B-X'].map((item, i) => {
                        return (<li key={i} onClick={() => {
                          if (item == '-') {
                            setWarehouse(item);
                            setShowDropdownWarehouse(false)
                            setFilterProperty({ ...filterProperty, WarehouseCode: '' })
                            return
                          }
                          if (warehouse != item) {
                            setWarehouse(item);
                            setShowDropdownWarehouse(false)
                            setFilterProperty({ ...filterProperty, WarehouseCode: item })
                            return
                          }
                          return
                        }} className={`dropdown-li ${warehouse == item ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{item}</a></li>)
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div className='card-buttons'>
              <button className='card-btn-filter card-btn-clear' onClick={() => {
                setFilterProperty({})
                getOrders({ ...arg })
                setPage(1)
                setTs(get(arg, 'limit', 10))
                setWarehouse('-')
              }}>Очистить фильтр</button>
              <button className='card-btn-filter' onClick={filterOrder} >Фильтр</button>
            </div>
          </div>
        </div>
      </Styles>
    </Modal>
  );
};

export default memo(FilterOrderModal);
