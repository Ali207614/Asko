const moment = require('moment');
const { db } = require('../config');

class DataRepositories {
    constructor(dbName) {
        this.db = dbName;
    }

    // OPCH so'rovini qaytaradi
    getSalesManager({ login = '', password = '' }) {
        return `
        SELECT T0."SlpCode", T0."SlpName", T0."GroupCode", T0."Telephone", T0."U_login", T0."U_password", T0."U_branch" ,T0."U_role" FROM ${this.db}.OSLP T0 where T0."U_login"= '${login}' and T0."U_password"='${password}'`;
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
        // T0."U_markamashina", T0."U_nomer", T0."U_merchantturi", T0."U_maerchantfoiz", T0."U_flayer", T0."U_vulkanizatsiya", T0."U_branch"

        return `
            SELECT (${lengthQuery}) as length, 
                    T0."U_merchantturi",
                    T0."U_merchantfoizi",
                    T0."U_flayer",
                    T0."U_vulkanizatsiya",
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
                    T0."DocTotalSy", 
                   T0."PaidSys", 
                   T0."DocTotal", 
                   T0."PaidToDate", 
                   T0."SlpCode", 
                   T0."U_branch",
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
            ORDER BY T0."DocEntry" desc
            LIMIT ${limit} 
            OFFSET ${offset - 1}
        `;
    }

    getItems({ offset = '1', limit = '1', status = 'false', search = '', items = '' }, { U_branch, SlpCode }) {
        let pagination = status == 'true' ? ` LIMIT ${limit} OFFSET ${offset - 1}` : '';

        // Agar "items" bo'sh bo'lmasa, filter yaratamiz
        let itemsFilter = items ? `AND T0."ItemCode" NOT IN (${items})` : '';

        // Agar "search" bo'sh bo'lmasa, qidiruv shartini qo'shamiz
        let searchFilter = search ? `AND (
            LOWER(T0."ItemCode") LIKE LOWER('%${search}%') OR
            LOWER(T0."ItemName") LIKE LOWER('%${search}%') OR
            LOWER(T5."Name") LIKE LOWER('%${search}%') OR
            LOWER(T0."U_Article") LIKE LOWER('%${search}%')
        )` : '';

        let lengthQuery = `
            SELECT COUNT(1) 
            FROM ${this.db}.OITM T0 
            LEFT JOIN ${this.db}.OITW T1 ON T0."ItemCode" = T1."ItemCode" 
            LEFT JOIN ${this.db}.ITM1 T3 ON T0."ItemCode" = T3."ItemCode" 
            LEFT JOIN ${this.db}.OPLN T4 ON T3."PriceList" = T4."ListNum"  
            LEFT JOIN ${this.db}."@BREND" T5 ON T0."U_brend" = T5."Code"
            WHERE T4."ListName" = '${U_branch}' 
              AND T1."WhsCode" = '${U_branch}' 
              ${itemsFilter} 
              ${searchFilter}
        `;

        return `
            SELECT (${lengthQuery}) as length,  
                   T0."U_brend",
                   T0."U_Article", 
                   T0."PicturName", 
                   T0."ItmsGrpCod", 
                   T1."IsCommited", 
                   T1."OnHand", 
                   T1."OnOrder", 
                   T1."Counted", 
                   T0."ItemCode", 
                   T0."ItemName", 
                   T0."CodeBars", 
                   T1."AvgPrice", 
                   T4."ListName", 
                   T3."PriceList", 
                   T3."Price", 
                   T3."Currency",
                   T5."Name"
            FROM ${this.db}.OITM T0 
            LEFT JOIN ${this.db}.OITW T1 ON T0."ItemCode" = T1."ItemCode" 
            LEFT JOIN ${this.db}.ITM1 T3 ON T0."ItemCode" = T3."ItemCode" 
            LEFT JOIN ${this.db}.OPLN T4 ON T3."PriceList" = T4."ListNum"  
            LEFT JOIN ${this.db}."@BREND" T5 ON T0."U_brend" = T5."Code"
            WHERE T4."ListName" = '${U_branch}' 
              AND T1."WhsCode" = '${U_branch}' 
              ${itemsFilter} 
              ${searchFilter} 
            ORDER BY T1."OnHand" DESC
            ${pagination}
        `;
    }

    getItemGroups() {
        let sql = `
        SELECT  T0."ItmsGrpCod", T0."ItmsGrpNam" FROM ${this.db}.OITB T0 
        `
        return sql
    }

    getAllBusinessPartners() {
        let sql = `
        SELECT T0."U_provincy", T0."U_region", T0."U_whwerasko",T0."U_gender" , T0."U_dateofbirth" , T0."CardCode", T0."CardName", T0."CardType", T0."GroupCode", T0."Phone1", T0."Phone2", T0."Balance" FROM ${this.db}.OCRD T0 WHERE T0."CardType" ='C'`
        return sql
    }

    getCars({ cardCode = '' }) {
        let sql = `
        SELECT T0."Code", T0."U_marka",T0."U_car_km", T0."U_bp_code", T0."U_car_code", T0."U_bp_name", T0."U_car_name" FROM ${this.db}."@CARCODE"  T0 where "U_bp_code" = '${cardCode}'`
        return sql
    }
    getBusinessPartnerAndCars({ CardCode = '' }) {
        let sql = `
        SELECT T1."Code", T1."U_marka",T1."U_car_km", T1."U_bp_code", T1."U_car_code", T1."U_bp_name", T1."U_car_name", T0."U_provincy", T0."U_region", T0."U_whwerasko",T0."U_gender" , T0."U_dateofbirth" , T0."CardCode", T0."CardName", T0."CardType", T0."GroupCode", T0."Phone1", T0."Phone2", T0."Balance" FROM ${this.db}.OCRD T0
        left JOIN ${this.db}."@CARCODE" T1 on T1."U_bp_code" = T0."CardCode"  WHERE T0."CardType" ='C' and T0."CardCode" = '${CardCode}'`
        return sql
    }

