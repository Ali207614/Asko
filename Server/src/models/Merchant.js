const mongoose = require('mongoose');

const merchant = new mongoose.Schema({
    Code: { type: String },
    U_merchant: { type: String },
    U_Foiz: { type: String },
    U_schot: { type: String },
    U_status: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Merchant = mongoose.model('Merchant', merchant);

module.exports = Merchant;

