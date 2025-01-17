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
                   T1."LineTotal",
                   T3."ItmsGrpCod",
                   T3."UserText",
                   T3."PicturName"
            FROM ${this.db}.OINV T0
            INNER JOIN ${this.db}.INV1 T1 ON T1."DocEntry" = T0."DocEntry"
            INNER JOIN ${this.db}.OCRD T2 ON T0."CardCode" = T2."CardCode"
            INNER JOIN ${this.db}.OITM T3 on T3."ItemCode" = T1."ItemCode"
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
                    T0."UserText", 
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

    getDiscountGroups() {
        let sql = `
        SELECT T0."U_group_code" FROM ${this.db}."@DISCOUNTGROUP" T0 
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
       T1."LineTotal",
       T3."ItmsGrpCod",
       T3."UserText",
        T3."PicturName"
FROM ${this.db}.OINV T0
INNER JOIN ${this.db}.INV1 T1 ON T1."DocEntry" = T0."DocEntry"
INNER JOIN ${this.db}.OCRD T2 ON T0."CardCode" = T2."CardCode"
INNER JOIN ${this.db}.OITM T3 ON T3."ItemCode" = T1."ItemCode"
  AND T0."CANCELED" = 'N' 
  AND (T0."DocStatus" = 'O' OR T0."DocStatus" = 'C') and T0."DocEntry" = '${doc}'`
        return sql
    }

    getInvoiceItems(items, U_branch) {
        let sql = ` SELECT  
        T0."UserText",
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

        let len = `SELECT COUNT(*) FROM (
            SELECT 'W' AS "ApprovalStatus"
            FROM ${this.db}."OPDF" T0
            INNER JOIN ${this.db}."PDF4" T1 on T1."DocNum" = T0."DocEntry" 
            WHERE T0."DocType" = 'A' 
              AND T0."U_branch" = '${U_branch}'
              AND NOT EXISTS (
                  SELECT 1 FROM ${this.db}."OVPM" VP 
                  WHERE VP."DraftKey" = T0."DocEntry"
              )
        
            UNION ALL
        
            SELECT 'Y' AS "ApprovalStatus"
            FROM ${this.db}."OVPM" T0 
            INNER JOIN ${this.db}."VPM4" T1 on T1."DocNum" = T0."DocEntry" 
            WHERE T0."DocType" = 'A' 
              AND T0."Canceled" = 'N' 
              AND T0."U_branch" = '${U_branch}'
        ) AS subquery`;

        return `SELECT * , (${len}) AS "LENGTH" FROM (
            SELECT 
            T0."Comments",
    CASE 
        WHEN T0."Canceled" = 'Y' 
            THEN 'N' -- Payment Draft reject qilingan
        ELSE 'W' -- Kutish holatida
    END AS "ApprovalStatus",
    T0."DocEntry",
    T1."AcctCode",
    T1."AcctName",
    T0."DocNum", 
    T0."DocType", 
    T0."Canceled", 
    T0."DocDate", 
    T0."DocDueDate", 
    T0."CardCode", 
    T0."CashSum", 
    T0."CashSumFC", 
    T0."DocCurr", 
    T0."DocRate", 
    T0."DocTotal", 
    T0."DocTotalFC",
    T1."AppliedFC"
FROM ${this.db}."OPDF" T0
INNER JOIN ${this.db}."PDF4" T1 on T1."DocNum" = T0."DocEntry" 
WHERE T0."DocType" = 'A' 
  AND T0."U_branch" = '${U_branch}'
  AND NOT EXISTS (
      SELECT 1 FROM ${this.db}."OVPM" VP 
      WHERE VP."DraftKey" = T0."DocEntry"
  )
            UNION ALL
            SELECT 
            T0."Comments",
                'Y' AS "ApprovalStatus", 
                T0."DocEntry",
                T1."AcctCode",
                T1."AcctName",
                T0."DocNum", 
                T0."DocType", 
                T0."Canceled", 
                T0."DocDate", 
                T0."DocDueDate", 
                T0."CardCode", 
                T0."CashSum", 
                T0."CashSumFC", 
                T0."DocCurr", 
                T0."DocRate", 
                T0."DocTotal", 
                T0."DocTotalFC",
                T1."AppliedFC"
            FROM ${this.db}."OVPM" T0 
            INNER JOIN ${this.db}."VPM4" T1 on T1."DocNum" = T0."DocEntry" 
            WHERE T0."DocType" = 'A' 
              AND T0."Canceled" = 'N' 
              AND T0."U_branch" = '${U_branch}'
        ) AS subquery
        ORDER by "DocNum" DESC
        LIMIT ${limit} OFFSET ${offset - 1}`;

    }
    outGoingByDocEntry(id, draft) {
        let sql = ''
        if (draft == 'draft') {
            sql = `
            SELECT 
            T0."Comments",
            T0."DocEntry",
            T1."AcctCode",
            T1."AcctName",
            T0."DocNum", 
            T0."DocType", 
            T0."Canceled", 
            T0."DocDate", 
            T0."DocDueDate", 
            T0."CardCode", 
            T0."CashSum", 
            T0."CashSumFC", 
            T0."DocCurr", 
            T0."DocRate", 
            T0."DocTotal", 
            T0."DocTotalFC",
            T1."AppliedFC"
        FROM ${this.db}."OPDF" T0
        INNER JOIN ${this.db}."PDF4" T1 on T1."DocNum" = T0."DocEntry" 
        WHERE T0."DocType" = 'A' 
          AND T0."DocEntry" = ${id}
          AND NOT EXISTS (
              SELECT 1 FROM ${this.db}."OVPM" VP 
              WHERE VP."DraftKey" = T0."DocEntry"
          )
            `
        }
        else {
            sql = `SELECT 
            T0."Comments",
            T0."DocEntry",
            T1."AcctCode",
            T1."AcctName",
            T0."DocNum", 
            T0."DocType", 
            T0."Canceled", 
            T0."DocDate", 
            T0."DocDueDate", 
            T0."CardCode", 
            T0."CashSum", 
            T0."CashSumFC", 
            T0."DocCurr", 
            T0."DocRate", 
            T0."DocTotal", 
            T0."DocTotalFC",
            T1."AppliedFC"
        FROM ${this.db}."OVPM" T0 
        INNER JOIN ${this.db}."VPM4" T1 on T1."DocNum" = T0."DocEntry" 
        WHERE T0."DocType" = 'A' 
          AND T0."Canceled" = 'N' 
          AND T0."DocEntry" = ${id}
   `
        }
        return sql
    }


    getAcctSearch(value = '') {
        return `
            Select * from ${this.db}.OACT
        `;
    }


    getAllAcct() {
        return `
        SELECT T0."AcctCode", T0."AcctName", T0."CurrTotal", T0."Levels" FROM ${this.db}.OACT T0  WHERE T0."AcctCode" like '94%'
        `;
    }
    cashReport(U_branch, merchants) {
        return `
        SELECT
            A1."OcrCode", A0."Type", A0."AcctCode", SUM(A0."InSum") AS "InSum", SUM(A0."OutSum") AS "OutSum", SUM(A0."InSum")-SUM(A0."OutSum") AS "Balance" 
            FROM 
            (
            SELECT
            T1."OcrCode" AS "OcrCode", 'Incoming' AS "Type", T2."AcctCode", SUM(T1."AppliedFC") AS "InSum", 0 AS "OutSum"
            FROM ${this.db}.ORCT T0 INNER JOIN ${this.db}.RCT2 T1 ON T1."DocNum" = T0."DocEntry"
            INNER JOIN ${this.db}.OACT T2 ON T2."AcctCode" = T0."CashAcct"
            WHERE T2."AcctCode" in (${merchants}) AND T0."Canceled" = 'N'
            GROUP BY T1."OcrCode", T2."AcctCode"

            UNION ALL

            SELECT B0."ProfitCode", 'Incoming',B0."Account", SUM(B0."FCDebit"), 0 FROM ${this.db}.JDT1 B0 WHERE B0."TransId" = '174' AND B0."Account" LIKE '5%'
            GROUP BY B0."ProfitCode", B0."Account"

            UNION ALL 

            SELECT 
            T1."OcrCode", 'Outgoing', T3."AcctCode", 0, SUM(T1."AppliedFC")
            FROM ${this.db}.OVPM T0 INNER JOIN ${this.db}.VPM4 T1 ON T1."DocNum" = T0."DocEntry"
            INNER JOIN ${this.db}.OACT T2 ON T2."AcctCode" = T1."AcctCode" AND (T2."AcctCode" LIKE '5%' OR T2."AcctCode" LIKE '94%')
            INNER JOIN ${this.db}.OACT T3 ON T3."AcctCode" = T0."CashAcct" 
            WHERE T3."AcctCode" in (${merchants}) AND T0."Canceled" = 'N'
            GROUP BY T1."OcrCode", T3."AcctCode"

            UNION ALL

            SELECT T1."OcrCode", 'Outgoing', T2."AcctCode", 0, SUM(T1."AppliedFC")
            FROM ${this.db}.ORCT T0 INNER JOIN ${this.db}.RCT4 T1 ON T1."DocNum" = T0."DocEntry"
            INNER JOIN ${this.db}.OACT T2 ON T2."AcctCode" = T1."AcctCode"
            WHERE T0."Canceled" = 'N' AND T2."AcctCode" in (${merchants}) 
            AND (T0."CashAcct" LIKE '56%' OR T0."TrsfrAcct" LIKE '51%') AND T1."AcctCode" LIKE '57%' 
            GROUP BY T1."OcrCode", T2."AcctCode"

            UNION ALL

            -- FOIZ

            SELECT T0."ProfitCode", 'MerchOut', T3."AcctCode", 0,  SUM(T0."FCCredit")
            FROM ${this.db}.JDT1 T0 INNER JOIN ${this.db}.OJDT T2 ON T2."TransId" = T0."TransId"
            AND T2."StornoToTr" IS NULL AND T0."TransId" NOT IN (SELECT A0."StornoToTr" FROM ${this.db}.OJDT A0 WHERE A0."StornoToTr" IS NOT NULL)
            INNER JOIN ${this.db}.OACT T3 ON T3."AcctCode" = T0."Account"
            WHERE T3."AcctCode" in (${merchants}) AND T0."FCCredit" > 0 AND T0."Account" LIKE '57%' AND T0."ContraAct" LIKE '94%' 
            GROUP BY T0."ProfitCode", T3."AcctCode"
            ) AS A0 LEFT JOIN ${this.db}.OOCR A1 ON A0."OcrCode" = A1."OcrCode" AND A1."DimCode" = '1' and A0."OcrCode" = '${U_branch}'
            GROUP BY A1."OcrCode", A0."Type", A0."AcctCode"
        `;
    }




}

module.exports = new DataRepositories(db);
