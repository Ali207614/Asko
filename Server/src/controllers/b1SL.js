const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
let dbService = require('../services/dbService')

const moment = require('moment');
const { getSession, saveSession } = require("../helpers");
const { } = require("../repositories/dataRepositories");
require('dotenv').config();


class b1SL {
    constructor() {
        this.api = process.env.api;
    }
    async auth() {
        let obj = {
            "CompanyDB": process.env.db,
            "UserName": process.env.userNameB1,
            "Password": process.env.passwordB1
        }
        const axios = Axios.create({
            baseURL: `https://${this.api}:50000/b1s/v1/`,
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

    async proxyFunc(req, res) {
        const { path } = req.params
        delete req.headers.host
        delete req.headers['content-length']
        if (!path) {
            return res.status(404).json({
                "error": {
                    "message": "Unrecognized resource path."
                }
            })
        }

        let cookie;
        if (!req.headers?.info) {
            cookie = req.headers
        }
        else {
            cookie = { ...JSON.parse(req.headers?.info), ...req.headers }
        }
        return axios({
            url: `https://${process.env.api}:50000` + req.originalUrl,
            method: req.method,
            data: req.body,
            timeout: 90000,
            headers: cookie,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        })
            .then(({ data, headers }) => {
                return res.status(200).json({ ...data, ...headers });
            })
            .catch(async (err) => {
                return res.status(err?.response?.status)
                    .json(err?.response?.data || err)
            });
    }
}

module.exports = new b1SL();


