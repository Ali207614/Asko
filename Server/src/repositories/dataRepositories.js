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

    getInvoices({ offset = '1', limit = '1', status = 'false' }, { U_branch, SlpCode }) {
        let last30DaysFilter = `."DocDate" >= ADD_DAYS(CURRENT_DATE, -30) ${status == 'true' ? `LIMIT ${limit} 
        OFFSET ${offset - 1}` : ''}`;
        let length = `SELECT SUM(1) FROM ${this.db}.OINV T0 WHERE T0."U_branch" = '${U_branch}' AND T0."CANCELED" = 'N' AND ( T0."DocStatus" = 'O' or T0."DocStatus" = 'C') AND T0${last30DaysFilter}`;
        return `
            SELECT (${length}) as length, 
                   T0."DocEntry", 
                   T0."DocNum", 
                   T0."DocType", 
                   T0."CANCELED", 
                   T0."DocStatus", 
                   T0."DocDate", 
                   T0."DocDueDate", 
                   T0."CardCode", 
                   T0."CardName", 
                   T0."DocCur", 
                   T0."DocRate", 
                   T0."DocTotal", 
                   T0."PaidToDate", 
                   T0."SlpCode", 
                   T0."U_branch" ,
                   T1."ItemCode", T1."Dscription", T1."Quantity", T1."Price", T1."DiscPrcnt", T1."LineTotal" 
            FROM ${this.db}.OINV T0 
            INNER JOIN ${this.db}.INV1 T1 ON T1."DocEntry" = T0."DocEntry"
            WHERE T0."DocEntry" in  (
                    select 
                A0."DocEntry" 
                from ${this.db}.OINV A0 
                where A0."U_branch" = '${U_branch}' 
            AND A0."CANCELED" = 'N' and  ( A0."DocStatus" = 'O' or A0."DocStatus" = 'C') and A0${last30DaysFilter})
            ORDER BY T0."DocNum" 
            `;

    }


    getAnotherQuery() {
        return `
      SELECT * FROM ${this.db}.SomeTable WHERE condition = true;
    `;
    }
}

module.exports = new DataRepositories(db);
