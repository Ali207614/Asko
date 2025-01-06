import React, { useEffect, useState, useRef, useCallback } from 'react';
import Layout from '../../components/Layout';
import { useParams, useLocation } from 'react-router-dom';
import Style from './Style';
import { useNavigate } from 'react-router-dom';
import searchImg from '../../assets/images/search-normal.svg';
import filterImg from '../../assets/images/filter-search.svg';
import arrowDown from '../../assets/images/arrow-down.svg';
import pagination from '../../assets/images/pagination.svg';
import tickSquare from '../../assets/images/tick-square.svg';
import add from '../../assets/images/add.svg';
import close from '../../assets/images/Close-filter.svg';
import axios from 'axios';
import { get, isNumber } from 'lodash';
import formatterCurrency from '../../helpers/currency';
import { FadeLoader } from "react-spinners";
import LazyLoad from "react-lazyload";
import { ErrorModal, ConfirmModal, FilterModal, FilterModalResizable, WarningModal, BusinessPartner } from '../../components/Modal';
import { Spinner } from '../../components';
import { useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { limitList, errorNotify, warningNotify, successNotify } from '../../components/Helper';
import 'react-resizable/css/styles.css';
import Resizable from './Resizable';
import moment from 'moment';
import rightButton from '../../assets/images/right.svg';
import { validate } from 'uuid';

let url = process.env.REACT_APP_API_URL

const override = {
  position: "absolute",
  left: "50%",
  top: "50%",
};

let merchants = {
  '01': "UZUM X12",
  '02': "UZUM X6",
  '03': "PAYME NASIYA",
  '04': "ALIF X6 X12",
  '05': "ZOOD X12",
  '06': "ZOOD X6",
  '07': "UZUM X3",
  '08': "ZOOD X4"
}
const Order = () => {
  const { getMe } = useSelector(state => state.main);

  let { id } = useParams();
  let location = useLocation();
  const navigate = useNavigate();

  let [color, setColor] = useState("#3C3F47");
  const [showDropdown, setShowDropdown] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [allPageLength, setAllPageLength] = useState(0);
  const [ts, setTs] = useState(10);
  const [loading, setLoading] = useState(false)
  const [mainData, setMainData] = useState([])
  const [search, setSearch] = useState('')
  const [state, setState] = useState([])
  const [allPageLengthSelect, setAllPageLengthSelect] = useState(state.length);
  const [actualData, setActualData] = useState([])
  const [isEmpty, setIsEmpty] = useState(false)
  const [bpShow, setBpShow] = useState(false)
  const [customer, setCustomer] = useState('')
  const [customerCode, setCustomerCode] = useState('')
  const [customerData, setCustomerData] = useState([])
  const [whereKnow, setWhereKnow] = useState([])
  const [region, setRegion] = useState([])
  const [customerDataInvoice, setCustomerDataInvoice] = useState({})
  const [orderLoading, setOrderLoading] = useState(false)
  const [date, setDate] = useState({ DocDate: moment().format("YYYY-MM-DD"), DocDueDate: moment().format("YYYY-MM-DD") })
  const [limitSelect, setLimitSelect] = useState(10);
  const [pageSelect, setPageSelect] = useState(1);
  const [tsSelect, setTsSelect] = useState(10);
  const [docEntry, setDocEntry] = useState({
    id,
    status: false,
  });

  const [orderStatus, setOrderStatus] = useState('1')

  const [salesPersonList, setSalesPersonList] = useState([
    { SlpCode: -1, SlpName: "Нет" }])


  const [showDropDownSalesPerson, setShowDropdownSalesPerson] = useState(false)
  const [salesPerson, setSalesPerson] = useState('Нет')
  const [salesPersonCode, setSalesPersonCode] = useState(-1)

  const [showDropDownStatus, setShowDropdownStatus] = useState(false)
  const [showDropDownMerchant, setShowDropdownMerchant] = useState(false)
  const [comment, setComment] = useState('')
  const [logist, setLogist] = useState()

  const [filterData, setFilterData] = useState([])
  const [groups, setGroups] = useState([])

  const [merchantList, setMerchantList] = useState([])
  const [carBrandList, setCarBrandList] = useState([])
  const [carBrandListName, setCarBrandListName] = useState([])

  const [filterProperty, setFilterProperty] = useState({})
  const [filterPropertyResize, setFilterPropertyResize] = useState({})

  const errorRef = useRef();
  const warningRef = useRef();
  const confirmRef = useRef();

  const filterRef = useRef();
  const businessPartner = useRef();


  const BusinessPartnerModalRef = useCallback(ref => {
    businessPartner.current = ref;
  }, []);

  const filterModalRef = useCallback(ref => {
    filterRef.current = ref;
  }, []);

  const getErrorRef = useCallback(ref => {
    errorRef.current = ref;
  }, []);

  const getWarningRef = useCallback(ref => {
    warningRef.current = ref;
  }, []);

  const confirmModalRef = useCallback(ref => {
    confirmRef.current = ref;
  }, []);

  const filterOrders = () => {
    filterRef.current?.open(filterData);
  }


  useEffect(() => {
    getUfd()

    getMerchant()

  }, []);



  const getUfd = () => {
    axios
      .get(
        url + `/api/getUFD`,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(({ data }) => {
        setWhereKnow(data.filter(item => item.TableID == 'OCRD' && item.FieldID == 0))
        setRegion(data.filter(item => item.TableID == 'OCRD' && item.FieldID == 3))
        setCarBrandList(data.filter(item => item.TableID == '@CARCODE' && item.FieldID == 4))
        setCarBrandListName(data.filter(item => item.TableID == '@CARCODE' && item.FieldID == 3))
      })
      .catch(err => {
        errorNotify(`UDF yuklashda muomo yuzaga keldi`)
      });

    return;
  }

  useEffect(() => {
    const delay = 1000;
    let timeoutId;
    if (search) {
      timeoutId = setTimeout(() => {
        getItems({ page: 1, limit, value: search, filterProperty })
        setTs(limit)
        setPage(1);
      }, delay);
    }
    else {
      getItems({ page: 1, limit, filterProperty })
      setTs(limit)
      setPage(1);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    const delay = 1000;
    let timeoutId;
    if (customer.length && !customerCode) {
      timeoutId = setTimeout(() => {
        getCustomer({ customer })
      }, delay);
    }
    else {
      if (customer.length == 0) {
        setBpShow(false)
      }
      setCustomerData([])
      if (!get(docEntry, 'id')) {
        // setCustomerDataInvoice({
        //   selectMerchantId: get(customerDataInvoice, 'selectMerchantId'),
        //   selectMarchantFoiz: get(customerDataInvoice, 'selectMarchantFoiz'),
        //   U_schot: get(customerDataInvoice, 'U_schot'),
        // })
      }
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [customer]);

  const handleChange = e => {
    const newSearchTerm = e.target.value;
    setSearch(newSearchTerm);
  };

  const getCustomer = (customerDataObj) => {
    axios
      .get(
        url + `/api/business-partner?search=${get(customerDataObj, 'customer', '').toLowerCase()}`,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(({ data }) => {
        setBpShow(true)
        setCustomerData(
          data
        )
      })
      .catch(err => {
        setBpShow(false)

        errorNotify("Mijozlarni yuklashda muommo yuzaga keldi")
      });

    return;
  };

  const getCars = (cardCode, partner) => {
    axios
      .get(
        url + `/api/cars?cardCode=${cardCode}`,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(({ data }) => {
        setCustomerDataInvoice({ ...partner, Cars: data })
      })
      .catch(err => {
        errorNotify("Mijozlarni yuklashda muommo yuzaga keldi")
      });

    return;
  };
  function roundMiddle(number) {
    return Math.round(number / 1000) * 1000;
  }



  const getOrderByDocEntry = (doc) => {
    let link = `/api/draft/${doc}`
    return axios
      .get(
        url + link,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(({ data }) => {
        return data
      })
      .catch(err => {
        setLoading(false)
        errorNotify("Buyurtmani yuklashda muommo yuzaga keldi")
      });

    return;
  };
  const getSalesPerson = () => {
    return axios
      .get(
        url + `/api/sales` ,
      )
      .then(({ data }) => {
        setSalesPersonList(get(data, 'value', []))
        if (filterData.length == 0) {
          getFilterItemData()
        }
      })
      .catch(err => {
        errorNotify("SalesPerson not found")
      });

    return;
  };

  const getFilterItemData = () => {
    return axios
      .get(
        url + `/api/filter` ,
      )
      .then(({ data }) => {
        setFilterData(get(data, 'value', []))
      })
      .catch(err => {
        errorNotify("Filter not found")
      });

    return;
  };

  useEffect(() => {
    console.log(customerDataInvoice)
  }, [customerDataInvoice])

  const getItems = (pagination) => {
    setLoading(true)
    let { link } = subQuery(get(pagination, 'filterProperty', {}))
    axios
      .get(
        url + `/api/items?offset=${get(pagination, 'page', 1)}&status=false&limit=${get(pagination, 'limit', limit)}&search=${get(pagination, 'value', '').toLowerCase()}&items=${actualData.map(item => `'${item.ItemCode}'`)}` + link,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(async ({ data }) => {
        if (get(docEntry, 'id') && !get(docEntry, 'status')) {
          getOrderByDocEntry(get(docEntry, 'id', 0)).then(async orderData => {
            let marchants = []
            if (merchantList.length == 0) {
              marchants = await getMerchant()
            }
            else {
              marchants = merchantList
            }

            setDocEntry({ ...docEntry, status: true })

            setLoading(false)
            setCustomer(get(orderData, 'CardName', ''))
            setCustomerCode(get(orderData, 'CardCode', ''))
            console.log({
              selectMerchantId: get(orderData, 'U_merchantturi'),
              selectMarchantFoiz: get(orderData, 'U_merchantfoizi'),
              U_schot: get(orderData, 'U_schot')
            })
            setCustomerDataInvoice({
              ...get(orderData, 'customer'),
              selectCar: orderData.U_car,
              selectCarName: orderData?.U_markamashina,
              selectMerchantId: get(orderData, 'U_merchantturi'),
              selectMarchantFoiz: get(orderData, 'U_merchantfoizi'),
              U_schot: get(orderData, 'U_schot')
            })
            setCustomerData([{ CardCode: get(orderData, 'CardCode', ''), CardName: get(orderData, 'CardName', '') }])
            setSalesPerson(get(orderData, 'SLP'))
            setSalesPersonCode(get(orderData, 'SlpCode'))
            setComment(get(orderData, 'Comments'))

            setDate({
              DocDate: moment(get(orderData, 'DocDate', '')).format("YYYY-MM-DD"),
              DocDueDate: moment(get(orderData, 'DocDueDate', '')).format("YYYY-MM-DD")
            })
            setAllPageLengthSelect(orderData.Items.length)
            setAllPageLength(get(data, '[0].LENGTH', 0) - orderData.Items.length)

            setMainData(data.map(item => {
              return { ...item, value: '', Discount: '', PriceList: { ...item.PriceList, Price: roundMiddle(Number(get(item, 'PriceList.Price', 0)) * get(getMe, 'currency.Rate')) } }
            }).filter(el => !orderData.Items.map(item => item.ItemCode).includes(get(el, 'ItemCode'))))


            setState(orderData.Items.map(item => {
              return { ...item, value: Number(item.Quantity).toString() }
            }).map(el => {
              return { ...el, PriceList: { ...el.PriceList, Price: roundMiddle((Number(el.PriceList.Price || 0) * get(getMe, 'currency.Rate')) + (((el.PriceList.Price || 0) * get(getMe, 'currency.Rate')) * (get(orderData, 'U_merchantfoizi', 0) || 0) / 100)) } }
            }))
            setActualData(orderData.Items.map(item => {
              return { ...item, value: Number(item.Quantity).toString(), PriceList: { ...item.PriceList, Price: roundMiddle(Number(item.PriceList.Price || 0) * get(getMe, 'currency.Rate')) } }
            }))

          })
        }
        else {

          setLoading(false)



          setMainData(data.map(item => {
            return { ...item, value: '', Discount: '', PriceList: { ...item.PriceList, Price: roundMiddle(Number(get(item, 'PriceList.Price', 0)) * get(getMe, 'currency.Rate')) } }
          }))
          setAllPageLength(get(data, '[0].LENGTH', 0))
          if (groups.length == 0) {
            getGroups()
          }
        }
      })
      .catch(err => {
        setLoading(false)
        errorNotify("Tovarlarni yuklashda muommo yuzaga keldi")
      });

    return;
  };

  function getGroups() {
    axios
      .get(
        url + `/api/group`,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(({ data }) => {
        setGroups(data)
      })
      .catch(err => {
        errorNotify("Tovarlarni yuklashda muommo yuzaga keldi")
      });

    return;
  };

  function getMerchant() {
    axios
      .get(
        url + `/api/getMerchant`,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(({ data }) => {
        setMerchantList(data)

        let marchants = data
        let naqd = marchants.find(item => item.U_merchant.toLowerCase() == (get(customerDataInvoice, 'selectMerchantId', 'naqd') || 'naqd').toLowerCase() && item.U_status == '01')
        if (naqd && !get(docEntry, 'id')) {
          setCustomerDataInvoice({
            ...customerDataInvoice,
            selectMerchantId: naqd.U_merchant, selectMarchantFoiz: naqd.U_Foiz, U_schot: naqd.U_schot
          })
        }
        return data
      })
      .catch(err => {
        errorNotify("Tovarlarni yuklashda muommo yuzaga keldi")
      });

    ;
  };


  const addState = (item) => {
    setAllPageLengthSelect(allPageLengthSelect + 1)
    setAllPageLength(allPageLength - 1)
    setMainData(mainData.filter(el => get(el, 'ItemCode', '') !== get(item, 'ItemCode', '')))
    setState([{ ...item, PriceList: { ...item.PriceList, Price: roundMiddle(Number(item.PriceList.Price || 0) + ((item.PriceList.Price || 0) * (get(customerDataInvoice, 'selectMarchantFoiz', 0) || 0) / 100)) } }, ...state])
    setActualData([item, ...actualData])
  }



  const changeValue = (value, itemCode) => {
    let index = mainData.findIndex(el => get(el, 'ItemCode', '') == itemCode)
    if (index >= 0) {
      mainData[index].value = value
      setMainData([...mainData])
    }
  }



  const postOrder = async (status) => {
    // status true obnavit
    if (!customerCode) {
      warningNotify("Customer tanlanmagan")
      return
    }
    if (!get(date, 'DocDate', '')) {
      warningNotify("Sana tanlanmagan")
      return
    }
    if (!get(date, "DocDueDate", '')) {
      warningNotify("Sana tanlanmagan")
      return
    }
    if (actualData.length == 0) {
      warningNotify("Ma'lumot mavjud emas")
      return
    }
    if (actualData.find(item => item.value.length == 0) || actualData.find(item => Number(item.value) < 0)) {
      warningNotify("Miqdor yozilmagan")
      setIsEmpty(true)
      return
    }
    if (!get(docEntry, 'id', 0) && actualData.find(item => {

      let free = Number(get(item, 'OnHand', '')) - Number(get(item, 'IsCommited', ''))
      if (free < Number(item.value.trim())) {
        return true
      }
    })) {
      warningNotify("Miqdor ko'p")
      return
    }
    setIsEmpty(false)
    confirmRef.current?.open(`Вы уверены, что хотите это ${get(docEntry, 'id', 0) ? 'обновить' : 'добавить'} ? `);
  }

  const Orders = async () => {
    let link = '/api/draft'
    setOrderLoading(true)
    let mapped = actualData.map(el => {
      return { ...el, PriceList: { ...el.PriceList, Price: roundMiddle(Number(el.PriceList.Price || 0) + ((el.PriceList.Price || 0) * (get(customerDataInvoice, 'selectMarchantFoiz', 0) || 0) / 100)) } }
    })
    let schema = {
      "CardCode": customerCode,
      "CardName": customer,
      "DocDate": get(date, 'DocDate'),
      "DocDueDate": get(date, 'DocDueDate'),
      "SalesPersonCode": salesPersonCode,
      "Comments": comment,
      "U_branch": get(getMe, 'data.U_branch'),
      "U_car": get(customerDataInvoice, 'selectCar'),
      "U_merchantturi": get(customerDataInvoice, 'selectMerchantId'),
      "U_merchantfoizi": get(customerDataInvoice, 'selectMarchantFoiz'),
      "U_markamashina": get(customerDataInvoice, 'selectCarName'),
      "U_schot": get(customerDataInvoice, 'U_schot'),
      "DocTotalSy": mapped.reduce((a, b) => a + (Number(get(b, 'PriceList.Price', 0) || 0) * Number(get(b, 'value', 1))), 0),
      "DocumentLines": mapped.map(item => {
        let obj = {
          "ItemCode": get(item, 'ItemCode', ''),
          "Dscription": get(item, 'ItemName', ''),
          "Quantity": Number(get(item, 'value', 0)),
          "WarehouseCode": get(getMe, 'data.U_branch'),
          "Price": get(item, 'PriceList.Price')
        }
        return obj
      })
    }


    let body = schema
    axios
      .post(
        url + link,
        body,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(({ data }) => {
        setCustomer('')
        setCustomerCode('')
        setOrderLoading(false)
        successNotify()
        setMainData([...actualData, ...mainData].map(item => {
          return { ...item, value: '', }
        }))
        setState([])
        setActualData([])
        setAllPageLength(allPageLength + actualData.length)
        setAllPageLengthSelect(0)
        setLimitSelect(10)
        setPageSelect(1)
        setTsSelect(10)
        setComment('')
        setLogist()
      })
      .catch(err => {
        if (get(err, 'response.status') == 401) {
          navigate('/login')
          return
        }
        setOrderLoading(false)
        errorRef.current?.open(get(err, 'response.data.error.message.value', 'Ошибка'));
      });

    return;
  };

  const Update = () => {
    let link = `/api/draft/${get(docEntry, 'id', 0)}`
    let mapped = actualData.map(el => {
      return { ...el, PriceList: { ...el.PriceList, Price: roundMiddle(Number(el.PriceList.Price || 0) + ((el.PriceList.Price || 0) * (get(customerDataInvoice, 'selectMarchantFoiz', 0) || 0) / 100)) } }
    })
    let schema = {
      "CardCode": customerCode,
      "CardName": customer,
      "DocDate": get(date, 'DocDate'),
      "DocDueDate": get(date, 'DocDueDate'),
      "SalesPersonCode": salesPersonCode,
      "Comments": comment,
      "U_branch": get(getMe, 'data.U_branch'),
      "U_car": get(customerDataInvoice, 'selectCar'),
      "U_merchantturi": get(customerDataInvoice, 'selectMerchantId'),
      "U_merchantfoizi": get(customerDataInvoice, 'selectMarchantFoiz'),
      "U_markamashina": get(customerDataInvoice, 'selectCarName'),
      "U_schot": get(customerDataInvoice, 'U_schot'),
      "DocTotalSy": mapped.reduce((a, b) => a + (Number(get(b, 'PriceList.Price', 0) || 0) * Number(get(b, 'value', 1))), 0),
      "DocumentLines": mapped.map(item => {
        let obj = {
          "ItemCode": get(item, 'ItemCode', ''),
          "Dscription": get(item, 'ItemName', ''),
          "Quantity": Number(get(item, 'value', 0)),
          "WarehouseCode": get(getMe, 'data.U_branch'),
          "Price": get(item, 'PriceList.Price')
        }
        return obj
      })
    }

    let body = schema
    console.log(schema)
    setOrderLoading(true)
    axios
      .put(
        url + link,
        body,
        {
          headers: {
            'Authorization': `Bearer ${get(getMe, 'token')}`,
          }
        }
      )
      .then(({ data }) => {
        setOrderLoading(false)
        successNotify("Ma'lumot muvaffaqiyatli o'zgartirildi")
      })
      .catch(err => {
        if (get(err, 'response.status') == 401) {
          navigate('/login')
          return
        }
        setOrderLoading(false)
        errorRef.current?.open(get(err, 'response.data.error.message.value', 'Ошибка'));
      });
  }

  const subQuery = (prop = {}) => {
    let group = get(prop, 'Group', '')
    let category = get(prop, 'CategoryCode', '').toString()
    let groupCode = get(prop, 'GroupCode', '').toString()

    let list = [
      { name: 'group', data: group },
      { name: 'code', data: groupCode },
      { name: 'category', data: category },
    ].filter(item => get(item, 'data', '').length)

    return {
      link: list.map(item => {
        return `&${get(item, 'name', '')}=${get(item, 'data', '')}`
      }).join(''), status: list.length
    }
  }

  const inputRefs = useRef([]);



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

  const handleScroll = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Style>
        <Layout>
          <div className='container'>
            <div className="order-head">
              <div className="order-main d-flex align justify">
                <div className='d-flex align'>
                  <button onClick={() => navigate('/home')} className='btn-back'>Назад</button>
                  <h3 className='title-menu'>Заказ</h3>
                </div>
                {(!get(docEntry, 'id') || validate(get(docEntry, 'id'))) ? <button onClick={() => postOrder(get(docEntry, 'id', 0) ? true : false)} className={`btn-head position-relative`}>
                  {orderLoading ? <Spinner /> : (get(docEntry, 'id', 0) ? 'Обновить' : 'Добавить')}
                </button> : ''}
              </div>
              <div className="order-head-data d-flex align justify">
                <div style={{ width: "10%" }}>
                  <button onClick={() => {
                    businessPartner.current?.open(setCustomerDataInvoice, customerDataInvoice, whereKnow, carBrandList, carBrandListName, region);
                  }} className='btn-businesPartner'>
                    <img width={20} height={20} src={rightButton} alt="link-busines-partner" />
                  </button>
                </div>
                <div className='w-100 position-relative' >
                  <input onChange={(e) => {
                    setCustomer(e.target.value)
                    setCustomerCode('')
                  }} value={customer} type="search" className='order-inp' placeholder='Клиент' />
                  {(customerData.length && bpShow) ? (
                    <ul className="dropdown-menu" style={{ top: '49px', zIndex: 1 }}>
                      {customerData.map((customerItem, i) => (
                        <li onClick={() => {
                          setBpShow(false)
                          setCustomer(get(customerItem, 'CardName', ''))
                          setCustomerCode(get(customerItem, 'CardCode', ''))
                          setCustomerData([])
                          getCars(get(customerItem, 'CardCode', ''), { ...customerDataInvoice, ...customerData.find(e => get(e, 'CardCode', '') == get(customerItem, 'CardCode', '')) })
                        }} key={i} className={`dropdown-li`}><a className="dropdown-item" href="#">
                            {get(customerItem, 'CardCode', '') || '-'} - {get(customerItem, 'CardName', '') || '-'}
                          </a></li>
                      ))}
                    </ul>
                  ) : (customerData.length == 0 && customer.length && bpShow) ? <ul className="dropdown-menu" style={{ top: '49px', zIndex: 1 }}>
                    <li onClick={() => {
                      setBpShow(false)
                    }} className={`dropdown-li`}><a className="dropdown-item" href="#">
                        {'-'}
                      </a></li>
                  </ul> : ''}
                </div>
                <div className='w-70'>
                  <input value={get(date, 'DocDate', '')} onChange={(e) => setDate({ ...date, DocDate: e.target.value })} type="date" className='order-inp' placeholder='Doc Date' />
                </div>
                <div className='w-70'>
                  <input value={get(date, 'DocDueDate', '')} onChange={(e) => setDate({ ...date, DocDueDate: e.target.value })} type="date" className='order-inp' placeholder='Due Date' />
                </div>

                <div className='w-70'>
                  <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className='order-inp' placeholder='Комментарий' />
                </div>

              </div>

              <div className='d-flex align justify'>
                <div className='d-flex align'>
                  {/* <div className='right-limit' >
                    <button style={{ width: "200px" }} onClick={() => setShowDropdownSalesPerson(!showDropDownSalesPerson)} className={`right-dropdown`}>
                      <p className='right-limit-text'>{salesPerson}</p>
                      <img src={arrowDown} className={showDropDownSalesPerson ? "up-arrow" : ""} alt="arrow-down-img" />
                    </button>
                    <ul style={{ zIndex: 1 }} className={`dropdown-menu  ${(showDropDownSalesPerson && salesPersonList.length) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                      {
                        salesPersonList.map((item, i) => {
                          return (<li key={i} onClick={() => {
                            if (salesPerson != get(item, 'SlpName')) {
                              setSalesPerson(get(item, 'SlpName'));
                              setSalesPersonCode(get(item, 'SlpCode'))
                              setShowDropdownSalesPerson(false)
                            }
                            return
                          }} className={`dropdown-li ${salesPerson == get(item, 'SlpName') ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'SlpName')}</a></li>)
                        })
                      }
                    </ul>
                  </div> */}

                  <div className='right-limit' style={{ marginLeft: '20px' }}>
                    <button style={{ width: "200px" }} onClick={() => setShowDropdownStatus(!showDropDownStatus)} className={`right-dropdown`}>
                      <p className='right-limit-text'>{get(customerDataInvoice, 'selectCarName', '').split('.')[1]} - {get(customerDataInvoice, 'selectCar', '-') || '-'}</p>
                      <img src={arrowDown} className={showDropDownStatus && get(customerDataInvoice, 'Cars', []).length ? "up-arrow" : ""} alt="arrow-down-img" />
                    </button>
                    <ul style={{ zIndex: 1, width: '240px' }} className={`dropdown-menu  ${(showDropDownStatus) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                      {
                        [{ U_car_code: '' }, ...get(customerDataInvoice, 'Cars', [])].map((item, i) => {
                          return (<li style={{ height: '30px' }} key={i} onClick={() => {
                            if (get(customerDataInvoice, 'selectCar') != get(item, 'U_car_code')) {
                              setCustomerDataInvoice({ ...customerDataInvoice, selectCar: get(item, 'U_car_code'), selectCarName: get(item, 'U_car_name') })
                              setShowDropdownStatus(false)
                              return
                            }
                            return
                          }} className={`dropdown-li ${get(customerDataInvoice, 'selectCar') == get(item, 'U_car_code') ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'U_car_name', '').split('.')[1]}  -  {get(item, 'U_car_code', '')}</a></li>)
                        })
                      }
                    </ul>
                  </div>

                  <div className='right-limit' style={{ marginLeft: '20px' }}>
                    <button style={{ width: "200px" }} onClick={() => {
                      setShowDropdownMerchant(!showDropDownMerchant)
                    }
                    } className={`right-dropdown`}>
                      <p className='right-limit-text'>{get(customerDataInvoice, 'selectMerchantId') || 'Naqd'} - {get(customerDataInvoice, 'selectMarchantFoiz', 0) || 0} %</p>
                      <img src={arrowDown} className={showDropDownMerchant ? "up-arrow" : ""} alt="arrow-down-img" />
                    </button>
                    <ul style={{ zIndex: 1, width: '240px' }} className={`dropdown-menu  ${(showDropDownMerchant) ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                      {
                        [...merchantList.filter(item => item.U_status == '01').sort((a, b) => Number(a.U_Foiz) - Number(b.U_Foiz))].map((item, i) => {

                          return (<li style={{ height: '30px' }} key={i} onClick={() => {
                            if (get(customerDataInvoice, 'selectMerchantId') != get(item, 'U_merchant')) {
                              setState(actualData.filter(el => state.map(itemC => itemC.ItemCode).includes(el.ItemCode)).map(el => {
                                return {
                                  ...el, PriceList: {
                                    ...el.PriceList,
                                    Price: roundMiddle(Number(el.PriceList.Price || 0) + ((el.PriceList.Price || 0) * (get(item, 'U_Foiz', 0) || 0) / 100))
                                  }
                                }
                              }))
                              setCustomerDataInvoice({ ...customerDataInvoice, selectMerchantId: get(item, 'U_merchant'), selectMarchantFoiz: get(item, 'U_Foiz', 0) || 0, U_schot: get(item, 'U_schot') })
                              setShowDropdownMerchant(false)
                              return
                            }
                            return
                          }} className={`dropdown-li ${get(customerDataInvoice, 'selectMerchantId') == get(item, 'U_merchant') ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{get(item, 'U_merchant') || 'Naqd'} - {get(item, 'U_Foiz', '0') || 0} %</a></li>)
                        })
                      }
                    </ul>
                  </div>
                </div>
                <div className='right-head order-head-filter'>
                  <div className='right-pagination'>
                    <p className='pagination-text'><span>{page}-{ts}</span> <span>of {allPageLength}</span> </p>
                    <button onClick={() => {
                      if (page > 1) {
                        getItems({ page: page - limit, limit, value: search, filterProperty })
                        setPage(page - limit);
                        setTs(ts - limit)
                      }
                    }} disabled={page == 1} className={`pagination-button left-pagination ${page == 1 ? 'opcity-5' : ''}`}>
                      <img src={pagination} alt="arrow-button-pagination" />
                    </button>

                    <button onClick={() => {
                      if (ts < allPageLength) {
                        getItems({ page: page + limit, limit, value: search, filterProperty })
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
                          setFilterProperty({})
                          getItems({ page: 1, limit, value: search })
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
                    <ul style={{ zIndex: 1 }} className={`dropdown-menu ${showDropdown ? "display-b" : "display-n"}`} aria-labelledby="dropdownMenuButton1">
                      {
                        limitList.map((item, i) => {
                          return (<li key={i} onClick={() => {
                            if (limit != item) {
                              setLimit(item);
                              setPage(1);
                              setShowDropdown(false);
                              setTs(item)
                              getItems({ page: 1, limit: item, value: search, filterProperty })
                            }
                            return
                          }} className={`dropdown-li ${limit == item ? 'dropdown-active' : ''}`}><a className="dropdown-item" href="#">{item}</a></li>)
                        })
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='table' >
              <div className='table-head'>
                <ul className='table-head-list d-flex align  justify'>
                  <li className='table-head-item w-50'>Код</li>
                  <li className='table-head-item w-100'>Продукция</li>
                  <li className='table-head-item w-50'>Бранд</li>
                  <li className='table-head-item w-50'>Мера</li>
                  <li className='table-head-item w-50'>Цена</li>
                  <li className='table-head-item w-50'>Остаток</li>
                  <li className='table-head-item w-70'>Количество</li>
                  <li className='table-head-item w-47px'>
                    <button onClick={() => {
                      let filterData = mainData.filter(el => {
                        let free = Number(get(el, 'OnHand.OnHand', '')) - Number(get(el, 'OnHand.IsCommited', ''))
                        return Number(el.value) > 0 && (free >= Number(el.value.trim()))
                      })
                      if (filterData.length) {
                        setAllPageLengthSelect(allPageLengthSelect + filterData.length)
                        setAllPageLength(allPageLength - filterData.length)
                        setMainData(mainData.filter(el => !filterData.map(item => item.ItemCode).includes(el.ItemCode)))
                        setState([...filterData.map(el => {
                          return { ...el, PriceList: { ...el.PriceList, Price: roundMiddle(Number(el.PriceList.Price || 0) + ((el.PriceList.Price || 0) * (get(customerDataInvoice, 'selectMarchantFoiz') || 0) / 100)) } }
                        }), ...state])
                        setActualData([...filterData, ...actualData])
                      }

                    }} className='table-head-check-btn'>
                      <img src={tickSquare} alt="tick" />
                    </button>
                  </li>
                </ul>
              </div>
              <div className='table-body'>
                {
                  !loading ? (
                    <ul className='table-body-list'>
                      {
                        mainData.map((item, i) => {
                          return (
                            <LazyLoad height={65} once>
                              <li key={i} className={`table-body-item`}>
                                <div className='table-item-head d-flex align  justify'>
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
                                      {get(item, 'Name', '') || '-'}
                                    </p>
                                  </div>
                                  <div className='w-50 p-16' >
                                    <p className='table-body-text truncated-text' title={get(item, 'ItemName', '')}>
                                      {get(item, 'U_Article', '') || '-'}
                                    </p>
                                  </div>
                                  <div className='w-50 p-16' >
                                    <p className='table-body-text 50'>
                                      {formatterCurrency(Number(get(item, 'PriceList.Price', 0)), 'UZS')}
                                    </p>
                                  </div>
                                  <div className='w-50 p-16' >
                                    <p className='table-body-text '>
                                      {Number(get(item, 'OnHand.OnHand', ''))} шт
                                    </p>
                                  </div>
                                  <div className='w-70 p-16' >
                                    <input
                                      ref={(el) => (inputRefs.current[i] = el)}
                                      onKeyDown={(event) => handleKeyDown(event, i)}
                                      value={get(item, 'value', '')}
                                      onWheel={handleScroll}
                                      onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) {
                                          changeValue(e.target.value, get(item, 'ItemCode', ''))
                                        }
                                      }}
                                      disabled={(Number(get(item, 'PriceList.Price', 0)) <= 0 || Number(get(item, 'OnHand.OnHand', '')) <= 0)}
                                      type="text"
                                      className={`table-body-inp ${(Number(get(item, 'PriceList.Price', 0)) <= 0 || Number(get(item, 'OnHand.OnHand', '')) <= 0) ? 'opacity-5' : ''
                                        }`}
                                      placeholder='-' />
                                  </div>

                                  <div className='w-47px p-16' >
                                    <button
                                      disabled={
                                        (get(item, 'PriceList.Price', 0) <= 0 ? true : (Number(get(item, 'value')) < 0) ? true : (
                                          Number(get(item, 'OnHand.OnHand', '')) <= 0
                                            ? true :
                                            (Number(get(item, 'OnHand.OnHand', '')) - Number(get(item, 'OnHand.IsCommited', ''))) <= 0 ||
                                            (Number(get(item, 'OnHand.OnHand', '')) - Number(get(item, 'OnHand.IsCommited', ''))) < Number(get(item, 'value', 0))))
                                      }
                                      onClick={() => addState(item)}
                                      className={`table-body-text table-head-check-btn ${(
                                        Number(get(item, 'OnHand.OnHand', '')) <= 0 || get(item, 'PriceList.Price', 0) <= 0
                                      ) ? 'opacity-5'
                                        : (
                                          (Number(get(item, 'OnHand.OnHand', '')) - Number(get(item, 'OnHand.IsCommited', ''))) <= 0 ||
                                            (Number(get(item, 'OnHand.OnHand', '')) - Number(get(item, 'OnHand.IsCommited', ''))) < Number(get(item, 'value', 0)) ? 'opacity-5' : '')} ${Number(get(item, 'value')) < 0 ? 'opacity-5' : ''}`}>
                                      <img src={add} alt="add button" />
                                    </button>
                                  </div>
                                </div>
                              </li>
                            </LazyLoad>
                          )
                        })
                      }
                    </ul>) :
                    <FadeLoader color={color} loading={loading} cssOverride={override} size={100} />
                }
              </div>
            </div>
          </div>

          <Resizable
            state={state}
            setState={setState}
            setAllPageLengthSelect={setAllPageLengthSelect}
            allPageLengthSelect={allPageLengthSelect}
            setMainData={setMainData}
            setAllPageLength={setAllPageLength}
            allPageLength={allPageLength}
            mainData={mainData}
            actualData={actualData}
            setActualData={setActualData}
            isEmpty={isEmpty}
            setIsEmpty={setIsEmpty}
            limitSelect={limitSelect}
            setLimitSelect={setLimitSelect}
            pageSelect={pageSelect}
            setPageSelect={setPageSelect}
            tsSelect={tsSelect}
            setTsSelect={setTsSelect}
            filterPropertyResize={filterPropertyResize}
            setFilterPropertyResize={setFilterPropertyResize}
            filterData={filterData}
            customerDataInvoice={customerDataInvoice}
            groups={groups}

          />
        </Layout>
      </Style>
      <>
        <ToastContainer />
        <FilterModal
          getRef={filterModalRef}
          filterProperty={filterProperty}
          setFilterProperty={setFilterProperty}
          getItems={getItems}
          arg={{ page: 1, limit, value: search }}
          setPage={setPage}
          setTs={setTs}
          groups={groups}
        />
        <BusinessPartner
          getRef={BusinessPartnerModalRef}
          setCustomerDataInvoice={setCustomerDataInvoice}
          customerDataInvoice={customerDataInvoice}
          setCustomer={setCustomer}
          setCustomerCode={setCustomerCode}
        />
        <ErrorModal
          getRef={getErrorRef}
          title={'Ошибка'}
        />
        <WarningModal
          getRef={getWarningRef}
          title={'Ошибка'}
        />
        <ConfirmModal getRef={confirmModalRef} title={"Oshibka"} fn={get(docEntry, 'id', '') ? Update : Orders} />
      </>
    </>
  );
};

export default Order;