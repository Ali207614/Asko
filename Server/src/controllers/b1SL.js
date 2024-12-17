const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
let dbService = require('../services/dbService')

const moment = require('moment');
const { getSession, saveSession } = require("../helpers");
const { } = require("../repositories/dataRepositories");
const { api_params } = require("../config");
const b1HANA = require("./b1HANA");
const BusinessPartner = require("../models/BusinessPartner");
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
        console.log(body)
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

}

module.exports = new b1SL();


