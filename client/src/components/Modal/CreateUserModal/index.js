import React, { memo, useEffect, useState } from "react";
import CreateUserStyle from "./CreateUserStyle";
import Modal from "react-modal";
import { get } from "lodash";
import api from "../../../api";
import Button from "../../Button";
import { MdDone } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
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

const CreateUserModal = ({ getRef }) => {
  const { t } = useTranslation();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [consumer, setConsumer] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [customerGroup, setCustomerGroup] = useState("");

  const [regionData, setRegionData] = useState([]);
  const [customerGroupData, setCustomerGroupData] = useState([]);

  useEffect(() => {
    const ref = {
      open: () => setIsOpenModal(true),
      close: () => setIsOpenModal(false),
    };
    getRef(ref);
    getRegion();
    getCustomerGroups();
  }, []);

  const getRegion = () => {
    api
      .get(`SQLQueries('getClientSeries')/List`)
      .then((res) => {
        const resData = get(JSON.parse(res.data), "value", []);
        setRegionData(resData);
      })
      .catch((err) => {
      });
  };

  const getCustomerGroups = () => {
    api
      .get(`SQLQueries('getBPGroups')/List`)
      .then((res) => {
        const resData = get(JSON.parse(res.data), "value", []);
        setCustomerGroupData(resData);
      })
      .catch((err) => {
      });
  };

  const createUser = () => {
    setIsLoading(true);
    api
      .post(`BusinessPartners`, {
        Series: region.split(" , ")[1],
        GroupCode: customerGroup.split(" , ")[1],
        CardName: consumer,
        CardType: "cCustomer", //static
        Phone1: phone.length <= 0 ? "-" : phone,
        Currency: "##",
      })
      .then((res) => {
        setIsSuccess(true);
        setIsLoading(false);
        setConsumer("");
        setPhone("");
        setRegion("");
        setCustomerGroup("");
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const close = () => {
    setConsumer("");
    setPhone("");
    setRegion("");
    setCustomerGroup("");
    setIsOpenModal(false);
    setIsSuccess(false);
  };

  return (
    <Modal
      isOpen={isOpenModal}
      onRequestClose={() => setIsOpenModal(false)}
      style={customStyles}
      contentLabel='Example Modal'
      ariaHideApp={false}
    >
      <CreateUserStyle>
        <div className='card'>
          <h2>{t("Добавить клиента")}!</h2>
          <div className='cancelCard'>
            <GiCancel onClick={() => close()} />
          </div>

          <input
            type='text'
            placeholder={t("Mijoz")}
            className='input'
            defaultValue={consumer}
            onChange={(v) => setConsumer(v.target.value)}
          />
          <div className='relative'>
            <input
              type='text'
              list='region'
              placeholder={t("Region")}
              className='input'
              defaultValue={region}
              onChange={(v) => setRegion(v.target.value)}
            />
            <datalist id='region'>
              {regionData.map((v, i) => (
                <option
                  key={i}
                  value={`${get(v, "SeriesName", "")} , ${get(
                    v,
                    "Series",
                    ""
                  )}`}
                />
              ))}
            </datalist>
          </div>

          <div className='relative'>
            <input
              type='text'
              list='customerGroup'
              placeholder={t("Guruh")}
              className='input'
              defaultValue={customerGroup}
              onChange={(v) => setCustomerGroup(v.target.value)}
            />
            <datalist id='customerGroup'>
              {customerGroupData.map((v, i) => (
                <option
                  key={i}
                  value={`${get(v, "GroupName", "")} , ${get(
                    v,
                    "GroupCode",
                    ""
                  )}`}
                />
              ))}
            </datalist>
          </div>

          <input
            type='number'
            placeholder={t("Phone")}
            className='input'
            defaultValue={phone}
            onChange={(v) => setPhone(v.target.value)}
          />

          <div className='centerCard'>
            <Button className='btnN' onClick={() => close()}>
              {t("Нет")}
            </Button>
            <Button
              isLoading={isLoading}
              disabled={
                consumer.length <= 0 ||
                  region.length <= 0 ||
                  phone.length <= 0 ||
                  customerGroup.length <= 0
                  ? true
                  : false
              }
              onClick={() => createUser()}
            >
              {isSuccess ? <MdDone /> : t("Да")}
            </Button>
          </div>
        </div>
      </CreateUserStyle>
    </Modal>
  );
};

export default memo(CreateUserModal);
