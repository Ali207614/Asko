const mongoose = require('mongoose');
const currency = new mongoose.Schema({
    Currency: { type: String },
    RateDate: { type: String },
    Rate: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Currency = mongoose.model('Currency', currency);

module.exports = Currency;








