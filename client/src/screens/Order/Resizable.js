import Style from './Style';
import searchImg from '../../assets/images/search-normal.svg';
import filterImg from '../../assets/images/filter-search.svg';
import arrowDown from '../../assets/images/arrow-down.svg';
import pagination from '../../assets/images/pagination.svg';
import remove from '../../assets/images/remove.svg';
import allRemove from '../../assets/images/close.svg';
import close from '../../assets/images/Close-filter.svg';

import formatterCurrency from '../../helpers/currency';
import 'react-resizable/css/styles.css';
import { memo, useRef } from 'react';


import React, { useState, useEffect, useCallback } from 'react';
import { ResizableBox } from 'react-resizable';
import throttle from 'lodash/throttle';
import { get } from 'lodash';
import { FilterModalResizable } from '../../components/Modal';

const Resizable = ({
    state,
    setState,
    setAllPageLengthSelect,
    allPageLengthSelect,
    setMainData,
    setAllPageLength,
    allPageLength,
    mainData,
    actualData,
    setActualData,
    isEmpty,
    setIsEmpty,
    limitSelect, setLimitSelect,
    pageSelect, setPageSelect,
    tsSelect, setTsSelect,
    filterPropertyResize,
    setFilterPropertyResize,
    filterData,
    customerDataInvoice,
    groups
}) => {
    let limitList = [1, 10, 50, 100, 500, 1000];
    const [height, setHeight] = useState(100);
    const [showDropdownSelect, setShowDropdownSelect] = useState(false);
    const [search, setSearch] = useState('');
    const [show, setShow] = useState(true);

    const pageHeight = window.innerHeight;
    const minTopSpacing = 300;
    const maxHeight = pageHeight - minTopSpacing;

    const filterResizeRef = useRef();

    const filterModalResizeRef = useCallback(ref => {
        filterResizeRef.current = ref;
    }, []);

    function paginateState(arr, perPage, nextPage) {
        return arr.slice(perPage, nextPage);
    }
    const filterOrders = () => {
        filterResizeRef.current?.open(filterData, search);
    }
    const handleResize = useCallback(
        throttle((event, { size }) => {
            setHeight(size.height);
        }, 200),
        []
    );

    const handleChange = (newSearchTerm = '', prop) => {
        setState(actualData.filter(item => {
            if (!(get(item, 'ItemCode', '').toLowerCase().includes(newSearchTerm.toLowerCase()) ||
                get(item, 'ItemName', '').toLowerCase().includes(newSearchTerm.toLowerCase()) ||
                get(item, 'U_model', '-').toLowerCase().includes(newSearchTerm.toLowerCase()))) {
                return false
            }

            if (get(prop, 'Category', '') && get(item, 'U_Kategoriya') != get(prop, 'Category', '')) {
                return false
            }
            if (get(prop, 'GroupCode', '') && get(item, 'ItmsGrpCod') != get(prop, 'GroupCode', '')) {
                return false
            }
            return true
        }
        ))
        setSearch(newSearchTerm);
    };


    const changeValue = (value, itemCode) => {
        let indexAct = actualData.findIndex(el => get(el, 'ItemCode', '') === itemCode);
        let indexState = state.findIndex(el => get(el, 'ItemCode', '') === itemCode);
        if (indexAct >= 0) {
            actualData[indexAct].value = value;
            setActualData([...actualData]);
        }
        if (indexState >= 0) {
            state[indexState].value = value;
            setState([...state]);
        }
        setIsEmpty(false);
    };


    const changeDiscount = (value, itemCode) => {
        let indexAct = actualData.findIndex(el => get(el, 'ItemCode', '') === itemCode);
        let indexState = state.findIndex(el => get(el, 'ItemCode', '') === itemCode);
        if (indexAct >= 0) {
            actualData[indexAct].Discount = value;
            setActualData([...actualData]);
        }
        if (indexState >= 0) {
            state[indexState].Discount = value;
            setState([...state]);
        }
        setIsEmpty(false);
    };

    useEffect(() => {
        console.log(actualData)
        console.log(state)
        if (actualData.length === 0) {
            setSearch('');
        }
    }, [actualData]);


    const inputRefs = useRef([]);
    const inputKarobkaRefs = useRef([]);

    const handleKarobkaKeyDown = (event, index) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault(); // ArrowDown tugmasining default harakatini to'xtatish
            if (index < inputKarobkaRefs.current.length - 1) {
                inputKarobkaRefs.current[index + 1].focus();
                setTimeout(() => {
                    const nextInput = inputKarobkaRefs.current[index + 1];
                    if (nextInput.type === 'number') {
                        const value = nextInput.value; // Hozirgi qiymatini saqlab qo'yamiz
                        nextInput.type = 'text'; // Vaqtinchalik text turiga o'zgartirish
                        nextInput.setSelectionRange(value.length, value.length);
                        nextInput.type = 'number'; // Qayta number turiga o'zgartirish
                        nextInput.value = value; // Qiymatini qaytarish
                    }
                }, 0);
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault(); // ArrowUp tugmasining default harakatini to'xtatish
            if (index > 0) {
                inputKarobkaRefs.current[index - 1].focus();
                setTimeout(() => {
                    const prevInput = inputKarobkaRefs.current[index - 1];
                    if (prevInput.type === 'number') {
                        const value = prevInput.value; // Hozirgi qiymatini saqlab qo'yamiz
                        prevInput.type = 'text'; // Vaqtinchalik text turiga o'zgartirish
                        prevInput.setSelectionRange(value.length, value.length);
                        prevInput.type = 'number'; // Qayta number turiga o'zgartirish
                        prevInput.value = value; // Qiymatini qaytarish
                    }
                }, 0);
            }
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault(); // ArrowDown tugmasining default harakatini to'xtatish
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
                setTimeout(() => {
                    const nextInput = inputRefs.current[index + 1];
                    if (nextInput.type === 'number') {
                        const value = nextInput.value; // Hozirgi qiymatini saqlab qo'yamiz
                        nextInput.type = 'text'; // Vaqtinchalik text turiga o'zgartirish
                        nextInput.setSelectionRange(value.length, value.length);
                        nextInput.type = 'number'; // Qayta number turiga o'zgartirish
                        nextInput.value = value; // Qiymatini qaytarish
                    }
                }, 0);
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault(); // ArrowUp tugmasining default harakatini to'xtatish
            if (index > 0) {
                inputRefs.current[index - 1].focus();
                setTimeout(() => {
                    const prevInput = inputRefs.current[index - 1];
                    if (prevInput.type === 'number') {
                        const value = prevInput.value; // Hozirgi qiymatini saqlab qo'yamiz
                        prevInput.type = 'text'; // Vaqtinchalik text turiga o'zgartirish
                        prevInput.setSelectionRange(value.length, value.length);
                        prevInput.type = 'number'; // Qayta number turiga o'zgartirish
                        prevInput.value = value; // Qiymatini qaytarish
                    }
                }, 0);
            }
        }
    };

    return (
        <Style>
            {actualData.length ? (
                <ResizableBox
                    width={Infinity}
                    height={height}
                    minConstraints={[Infinity, 100]}
                    maxConstraints={[Infinity, maxHeight]}
                    resizeHandles={['n']}
                    onResize={handleResize}
                    axis="y"
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#F7F8F9'
                    }}
                >
                    <div style={{ width: '100%', height: '100%' }}>
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'transparent'
                        }} className="select-items">
                            <div className='container' style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                <div className='right-head select-items-filter' style={{ justifyContent: 'space-between' }}>

                                    <div className='right-head' style={{ justifyContent: 'space-between' }}>
                                        <div className='footer-block'>
                                            <p className='footer-text'>Сумма сделки : <span className='footer-text-spn'>
                                                {
                                                    (state.length ? formatterCurrency(
                                                        state.reduce((a, b) => a + (
                                                            (Number(get(b, 'PriceList.Price', 1) || 1) * Number(get(b, 'value', 1)))), 0)
                                                        , 'UZS') : 0)
                                                }</span></p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex' }}>
                                        <div className='right-pagination'>
                                            <p className='pagination-text'>
                                                <span>{pageSelect}-{tsSelect}</span> <span>of {allPageLengthSelect}</span>
                                            </p>
                                            <button onClick={() => {
                                                if (pageSelect > 1) {
                                                    setPageSelect(pageSelect - limitSelect);
                                                    setTsSelect(tsSelect - limitSelect);
                                                }
                                            }} disabled={pageSelect === 1} className={`pagination-button left-pagination bg-white ${pageSelect === 1 ? 'opcity-5' : ''}`}>
                                                <img src={pagination} alt="arrow-button-pagination" />
                                            </button>
                                            <button onClick={() => {
                                                if (tsSelect < allPageLengthSelect) {
                                                    setPageSelect(pageSelect + limitSelect);
                                                    setTsSelect(limitSelect + tsSelect);
                                                }
                                            }} disabled={tsSelect >= allPageLengthSelect} className={`pagination-button margin-right bg-white ${tsSelect >= allPageLengthSelect ? 'opcity-5' : ''}`}>
                                                <img src={pagination} alt="arrow-button-pagination" />
                                            </button>
                                        </div>
                                        <div className='right-input'>
                                            <img className='right-input-img' src={searchImg} alt="search-img" />
                                            <input onChange={(e) => handleChange(e.target.value, filterPropertyResize)} value={search} type="search" className='right-inp bg-white' placeholder='Поиск' />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            {
                                                (Object.values(filterPropertyResize).length > 1 && get(filterPropertyResize, 'click')) ? (
                                                    <button onClick={() => {
                                                        setFilterPropertyResize({})
                                                        handleChange(search, {})
                                                    }} className={`close-btn`}>
                                                        <img src={close} alt="close-filter" />
                                                    </button>
                                                ) : ''
                                            }
                                            <button onClick={filterOrders} className='right-filter bg-white'>
                                                <img className='right-filter-img' src={filterImg} alt="filter-img" />
                                            </button>
                                        </div>
                                        <div className='right-limit'>
                                            <button onClick={() => setShowDropdownSelect(!showDropdownSelect)} className='right-dropdown bg-white'>
                                                <p className='right-limit-text'>{limitSelect}</p>
                                                <img src={arrowDown} className={showDropdownSelect ? "up-arrow" : ""} alt="arrow-down-img" />
                                            </button>
                                            <ul className={`dropdown-menu bg-white ${showDropdownSelect ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                                                {limitList.map((item, i) => (
                                                    <li key={i} onClick={() => {
                                                        if (limitSelect !== item) {
                                                            setLimitSelect(item);
                                                            setPageSelect(1);
                                                            setShowDropdownSelect(false);
                                                            setTsSelect(item);
                                                        }
                                                    }} className={`dropdown-li ${limitSelect === item ? 'dropdown-active' : ''}`}>
                                                        <a className="dropdown-item" href="#">{item}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className='table tab-table'>
                                    <div className='table-head'>
                                        <ul className='table-head-list d-flex align justify'>
                                            <li className='table-head-item w-50'>Код</li>
                                            <li className='table-head-item w-100'>Продукция</li>
                                            <li className='table-head-item w-50'>Бранд</li>
                                            <li className='table-head-item w-50'>Мера</li>
                                            <li className='table-head-item w-50'>Цена</li>
                                            <li className='table-head-item w-50'>Остаток</li>
                                            <li className='table-head-item w-70'>Количество</li>
                                            <li className='table-head-item w-70'>Скидка</li>
                                            <li className='table-head-item w-47px'>
                                                <button onClick={() => {
                                                    setMainData([...state.map(item => {
                                                        return { ...item, value: '', karobka: '' }
                                                    }), ...mainData]);
                                                    setState([]);
                                                    setActualData([]);
                                                    setAllPageLength(allPageLength + state.length);
                                                    setAllPageLengthSelect(0);
                                                    setLimitSelect(10);
                                                    setPageSelect(1);
                                                    setTsSelect(10);
                                                }} className='table-head-check-btn'>
                                                    <img src={allRemove} alt="tick" />
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='table-body'>
                                        <ul className='table-body-list'>
                                            {paginateState(state, pageSelect - 1, tsSelect).map((item, i) => (
                                                <li key={i} className='table-body-item'>
                                                    <div className='table-item-head d-flex align justify'>
                                                        <div className='w-50 p-16'>
                                                            <p className='table-body-text' >
                                                                {get(item, 'ItemCode', '')}
                                                            </p>
                                                        </div>
                                                        <div className='w-100 p-16' >
                                                            <p className='table-body-text truncated-text' title={get(item, 'ItemName', '')}>
                                                                {get(item, 'ItemName', '') || '-'}
                                                            </p>
                                                        </div>
                                                        <div className='w-50 p-16' >
                                                            <p className='table-body-text truncated-text' title={get(item, 'ItemName', '')}>
                                                                {get(item, 'U_BRAND', '') || '-'}
                                                            </p>
                                                        </div>
                                                        <div className='w-50 p-16' >
                                                            <p className='table-body-text truncated-text' title={get(item, 'ItemName', '')}>
                                                                {get(item, 'U_Measure', '') || '-'}
                                                            </p>
                                                        </div>
                                                        <div className='w-50 p-16' >
                                                            <p className='table-body-text 50'>
                                                                {formatterCurrency(Number(get(item, 'PriceList.Price', 0)), get(item, 'Currency', "USD") || 'USD')}
                                                            </p>
                                                        </div>
                                                        <div className='w-50 p-16' >
                                                            <p className='table-body-text '>
                                                                {Number(get(item, 'OnHand.OnHand', ''))} / <span className='isCommited'>{Number(get(item, 'OnHand.OnHand', '')) - Number(get(item, 'OnHand.IsCommited', ''))}</span>
                                                            </p>
                                                        </div>
                                                        <div className='w-70 p-16'>
                                                            <p className='table-body-text'>
                                                                <input
                                                                    ref={(el) => (inputRefs.current[i] = el)}
                                                                    onKeyDown={(event) => handleKeyDown(event, i)}
                                                                    value={get(item, 'value', '')}
                                                                    onChange={e => {
                                                                        if (/^\d*$/.test(e.target.value)) {
                                                                            changeValue(e.target.value, get(item, 'ItemCode', ''));
                                                                        }
                                                                    }}
                                                                    type="text"
                                                                    className={`table-body-inp bg-white ${(isEmpty && item?.value.length === 0) ? 'borderRed' : ''}`}
                                                                    placeholder='-' />
                                                            </p>
                                                        </div>
                                                        <div className='w-70 p-16'>
                                                            <p className='table-body-text'>
                                                                <input
                                                                    ref={(el) => (inputRefs.current[i] = el)}
                                                                    onKeyDown={(event) => handleKeyDown(event, i)}
                                                                    value={get(item, 'Discount', '')}
                                                                    onChange={e => {
                                                                        if (/^\d*$/.test(e.target.value)) {
                                                                            changeDiscount(e.target.value, get(item, 'ItemCode', ''));
                                                                        }
                                                                    }}
                                                                    type="text"
                                                                    className={`table-body-inp bg-white ${(isEmpty && item?.value.length === 0) ? 'borderRed' : ''}`}
                                                                    placeholder='-' />
                                                            </p>
                                                        </div>
                                                        <div className='w-47px p-16'>
                                                            <button onClick={() => {
                                                                setState([...state.filter(el => get(el, 'ItemCode') !== get(item, 'ItemCode'))]);
                                                                setActualData([...actualData.filter(el => get(el, 'ItemCode') !== get(item, 'ItemCode'))]);
                                                                setMainData([{ ...item, value: '', karobka: '' }, ...mainData]);
                                                                setAllPageLength(allPageLength + 1);
                                                                setAllPageLengthSelect(allPageLengthSelect - 1);
                                                            }} className='table-body-text table-head-check-btn'>
                                                                <img src={remove} alt="add button" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ResizableBox>
            ) : ''}
            <FilterModalResizable
                actualData={actualData}
                getRef={filterModalResizeRef}
                filterProperty={filterPropertyResize}
                setFilterProperty={setFilterPropertyResize}
                limitSelect={limitSelect}
                setLimitSelect={setLimitSelect}
                pageSelect={pageSelect}
                setPageSelect={setPageSelect}
                tsSelect={tsSelect}
                setTsSelect={setTsSelect}
                state={state}
                setState={setState}
                search={search}
                groups={groups}
            />
        </Style>
    );
};

export default Resizable;
