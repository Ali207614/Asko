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
  const [warehouse, setWarehouse] = useState('-')
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [cloneFilter, setCloneFilter] = useState({});
  useEffect(() => {
    const ref = {
      open: (filt, setFilt) => {
        setIsOpenModal(true);
        setCloneFilter({ ...filt })
      },
      close: () => {
        setIsOpenModal(false)
        return
      },
    };
    getRef(ref);
  }, []);


  const filterOrder = (data) => {
    setFilterProperty({ ...data })
    getOrders({ ...arg, ...{ filterProperty: data } })
    setPage(1)
    setTs(get(arg, 'limit', 10))
    setIsOpenModal(false)
  }

  const isCheck = (id) => {
    let arr = [...cloneFilter?.status || []];
    if (arr.find(item => item == id)) {
      arr = arr.filter(item => item != id)
    }
    else {
      arr.push(id)
    }
    setCloneFilter({ ...cloneFilter, status: [...arr] })
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
        <div className="card df">
          <div className='card-left'>
            <h2 className='card-left-title'>Фильтр</h2>
          </div>
          <div className='card-right' style={{ position: 'relative' }}>
            <button onClick={() => {
              setIsOpenModal(false)
            }} className='close-filter'>
              <img src={CloseFilter} alt="close" />
            </button>
            <div className='card-filter'>
              <div className='filter-manager'>
                <h3 className='filter-title'>Дата заказа</h3>
                <div className='df align justify'>
                  <input value={get(cloneFilter, 'DocDate.start')} onChange={(e) => setCloneFilter({ ...cloneFilter, DocDate: { ...get(cloneFilter, 'DocDate'), start: e.target.value } })} style={{ width: '48%' }} className='filter-inp' type="date" id='manager' />
                  <input value={get(cloneFilter, 'DocDate.end')} onChange={(e) => setCloneFilter({ ...cloneFilter, DocDate: { ...get(cloneFilter, 'DocDate'), end: e.target.value } })} style={{ width: '48%' }} className='filter-inp' type="date" id='manager' />
                </div>
              </div>
              <div className='filter-manager'>
                <h3 className='filter-title'>Состояние</h3>
                <div className='filter-wrapper df'>
                  <label class="container">Все
                    <input type="checkbox" checked={get(cloneFilter, 'status', []).includes('0')} onChange={(e) => isCheck('0')} />
                  </label>
                  <label class="container">Оплачено
                    <input type="checkbox" checked={get(cloneFilter, 'status', []).includes('1')} onChange={(e) => isCheck('1')} />
                  </label>
                  <label class="container">Частично оплачено
                    <input type="checkbox" checked={get(cloneFilter, 'status', []).includes('3')} onChange={(e) => isCheck('3')} />
                  </label>
                  <label class="container">Не оплачено
                    <input type="checkbox" checked={get(cloneFilter, 'status', []).includes('2')} onChange={(e) => isCheck('2')} />
                  </label>
                </div>
              </div>
            </div>
            <div className='card-buttons'>
              <button className='card-btn-filter card-btn-clear' onClick={() => {
                setCloneFilter({})
                getOrders({ ...arg })
                setPage(1)
                setTs(get(arg, 'limit', 10))
                setWarehouse('-')
              }}>Очистить фильтр</button>
              <button className='card-btn-filter' onClick={() => filterOrder(cloneFilter)} >Фильтр</button>
            </div>
          </div>
        </div>
      </Styles>
    </Modal>
  );
};

export default memo(FilterOrderModal);
