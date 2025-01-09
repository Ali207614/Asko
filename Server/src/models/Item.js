const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    ItemCode: { type: String },
    ItemName: { type: String },
    ItmsGrpCod: { type: String },
    U_brend: { type: String },
    Name: { type: String },
    UserText: { type: String },
    U_Article: { type: String },
    OnHand: { type: [mongoose.Schema.Types.Mixed], default: [] },
    PriceList: { type: [mongoose.Schema.Types.Mixed], default: [] },
    PicturName: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;