    getLastCodeCars() {
        let sql = `
        SELECT T0."Code", T0."U_marka", T0."U_car_km", T0."U_bp_code", T0."U_car_code", T0."U_bp_name", T0."U_car_name"
        FROM ${this.db}."@CARCODE" T0
        ORDER BY CAST(T0."Code" AS INTEGER) DESC
        LIMIT 1;
        
    `;
        return sql

    }
    getLastCurrency() {
        let sql = `SELECT T0."Currency", T0."RateDate", T0."Rate" 
        FROM ${db}.ORTT T0 
        WHERE T0."RateDate" = CURRENT_DATE and T0."Currency"='UZS'`
        return sql
    }

    getMerchant() {
        let sql = `SELECT T0."Code", T0."U_merchant", T0."U_Foiz", T0."U_schot"  , T0."U_status" FROM ${this.db}."@MERCHANT"  T0`
        return sql
    }

    getInvoiceByDocEntry(doc) {
        let sql = `SELECT
        T0."U_merchantturi",
        T0."U_merchantfoizi",
        T0."U_flayer",
        T0."U_vulkanizatsiya",
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
       T0."DocTotalSy", 
       T0."PaidSys", 
       T0."PaidToDate", 
       T0."SlpCode", 
       T0."U_branch",
       T1."ItemCode", 
       T1."Dscription", 
       T1."Quantity", 
       T1."Price", 
       T1."DiscPrcnt", 
       T1."LineTotal"
FROM ${this.db}.OINV T0
INNER JOIN ${this.db}.INV1 T1 ON T1."DocEntry" = T0."DocEntry"
INNER JOIN ${this.db}.OCRD T2 ON T0."CardCode" = T2."CardCode"
  AND T0."CANCELED" = 'N' 
  AND (T0."DocStatus" = 'O' OR T0."DocStatus" = 'C') and T0."DocEntry" = '${doc}'`
        return sql
    }

    getInvoiceItems(items, U_branch) {
        let sql = ` SELECT  
T0."U_brend",
T0."U_Article", 
T0."PicturName", 
T0."ItmsGrpCod", 
T1."IsCommited", 
T1."OnHand", 
T1."OnOrder", 
T1."Counted", 
T0."ItemCode", 
T0."ItemName", 
T0."CodeBars", 
T1."AvgPrice", 
T4."ListName", 
T3."PriceList", 
T3."Price", 
T3."Currency",
T5."Name"
FROM ${this.db}.OITM T0 
LEFT JOIN ${this.db}.OITW T1 ON T0."ItemCode" = T1."ItemCode" 
LEFT JOIN ${this.db}.ITM1 T3 ON T0."ItemCode" = T3."ItemCode" 
LEFT JOIN ${this.db}.OPLN T4 ON T3."PriceList" = T4."ListNum"  
LEFT JOIN ${this.db}."@BREND" T5 ON T0."U_brend" = T5."Code"
WHERE T4."ListName" = '${U_branch}' 
AND T1."WhsCode" = '${U_branch}' 
AND T0."ItemCode" in (${items.map(el => `'${el}'`)})
ORDER BY T0."ItemName"`
        return sql
    }

    getUFD1() {
        return `select * from ${this.db}.UFD1 T0  WHERE T0."TableID" in ('OCRD','@CARCODE','@MERCHANT')`
    }

    disCount() {
        return `SELECT T0."Code", T0."U_code_disc", T0."U_name_disc", T0."U_sum_disc" FROM ${this.db}."@DISCOUNT"  T0`
    }

    outGoing(U_branch = '', { offset, limit, search }) {
        return `
        WITH FilteredData AS (
            SELECT 
                T1."AcctName", 
                T0."DocNum", 
                T0."DocType", 
                T0."Canceled", 
                T0."DocDate" AS "DocumentDate",
                T0."DocDueDate", 
                T0."CardCode", 
                T0."DocTotal", 
                T0."DocTotalFC", 
                T0."CardName",
                T2."Status" AS "ApprovalStatus", 
                CASE T2."Status"
                    WHEN 'W' THEN 'Waiting for Approval'
                    WHEN 'Y' THEN 'Approved'
                    WHEN 'N' THEN 'Rejected'
                    ELSE 'No Approval Process'
                END AS "ApprovalStatusDescription"
            FROM ${this.db}.OVPM T0
            INNER JOIN ${this.db}.OACT T1 ON T0."CardCode" = T1."AcctCode"
            LEFT JOIN ${this.db}.OWDD T2 ON T0."DocEntry" = T2."DocEntry" 
            WHERE 
                T0."Canceled" = 'N' 
                AND T0."DocType" = 'A' 
                AND T0."U_branch" = '${U_branch}'
                AND T2."ObjType" = 46
                ${search ? `AND (T1."AcctName" LIKE '%${search}%' OR T0."CardName" LIKE '%${search}%')` : ''}
        )
        SELECT 
            *,
            (SELECT COUNT(*) FROM FilteredData) AS "LENGTH"
        FROM FilteredData
        ORDER BY "DocumentDate" DESC 
        LIMIT ${limit}
        OFFSET ${offset - 1};
        `;
    }


    getAcctSearch(value = '') {
        return `
            Select * from ${this.db}.OACT
        `;
    }




}

module.exports = new DataRepositories(db);
