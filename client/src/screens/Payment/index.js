// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import Layout from '../../components/Layout';
// import { useParams, useLocation } from 'react-router-dom';
// import Style from './Style';
// import { useNavigate } from 'react-router-dom';
// import searchImg from '../../assets/images/search-normal.svg';
// import filterImg from '../../assets/images/filter-search.svg';
// import arrowDown from '../../assets/images/arrow-down.svg';
// import pagination from '../../assets/images/pagination.svg';
// import tickSquare from '../../assets/images/tick-square.svg';
// import add from '../../assets/images/add.svg';
// import close from '../../assets/images/Close-filter.svg';
// import axios from 'axios';
// import { get, isNumber } from 'lodash';
// import formatterCurrency from '../../helpers/currency';
// import LazyLoad from "react-lazyload";
// import { Spinner } from '../../components';
// import { useSelector } from 'react-redux';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { limitList, errorNotify, warningNotify, successNotify } from '../../components/Helper';
// import moment from 'moment';

// let url = process.env.REACT_APP_API_URL


// const Order = () => {
//   const { getMe } = useSelector(state => state.main);

//   let { id } = useParams();
//   let location = useLocation();
//   const navigate = useNavigate();


//   const [mainData, setMainData] = useState([])
//   const [state, setState] = useState([])
//   const [orderLoading, setOrderLoading] = useState(false)
//   const [value, setValue] = useState('')

//   useEffect(() => {
//     setMainData('a'.repeat(20).split(''))
//   }, [])


//   const getAcct = (acct) => {
//     axios
//       .get(
//         url + `/api/getAcct`,
//         {
//           headers: {
//             'Authorization': `Bearer ${get(getMe, 'token')}`,
//           }
//         }
//       )
//       .then(({ data }) => {

//       })
//       .catch(err => {
//         setLoading(false)
//         if (get(err, 'response.status') == 401) {
//           navigate('/login')
//           return
//         }
//         errorNotify(get(err, 'response.data.message', `Ma'lumot yuklashda xatolik yuz berdi`) || `Ma'lumot yuklashda xatolik yuz berdi`)
//       });

//     return;
//   };


//   return (
//     <>
//       <Style>
//         <Layout>
//           <div className='container'>
//             <div className="order-head">
//               <div className="order-main d-flex align justify">
//                 <div className='d-flex align'>
//                   <button onClick={() => navigate('/outgoing')} className='btn-back'>Назад</button>
//                   <h3 className='title-menu'>Исходящий платеж</h3>
//                 </div>
//                 <button className={`btn-head position-relative`}>
//                   {orderLoading ? <Spinner /> : 'Добавить'}
//                 </button>
//               </div>
//             </div>
//             <div className='table' >
//               <div className='table-head'>
//                 <ul className='table-head-list d-flex align  justify'>
//                   <li className='table-head-item w-100'>Код счета</li>
//                   <li className='table-head-item w-100'>Название счета</li>
//                   <li className='table-head-item w-100'>Всего</li>
//                   <li className='table-head-item w-50'>Удалить</li>
//                 </ul>
//               </div>
//               <div className='table-body'>
//                 {

//                   <ul className='table-body-list'>
//                     {
//                       mainData.map((item, i) => {
//                         return (
//                           <LazyLoad height={65} once>
//                             <li key={i} className={`table-body-item`}>
//                               <div className='table-item-head d-flex align  justify'>
//                                 <div className='w-100 p-16'>
//                                   <input
//                                     style={{ width: '80%' }}
//                                     type="text"
//                                     value={get(item, 'AcctCode', '') || ''}
//                                     className={`table-body-inp bg-white`}
//                                     onChange={(e) => {
//                                       const updatedCars = mainData.map((el, index) =>
//                                         index === i ? { ...el, AcctCode: e.target.value } : el
//                                       );
//                                       setMainData(updatedCars);

//                                     }}
//                                     placeholder="Введите счет"
//                                   />
//                                   {(customerData.length && bpShow) ? (
//                                     <ul className="dropdown-menu" style={{ top: '49px', zIndex: 1 }}>
//                                       {customerData.map((el, i) => (
//                                         <li onClick={() => {

//                                         }} key={i} className={`dropdown-li`}><a className="dropdown-item" href="#">
//                                             {get(el, 'AcctCode', '') || '-'} - {get(el, 'AcctName', '') || '-'}
//                                           </a></li>
//                                       ))}
//                                     </ul>
//                                   ) : (customerData.length == 0 && bpShow) ? <ul className="dropdown-menu" style={{ top: '49px', zIndex: 1 }}>
//                                     <li onClick={() => {
//                                       setBpShow(false)
//                                     }} className={`dropdown-li`}><a className="dropdown-item" href="#">
//                                         {'-'}
//                                       </a></li>
//                                   </ul> : ''}
//                                 </div>
//                                 <div className='w-100 p-16' >
//                                   <p className='table-body-text truncated-text' title={get(item, 'ItemName', '')}>
//                                     {get(item, 'AcctName', '') || '-'}
//                                   </p>
//                                 </div>
//                                 <div className='w-100 p-16' >
//                                   <input
//                                     type="text"
//                                     value={get(item, 'value', '')
//                                       ? formatterCurrency(Number(get(item, 'value', '')), "UZS").replace("UZS", "").trim()
//                                       : ''}
//                                     className={`table-body-inp bg-white`}
//                                     onChange={(e) => {
//                                       const rawValue = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, ''); // Faqat raqamlar
//                                       const updatedCars = mainData.map((el, index) =>
//                                         index === i ? { ...el, value: rawValue } : el
//                                       );
//                                       setMainData(updatedCars);
//                                     }}
//                                     placeholder="Введите число"
//                                   />
//                                 </div>
//                                 <div className='w-50 p-16' >
//                                   <button type="button" className='close-btn'>
//                                     &times;
//                                   </button>
//                                 </div>
//                               </div>
//                             </li>
//                           </LazyLoad>
//                         )
//                       })
//                     }
//                   </ul>
//                 }
//               </div>
//             </div>
//           </div>

//         </Layout>
//       </Style>
//       <>
//         <ToastContainer />
//       </>
//     </>
//   );
// };

// export default Order;