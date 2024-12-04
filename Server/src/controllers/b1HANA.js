const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
const tokenService = require('../services/tokenService');

let dbService = require('../services/dbService')

const DataRepositories = require("../repositories/dataRepositories");
const ApiError = require("../exceptions/api-error");
const Invoice = require("../models/Invoice");
require('dotenv').config();


class b1HANA {

    execute = async (sql) => {
        try {
            let data = await dbService.execute(sql);
            return data;
        } catch (e) {
            throw new Error(e);
        }
    };

    login = async (req, res, next) => {
        const { login, password } = req.body;
        if (!login || !password) {
            return next(ApiError.BadRequest('Некорректный login или password'));
        }

        const query = await DataRepositories.getSalesManager({ login, password });
        let user = await this.execute(query);
        if (user.length == 0) {
            return next(ApiError.BadRequest('Пользователь не найден'));
        }

        if (user.length > 1) {
            return next(ApiError.BadRequest('Найдено несколько пользователей с указанными учетными данными. Проверьте введенные данные.'));
        }

        if (!get(user, `[0].U_branch`, '')) {
            return next(ApiError.BadRequest('Филиал не выбран'));
        }
        const token = tokenService.generateJwt(user[0])
        return res.json({ token, data: { SlpCode: get(user, '[0].SlpCode'), U_branch: get(user, '[0].U_branch') } })
    };

    invoices = async (req, res, next) => {
        if (get(req, 'query.status', '') == 'false') {
            const totalDocuments = await Invoice.countDocuments({ U_branch: req.user.U_branch })
            if (totalDocuments) {
                const search = req.query.search || "";
                const offset = parseInt(req.query.offset, 10) || 0;
                const limit = parseInt(req.query.limit, 10) || 10;

                let searchQuery = { U_branch: req.user.U_branch };

                if (search.trim().length) {
                    searchQuery = {
                        ...searchQuery,
                        $or: [
                            { CardName: { $regex: search, $options: "i" } },
                            { Phone1: { $regex: search, $options: "i" } },
                            { U_car: { $regex: search, $options: "i" } }
                        ]
                    };
                }

                const invoices = await Invoice.find(searchQuery)
                    .skip(offset - 1)
                    .limit(limit)
                    .lean();
                return res.status(200).json([...invoices.map(item => {
                    return { ...item, LENGTH: totalDocuments }
                })])
            }
        }
        const query = await DataRepositories.getInvoices(req.query, req.user);
        let data = await this.execute(query);
        let newInvoices = []
        if (data.length) {
            let docs = [...new Set(data.map(item => item.DocEntry))]
            let mapped = docs.map(item => {
                return { ...data.find(el => el.DocEntry == item), Items: data.filter(el => el.DocEntry == item) }
            })
            if (get(req, 'query.status', '') == 'false') {
                newInvoices = await Invoice.insertMany(mapped);
            }
            else {
                newInvoices = mapped
            }
        }
        return res.status(200).json(newInvoices)
    };

}

module.exports = new b1HANA();


