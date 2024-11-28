const Axios = require("axios");
const https = require("https");
const { get } = require("lodash");
const jwt = require('jsonwebtoken')

let dbService = require('../services/dbService')

const DataRepositories = require("../repositories/dataRepositories");
const ApiError = require("../exceptions/api-error");
require('dotenv').config();

const generateJwt = (arg) => {
    return jwt.sign(
        arg,
        process.env.secret_key,
        { expiresIn: '24h' }
    )
}
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
            return next(ApiError.badRequest('Некорректный login или password'));
        }

        const query = await DataRepositories.getSalesManager({ login, password });
        let user = await this.execute(query);

        if (user.length == 0) {
            return next(ApiError.internal('Пользователь не найден'));
        }

        if (user.length > 1) {
            return next(ApiError.internal('Найдено несколько пользователей с указанными учетными данными. Проверьте введенные данные.'));
        }

        if (!get(user, `[0].U_branch`, '')) {
            return next(ApiError.badRequest('Филиал не выбран'));
        }

        const token = generateJwt(user[0])
        return res.json({ token })
    };

}

module.exports = new b1HANA();


