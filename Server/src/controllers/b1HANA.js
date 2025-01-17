const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
const tokenService = require('../services/tokenService');
const { v4: uuidv4, validate } = require('uuid');
let dbService = require('../services/dbService')


const DataRepositories = require("../repositories/dataRepositories");
const ApiError = require("../exceptions/api-error");
const Invoice = require("../models/Invoice");
const Item = require("../models/Item");
const ItemGroup = require("../models/ItemGroup");
const BusinessPartner = require("../models/BusinessPartner");
const Currency = require("../models/Currency");
const Merchant = require("../models/Merchant");
const UserDefinedField = require("../models/UserDefinedField");
const DisCount = require("../models/DisCount");
const DiscountGroup = require("../models/DisCountGroup");
const Accounts = require("../models/Accounts");
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
        return res.json({
            token, data: {
                SlpCode: get(user, '[0].SlpCode'),
                U_branch: get(user, '[0].U_branch'),
                U_role: get(user, '[0].U_role')
            }
        })
    };

    invoices = async (req, res, next) => {
        try {
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
                        .sort({
                            UUID: -1,       // UUID bo'lganlar yuqoriga
                            createdAt: -1,    // Vaqt bo'yicha katta-kichik tartib
                            DocEntry: -1   // DocEntry bo'yicha katta-kichik tartib
                        })
                        .skip(offset - 1)    // Paginatsiya: boshlanish nuqtasi
                        .limit(limit)        // Paginatsiya: natijalar soni
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
        }
        catch (error) {
            next(error); // Xatolikni middleware orqali qaytarish
        }
    };

    updateList = (list, item, key) => {
        const index = list.findIndex((el) => el.ListName === item.ListName);
        if (index === -1) {
            list.push(item);
        } else {
            list[index] = item;
        }
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
        try {
            if (get(req, 'query.status', '') == 'false') {
                const totalDocuments = await Item.countDocuments({
                    "PriceList.ListName": get(req, 'user.U_branch', '')
                });
                if (totalDocuments) {
                    const search = (req.query.search || "").toString().trim();
                    const offset = parseInt(req.query.offset, 10) || 0;
                    const limit = parseInt(req.query.limit, 10) || 10;
                    const groupCode = req.query?.code || '';
                    let items = req.query.items ? req.query.items.split(",").map(item => item.replace(/['"]/g, "").trim()) : [];
                    const searchQuery = {
                        "PriceList.ListName": get(req, 'user.U_branch', '')
                    };
                    if (search.length) {
                        searchQuery.$or = [
                            { ItemName: { $regex: search, $options: "i" } },
                            { ItemCode: { $regex: search, $options: "i" } },
                            { Name: { $regex: search, $options: "i" } },
                            { U_Article: { $regex: search, $options: "i" } }
                        ];
                    }

                    if (items.length) {
                        searchQuery.ItemCode = { $nin: items };
                    }

                    if (groupCode) {
                        searchQuery.ItmsGrpCod = groupCode;
                    }


                    // Hujjatlarni olish
                    // const documents = await Item.find(searchQuery)
                    //     .skip(offset - 1)
                    //     .limit(limit)
                    //     .lean();

                    const documents = await Item.aggregate([
                        // Foydalanuvchi uchun filterni qo'llash
                        { $match: searchQuery },

                        // OnHand massivini filtrlash
                        {
                            $addFields: {
                                OnHand: {
                                    $filter: {
                                        input: "$OnHand",
                                        as: "onHand",
                                        cond: { $eq: ["$$onHand.ListName", get(req, 'user.U_branch', '')] },
                                    },
                                },
                            },
                        },

                        // Faqat kerakli ma'lumotlarni qoldirish
                        { $match: { "OnHand.0": { $exists: true } } },

                        // OnHand massiviga yangi maydon (OnHandDouble) qo'shish
                        {
                            $addFields: {
                                OnHand: {
                                    $map: {
                                        input: "$OnHand",
                                        as: "onHand",
                                        in: {
                                            $mergeObjects: [
                                                "$$onHand",
                                                { OnHandDouble: { $toDouble: "$$onHand.OnHand" } },
                                            ],
                                        },
                                    },
                                },
                            },
                        },

                        // Hujjatlarni OnHand[0].OnHandDouble bo'yicha tartiblash
                        {
                            $sort: { "OnHand.0.OnHandDouble": -1 },
                        },

                        // Paginationni qo'llash
                        { $skip: offset - 1 },
                        { $limit: limit },
                    ]);

                    // Umumiy hujjat sonini hisoblash
                    const totalDocuments = await Item.countDocuments(searchQuery);

                    const drafts = await Invoice.find({
                        U_branch: get(req, 'user.U_branch', ''),
                        sap: false,
                        'Items.ItemCode': { $in: documents.map(item => item.ItemCode) },
                    }).lean();

                    return res.status(200).json(documents.map(item => {
                        let onHandObj = get(item, 'OnHand', []).find(el => el.ListName == get(req, 'user.U_branch', ''))
                        let filteredItem = drafts.map(el => el.Items).flat().filter(el => el.ItemCode == item.ItemCode)

                        return {
                            ...item,
                            LENGTH: totalDocuments,
                            OnHand: { ...onHandObj, OnHand: filteredItem.length ? onHandObj.OnHand - filteredItem.reduce((a, b) => a + Number(b.Quantity), 0) : onHandObj.OnHand },
                            PriceList: get(item, 'PriceList', []).find(el => el.ListName == get(req, 'user.U_branch', ''))
                        }
                    }));
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
                newItems = newItems.slice(0, 10)
            }
            newItems = [
                ...newItems.filter(item => item?.insertOne?.document).map(item => item.insertOne.document),
                ...newItems.filter(item => item?.updateOne?.document).map(item => item.updateOne.document)
            ]
            if (get(req, 'query.status', '') == 'false') {
                newItems = newItems.map(item => {
                    if (typeof item.toObject === 'function') {
                        return item.toObject();
                    }
                    return item;
                });
            }
            const drafts = await Invoice.find({
                U_branch: get(req, 'user.U_branch', ''),
                sap: false,
                'Items.ItemCode': { $in: newItems.map(item => item.ItemCode) },
            }).lean();

            return res.status(200).json(newItems.map(item => {
                let onHandObj = get(item, 'OnHand', []).find(el => el.ListName == get(req, 'user.U_branch', ''))
                let filteredItem = drafts.map(el => el.Items).flat().filter(el => el.ItemCode == item.ItemCode)

                return {
                    ...item,
                    OnHand: { ...onHandObj, OnHand: filteredItem.length ? onHandObj.OnHand - filteredItem.reduce((a, b) => a + Number(b.Quantity), 0) : onHandObj.OnHand },
                    PriceList: get(item, 'PriceList', []).find(el => el.ListName == get(req, 'user.U_branch', ''))
                }
            }));
        }
        catch (error) {
            next(error); // Xatolikni middleware orqali qaytarish
        }
    };

    groups = async (req, res, next) => {
        try {
            const group = await ItemGroup.find();
            if (group.length > 0) {
                return res.status(200).json(group);
            }
            const query = await DataRepositories.getItemGroups();
            let data = await this.execute(query);
            await ItemGroup.insertMany(data);
            return res.status(200).json(data);
        }
        catch (error) {
            next(error); // Xatolikni middleware orqali qaytarish
        }
    }

    businessPartners = async (req, res, next) => {
        try {
            const search = (req.query.search || "").toString().trim();

            // Query uchun default object
            const searchQuery = {};
            if (search.length) {
                searchQuery.$or = [
                    { CardCode: { $regex: search, $options: "i" } },
                    { CardName: { $regex: search, $options: "i" } },
                    { Phone1: { $regex: search, $options: "i" } },
                    { Phone2: { $regex: search, $options: "i" } }
                ];
            }

            // Kolleksiyada ma'lumotlar mavjudligini tekshirish
            const bpExists = await BusinessPartner.estimatedDocumentCount();
            if (bpExists > 0) {
                const result = await BusinessPartner.find(searchQuery);
                return res.status(200).json(result);
            }

            // Agar kolleksiyada ma'lumot bo'lmasa, yangi ma'lumotlarni yuklash
            const query = await DataRepositories.getAllBusinessPartners();
            const data = await this.execute(query);
            // Yangi ma'lumotlarni bazaga saqlash
            await BusinessPartner.insertMany(data);

            // Agar qidiruv bo'lsa, ma'lumotni filter qilish
            if (search.length && data.length) {
                const filteredData = data.filter(item =>
                    item.CardCode.toLowerCase().includes(search) ||
                    (get(item, 'CardName', '') || '').toLowerCase().includes(search) ||
                    (get(item, 'Phone1', '') || '').toLowerCase().includes(search) ||
                    (get(item, 'Phone2', '') || '').toLowerCase().includes(search)
                );
                return res.status(200).json(filteredData);
            }

            return res.status(200).json(data);
        } catch (error) {
            next(error); // Xatolikni middleware orqali qaytarish
        }
    };

    getBusinessPartnersAndCars = async (CardCode = '') => {
        const query = await DataRepositories.getBusinessPartnerAndCars({ CardCode });
        const data = await this.execute(query);
        return data
    }

    getCars = async (req, res, next) => {
        try {
            const cardCode = req.query.cardCode;

            if (!cardCode) {
                return res.status(400).json({ message: "CardCode is required" });
            }

            // MongoDB'dan `BusinessPartner`ni olish
            const businessPartner = await BusinessPartner.findOne({ CardCode: cardCode });

            if (!businessPartner) {
                return res.status(404).json({ message: "BusinessPartner not found" });
            }

            // `cars` arrayini tekshirish
            if (businessPartner.Cars && businessPartner.Cars.length > 0) {
                return res.status(200).json(businessPartner.Cars); // Avvaldan mavjud `cars` qaytariladi
            }

            // SQL orqali mashinalarni olish
            const query = await DataRepositories.getCars({ cardCode }); // SQL uchun kerakli so'rov
            const carsFromSQL = await this.execute(query);
            if (!carsFromSQL || carsFromSQL.length === 0) {
                return res.status(200).json([]);
            }

            // MongoDB'dagi `cars` arrayini yangilash
            businessPartner.Cars = carsFromSQL;
            await businessPartner.save();

            // Yangilangan `cars` arrayini qaytarish
            return res.status(200).json(carsFromSQL);
        } catch (error) {
            next(error); // Xatolarni qayta ishlash
        }
    };

    getLastCodeCars = async (req, res, next) => {
        const query = await DataRepositories.getLastCodeCars();
        const data = await this.execute(query);
        return data
    }

    createInvoice = async (req, res, next) => {
        try {
            let body = { ...req.body, DocCur: "UZS", Items: req.body.DocumentLines, sap: false, CANCELED: 'N', DocStatus: 'O', UUID: uuidv4() }
            let bp = await this.getBusinessPartnersAndCars(req.body.CardCode)
            if (bp.length) {
                let obj = {
                    ...bp[0], Cars: bp.filter(item => item.Code).map(el => {
                        return { Code: el.Code, U_marka: el.U_marka, U_car_km: el.U_car_km, U_bp_code: el.U_bp_code, U_car_code: el.U_car_code, U_bp_name: el.U_bp_name, U_car_name: el.U_car_name }
                    })
                }
                const result = await BusinessPartner.findOneAndUpdate(
                    { CardCode: req.body.CardCode },
                    { $set: obj },
                    { upsert: true, new: true }
                );
                body = { ...body, Phone1: get(result, 'Phone1', ''), Phone2: get(result, "Phone2", ''), CardName: get(result, 'CardName') }
            }
            await Invoice.create(body)
            return res.status(201).json()
        }
        catch (e) {
            return res.status(404).json(e)
        }
    }

    updateInvoice = async (req, res, next) => {
        try {
            const uuid = req.params.id; // UUID ni oling
            let body = {
                ...req.body,
                DocCur: "UZS",
                Items: req.body.DocumentLines, // Hujjat chiziqlari
                sap: false,
                CANCELED: 'N',
                DocStatus: 'O',
            };

            let bp = await this.getBusinessPartnersAndCars(req.body.CardCode)
            if (bp.length) {
                let obj = {
                    ...bp[0], Cars: bp.filter(item => item.Code).map(el => {
                        return { Code: el.Code, U_marka: el.U_marka, U_car_km: el.U_car_km, U_bp_code: el.U_bp_code, U_car_code: el.U_car_code, U_bp_name: el.U_bp_name, U_car_name: el.U_car_name }
                    })
                }
                const result = await BusinessPartner.findOneAndUpdate(
                    { CardCode: req.body.CardCode },
                    { $set: obj },
                    { upsert: true, new: true }
                );
                body = { ...body, Phone1: get(result, 'Phone1', ''), Phone2: get(result, "Phone2", ''), CardName: get(result, 'CardName') }
            }

            // Hujjatni yangilash
            const updatedInvoice = await Invoice.findOneAndUpdate(
                { UUID: uuid }, // Filtr
                { $set: body }, // Yangilanish
                { new: true, lean: true } // Yangilangan hujjatni qaytarish
            );

            if (updatedInvoice) {
                return res.status(200).json(updatedInvoice); // Yangilangan hujjatni qaytarish
            }

            return res.status(404).json({ message: "Invoice not found" });
        } catch (e) {
            console.error(e); // Xatolarni konsolda chiqarish
            return res.status(500).json({ error: "Failed to update invoice", details: e });
        }
    };

    getLastCurrency = async (req, res, next) => {
        let usd = await Currency.find({ Currency: "UZS" })
        if (usd.length) {
            return res.status(200).json(usd[0])
        }
        let query = await DataRepositories.getLastCurrency()
        const data = await this.execute(query);
        await Currency.create(data)
        return res.status(200).json(data[0])
    }

    getInvoiceById = async (req, res, next) => {
        const filterOperation = validate(req.params.id)
            ? { UUID: req.params.id }
            : { DocEntry: req.params.id };

        const invoice = await Invoice.findOne(filterOperation).lean();

        if (invoice) {
            const customer = await BusinessPartner.findOne({ CardCode: get(invoice, 'CardCode') }).lean();
            const existingItems = await Item.find({
                ItemCode: { $in: invoice.Items.map((item) => item.ItemCode) },
            }).lean();

            const drafts = await Invoice.find({
                U_branch: get(req, 'user.U_branch', ''),
                sap: false,
                'Items.ItemCode': { $in: existingItems.map(item => item.ItemCode) },
            }).lean();

            const result = {
                ...invoice,
                customer,
                Items: invoice.Items.map((el) => {
                    const existingItem = existingItems.find((item) => item.ItemCode === el.ItemCode); // To'g'ri elementni topish
                    let filteredItem = drafts.map(i => i.Items).flat().filter(i => el.ItemCode == i.ItemCode)

                    let existingOnHandObj = existingItem.OnHand?.find((el2) => el2.ListName === invoice.U_branch)
                    let existingPriceListObj = existingItem.PriceList?.find((el2) => el2.ListName === invoice.U_branch)
                    if (existingItem) {
                        return {
                            ...el,
                            ...existingItem,
                            OnHand: { ...existingOnHandObj, OnHand: filteredItem.length ? existingOnHandObj.OnHand - filteredItem.reduce((a, b) => a + Number(b.Quantity), 0) : existingOnHandObj.OnHand },
                            PriceList: existingPriceListObj,
                        };
                    }
                    return el; // Agar mos keladigan item topilmasa, asl elementni qaytaradi
                }),
            };

            return res.status(200).json(result);
        }

        return res.status(200).json({});

    }

    getMerchant = async (req, res, next) => {
        let merchant = await Merchant.find()
        if (merchant.length) {
            return res.status(200).json(merchant)
        }
        let query = await DataRepositories.getMerchant()
        const data = await this.execute(query);
        await Merchant.create(data)
        return res.status(200).json(data)
    }

    getAcct = async (req, res, next) => {
        const search = req.query.search || ""
        let count = await Accounts.estimatedDocumentCount()
        if (count > 0) {
            let searchQuery = {}
            if (search.trim().length) {
                searchQuery.$or = [
                    { AcctCode: { $regex: search, $options: "i" } },
                    { AcctName: { $regex: search, $options: "i" } },
                ];
            }
            let accounts = await Accounts.find(searchQuery)
            return res.status(200).json(accounts)
        }
        let query = await DataRepositories.getAllAcct()
        let data = await this.execute(query);
        await Accounts.create(data)
        if (search.trim().length) {
            data = data.filter(item => item.AcctCode.includes(search) || item.AcctName.includes(search))
        }
        return res.status(200).json(data)
    }

    deleteInvoice = async (req, res, next) => {
        try {
            const uuid = req.params.id; // URL dan ID ni olish
            const result = await Invoice.deleteOne({ UUID: uuid }); // MongoDB query

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Invoice not found" }); // Agar topilmasa
            }

            return res.status(200).json({ message: "Invoice deleted successfully" }); // Muvaffaqiyatli o'chirildi
        } catch (error) {
            next(error); // Xatolikni qayta ishlash uchun
        }
    };

    getInvoiceByDocEntry = async (doc) => {
        let query = await DataRepositories.getInvoiceByDocEntry(doc);
        const data = await this.execute(query);
        let newInvoices = [];

        if (data.length) {
            let docs = [...new Set(data.map(item => item.DocEntry))];
            let mapped = docs.map(item => ({
                ...data.find(el => el.DocEntry === item),
                Items: data.filter(el => el.DocEntry === item),
            }));

            for (const invoice of mapped) {
                const existingInvoice = await Invoice.findOne({ DocEntry: invoice.DocEntry });
                if (existingInvoice) {
                    await Invoice.updateOne({ DocEntry: invoice.DocEntry }, { $set: invoice });
                } else {
                    await Invoice.create(invoice);
                }
            }
        }

    }
    getInvoiceItems = async (items, U_branch) => {
        let query = await DataRepositories.getInvoiceItems(items, U_branch);
        const data = await this.execute(query);
        let newItems = []

        if (data.length) {
            newItems = await this.itemSchema(data)
            if (newItems.length > 0) {
                await Item.bulkWrite(newItems);
            }
        }
    }
    getOutgoingPayment = async (req, res, next) => {
        try {
            let { offset, limit, status, search } = req.query
            const branch = req.user.U_branch;
            let query = await DataRepositories.outGoing(branch, req.query);
            const data = await this.execute(query);
            return res.status(200).json(data)
        }
        catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    }
    cashReport = async (req, res, next) => {
        try {
            const branch = req.user.U_branch;

            let merchant = await Merchant.find()
            if (merchant.length) {
                let merchants = [...new Set(merchant.filter(item => item.U_status == '01').map(item => item.U_schot))]
                let query = await DataRepositories.cashReport(branch, merchants);
                let data = await this.execute(query);
                data = data.filter(item => item?.OcrCode).map(item => {
                    return { ...item, AcctName: merchant.find(el => el?.U_schot == get(item, 'AcctCode'))?.U_merchant }
                })
                return res.status(200).json(data)
            }
            let queryM = await DataRepositories.getMerchant()
            const dataM = await this.execute(queryM);
            let merchants = [...new Set(dataM.filter(item => item.U_status == '01').map(item => item.U_schot))]
            let query = await DataRepositories.cashReport(branch, merchants);
            let data = await this.execute(query);
            data = data.filter(item => item?.OcrCode).map(item => {
                return { ...item, AcctName: dataM.find(el => el?.U_schot == get(item, 'AcctCode'))?.U_merchant }
            })
            return res.status(200).json(data)

        }
        catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    }
    getOutgoingPaymentById = async (req, res, next) => {
        try {
            let { id, draft } = req.params
            const branch = req.user.U_branch;
            let query = await DataRepositories.outGoingByDocEntry(id, draft);
            const data = await this.execute(query);
            return res.status(200).json(data)
        }
        catch (error) {
            console.log(error)
            return res.status(404).json(error)
        }
    }

    getUserDefinedField = async (req, res, next) => {
        let count = await UserDefinedField.estimatedDocumentCount()
        if (count > 0) {
            let result = await UserDefinedField.find()
            return res.status(200).json(result)
        }
        let query = await DataRepositories.getUFD1();
        const data = await this.execute(query);
        if (data.length) {
            await UserDefinedField.create(data)
        }
        return res.status(200).json(data)
    }

    getDisCount = async (req, res, next) => {
        let count = await DisCount.estimatedDocumentCount()
        if (count > 0) {
            let result = await DisCount.find()
            return res.status(200).json(result)
        }
        let query = await DataRepositories.disCount();
        const data = await this.execute(query);
        if (data.length) {
            await DisCount.create(data)
        }
        return res.status(200).json(data)
    }

    getDiscountGroups = async (req, res, next) => {
        let count = await DiscountGroup.estimatedDocumentCount()
        if (count > 0) {
            let result = await DiscountGroup.find()
            return res.status(200).json(result)
        }
        let query = await DataRepositories.getDiscountGroups();
        const data = await this.execute(query);
        if (data.length) {
            await DiscountGroup.create(data)
        }
        return res.status(200).json(data)
    }

}

module.exports = new b1HANA();


