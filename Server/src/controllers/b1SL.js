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


}

module.exports = new b1SL();


