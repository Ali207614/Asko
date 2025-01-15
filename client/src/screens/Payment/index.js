import React, { useEffect, useState, useRef, useCallback } from 'react';
import Layout from '../../components/Layout';
import { useParams, useLocation } from 'react-router-dom';
import Style from './Style';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { get, isNumber } from 'lodash';
import formatterCurrency from '../../helpers/currency';
import LazyLoad from "react-lazyload";
import { Spinner } from '../../components';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { limitList, errorNotify, warningNotify, successNotify } from '../../components/Helper';
import moment from 'moment';

let url = process.env.REACT_APP_API_URL


const Order = () => {
    const { getMe } = useSelector(state => state.main);

    let { id } = useParams();
    let location = useLocation();
    const navigate = useNavigate();


    const [mainData, setMainData] = useState([])
    const [acctList, setAcctList] = useState([])


    const [state, setState] = useState([])
    const [orderLoading, setOrderLoading] = useState(false)
    const [showAcct, setShowAcct] = useState(false)
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState('')
    const isDisabled = mainData.filter(item => (item?.value || '').trim().length && item?.AcctCode && item?.AcctName).length

    useEffect(() => {
        setMainData('a'.repeat(20).split('').map((el, i) => ({ ...el, i })))
    }, [])




    const getAcct = (acct, i) => {
        if (acct.length == 0) {
            setAcctList([])
            setShowAcct(false)
            return
        }
        axios
            .get(
                url + `/api/getAcct?search=${acct}`,
                {
                    headers: {
                        'Authorization': `Bearer ${get(getMe, 'token')}`,
                    }
                }
            )
            .then(({ data }) => {
                if (data.length) {
                    setAcctList(data.map(el => ({ ...el, ind: i })))
                }
                else {
                    setAcctList([])
                }
                setShowAcct(true)
            })
            .catch(err => {
                setShowAcct(false)
                if (get(err, 'response.status') == 401) {
                    navigate('/login')
                    return
                }
                errorNotify(get(err, 'response.data.message', `Ma'lumot yuklashda xatolik yuz berdi`) || `Ma'lumot yuklashda xatolik yuz berdi`)
            });


        return;
    };

    const addOutgoingPayment = () => {
        setOrderLoading(true)
        let data = mainData.filter(item => (item?.value || '').trim().length && item?.AcctCode && item?.AcctName)
        let sum = data.reduce((a, b) => a + Number(b.value), 0)
        let body = {
            "DocType": "rAccount",
            "CardCode": "94107",
            "CashAccount": "50103",
            "DocCurrency": "UZS",
            "DocObjectCode": "bopot_OutgoingPayments",
            "CashSum": sum,
            "CashSumFC": sum,
            "CashSumSys": sum,
            "PaymentAccounts": data.map(item => {
                return { AccountCode: item.AcctCode, SumPaid: Number(item.value), SumPaidFC: Number(item.value) }
            })
        }

        axios
            .post(
                url + `/api/paymentDrafts`,
                body,
                {
                    headers: {
                        'Authorization': `Bearer ${get(getMe, 'token')}`,
                    }
                }
            )
            .then(({ data }) => {
                setOrderLoading(false)
                successNotify("Ma'lumot muvaffaqiyatli qo'shildi")
            })
            .catch(err => {
                setOrderLoading(false)
                if (get(err, 'response.status') == 401) {
                    navigate('/login')
                    return
                }
                errorNotify(get(err, 'response.data.message', `Ma'lumot yuklashda xatolik yuz berdi`) || `Ma'lumot yuklashda xatolik yuz berdi`)
            });
    }


    return (
        <>
            <Style>
                <Layout>
                    <div className='container'>
                        <div className="order-head">
                            <div className="order-main d-flex align justify">
                                <div className='d-flex align'>
                                    <button onClick={() => navigate('/outgoing')} className='btn-back'>Назад</button>
                                    <h3 className='title-menu'>Исходящий платеж</h3>
                                </div>
                                <button disabled={!isDisabled} onClick={addOutgoingPayment} className={`btn-head position-relative ${!isDisabled ? "opacity-5" : ''}`}>
                                    {orderLoading ? <Spinner /> : 'Добавить'}
                                </button>
                            </div>
                        </div>
                        <div className='table' >
                            <div className='table-head'>
                                <ul className='table-head-list d-flex align  justify'>
                                    <li className='table-head-item w-20'>N</li>
                                    <li className='table-head-item w-100'>Код счета</li>
                                    <li className='table-head-item w-100'>Название счета</li>
                                    <li className='table-head-item w-100'>Всего</li>
                                    <li className='table-head-item w-50'>Валюта</li>
                                    <li className='table-head-item w-50'>Удалить</li>
                                </ul>
                            </div>
                            <div className='table-body'>
                                {
                                    <ul className='table-body-list'>
                                        {
                                            mainData.map((item, i) => {
                                                return (
                                                    <LazyLoad height={65} once>
                                                        <li key={i} className={`table-body-item`}>
                                                            <div className='table-item-head d-flex align  justify'>
                                                                <p className='w-20 p-16'>
                                                                    {item.i + 1}
                                                                </p>
                                                                <div className='w-100 p-16 position-relative' >
                                                                    <input
                                                                        style={{ width: '80%' }}
                                                                        type="search"
                                                                        value={get(item, 'AcctCode', '') || ''}
                                                                        className={`table-body-inp bg-white`}
                                                                        onChange={(e) => {
                                                                            const updatedCars = mainData.map((el) =>
                                                                                el.i === i ? { ...el, AcctCode: e.target.value, AcctName: '' } : el
                                                                            );
                                                                            setMainData(updatedCars.sort((a, b) => a.i - b.i));
                                                                            getAcct(e.target.value, i)
                                                                        }}
                                                                        placeholder="Введите счет"
                                                                    />
                                                                    {(acctList.length && showAcct && acctList[0]?.ind == i) ? (
                                                                        <ul className="dropdown-menu" style={{ top: '49px', zIndex: 1 }}>
                                                                            {acctList.map((customerItem) => (
                                                                                <li onClick={() => {
                                                                                    setShowAcct(false)
                                                                                    const updatedCars = mainData.map((el, index) =>
                                                                                        el.i === i ? { ...el, AcctCode: get(customerItem, 'AcctCode', ''), AcctName: get(customerItem, 'AcctName', '') } : el
                                                                                    );
                                                                                    setMainData(updatedCars.sort((a, b) => a.i - b.i));
                                                                                }} key={i} className={`dropdown-li`}><a className="dropdown-item" href="#">
                                                                                        {get(customerItem, 'AcctCode', '')} - {get(customerItem, 'AcctName', '')}
                                                                                    </a></li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (acctList.length == 0 && showAcct && acctList[0]?.ind == i) ?
                                                                        <ul className="dropdown-menu" style={{ top: '49px', zIndex: 1 }}>
                                                                            <li onClick={() => {
                                                                                setShowAcct(false)
                                                                            }} className={`dropdown-li`}><a className="dropdown-item" href="#">
                                                                                    {'-'}
                                                                                </a></li>
                                                                        </ul> : ''}

                                                                </div>
                                                                <div className='w-100 p-16' >
                                                                    <p className='table-body-text truncated-text w-100' style={{ width: '280px' }} title={get(item, 'AcctName', '')}>
                                                                        {get(item, 'AcctName', '') || '-'}
                                                                    </p>
                                                                </div>

                                                                <div className='w-100 p-16' >
                                                                    <input
                                                                        type="text"
                                                                        value={get(item, 'value', '')
                                                                            ? formatterCurrency(Number(get(item, 'value', '')), "UZS").replace("UZS", "").trim()
                                                                            : ''}
                                                                        className={`table-body-inp bg-white`}
                                                                        onChange={(e) => {
                                                                            const rawValue = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, ''); // Faqat raqamlar
                                                                            const updatedCars = mainData.map((el, index) =>
                                                                                el.i === i ? { ...el, value: rawValue } : el
                                                                            );
                                                                            setMainData(updatedCars.sort((a, b) => a.i - b.i));
                                                                        }}
                                                                        placeholder="Введите число"
                                                                    />
                                                                </div>
                                                                <div className='w-50 p-16' >
                                                                    <p className='table-body-text truncated-text' title={get(item, 'ItemName', '')}>
                                                                        UZS
                                                                    </p>
                                                                </div>
                                                                <div className='w-50 p-16' >
                                                                    <button type="button" className='close-btn'>
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </LazyLoad>
                                                )
                                            })
                                        }
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>

                </Layout>
            </Style>
            <>
                <ToastContainer />
            </>
        </>
    );
};

export default Order;