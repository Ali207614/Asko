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
    width: "500px",
    padding: 0,
    overflow: 'none',
    borderRadius: 0
  },
  overlay: {
    background: '#0000008D',
    zIndex: '1000'
  },
};

const FilterModal = ({ getRef, filterProperty, setFilterProperty, getItems, arg, setPage,
  setTs, groups }) => {
  const { t } = useTranslation();
  const [showDropDownWarehouse, setShowDropdownWarehouse] = useState(false)
  const [groupName, setGroupName] = useState(false)
  const [category, setCategory] = useState('-')
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const { getMe } = useSelector(state => state.main);

  useEffect(() => {
    const ref = {
      open: (data) => {
        setIsOpenModal(true);
        setFilterData(data)
      },
      close: () => setIsOpenModal(false),
    };
    getRef(ref);
  }, []);


  const filterOrder = () => {
    setFilterProperty({ ...filterProperty, click: true })
    getItems({ ...arg, filterProperty })
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
                <h3 className='filter-title'>Группа</h3>
                <div className='right-limit' style={{ width: "100%" }}>
                  <button style={{ width: "100%" }} onClick={() => setGroupName(!groupName)} className={`right-dropdown`}>
                    <p className='right-limit-text'>{get(filterProperty, 'Group', '-') || '-'}</p>
                    <img src={arrowDown} className={groupName ? "up-arrow" : ""} alt="arrow-down-img" />
                  </button>
                  <ul style={{ zIndex: 1 }} className={`dropdown-menu  ${(groupName) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                    {
                      [{ ItmsGrpCod: '-', ItmsGrpNam: '' }, ...groups].map((item, i) => {

                        return (<li key={i} onClick={() => {
                          if (get(item, 'ItmsGrpCod', '') == '-') {
                            setGroupName(false)
                            setFilterProperty({ ...filterProperty, Group: '', GroupCode: '' })
                            return
                          }
                          if (get(filterProperty, 'GroupCode', '-') != get(item, 'ItmsGrpCod', '')) {
                            setGroupName(false)
                            setFilterProperty({ ...filterProperty, Group: get(item, 'ItmsGrpNam', ''), GroupCode: get(item, 'ItmsGrpCod', '').toString() })
                            return
                          }
                          return
                        }} className={`dropdown-li ${get(filterProperty, 'GroupCode', '-') == get(item, 'ItmsGrpCod', '') ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'ItmsGrpNam', '')} - {get(item, 'ItmsGrpCod', '')}</a></li>)
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>
            <div className='card-buttons'>
              <button className='card-btn-filter card-btn-clear' onClick={() => {
                getItems({ ...arg })
                setFilterProperty({})
                setPage(1)
                setTs(get(arg, 'limit', 10))
              }}>Очистить фильтр</button>
              <button className='card-btn-filter' onClick={filterOrder} >Фильтр</button>
            </div>
          </div>
        </div>
      </Styles>
    </Modal>
  );
};

export default memo(FilterModal);
