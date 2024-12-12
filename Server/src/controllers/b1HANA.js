const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
const tokenService = require('../services/tokenService');

let dbService = require('../services/dbService')

const DataRepositories = require("../repositories/dataRepositories");
const ApiError = require("../exceptions/api-error");
const Invoice = require("../models/Invoice");
const Item = require("../models/Item");
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
                const docDateStart = req.query?.docDateStart || null;
                const docDateEnd = req.query?.docDateEnd || null;
                const statusPay = req.query?.statusPay ? req.query?.statusPay.split(",").map(Number) : [];
                const searchQuery = { U_branch: req.user.U_branch };

                if (search.trim().length) {
                    searchQuery.$or = [
                        { CardName: { $regex: search, $options: "i" } },
                        { Phone1: { $regex: search, $options: "i" } },
                        { U_car: { $regex: search, $options: "i" } }
                    ];
                }

                if (docDateStart || docDateEnd) {
                    searchQuery.DocDate = {};
                    if (docDateStart) searchQuery.DocDate.$gte = new Date(docDateStart);
                    if (docDateEnd) searchQuery.DocDate.$lte = new Date(docDateEnd);
                }

                if (statusPay.length) {
                    searchQuery.$or = [
                        ...(searchQuery.$or || []),
                        ...(statusPay.includes(1) ? [{ $expr: { $and: [{ $gt: ["$DocTotal", 0] }, { $eq: ["$DocTotal", "$PaidToDate"] }] } }] : []),
                        ...(statusPay.includes(2) ? [{ $expr: { $eq: ["$PaidToDate", 0] } }] : []),
                        ...(statusPay.includes(3) ? [{ $expr: { $and: [{ $gt: ["$PaidToDate", 0] }, { $lt: ["$PaidToDate", "$DocTotal"] }] } }] : []),
                    ];
                }

                const invoices = await Invoice.find(searchQuery)
                    .skip(offset - 1)
                    .limit(limit)
                    .lean();

                const totalDocuments = await Invoice.countDocuments(searchQuery);

                return res.status(200).json(invoices.map(item => ({
                    ...item,
                    LENGTH: totalDocuments,
                })));

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

    itemSchema = async (data) => {
        const existingItems = await Item.find({
            ItemCode: { $in: data.map((item) => item.ItemCode) },
        }).lean();

        const existingItemsMap = new Map();
        existingItems.forEach((item) => existingItemsMap.set(item.ItemCode, item));

        const bulkOps = data.map((item) => {
            const existingItem = existingItemsMap.get(item.ItemCode);

            if (!existingItem) {
                return {
                    insertOne: {
                        document: {
                            ...item,
                            OnHand: [{
                                OnHand: item.OnHand,
                                OnOrder: item.OnOrder,
                                Counted: item.Counted,
                                IsCommited: item.IsCommited,
                                ListName: item.ListName,
                            }],
                            PriceList: [{
                                PriceList: item.PriceList,
                                Price: item.Price,
                                ListName: item.ListName,
                                Currency: item.Currency,
                                ListNum: item.ListNum,
                            }],
                        },
                    },
                };
            } else {
                let updated = false;

                const onHandIndex = existingItem.OnHand.findIndex(
                    (oh) => oh.ListName === item.ListName
                );
                if (onHandIndex === -1) {
                    existingItem.OnHand.push({
                        OnHand: item.OnHand,
                        OnOrder: item.OnOrder,
                        Counted: item.Counted,
                        IsCommited: item.IsCommited,
                        ListName: item.ListName,
                    });
                    updated = true;
                } else {
                    existingItem.OnHand[onHandIndex] = {
                        OnHand: item.OnHand,
                        OnOrder: item.OnOrder,
                        Counted: item.Counted,
                        IsCommited: item.IsCommited,
                        ListName: item.ListName,
                    };
                    updated = true;
                }

                const priceListIndex = existingItem.PriceList.findIndex(
                    (pl) => pl.ListName === item.ListName
                );
                if (priceListIndex === -1) {
                    existingItem.PriceList.push({
                        PriceList: item.PriceList,
                        Price: item.Price,
                        ListName: item.ListName,
                        Currency: item.Currency,
                        ListNum: item.ListNum,
                    });
                    updated = true;
                } else {
                    existingItem.PriceList[priceListIndex] = {
                        PriceList: item.PriceList,
                        Price: item.Price,
                        ListName: item.ListName,
                        Currency: item.Currency,
                        ListNum: item.ListNum,
                    };
                    updated = true;
                }

                if (updated) {
                    return {
                        updateOne: {
                            filter: { ItemCode: item.ItemCode },
                            update: {
                                $set: {
                                    OnHand: existingItem.OnHand,
                                    PriceList: existingItem.PriceList,
                                },
                            },
                            document: {
                                ...item,
                                OnHand: existingItem.OnHand,
                                PriceList: existingItem.PriceList,
                            },
                        },

                    };
                }
            }
            return null;
        });

        return bulkOps.filter((op) => op !== null);
    }


    items = async (req, res, next) => {
        // U_branch = 'A_SH01'
        // req.user.U_branch = 'A_SH01'
        if (get(req, 'query.status', '') == 'false') {
            const totalDocuments = await Item.countDocuments({
                "PriceList.ListNum": get(req, 'user.U_branch', '')
            })
            if (totalDocuments) {
                const search = req.query.search || "";
                const offset = parseInt(req.query.offset, 10) || 0;
                const limit = parseInt(req.query.limit, 10) || 10;
                const searchQuery = {
                    "PriceList.ListNum": get(req, 'user.U_branch', '')
                };


                if (search.trim().length) {
                    searchQuery.$or = [
                        { ItemName: { $regex: search, $options: "i" } },
                        { U_BRAND: { $regex: search, $options: "i" } },
                        { U_Measure: { $regex: search, $options: "i" } }
                    ];
                }

                const items = await Item.find(searchQuery)
                    .skip(offset - 1)
                    .limit(limit)
                    .lean();

                const totalDocuments = await Item.countDocuments(searchQuery)

                return res.status(200).json(items.map(item => ({
                    ...item,
                    LENGTH: totalDocuments,
                })));

            }
        }
        const query = await DataRepositories.getItems(req.query, req.user);
        let data = await this.execute(query);
        let newItems = []
        if (data.length) {
            newItems = await this.itemSchema(data)
            if (newItems.length > 0) {
                await Item.bulkWrite(newItems);
            }
        }

        if (get(req, 'query.status', '') == 'false') {
            newItems = newItems
                .slice(0, 10) // Birinchi 10 ta elementni olish
                .map(item => {
                    // insertOne yoki updateOne ichidagi document ni birlashtirish
                    const document = {
                        ...(item?.insertOne?.document || {}),
                        ...(item?.updateOne?.document || {})
                    };
                    return document;
                });
        }
        else {
            newItems = newItems
                .slice(0, 10) // Birinchi 10 ta elementni olish
                .map(item => {
                    const document = {
                        ...(item?.insertOne?.document || {}),
                        ...(item?.updateOne?.document || {})
                    };
                    return document;
                });
        }

        return res.status(200).json(newItems)
    };

}

module.exports = new b1HANA();


