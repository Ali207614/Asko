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

    getInvoices({ offset = '1', limit = '1', status = 'false', statusPay = '', docDateStart, docDateEnd, search }, { U_branch, SlpCode }) {
        let dateFilter = "";
        if (docDateStart && docDateEnd) {
            dateFilter = `AND T0."DocDate" BETWEEN '${docDateStart}' AND '${docDateEnd}'`;
        }

        let searchFilter = "";
        if (search) {
            searchFilter = `AND (
                T0."CardName" LIKE '%${search}%' OR 
                T0."U_car" LIKE '%${search}%' OR 
                T2."Phone1" LIKE '%${search}%' OR 
                T2."Phone2" LIKE '%${search}%'
            )`;
        }

        let statusPayFilter = "";
        if (statusPay) {
            const conditions = [];
            if (statusPay.includes("1")) {
                conditions.push(`(T0."DocTotal" = T0."PaidToDate" AND T0."DocTotal" > 0)`); // To'liq to'langan
            }
            if (statusPay.includes("2")) {
                conditions.push(`(T0."PaidToDate" = 0)`); // Umuman to'lanmagan
            }
            if (statusPay.includes("3")) {
                conditions.push(`(T0."PaidToDate" > 0 AND T0."PaidToDate" < T0."DocTotal")`); // Chala to'langan
            }
            statusPayFilter = `AND (${conditions.join(" OR ")})`;
        }

        let lengthQuery = `
            SELECT COUNT(1) 
            FROM ${this.db}.OINV T0 
            WHERE T0."U_branch" = '${U_branch}' 
              AND T0."CANCELED" = 'N' 
              AND (T0."DocStatus" = 'O' OR T0."DocStatus" = 'C') 
              ${dateFilter} 
              ${searchFilter} 
              ${statusPayFilter}
        `;

        return `
            SELECT (${lengthQuery}) as length, 
                   T2."Phone1",
                   T2."Phone2",
                   T0."DocEntry", 
                   T0."U_car", 
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
                   T2."U_branch",
                   T1."ItemCode", 
                   T1."Dscription", 
                   T1."Quantity", 
                   T1."Price", 
                   T1."DiscPrcnt", 
                   T1."LineTotal"
            FROM ${this.db}.OINV T0
            INNER JOIN ${this.db}.INV1 T1 ON T1."DocEntry" = T0."DocEntry"
            INNER JOIN ${this.db}.OCRD T2 ON T0."CardCode" = T2."CardCode"
            WHERE T0."U_branch" = '${U_branch}' 
              AND T0."CANCELED" = 'N' 
              AND (T0."DocStatus" = 'O' OR T0."DocStatus" = 'C') 
              ${dateFilter} 
              ${searchFilter} 
              ${statusPayFilter}
            ORDER BY T0."DocNum"
            LIMIT ${limit} 
            OFFSET ${offset - 1}
        `;
    }

    getItems({ offset = '1', limit = '1', status = 'false' }, { U_branch, SlpCode }) {
        let pagination = status == 'true' ? ` LIMIT ${limit} 
        OFFSET ${offset - 1}` : ''

        let lengthQuery = `
            SELECT COUNT(1) 
            FROM ${this.db}.OITM  T0 INNER JOIN ${this.db}.OITW  T1 ON T0."ItemCode" = T1."ItemCode" INNER JOIN ${this.db}.ITM1 T3 ON T0."ItemCode" = T3."ItemCode" INNER JOIN ${this.db}.OPLN T4 ON T3."PriceList" = T4."ListNum"  WHERE T4."ListName"  = '${U_branch}' and T1."WhsCode" = '${U_branch}' 
        `;
        return `
        SELECT (${lengthQuery}) as length,  T0."U_BRAND",T0."U_Measure", T0."PicturName", T0."ItmsGrpCod", T1."IsCommited", T1."OnHand", T1."OnOrder", T1."Counted", T0."ItemCode", T0."ItemName", T0."CodeBars", T1."AvgPrice", T4."ListName", T3."PriceList", T3."Price" , T3."Currency" FROM ${this.db}.OITM  T0 INNER JOIN ${this.db}.OITW  T1 ON T0."ItemCode" = T1."ItemCode" INNER JOIN ${this.db}.ITM1 T3 ON T0."ItemCode" = T3."ItemCode" INNER JOIN ${this.db}.OPLN T4 ON T3."PriceList" = T4."ListNum"  WHERE T4."ListName"  = '${U_branch}' and T1."WhsCode" = '${U_branch}' 
        ORDER BY T0."ItemName"
        ${pagination}
    `;
    }
}

module.exports = new DataRepositories(db);
