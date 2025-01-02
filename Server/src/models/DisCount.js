const mongoose = require('mongoose');
const disCount = new mongoose.Schema({
    Code: { type: String },
    U_name_disc: { type: String },
    U_sum_disc: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const DisCount = mongoose.model('DisCount', disCount);

module.exports = DisCount;








