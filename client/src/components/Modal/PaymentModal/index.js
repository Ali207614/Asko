import React, { memo, useEffect, useState } from "react";
import PaymentModalStyle from "./PaymentModalStyle";
import Modal from "react-modal";
import {
  AiFillBank,
  AiFillCreditCard,
  AiFillDollarCircle,
  AiOutlineDollarCircle,
} from "react-icons/ai";
import api from "../../../api";
import numberWithSpaces from "../../../helpers/numberWithSpaces";
import { useTranslation } from "react-i18next";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    background: '#0000008D',
  },
};

const PaymentModal = ({ getRef, onConfirm = () => {}, onClose = () => {} }) => {
  const { t } = useTranslation();

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1 and pad with '0' if needed
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [sum, setSum] = useState("");
  const [valuta, setValuta] = useState("USD");
  const [paym, setPaym] = useState("U_CashAccount");
  const [dollar, setDollar] = useState(1);
  const [dateC, setDateC] = useState(formattedDate);
  const [redPrice, setRedPrice] = useState(0);
  const [typeOfPayment, setTypeOfPayment] = useState([
    {
      title: "Naqd",
      icon: <AiFillDollarCircle />,
      isActive: true,
      value: "U_CashAccount",
    },
    {
      title: "Karta",
      icon: <AiFillCreditCard />,
      isActive: false,
      value: "U_CardAccount",
    },
    {
      title: "Terminal",
      icon: <AiFillBank />,
      isActive: false,
      value: "U_TransAccount",
    },
    {
      title: "Bonus",
      icon: <AiOutlineDollarCircle />,
      isActive: false,
      value: "U_BonusAccount",
    },
  ]);

  const [valuteDate, setValuteDate] = useState([
    {
      title: "DOLLAR",
      value: "USD",
      isActive: true,
    },
    {
      title: "SUM",
      value: "UZS",
      isActive: false,
    },
  ]);

  useEffect(() => {
    const ref = {
      open: (p) => {
        setIsOpenModal(true);
        setRedPrice(p);
      },
      close: () => setIsOpenModal(false),
    };
    getRef(ref);
    getUSD(dateC);
  }, []);

  const sending = () => {
    onConfirm(sum, paym, valuta, dollar, dateC);
    setIsOpenModal(false);
  };

  const changeActive = (v, index) => {
    setPaym(v);
    let a = [...typeOfPayment];

    for (let i = 0; i < a.length; i++) {
      if (i === index) {
        a[i].isActive = true;
      } else {
        a[i].isActive = false;
      }
    }

    setTypeOfPayment(a);
  };

  const changeActive2 = (v, index) => {
    setValuta(v);
    let a = [...valuteDate];

    for (let i = 0; i < a.length; i++) {
      if (i === index) {
        a[i].isActive = true;
      } else {
        a[i].isActive = false;
      }
    }

    setValuteDate(a);
    console.log(v);
  };

  const getUSD = (courseDate) => {
    setDateC(courseDate);
    api
      .post(`SBOBobService_GetCurrencyRate`, {
        Currency: "UZS",
        Date: courseDate,
      })
      .then((res) => {
        setDollar(JSON.parse(res.data));
        // console.log(JSON.parse(res.data));
      })
      .catch((err) => {
        console.log("err getUSD", err);
      });
  };

  return (
    <Modal
      isOpen={isOpenModal}
      onRequestClose={() => setIsOpenModal(false)}
      style={customStyles}
      contentLabel='Example Modal'
      ariaHideApp={false}
    >
      <PaymentModalStyle>
        <div className='card'>
          <h2>{t("Добавить платеж")}</h2>
          <div className='halfCard'>
            <div className='insideMiniCard'>
              <p>
                {t("Оплата")}: {numberWithSpaces(sum)}
              </p>
              <input
                type='number'
                placeholder='Цена'
                className={
                  (valuta === "UZS" &&
                    Number(sum) / Number(dollar) > redPrice) ||
                  (valuta === "USD" && Number(sum) > redPrice)
                    ? "redInput"
                    : "input"
                }
                defaultValue={sum}
                onChange={(v) => setSum(v.target.value)}
              />
            </div>
            <div className='insideMiniCard'>
              <p>
                {t("Курс")}: {dollar}
              </p>

              <input
                type='date'
                placeholder={t("Цена")}
                className='input'
                value={dateC}
                onChange={(v) => getUSD(v.target.value)}
              />
            </div>
          </div>

          <h3>{t("Способ оплаты")}</h3>
          <div className='radioBtnCard'>
            {typeOfPayment.map((v, i) => {
              return (
                <button
                  key={i}
                  onClick={() => changeActive(v.value, i)}
                  className={v.isActive ? "ac" : "inac"}
                >
                  {v.icon}
                  <p className='btnTitle'> {v.title}</p>
                </button>
              );
            })}
          </div>

          <h3>{t("Valyuta")}</h3>
          <div className='radioBtnCard2'>
            {valuteDate.map((v, i) => {
              return (
                <button
                  key={i}
                  onClick={() => changeActive2(v.value, i)}
                  className={v.isActive ? "ac" : "inac"}
                >
                  {v.icon}
                  <p className='btnTitle'> {v.title}</p>
                </button>
              );
            })}
          </div>

          <div className='centerCard'>
            <button className='btnN' onClick={() => onClose()}>
              {t("Нет")}
            </button>
            <button
              className='btnY'
              onClick={() => sending()}
              disabled={
                (valuta === "UZS" && Number(sum) / Number(dollar) > redPrice) ||
                (valuta === "USD" && Number(sum) > redPrice) ||
                String(sum).length <= 0
                  ? true
                  : false
              }
            >
              {t("Да")}
            </button>
          </div>
        </div>
      </PaymentModalStyle>
    </Modal>
  );
};

export default memo(PaymentModal);
