import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Style from './Style';
import Layout from '../../components/Layout';
import { useTranslation } from 'react-i18next';

import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import { get } from 'lodash';
import formatterCurrency from '../../helpers/currency';
import moment from 'moment';
import { FadeLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { errorNotify, successNotify, warningNotify, limitList, override, statuses } from '../../components/Helper';
import { main } from '../../store/slices';

let url = process.env.REACT_APP_API_URL



const CashReport = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setMe } = main.actions;

    const { setFilter } = main.actions;
    const { getMe, getFilter } = useSelector(state => state.main);
    let [color, setColor] = useState("#3C3F47");

    const [loading, setLoading] = useState(false)
    const [mainData, setMainData] = useState([])

    useEffect(() => {
        setLoading(true)
        axios
            .get(
                url + `/api/cash-report`,
                {
                    headers: {
                        'Authorization': `Bearer ${get(getMe, 'token')}`,
                    }
                }
            )
            .then(({ data }) => {
                setLoading(false)
                setMainData(data)
            })
            .catch(err => {
                setLoading(false)

                errorNotify(get(err, 'response.data.message', `Ma'lumot yuklashda xatolik yuz berdi`) || `Ma'lumot yuklashda xatolik yuz berdi`)
            });

        return;
    }, [])

    return (
        <>
            <Style>
                <Layout>
                    <div className='container'>
                        <div className='table'>
                            <div className='table-head'>
                                <ul className='table-head-list d-flex align  justify'>
                                    <li className='table-head-item  d-flex align w-100'>
                                        Название счета
                                    </li>
                                    <li className='table-head-item w-70'>Код счета</li>
                                    <li className='table-head-item w-70'>Всего</li>
                                </ul>
                            </div>
                            <div className='table-body'>
                                {
                                    !loading ? (
                                        <ul className='table-body-list'>
                                            {
                                                mainData.map((item, i) => {
                                                    return (
                                                        <li key={i} className={`table-body-item `}>
                                                            <div className='table-item-head d-flex align  justify'>
                                                                <div className=' w-100 p-16'>
                                                                    <p className='table-body-text truncated-text ' style={{ width: '240px' }} title={get(item, 'AcctName', '')}>
                                                                        {get(item, 'AcctName', '')}
                                                                    </p>
                                                                </div>
                                                                <div className='w-70 p-16' >
                                                                    <p className='table-body-text'>
                                                                        {get(item, 'AcctCode', '-') || '-'}
                                                                    </p>
                                                                </div>
                                                                <div className='w-70 p-16' >
                                                                    <p className='table-body-text'>
                                                                        {formatterCurrency(Number(get(item, 'Balance', 0) || 0), 'UZS')}
                                                                    </p>
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

                </Layout>
            </Style>
            <>
                <ToastContainer />
            </>
        </>
    );
};

export default CashReport;
