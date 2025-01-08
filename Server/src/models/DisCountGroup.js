const mongoose = require('mongoose');
const discountGroup = new mongoose.Schema({
    Code: { type: String },
    U_group_code: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const DiscountGroup = mongoose.model('DiscountGroup', discountGroup);

module.exports = DiscountGroup;








