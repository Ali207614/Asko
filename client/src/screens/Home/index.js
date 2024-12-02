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
    const [fnState, setFnState] = useState(false)

    const [filterProperty, setFilterProperty] = useState(get(getFilter, 'filterProperty', {}))

    const [updateLoading, setUpdateLoading] = useState(false)
    const [updateLoadingAll, setUpdateLoadingAll] = useState(false)

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenAll, setDropdownOpenAll] = useState(false);
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
        let creationDateStart = get(prop, 'CreationDate.start', {})
        let creationDateEnd = get(prop, 'CreationDate.end', {})
        let docDateStart = get(prop, 'DocDate.start', {})
        let docDateEnd = get(prop, 'DocDate.end', {})

        let salesPerson = get(prop, 'SalesPerson', [])
        let status = get(prop, 'Status', [])
        let warehouseCode = get(prop, 'WarehouseCode', '')

        let list = [
            { name: 'creationDateStart', data: creationDateStart },
            { name: 'creationDateEnd', data: creationDateEnd },
            { name: 'docDateStart', data: docDateStart },
            { name: 'docDateEnd', data: docDateEnd },
            { name: 'salesPerson', data: salesPerson },
            { name: 'status', data: status },
            { name: 'warehouseCode', data: warehouseCode },
        ].filter(item => get(item, 'data', '').length)
        return {
            link: list.map(item => {
                return `&${get(item, 'name', '')}=${get(item, 'data', '')}`
            }).join(''), status: list.length
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
                setMainData(data)
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

    const deleteDraft = (doc) => {
        setDropdownOpen(false);
        setUpdateLoading(true)
        axios
            .delete(
                url + `/api/draft/${doc}`,
            )
            .then(({ data }) => {
                setMainData([...mainData.filter(item => item.DocEntry != doc)])
                setAllPageLength(allPageLength - 1)
                successNotify("Malumot muvaffaqiyatli o'chirldi")
                setUpdateLoading(false)
                setActiveData(0)
                return
            })
            .catch(err => {
                errorNotify('Xatolik yuz berdi')
                setUpdateLoading(false)
            });
    }

    const addDraft = async (body) => {
        if (get(body, 'schema.CardCode')) {
            await sleepNow(500)
            setDropdownOpen(false);
            setUpdateLoading(true)
            let checkItem = axios
                .get(
                    url + `/api/items-check?items=${get(body, 'schema.DocumentLines', []).map(item => `'${item.ItemCode}'`)}&whsCode=${get(body, 'schema.DocumentLines[0].WarehouseCode', '')}`,
                ).then(({ data }) => {
                    let itemsList = get(data, 'value', [])
                    let isEnough = itemsList.find(el => {
                        let currentItem = get(body, 'schema.DocumentLines', []).find(e => get(e, 'ItemCode') == get(el, 'ItemCode'))
                        return Number(get(el, 'OnHand', '')) - Number(get(el, 'IsCommited', '')) < Number(get(currentItem, 'Quantity'))
                    })
                    if (isEnough) {
                        return { status: true, data: isEnough }
                    }
                }).catch(e => {
                    errorNotify("Tovarlar tekshirishda muommo yuzaga keldi")
                    setUpdateLoading(false)
                    return { status: false }
                })
            let inData = await checkItem
            if (get(inData, 'status')) {
                setUpdateLoading(false)
                errorNotify(`${get(inData, 'data.ItemName')} tovaridan yetarli miqdorda mavjud emas`)
                return
            }



            let link = `/b1s/v1/Orders`
            axios
                .post(
                    url + link,
                    get(body, 'schema', {}),
                    {
                        headers: {
                            info: JSON.stringify({
                                'Cookie': get(getMe, 'Cookie[0]', '') + get(getMe, 'Cookie[1]', ''),
                                'SessionId': get(getMe, 'SessionId', ''),
                            })
                        },
                    }
                )
                .then(({ data }) => {
                    successNotify("Malumot muvaffaqiyatli qo'shildi")
                    axios
                        .delete(
                            url + `/api/draft/${get(body, 'DocEntry')}`,
                        )
                        .then(({ el }) => {
                            let index = mainData.findIndex(item => item.draft && item.DocEntry == get(body, 'DocEntry'))
                            mainData[index] = { ...mainData[index], U_status: 1, DocEntry: get(data, 'DocEntry'), draft: false }
                            setMainData([...mainData])
                            setUpdateLoading(false)
                            setActiveData(0)
                            return
                        })
                        .catch(err => {
                            errorNotify('Xatolik yuz berdi ochirishda')
                            setUpdateLoading(false)
                        });
                })
                .catch(err => {
                    if (get(err, 'response.status') == 401) {
                        navigate('/login')
                        return
                    }
                    setUpdateLoading(false)
                    errorRef.current?.open(get(err, 'response.data.error.message.value', 'Ошибка'));
                });
            return;
        }
        return
    };

    const cancelOrder = (doc) => {
        setDropdownOpen(false);
        setUpdateLoading(true)
        axios
            .post(
                url + `/b1s/v1/Orders(${doc})/Cancel`,
                {},
                {
                    headers: {
                        info: JSON.stringify({
                            'Cookie': get(getMe, 'Cookie[0]', '') + get(getMe, 'Cookie[1]', ''),
                            'SessionId': get(getMe, 'SessionId', ''),
                        })
                    },
                }
            )
            .then(({ data }) => {
                setUpdateLoading(false)
                setActiveData(0)
                setMainData([...mainData.filter(item => item.DocEntry != doc)])
                setAllPageLength(allPageLength - 1)
                successNotify("Malumot muvaffaqiyatli bekor qilindi")
            })
            .catch(err => {
                if (get(err, 'response.status') == 401) {
                    navigate('/login')
                    return
                }
                errorRef.current?.open(get(err, 'response.data.error.message.value', 'Ошибка'));
                setUpdateLoading(false)
            });
    }

    const addInvoice = async (body, doc) => {

        axios
            .post(
                url + `/b1s/v1/Invoices`,
                body,
                {
                    headers: {
                        info: JSON.stringify({
                            'Cookie': get(getMe, 'Cookie[0]', '') + get(getMe, 'Cookie[1]', ''),
                            'SessionId': get(getMe, 'SessionId', ''),
                        })
                    },
                }
            )
            .then(async ({ data }) => {
                // let data2 = await axios
                //   .post(
                //     url_bot + `/api/bot`,
                //     {
                //       docEntry: get(data, 'DocumentLines[0].BaseEntry', ''),
                //       doc: get(data, 'DocEntry', ''),
                //       CardCode: get(body, 'CardCode', '')
                //     },
                //   )
                setUpdateLoading(false)
                setActiveData(0)
                setMainData([...mainData.filter(item => item.DocEntry != doc)])
                setAllPageLength(allPageLength - 1)
                successNotify("Malumot muvaffaqiyatli qo'shildi")
            })
            .catch(err => {
                setUpdateLoading(false)
                errorRef.current?.open(get(err, 'response.data.error.message.value', 'Ошибка'));
            });
    }

    const invoice = (doc) => {
        setDropdownOpen(false);
        setUpdateLoading(true)
        axios
            .get(
                url + `/b1s/v1/Orders(${doc})`,
                {
                    headers: {
                        info: JSON.stringify({
                            'Cookie': get(getMe, 'Cookie[0]', '') + get(getMe, 'Cookie[1]', ''),
                            'SessionId': get(getMe, 'SessionId', ''),
                        })
                    },
                }
            )
            .then(({ data }) => {

                let schema = {
                    "CardCode": get(data, 'CardCode', ''),
                    "DocDate": get(data, 'DocDate'),
                    "DocDueDate": get(data, 'DocDueDate'),
                    "Comments": get(data, 'Comments'),
                    "JournalMemo": `Продажи - ${get(data, 'CardCode', '')}`,
                    "DocumentLines": data.DocumentLines.map((item, i) => {
                        return {
                            "ItemCode": get(item, 'ItemCode', ''),
                            "Quantity": get(item, 'Quantity', 0),
                            "Price": get(item, 'Price', 0),
                            "WarehouseCode": get(item, 'WarehouseCode', ''),
                            "BaseType": 17,
                            "BaseEntry": get(data, 'DocEntry'),
                            "BaseLine": get(item, 'LineNum'),
                            "UnitPrice": get(item, 'UnitPrice'),
                        }
                    })
                }
                addInvoice(schema, doc)
            })
            .catch(err => {
                if (get(err, 'response.status') == 401) {
                    navigate('/login')
                    return
                }
                errorRef.current?.open(get(err, 'response.data.error.message.value', 'Ошибка') + " order");
                setUpdateLoading(false)
            });
    }


    const handleSelect = async (status, docEntry, isDraft = false) => {
        let handleFn = {
            1: {
                name: 'новый',
                fn: () => addDraft
            },
            6: {
                name: 'отменить',
                fn: () => cancelOrder
            },
            7: {
                name: 'удалить',
                fn: () => deleteDraft
            },
            8: {
                name: 'архивировать',
                fn: () => invoice
            }
        };

        if (isDraft && status == 1) {
            confirmRef.current?.open(`Вы уверены, что хотите это добавить ? `, handleFn[status].fn, mainData.find(item => item.DocEntry == docEntry));
            return
        }
        if (handleFn[status]) {
            confirmRef.current?.open(`Вы уверены, что хотите это ${handleFn[status].name} ? `, handleFn[status].fn, docEntry);
            return
        }
        setDropdownOpen(false);
        setUpdateLoading(true)
        axios
            .patch(
                url + `/b1s/v1/Orders(${docEntry})`,
                {
                    U_status: status
                },
                {
                    headers: {
                        info: JSON.stringify({
                            'Cookie': get(getMe, 'Cookie[0]', '') + get(getMe, 'Cookie[1]', ''),
                            'SessionId': get(getMe, 'SessionId', ''),
                        })
                    },
                }
            )
            .then(async ({ data }) => {
                setUpdateLoading(false)
                let index = mainData.findIndex((el => el.DocEntry == docEntry))
                mainData[index].U_status = status
                setMainData([...mainData])

                if (status == '4') {
                    getOrderByDocEntry(docEntry).then((data) => {
                        let sortedData = get(data, 'value', []).sort((a, b) => {
                            const aValue = a.U_prn === null || a.U_prn === 0 || a.U_prn === undefined ? 9999 : a.U_prn;
                            const bValue = b.U_prn === null || b.U_prn === 0 || b.U_prn === undefined ? 9999 : b.U_prn;

                            return aValue - bValue;
                        })

                        setUpdateLoading(false)
                    }).catch(e => {
                        errorNotify(`Get order by DocEntry ${e} 
            400 qator`)
                    })
                }
                successNotify(`Status muvaffaqiyatli o'zgartirildi`)
            })
            .catch(err => {
                setUpdateLoading(false)
                if (get(err, 'response.status') == 401) {
                    navigate('/login')
                    return
                }
                errorNotify(`Status o'zgartirishda xatolik yuz berdi`)
            });
    };

    const statusChange = () => setFnState(true)



    const filterOrders = () => {
        // filterRef.current?.open(filterData);
    }

    const getOrderByDocEntry = (doc) => {
        let link = `/api/order?docEntry=${doc}`
        return axios
            .get(
                url + link ,
            )
            .then(({ data }) => {
                return data
            })
            .catch(err => {
                errorNotify("Telegramga jo'natishda muomo yuzaga keldi")
            });

        return;
    };

    let helperClassName = () => {
        let unq = select.filter(item => mainData[item - 1]?.U_status == mainData[select[0] - 1]?.U_status).length == select.length
        if (select.length && unq && mainData.length) {
            return ''
        }
        return 'opacity-5'
    }

    let helperFunction = async (doc, status) => {
        let handleFn = {
            1: {
                name: 'новый',
                fn: (arg) => addDraft(arg)
            },
            6: {
                name: 'отменить',
                fn: (arg) => cancelOrder(arg)
            },
            7: {
                name: 'удалить',
                fn: (arg) => deleteDraft(arg)
            },
            8: {
                name: 'архивировать',
                fn: (arg) => invoice(arg)
            }
        };

        if (handleFn[status]) {
            if (status == 1) {
                handleFn[status].fn(doc)
            }
            else {
                handleFn[status].fn(doc.DocEntry)
            }
        }
        else {
            setDropdownOpen(false);
            setUpdateLoading(true)
            axios
                .patch(
                    url + `/b1s/v1/Orders(${doc.DocEntry})`,
                    {
                        U_status: status
                    },
                    {
                        headers: {
                            info: JSON.stringify({
                                'Cookie': get(getMe, 'Cookie[0]', '') + get(getMe, 'Cookie[1]', ''),
                                'SessionId': get(getMe, 'SessionId', ''),
                            })
                        },
                    }
                )
                .then(async ({ data }) => {
                    let index = mainData.findIndex((el => el.DocEntry == doc.DocEntry))
                    mainData[index].U_status = status
                    setMainData([...mainData])
                    if (status == '4') {
                        getOrderByDocEntry(doc.DocEntry).then((data) => {
                            let sortedData = get(data, 'value', []).sort((a, b) => {
                                const aValue = a.U_prn === null || a.U_prn === 0 || a.U_prn === undefined ? 9999 : a.U_prn;
                                const bValue = b.U_prn === null || b.U_prn === 0 || b.U_prn === undefined ? 9999 : b.U_prn;

                                return aValue - bValue;
                            })

                        }).catch(e => {
                            errorNotify(`Get order by DocEntry ${e} 
                  400 qator`)
                        })
                    }
                    successNotify(`Status muvaffaqiyatli o'zgartirildi`)
                })
                .catch(err => {
                    errorNotify(`Status o'zgartirishda xatolik yuz berdi`)
                });
        }
    }

    let changeStatus = async ({ select, status }) => {
        let docEntryList = mainData.filter((item, i) => select.includes(i + 1))
        for (let i = 0; i < docEntryList.length; i++) {
            let el = docEntryList[i]
            await helperFunction(el, status)
        }
        await sleepNow(1000)
        setSelect([])
        setMainCheck(false)
        getOrders({ page: 1, limit, filterProperty, value: search })
        setUpdateLoading(false)
    }



    return (
        <>

            <Style>
                <Layout>
                    <div className='container'>
                        <div className='head'>
                            <div className='left-head d-flex align'>
                                <h3 className='left-title'>Заказы</h3>
                                <div className="dropdown-container all-status">
                                    <button style={{ width: '110px' }} disabled={updateLoadingAll} className={`table-item-btn d-flex align table-item-text position-relative ${helperClassName()}`} onClick={() => {
                                        let unq = select.filter(item => mainData[item - 1]?.U_status == mainData[select[0] - 1]?.U_status).length == select.length
                                        if (select.length && unq && mainData.length) {
                                            setDropdownOpenAll(!dropdownOpenAll)
                                            setActiveData(0)
                                        }
                                    }}>
                                        Состояние  {updateLoadingAll ?
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            : <img style={{ marginLeft: '6px' }} src={editIcon} alt="arrow-right" />}
                                    </button>
                                    {(dropdownOpenAll && (select.length ? true : false)) && (
                                        <ul className="dropdown-menu">
                                            {get(statuses, `${[get(mainData, `[${select[0] - 1}].U_status`, '')]}.access`, []).map((status, i) => (
                                                <li key={i} onClick={() => {
                                                    if (status != get(mainData, `[${select[0] - 1}].U_status`, '')) {
                                                        if (status == 1) {
                                                            confirmRef.current?.open(`Вы уверены, что хотите это добавить ? `, () => changeStatus, { select, status });
                                                            return
                                                        }
                                                        if (statuses[status]) {
                                                            confirmRef.current?.open(`Вы уверены, что хотите это ${statuses[status].name} ? `, () => changeStatus, { select, status });
                                                            return
                                                        }
                                                    }
                                                }} className={`dropdown-li ${get(mainData, `[${select[0] - 1}].U_status`, '') == status ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{statuses[status].name}</a></li>
                                            ))}

                                        </ul>
                                    )}
                                </div>
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
                                        (get(subQuery(filterProperty), 'status') && get(filterProperty, 'click')) ? (
                                            <button onClick={() => {
                                                setFilterProperty({ clear: true })
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
                                    <li className='table-head-item d-flex align '>
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
                                    <li className='table-head-item w-50'>Дата создания</li>
                                    <li className='table-head-item w-70'>Сумма сделки</li>
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
                                                                <div className='w-50 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text'>
                                                                        {get(item, 'SlpName', '')}
                                                                    </p>
                                                                </div>
                                                                <div className='w-50 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text '>
                                                                        {moment(get(item, 'DocDate', '')).format("DD-MM-YYYY")}
                                                                    </p>
                                                                </div>

                                                                <div className='w-70 p-16' onClick={() => setActiveData(activeData === i + 1 ? 0 : (i + 1))}>
                                                                    <p className='table-body-text w-70'>
                                                                        {formatterCurrency(Number(get(item, 'DocTotal', 0)), get(item, 'DocCur', 'USD'))}
                                                                    </p>
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
                                                                                    if (status != get(item, 'U_status', '')) {
                                                                                        handleSelect(status, get(item, 'DocEntry', 0), get(item, 'draft'))
                                                                                    }
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
                {/* <ConfirmModalOrder getRef={confirmModalRef} title={"Oshibka"} fn={statusChange} />
                <FilterOrderModal
                    getRef={filterModalRef}
                    filterProperty={filterProperty}
                    setFilterProperty={setFilterProperty}
                    getOrders={getOrders}
                    arg={{ page: 1, limit, value: search }}
                    setPage={setPage}
                    setTs={setTs}
                /> */}
                <ErrorModal
                    getRef={getErrorRef}
                    title={'Ошибка'}
                />
            </>
        </>
    );
};

export default Home;
