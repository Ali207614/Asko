const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
let dbService = require('../services/dbService')

const moment = require('moment');
const { getSession, saveSession } = require("../helpers");
const { api_params } = require("../config");
const b1HANA = require("./b1HANA");
const BusinessPartner = require("../models/BusinessPartner");
const Invoice = require("../models/Invoice");
require('dotenv').config();


class b1SL {
    constructor() {
        this.api = process.env.api;
    }
    auth = async () => {
        let obj = api_params
        const axios = Axios.create({
            baseURL: `${this.api}`,
            timeout: 30000,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        return axios.post("/Login", obj).then(({ headers, data }) => {
            saveSession({
                'Cookie': get(headers, 'set-cookie', ''),
                'SessionId': get(data, 'SessionId', '')
            })
            return { status: true };
        }).catch(err => {
            return { status: false, message: get(err, 'response.data.error.message.value') }
        });
    }

    createCars = async (req, res, next) => {
        let newCode = await b1HANA.getLastCodeCars()
        let body = req.body
        delete body.status
        body = { ...body, "Object": "CARcode", Code: (Number(get(newCode, '[0].Code', "0")) || 0) + 1, }
        const axios = Axios.create({
            baseURL: `${this.api}`,
            timeout: 30000,
            headers: {
                'Cookie': get(getSession(), 'Cookie[0]', '') + get(getSession(), 'Cookie[1]', ''),
                'SessionId': get(getSession(), 'SessionId', '')
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        return axios
            .post(`/CARcode`, { ...body, "Object": "CARcode", })
            .then(async ({ data }) => {
                let businessPartner = await BusinessPartner.findOne({ CardCode: get(data, 'U_bp_code') })
                if (businessPartner) {
                    businessPartner.Cars.push({ Code: get(data, 'Code'), U_MARKA: get(data, 'U_MARKA'), U_km: get(data, 'U_km'), U_bp_code: get(data, 'U_bp_code'), U_car_code: get(data, 'U_car_code'), U_bp_name: get(data, 'U_bp_name'), U_car_name: get(data, 'U_car_name') })
                    await businessPartner.save()
                }
                return res.status(201).json({ status: true, data })
            })
            .catch(async (err) => {
                if (get(err, 'response.status') == 401) {
                    let token = await this.auth()
                    if (token.status) {
                        return await this.createCars(req, res, next)
                    }
                    return res.status(get(err, 'response.status', '400') || 400).json({ status: false, message: token.message })
                } else {
                    return res.status(get(err, 'response.status', '400') || 400).json({ status: false, message: get(err, 'response.data.error.message.value') })

                }
            });
    }

    updateCars = async (req, res, next) => {
        let body = req.body
        delete body.status
        body = { ...body, "Object": "CARcode", }
        const axios = Axios.create({
            baseURL: `${this.api}`,
            timeout: 30000,
            headers: {
                'Cookie': get(getSession(), 'Cookie[0]', '') + get(getSession(), 'Cookie[1]', ''),
                'SessionId': get(getSession(), 'SessionId', '')
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        return axios
            .patch(`/CARcode('${req.body.Code}')`, body)
            .then(async ({ data }) => {
                let businessPartner = await BusinessPartner.findOne({ CardCode: get(body, 'U_bp_code') })
                if (businessPartner) {
                    let ind = businessPartner.Cars.findIndex(item => item.Code == get(body, 'Code', ''))
                    if (ind > -1) {
                        businessPartner.Cars[ind] = req.body
                        await businessPartner.save()
                    }
                }
                return res.status(201).json({ status: true, data })
            })
            .catch(async (err) => {
                if (get(err, 'response.status') == 401) {
                    let token = await this.auth()
                    if (token.status) {
                        return await this.updateCars(req, res, next)
                    }
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: token.message })
                } else {
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: get(err, 'response.data.error.message.value') })

                }
            });
    }
    updateBusinessPartner = async (req, res, next) => {
        delete req.body.Cars
        delete req.body.__v
        delete req.body._id
        delete req.body.created_at
        delete req.body.updated_at
        delete req.body.Balance

        let body = req.body
        const axios = Axios.create({
            baseURL: `${this.api}`,
            timeout: 30000,
            headers: {
                'Cookie': get(getSession(), 'Cookie[0]', '') + get(getSession(), 'Cookie[1]', ''),
                'SessionId': get(getSession(), 'SessionId', '')
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        return axios
            .patch(`/BusinessPartners('${req.body.CardCode}')`, body)
            .then(async ({ data }) => {
                let businessPartner = await BusinessPartner.findOne({ CardCode: req.body.CardCode });
                if (businessPartner) {
                    Object.assign(businessPartner, req.body); // req.body ni mavjud obyektga birlashtirish
                    await businessPartner.save(); // Ma'lumotni saqlash
                    return res.status(200).json({ status: true, data: businessPartner });
                }

                return res.status(201).json({ status: true, data })
            })
            .catch(async (err) => {
                if (get(err, 'response.status') == 401) {
                    let token = await this.auth()
                    if (token.status) {
                        return await this.updateBusinessPartner(req, res, next)
                    }
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: token.message })
                } else {
                    console.log(err)
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: get(err, 'response.data.error.message.value') })

                }
            });
    }

    createBusinessPartner = async (req, res, next) => {
        let body = req.body
        body = { ...req.body, "Series": 83, }
        const axios = Axios.create({
            baseURL: `${this.api}`,
            timeout: 30000,
            headers: {
                'Cookie': get(getSession(), 'Cookie[0]', '') + get(getSession(), 'Cookie[1]', ''),
                'SessionId': get(getSession(), 'SessionId', '')
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        return axios
            .post(`/BusinessPartners`, body)
            .then(async ({ data }) => {
                await BusinessPartner.create({ CardCode: get(data, 'CardCode'), ...req.body })
                return res.status(201).json({ status: true, data })
            })
            .catch(async (err) => {
                if (get(err, 'response.status') == 401) {
                    let token = await this.auth()
                    if (token.status) {
                        return await this.createBusinessPartner(req, res, next)
                    }
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: token.message })
                } else {
                    console.log(err)
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: get(err, 'response.data.error.message.value') })

                }
            });
    }


    postInvoices = async (req, res, next) => {
        let body = req.body
        if (get(body, 'DocEntry') && get(body, 'sap')) {
            let incoming = await this.postIncomingPayment(body, 5010)
            return res.status(get(incoming, 'status')).json(incoming)
        }
        let schema = {
            "CardCode": get(body, 'CardCode'),
            "DocDate": get(body, 'DocDate'),
            "DocDueDate": get(body, 'DocDueDate'),
            "Comments": get(body, 'Comments'),
            "U_branch": get(body, 'U_branch'),
            "DocCurrency": "UZS",
            "U_car": get(body, 'U_car', ''),
            "U_merchantturi": get(body, 'U_merchantturi', ''),
            "U_merchantfoizi": get(body, 'U_merchantfoizi', ''),
            "U_flayer": get(body, 'U_flayer2') ? 'Да' : "Нет",
            "U_vulkanizatsiya": "Нет",
            "DocumentLines": get(body, 'Items', []).map(item => {
                return {
                    ItemCode: item.ItemCode,
                    Quantity: item.Quantity,
                    Price: item.Price * item.Quantity,
                    UnitPrice: item.Price,
                    WarehouseCode: get(body, 'U_branch'),
                    CostingCode: get(body, 'U_branch')
                }
            })
        }
        const axios = Axios.create({
            baseURL: `${this.api}`,
            timeout: 30000,
            headers: {
                'Cookie': get(getSession(), 'Cookie[0]', '') + get(getSession(), 'Cookie[1]', ''),
                'SessionId': get(getSession(), 'SessionId', '')
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        return axios
            .post(`/Invoices`, schema)
            .then(async ({ data }) => {
                await Invoice.deleteOne({ UUID: req.body.UUID })
                if (get(body, 'U_flayer2')) {
                    let incoming = await this.postIncomingPayment({ ...body, DocEntry: get(data, 'DocEntry'), value: 30000 }, 5010)
                }

                let incoming = await this.postIncomingPayment({ ...body, DocEntry: get(data, 'DocEntry') })
                return res.status(incoming?.status).json(incoming)
            })
            .catch(async (err) => {
                if (get(err, 'response.status') == 401) {
                    let token = await this.auth()
                    if (token.status) {
                        return await this.postInvoices(req, res, next)
                    }
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: token.message })
                } else {
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: get(err, 'response.data.error.message.value') })

                }
            });
    }

    postIncomingPayment = async (body, account = 5010) => {
        let schema = {
            "CardCode": get(body, 'CardCode'),
            "CashAccount": account,
            "DocCurrency": "UZS",
            "CashSum": get(body, 'value'),
            "PaymentInvoices": [
                {
                    "SumApplied": get(body, 'value'),
                    "DocEntry": get(body, 'DocEntry'),
                }
            ],
        }

        console.log(schema, ' bu body')
        const axios = Axios.create({
            baseURL: `${this.api}`,
            timeout: 30000,
            headers: {
                'Cookie': get(getSession(), 'Cookie[0]', '') + get(getSession(), 'Cookie[1]', ''),
                'SessionId': get(getSession(), 'SessionId', '')
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        return axios
            .post(`/IncomingPayments`, schema)
            .then(async ({ data }) => {
                console.log('bu joyga tushgan')
                await b1HANA.getInvoiceByDocEntry(get(body, 'DocEntry'))
                return { status: 201 }
            })
            .catch(async (err) => {
                if (get(err, 'response.status') == 401) {
                    let token = await this.auth()
                    if (token.status) {
                        return await this.postIncomingPayment(body, account)
                    }
                    return { status: get(err, 'response.status'), message: err }
                } else {
                    console.log(err)
                    return { status: get(err, 'response.status'), message: err }
                }
            });
    }


}

module.exports = new b1SL();


