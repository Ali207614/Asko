const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    ItemCode: { type: String },
    ItemName: { type: String },
    FrgnName: { type: String },
    ItmsGrpCod: { type: String },
    OnHand: { type: String },
    CodeBars: { type: String },
    IsCommited: { type: String },
    OnOrder: { type: String },
    UserText: { type: String },
    Price: { type: String },
    PicturName: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;








