const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
let dbService = require('../services/dbService')

const moment = require('moment');
const { getSession, saveSession } = require("../helpers");
const { api_params, api } = require("../config");
const b1HANA = require("./b1HANA");
const BusinessPartner = require("../models/BusinessPartner");
const Invoice = require("../models/Invoice");
const Currency = require("../models/Currency");
const DisCount = require("../models/DisCount");
require('dotenv').config();
const sleepNow = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

class b1SL {
    constructor() {
        this.api = api;
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
        body = { ...body, "Object": "Carcode", Code: (Number(get(newCode, '[0].Code', "0")) || 0) + 1, }
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
            .post(`/Carcode`, { ...body, "Object": "Carcode", })
            .then(async ({ data }) => {
                let businessPartner = await BusinessPartner.findOne({ CardCode: get(data, 'U_bp_code') })
                if (businessPartner) {
                    businessPartner.Cars.push({ Code: get(data, 'Code'), U_marka: get(data, 'U_marka'), U_car_km: get(data, 'U_car_km'), U_bp_code: get(data, 'U_bp_code'), U_car_code: get(data, 'U_car_code'), U_bp_name: get(data, 'U_bp_name'), U_car_name: get(data, 'U_car_name') })
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
        body = { ...body, "Object": "Carcode", }

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
            .patch(`/Carcode('${req.body.Code}')`, body)
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
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: get(err, 'response.data.error.message.value') })

                }
            });
    }

    createBusinessPartner = async (req, res, next) => {
        let body = req.body
        body = { ...req.body, "Series": 84, Currency: '##' }

        delete body.selectMerchantId
        delete body.selectMarchantFoiz
        delete body.schot
        delete body.U_schot
        delete body.selectCar

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
                    return res.status(get(err, 'response.status', 400) || 400).json({ status: false, message: get(err, 'response.data.error.message.value') })

                }
            });
    }

    updateInvoice = async (doc, body) => {
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
            .patch(`/Invoices(${doc})`, body)
            .then(async ({ data }) => {
                return { status: true }
            })
            .catch(async (err) => {
                if (get(err, 'response.status') == 401) {
                    let token = await this.auth()
                    if (token.status) {
                        return await this.updateInvoice(doc, body)
                    }
                    return { status: false, message: token.message }
                } else {
                    return { status: false, message: get(err, 'response.data.error.message.value') }

                }
            });
    }


    postInvoices = async (req, res, next) => {
        let body = req.body
        if (get(body, 'DocEntry') && get(body, 'sap')) {
            try {
                const flayerUpdate = await get(body, 'U_flayer2') || get(body, 'U_flayer') != 'Да';
                const vulkanUpdate = await get(body, 'U_vulkanizatsiya2') || get(body, 'U_vulkanizatsiya') != 'Да';
                let account = []

                if (flayerUpdate || vulkanUpdate) {
                    account = await DisCount.find()
                    let obj = {
                        "U_flayer": get(body, 'U_flayer') ? 'Да' : (flayerUpdate ? 'Да' : "Нет"),
                        "U_vulkanizatsiya": get(body, 'U_vulkanizatsiya') ? 'Да' : (vulkanUpdate ? 'Да' : "Нет")
                    }
                    let update = await this.updateInvoice(get(body, 'DocEntry'), obj)
                    await sleepNow(300)
                }

                let incoming = await this.postIncomingPayment(body, get(body, 'U_schot'))



                if (flayerUpdate) {
                    let acc = account.find(item => item.U_name_disc === 'FLAYER');
                    let incoming = await this.postIncomingPayment({ ...body, DocEntry: get(body, 'DocEntry'), value: acc.U_sum_disc }, acc.Code);
                    await sleepNow(300)

                    console.log('FLAYER payment muvaffaqiyatli:');
                }

                if (vulkanUpdate) {
                    let acc = account.find(item => item.U_name_disc === 'VULKANIZATSIYA');
                    let incoming = await this.postIncomingPayment({ ...body, DocEntry: get(body, 'DocEntry'), value: acc.U_sum_disc }, acc.Code);
                    await sleepNow(300)

                    console.log('VULKANIZATSIYA payment muvaffaqiyatli:');
                }

                return res.status(get(incoming, 'status')).json(incoming)

            } catch (error) {
                console.error('Tranzaktsiya muvaffaqiyatsiz:', error.message);
                return res.status(500).json({ status: false, message: error.message });
            }
        }

        let schema = {
            "CardCode": get(body, 'CardCode'),
            "DocDate": get(body, 'DocDate'),
            "DocCurrency": "UZS",
            "DocDueDate": get(body, 'DocDueDate'),
            "Comments": get(body, 'Comments'),
            "U_branch": get(body, 'U_branch'),
            "U_car": get(body, 'U_car', ''),
            "U_merchantturi": get(body, 'U_merchantturi', ''),
            "U_markamashina": get(body, 'U_markamashina', ''),
            "U_merchantfoizi": get(body, 'U_merchantfoizi', ''),
            "U_flayer": get(body, 'U_flayer2') ? 'Да' : "Нет",
            "U_vulkanizatsiya": get(body, 'U_vulkanizatsiya2') ? 'Да' : "Нет",
            "DocumentLines": get(body, 'Items', []).map(item => {
                return {
                    ItemCode: item.ItemCode,
                    Quantity: item.Quantity,
                    Price: item.Price * item.Quantity,
                    UnitPrice: item.Price,
                    WarehouseCode: get(body, 'U_branch'),
                    CostingCode: get(body, 'U_branch'),
                    COGSCostingCode: get(body, 'U_branch'),
                    "Currency": "UZS"
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
                let account = []
                if (get(body, 'U_flayer2') || get(body, 'U_vulkanizatsiya2')) {
                    account = await DisCount.find()
                }
                if (get(body, 'U_flayer2')) {
                    let acc = account.find(item => item.U_name_disc == 'FLAYER')
                    await sleepNow(300)
                    let incoming = await this.postIncomingPayment({ ...body, DocEntry: get(data, 'DocEntry'), value: acc.U_sum_disc }, acc.Code)

                }

                if (get(body, 'U_vulkanizatsiya2')) {
                    let acc = account.find(item => item.U_name_disc == 'VULKANIZATSIYA')
                    await sleepNow(300)
                    let incoming = await this.postIncomingPayment({ ...body, DocEntry: get(data, 'DocEntry'), value: acc.U_sum_disc }, acc.Code)

                }

                await sleepNow(300)

                let items = await b1HANA.getInvoiceItems(get(body, 'Items', []).map(item => item.ItemCode), get(body, 'U_branch'))
                let incoming = await this.postIncomingPayment({ ...body, DocEntry: get(data, 'DocEntry') }, get(body, 'U_schot'))

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

    postIncomingPayment = async (body, account = 50101) => {
        let schema = {
            "CardCode": get(body, 'CardCode'),
            "CashAccount": account,
            "DocCurrency": "UZS",
            "CashSum": get(body, 'value'),
            "CashSumFC": get(body, 'value'),
            "CashSumSys": get(body, 'value'),
            "U_branch": get(body, 'U_branch'),
            "U_tolovturi": `${get(body, 'U_merchantturi', '')} - ${get(body, 'U_merchantfoizi', '')} %`,
            "PaymentInvoices": [
                {
                    "AppliedFC": get(body, 'value'),
                    "AppliedSys": get(body, 'value'),
                    "DocEntry": get(body, 'DocEntry'),
                    "DistributionRule": get(body, 'U_branch')
                }
            ],
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
            .post(`/IncomingPayments`, schema)
            .then(async ({ data }) => {
                await b1HANA.getInvoiceByDocEntry(get(body, 'DocEntry'), body)
                return { status: 201 }
            })
            .catch(async (err) => {
                if (get(err, 'response.status') == 401) {
                    let token = await this.auth()
                    if (token.status) {
                        return await this.postIncomingPayment(body, account)
                    }
                    return { status: get(err, 'response.status', 400) || 400, message: get(err, 'response.data.error.message.value') }
                } else {
                    return { status: get(err, 'response.status', 400) || 400, message: get(err, 'response.data.error.message.value') }
                }
            });
    }


}

module.exports = new b1SL();


