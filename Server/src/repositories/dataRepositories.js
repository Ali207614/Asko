const moment = require('moment');
const { db } = require('../config');

class DataRepositories {
    constructor(dbName) {
        this.db = dbName;
    }

    // OPCH so'rovini qaytaradi
    getSalesManager({ login = '', password = '' }) {
        return `
        SELECT T0."SlpCode", T0."SlpName", T0."GroupCode", T0."Telephone", T0."U_login", T0."U_password", T0."U_branch" FROM ${this.db}.OSLP T0 where T0."U_login"= '${login}' and T0."U_password"='${password}'`;
    }

    // Boshqa so'rovlar uchun metodlar qo'shishingiz mumkin
    getAnotherQuery() {
        return `
      SELECT * FROM ${this.db}.SomeTable WHERE condition = true;
    `;
    }
}

module.exports = new DataRepositories(db);
