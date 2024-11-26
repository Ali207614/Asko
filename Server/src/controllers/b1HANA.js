const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
let dbService = require('../services/dbService')

const { } = require("../repositories/dataRepositories");
require('dotenv').config();


class b1HANA {

    async getBusinessPartnerByPhone(phone = '') {
        try {
            let data = await dbService.executeParam(GETBUSINESSPARTNERBYPHONE, [phone, phone])
            return data
        }
        catch (e) {
            throw new Error(e)
        }
    }

}

module.exports = new b1HANA();


