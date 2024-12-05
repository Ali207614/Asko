import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Style from './Style';
import Layout from '../../components/Layout';
import { useTranslation } from 'react-i18next';

import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import searchImg from '../../assets/images/search-normal.svg';
import filterImg from '../../assets/images/filter-search.svg';
import arrowDown from '../../assets/images/arrow-down.svg';
import pagination from '../../assets/images/pagination.svg';
import editIcon from '../../assets/images/edit-icon.svg';
import close from '../../assets/images/Close-filter.svg';
import { get } from 'lodash';
import formatterCurrency from '../../helpers/currency';
import moment from 'moment';
import { FadeLoader } from "react-spinners";
import { ConfirmModal, ErrorModal, ConfirmModalOrder, FilterOrderModal } from '../../components/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorNotify, successNotify, warningNotify, limitList, override, statuses } from '../../components/Helper';
import { main } from '../../store/slices';

let url = process.env.REACT_APP_API_URL



const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setFilter } = main.actions;
    const { getMe, getFilter } = useSelector(state => state.main);

    const [showDropdown, setShowDropdown] = useState(false);
    const [limit, setLimit] = useState(get(getFilter, 'limit', 10));
    const [page, setPage] = useState(get(getFilter, 'page', 1));
    const [ts, setTs] = useState(get(getFilter, 'ts', 10));
    const [select, setSelect] = useState(get(getFilter, 'select', []))
    const [search, setSearch] = useState(get(getFilter, 'search', ''))

    const [activeData, setActiveData] = useState(get(getFilter, 'activeData', false));
    const [allPageLength, setAllPageLength] = useState(0);
    const [loading, setLoading] = useState(false)
    const [mainCheck, setMainCheck] = useState(false)
    const [mainData, setMainData] = useState([])

    const [filterProperty, setFilterProperty] = useState(get(getFilter, 'filterProperty', {}))

    const [updateLoading, setUpdateLoading] = useState(false)

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [invoiceDropDown, setInvoiceDropDown] = useState(false);
    let [color, setColor] = useState("#3C3F47");


    const confirmRef = useRef();

    const errorRef = useRef();

    const filterRef = useRef();

    const filterModalRef = useCallback(ref => {
        filterRef.current = ref;
    }, []);

    const confirmModalRef = useCallback(ref => {
        confirmRef.current = ref;
    }, []);

    const getErrorRef = useCallback(ref => {
        errorRef.current = ref;
    }, []);

    const sleepNow = (delay) =>
        new Promise((resolve) => setTimeout(resolve, delay));

    const handleChange = e => {
        const newSearchTerm = e.target.value;
        setSearch(newSearchTerm);
    };

    useEffect(() => {
        dispatch(setFilter({ limit, ts, search, filterProperty, activeData }));
        console.log(Object.values(filterProperty).flat())
    }, [limit, ts, search, filterProperty, activeData])


    useEffect(() => {
        const delay = 1000;
        let timeoutId;

        if (search) {
            timeoutId = setTimeout(() => {
                getOrders({ page: 1, limit, value: search, filterProperty })
                setTs(limit)
                setPage(1);
            }, delay);
        }
        else {
            getOrders({ page: 1, limit, filterProperty, value: search })
            setTs(limit)
            setPage(1);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [search]);



    const subQuery = (prop = {}) => {
        let docDateStart = get(prop, 'DocDate.start', {})
        let docDateEnd = get(prop, 'DocDate.end', {})
        let status = get(prop, 'status', [])
        let list = [
            { name: 'docDateStart', data: docDateStart },
            { name: 'docDateEnd', data: docDateEnd },
            { name: 'statusPay', data: status },
        ].filter(item => get(item, 'data', '').length)
        return {
            link: list.map(item => {
                return `&${get(item, 'name', '')}=${get(item, 'data', '')}`
            }).join(''), status: status.length
        }
    }

    const getOrders = (pagination) => {
        setLoading(true)
        let { link } = subQuery(get(pagination, 'filterProperty', {}))
        // status agar false bo'lsa mongo db bilan ishlaydi agar true bo'lsa to'gridan to'gri sql bilan
        axios
            .get(
                url + `/api/invoices?offset=${get(pagination, 'page', 1)}&limit=${get(pagination, 'limit', limit)}&status=${false}&search=${get(pagination, 'value', '').toLowerCase()}` + link,
                {
                    headers: {
                        'Authorization': `Bearer ${get(getMe, 'token')}`,
                    }
                }
            )
            .then(({ data }) => {
                setLoading(false)
                setMainData(data.map(item => {
                    let total = Number(get(item, 'DocTotal', 0)) - Number(get(item, 'PaidToDate', 0))
                    return { ...item, status: (Number(get(item, 'PaidToDate', 0) == 0 ? 2 : (total == 0 ? 1 : 3))) }
                }))
                setAllPageLength(get(data, '[0].LENGTH', 0))
                setSelect([])
            })
            .catch(err => {
                setLoading(false)

                if (get(err, 'response.status') == 401) {
                    navigate('/login')
                    return
                }

                errorNotify(get(err, 'response.data.message', `Ma'lumot yuklashda xatolik yuz berdi`) || `Ma'lumot yuklashda xatolik yuz berdi`)
            });

        return;
    };







    const filterOrders = () => {
        filterRef.current?.open(filterProperty, setFilterProperty);
    }









    let statuses = {
        1: {
            color: '#FFFFFF', // Oq rang matn uchun
            backgroundColor: '#388E3C', // Yashil rang (To'liq to'langan)
            name: 'Оплачено',
        },
        2: {
            color: '#FFFFFF', // Oq rang matn uchun
            backgroundColor: '#D32F2F', // Qizil rang (Umuman to'lanmagan)
            name: 'Не оплачено',
        },
        3: {
            color: '#FFFFFF', // Oq rang matn uchun
            backgroundColor: '#FFA000', // To'q sariq rang (Chala to'langan)
            name: 'Частично оплачено',
        },
    };

    return (
        <>

            <Style>
                <Layout>
                    <div className='container'>
                        <div className='head'>
                            <div className='left-head d-flex align'>
                                <h3 className='left-title'>Заказы</h3>
                            </div>
                            <div className='right-head'>

                                <div className='right-pagination'>
                                    <p className='pagination-text'><span>{page}-{ts}</span> <span>of {allPageLength}</span> </p>
                                    <button onClick={() => {
                                        if (page > 1) {
                                            getOrders({ page: page - limit, limit, value: search, filterProperty })
                                            setPage(page - limit);
                                            setTs(ts - limit)
                                        }
                                    }} disabled={page == 1} className={`pagination-button left-pagination ${page == 1 ? 'opcity-5' : ''}`}>
                                        <img src={pagination} alt="arrow-button-pagination" />
                                    </button>

                                    <button onClick={() => {
                                        if (ts < allPageLength) {
                                            getOrders({ page: page + limit, limit, value: search, filterProperty })
                                            setPage(page + limit)
                                            setTs(limit + ts)
                                        }
                                    }} disabled={ts >= allPageLength} className={`pagination-button margin-right ${ts >= allPageLength ? 'opcity-5' : ''}`}>
                                        <img src={pagination} alt="arrow-button-pagination" />
                                    </button>
                                </div>
                                <div className='right-input'>
                                    <img className='right-input-img' src={searchImg} alt="search-img" />
                                    <input onChange={handleChange} value={search} type="search" className='right-inp' placeholder='Поиск' />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    {
                                        (Object.values(filterProperty).flat().length) ? (
                                            <button onClick={() => {
                                                setFilterProperty({})
                                                getOrders({ page: 1, limit, value: search })
                                                setPage(1)
                                                setTs(limit)
                                            }} className={`close-btn`}>
                                                <img src={close} alt="close-filter" />
                                            </button>
                                        ) : ''
                                    }

                                    <button onClick={filterOrders} className='right-filter'>
                                        <img className='right-filter-img' src={filterImg} alt="filter-img" />
                                    </button>
                                </div>

                                <div className='right-limit'>
                                    <button onClick={() => setShowDropdown(!showDropdown)} className='right-dropdown'>
                                        <p className='right-limit-text'>{limit}</p>
                                        <img src={arrowDown} className={showDropdown ? "up-arrow" : ""} alt="arrow-down-img" />
                                    </button>
                                    <ul className={`dropdown-menu ${showDropdown ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                                        {
                                            limitList.map((item, i) => {
                                                return (<li key={i} onClick={() => {
                                                    if (limit != item) {
                                                        setLimit(item);
                                                        setPage(1);
                                                        setShowDropdown(false);
                                                        setTs(item)
                                                        getOrders({ page: 1, limit: item, value: search, filterProperty })
                                                        setMainCheck(false)
                                                    }
                                                    return
                                                }} className={`dropdown-li ${limit == item ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{item}</a></li>)
                                            })
                                        }
                                    </ul>
                                </div>


                                <button onClick={() => navigate('/order')} className='btn-head'>
                                    Добавить
                                </button>
                            </div>
                        </div>
                        <div className='table'>
                            <div className='table-head'>
                                <ul className='table-head-list d-flex align  justify'>
                                    {/* <li className='table-head-item'>DocNum</li> */}
                                    <li className='table-head-item  d-flex align '>
                                        <input checked={mainCheck} className='m-right-16 inp-checkbox' onClick={() => {
                                            if (mainCheck) {
                                                setSelect([])
                                            }
                                            else {
                                                setSelect([...mainData.map((item, i) => (i + 1))])
                                            }
                                            setMainCheck(!mainCheck)
                                        }} type="checkbox" name="checkbox" />
                                        Контрагент
                                    </li>
                                    <li className='table-head-item w-70'>Телефон</li>
                                    <li className='table-head-item w-70'>Номер машины</li>
                                    <li className='table-head-item w-70'>Дата регистрации</li>
                                    <li className='table-head-item w-70'>Всего</li>
                                    <li className='table-head-item w-70'>Закрытая сумма</li>
                                    <li className='table-head-item w-70'>Открытая сумма</li>
                                    <li className='table-head-item w-70'>Статус оплаты</li>
                                </ul>
                            </div>
                            <div className='table-body'>
                                {
                                    !loading ? (
                                        <ul className='table-body-list'>
                                            {
                                                mainData.map((item, i) => {
                                                    return (
                                                        <li key={i} className={`table-body-item ${activeData === (i + 1) ? 'active-table' : ''}`}>
                                                            <div className='table-item-head d-flex align  justify'>
                                                                <div className='d-flex align  w-100 p-16'>
                                                                    <input checked={select.find(item => item == (i + 1))} className='m-right-16 inp-checkbox' onClick={(e) => {
                                                                        if (select.find(item => item == (i + 1))) {
                                                                            setSelect([...select.filter(item => item != (i + 1))])
                                                                        }
                                                                        else {
                                                                            setSelect([...select, (i + 1)])
                                                                        }
                                                                    }} type="checkbox" name="checkbox" />
                                                                    <p className='table-body-text truncated-text ' style={{ width: '200px' }} title={get(item, 'CardName', '')} onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                        {get(item, 'CardName', '')}
                                                                    </p>
                                                                </div>


                                                                <div className='w-70 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text '>
                                                                        {get(item, 'Phone1', '') || ''}
                                                                    </p>
                                                                </div>
                                                                <div className='w-70 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text '>
                                                                        {get(item, 'U_car', '') || 'Нет'}
                                                                    </p>
                                                                </div>


                                                                <div className='w-70 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text '>
                                                                        {moment(get(item, 'DocDate', '')).format("DD-MM-YYYY")}
                                                                    </p>
                                                                </div>
                                                                <div className='w-70 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text '>
                                                                        {formatterCurrency(Number(get(item, 'DocTotal', 0)), get(item, 'DocCur', 'USD'))}
                                                                    </p>
                                                                </div>
                                                                <div className='w-70 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text '>
                                                                        {formatterCurrency(Number(get(item, 'PaidToDate', 0)), get(item, 'DocCur', 'USD'))}
                                                                    </p>
                                                                </div>
                                                                <div className='w-70 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text'>
                                                                        {formatterCurrency(Number(get(item, 'DocTotal', 0)) - Number(get(item, 'PaidToDate', 0)), get(item, 'DocCur', 'USD'))}
                                                                    </p>
                                                                </div>
                                                                <div className='w-70 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <button style={{ color: statuses[get(item, 'status', '1')].color, backgroundColor: statuses[get(item, 'status', '1')].backgroundColor }} className='table-body-text status-button'>
                                                                        {statuses[get(item, 'status', '1')].name}
                                                                    </button>
                                                                </div>

                                                            </div>
                                                            <div className='table-item-foot d-flex align'>
                                                                <button className='table-item-btn d-flex align'>
                                                                    <Link className='table-item-text d-flex align' to={(get(item, 'draft') ? `/order/${item.DocEntry}/draft` : `/order/${item.DocEntry}`)}>Просмотреть и изменить заказ  <img src={editIcon} alt="arrow right" /></Link>
                                                                </button>
                                                                {/* invoice */}
                                                                <div className="dropdown-container" >
                                                                    <button onClick={() => {
                                                                        setInvoiceDropDown(!invoiceDropDown)
                                                                        setDropdownOpen(false)
                                                                    }} style={{ width: '110px' }} className='table-item-btn d-flex align table-item-text position-relative'>
                                                                        Накладный <img src={editIcon} alt="arrow-right" />
                                                                    </button>
                                                                    {(invoiceDropDown) && (
                                                                        <ul className="dropdown-menu">
                                                                            {['N1 Накладная', 'N2 Накладная'].map((status, i) => (
                                                                                <li key={i} className={`dropdown-li`}>
                                                                                    <Link to={(get(item, 'draft') ? `/invoice/${item.DocEntry}/draft/${i === 0 ? 'total' : ''}` : `/invoice/${item.DocEntry}/${i === 0 ? 'total' : ''}`)} className="dropdown-item display-b" href="#">
                                                                                        {status}
                                                                                    </Link>
                                                                                </li>
                                                                            ))}

                                                                        </ul>
                                                                    )}
                                                                </div>
                                                                <div className="dropdown-container">
                                                                    <button style={{ width: '110px' }} disabled={updateLoading} className="table-item-btn d-flex align table-item-text position-relative" onClick={() => {
                                                                        setDropdownOpen(!dropdownOpen)
                                                                        setInvoiceDropDown(false)
                                                                    }}>
                                                                        Состояние  {updateLoading ?
                                                                            <div className="spinner-border" role="status">
                                                                                <span className="sr-only">Loading...</span>
                                                                            </div>
                                                                            : <img style={{ marginLeft: '6px' }} src={editIcon} alt="arrow-right" />}
                                                                    </button>
                                                                    {(dropdownOpen) && (
                                                                        <ul className="dropdown-menu">
                                                                            {get(statuses, `${[get(item, 'U_status', '')]}.access`, []).map((status, i) => (
                                                                                <li key={i} onClick={() => {

                                                                                }} className={`dropdown-li ${get(item, 'U_status', '') == status ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{statuses[status].name}</a></li>
                                                                            ))}

                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    ) : <FadeLoader color={color} loading={loading} cssOverride={override} size={100} />
                                }
                            </div>
                        </div>
                    </div>
                    {/* <div className='footer-main'>
                        <div className='footer-info'>
                            <div className="container">
                                <div className='right-head' style={{ justifyContent: 'end' }}>
                                    <div className='footer-block'>
                                        <p className='footer-text'>Сумма сделки : <span className='footer-text-spn'>{formatterCurrency(Number(get(mainData, '[0].ALLDOCTOTAL', 0)), "USD")}</span></p>
                                    </div>
                                    <div className='footer-block'>
                                        <p className='footer-text'>Куб : <span className='footer-text-spn'>{Number(get(mainData, '[0].ALLKUB', 0)).toFixed(4)}</span></p>
                                    </div>
                                    <div className='footer-block'>
                                        <p className='footer-text'>Брутто : <span className='footer-text-spn'>{Number(get(mainData, '[0].ALLBRUTTO', 0)).toFixed(4)}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </Layout>
            </Style>
            <>
                <ToastContainer />
                {/* <ConfirmModalOrder getRef={confirmModalRef} title={"Oshibka"} fn={statusChange} /> */}
                <FilterOrderModal
                    getRef={filterModalRef}
                    filterProperty={filterProperty}
                    setFilterProperty={setFilterProperty}
                    getOrders={getOrders}
                    arg={{ page: 1, limit, value: search }}
                    setPage={setPage}
                    setTs={setTs}
                />
                <ErrorModal
                    getRef={getErrorRef}
                    title={'Ошибка'}
                />
            </>
        </>
    );
};

export default Home;
