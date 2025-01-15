const mongoose = require('mongoose');

const accounts = new mongoose.Schema({
    AcctCode: { type: String },
    AcctName: { type: String },
    CurrTotal: { type: String },
    Levels: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Accounts = mongoose.model('Accounts', accounts);

module.exports = Accounts;

