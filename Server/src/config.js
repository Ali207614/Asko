const mongoose = require('mongoose');
const hanaClient = require("@sap/hana-client");

require('dotenv').config();


// let token = process.env.token

const conn_params = {
    serverNode: process.env.server_node,
    // serverNode: process.env.server_node_local,
    uid: process.env.uid,
    pwd: process.env.password,
};

const db = process.env.db

// const db = process.env.test_db
const UserName = process.env.service_layer_username
const Password = process.env.service_layer_password

const api_params = {
    CompanyDB: db,
    UserName,
    Password
}

const api = process.env.api
// const api = process.env.api_local




let connectHana = () => {
    const connection = hanaClient.createConnection();
    connection.connect(conn_params, async (err) => {
        if (err) {
            console.error('Hanaga ulanishda xatolik yuz berdi:', err);
        } else {
            console.log('Hanaga ulanish muvaffaqiyatli amalga oshirildi');
        }
    });
    global.connection = connection;
}


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongo_url_local);
        console.log('MongoDBga ulanish muvaffaqiyatli amalga oshirildi');
    } catch (err) {
        console.error('MongoDBga ulanishda xatolik yuz berdi:', err);
        process.exit(1);
    }
};





module.exports = { conn_params, db, connectDB, api_params, api, connectHana }



