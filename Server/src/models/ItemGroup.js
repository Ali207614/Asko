const mongoose = require('mongoose');

const itemGroup = new mongoose.Schema({
    ItmsGrpCod: { type: String },
    ItmsGrpNam: { type: String },
    Discount: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const ItemGroup = mongoose.model('ItemGroup', itemGroup);

module.exports = ItemGroup;

