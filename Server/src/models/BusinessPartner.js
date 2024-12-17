const mongoose = require('mongoose');

const businessPartner = new mongoose.Schema({
    CardCode: { type: String },
    CardName: { type: String },
    CardType: { type: String },
    GroupCode: { type: String },
    Phone1: { type: String },
    Phone2: { type: String },
    U_customer: { type: String },
    U_gender: { type: String },
    U_dateofbirth: { type: String },
    Balance: { type: String },
    Cars: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const BusinessPartner = mongoose.model('BusinessPartner', businessPartner);

module.exports = BusinessPartner;








