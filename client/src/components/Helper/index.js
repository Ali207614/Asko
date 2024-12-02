import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const errorNotify = (text) => toast.error(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
});

const warningNotify = (text) => toast.warning(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
});


const successNotify = (text = "Ma'lumot muvaffaqiyatli qo'shildi") => toast.success(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
});

let limitList = [1, 10, 50, 100, 500, 1000]

const override = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "100px",
    height: "100px",
    margin: 'auto'
};


let statuses = {
    2: {
        color: '#FFFFFF',
        backgroundColor: '#6C757D',
        name: 'Черновик',
        access: [2, 1, 7],
        actualName: 'Черновик'
    },
    1: {
        color: '#FFFFFF',
        backgroundColor: '#388E3C',
        name: 'Новый',
        access: [1, 3, 4, 5, 6],
        actualName: 'Новый'
    },
    3: {
        color: '#FFFFFF',
        backgroundColor: '#FFA000',
        name: 'Ожидания',
        access: [3, 4, 5, 6],
        actualName: 'Ожидания'
    },
    4: {
        color: '#FFFFFF',
        backgroundColor: '#0056B3',
        name: 'Подтвердить',
        access: [4, 5, 6],
        actualName: 'Подтвержден'
    },
    5: {
        color: '#FFFFFF',
        backgroundColor: '#00A2C7',
        name: 'Напечатать',
        access: [5, 6, 8],
        actualName: 'Печатанный'
    },
    6: {
        color: '#FFFFFF',
        backgroundColor: '#00A2C7',
        name: 'Отменить'
    },
    7: {
        color: '#FFFFFF',
        backgroundColor: '#00A2C7',
        name: 'Удалить'
    },
    8: {
        color: '#FFFFFF',
        backgroundColor: '#00A2C7',
        name: 'Архивировать'
    }
};

let warehouseList = ['BAZA1', 'BAZA2', 'LYUSTRA', 'YANGI']

export {
    errorNotify,
    warningNotify,
    successNotify,
    limitList,
    override,
    statuses,
    warehouseList
};