
const { get } = require('lodash')
const moment = require('moment')
let { db } = require('../config')


module.exports = {

    GETOPCH: `SELECT T0."DocType", T0."CANCELED", T0."DocStatus", T0."DocDueDate", T1."ItemCode", T1."Dscription" FROM ${db}.OPCH T0  INNER JOIN ${db}.PCH1 T1 ON T0."DocEntry" = T1."DocEntry" WHERE T0."DocType" ='I' and  T0."CANCELED" ='N' and  T0."DocStatus" ='O'`,
}


