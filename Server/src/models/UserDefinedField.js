const mongoose = require('mongoose');
const userDefinedField = new mongoose.Schema({
    TableID: { type: String },
    FieldID: { type: String },
    FldValue: { type: String },
    Descr: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const UserDefinedField = mongoose.model('userDefinedField', userDefinedField);

module.exports = UserDefinedField;








