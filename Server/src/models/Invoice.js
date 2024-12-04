const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    DocEntry: { type: Number, required: true }, // Yagona identifikator
    DocNum: { type: Number, required: true },   // Hujjat raqami
    DocType: { type: String, required: true },  // Hujjat turi
    CANCELED: { type: String, enum: ['Y', 'N'], required: true }, // Bekor qilinganlik holati
    DocStatus: { type: String, enum: ['O', 'C'], required: true }, // Holat (Ochilgan yoki yopilgan)
    DocDate: { type: Date, required: true },    // Hujjat sanasi
    DocDueDate: { type: Date, required: false }, // To'lov muddati
    CardCode: { type: String, required: true }, // Mijoz kodi
    CardName: { type: String, required: true }, // Mijoz nomi
    Phone1: { type: String, required: false }, // Mijoz nomi
    Phone2: { type: String, required: false }, // Mijoz nomi
    DocCur: { type: String, required: false },   // Valyuta kodi
    DocRate: { type: Number, required: false },  // Valyuta kursi
    DocTotal: { type: Number, required: true }, // Umumiy summa
    PaidToDate: { type: Number, default: 0 },   // To'langan summa
    SlpCode: { type: Number, required: false },  // Sotuvchi kodi
    U_branch: { type: String, required: false }, // Filial kodi
    U_car: { type: String, required: false }, // Filial kodi
    Items: [
        {
            ItemCode: { type: String, required: true },
            Dscription: { type: String, required: true },
            Quantity: { type: Number, required: true },
            Price: { type: Number, required: true },
            DiscPrcnt: { type: Number, default: 0 },
            LineTotal: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
