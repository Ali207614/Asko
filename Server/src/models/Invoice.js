const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    UUID: { type: String, required: false }, // Yagona identifikator
    DocEntry: { type: Number, required: false }, // Yagona identifikator
    DocNum: { type: Number, required: false },   // Hujjat raqami
    DocType: { type: String, required: false },  // Hujjat turi
    CANCELED: { type: String, enum: ['Y', 'N'], required: true }, // Bekor qilinganlik holati
    DocStatus: { type: String, enum: ['O', 'C'], required: true }, // Holat (Ochilgan yoki yopilgan)
    DocDate: { type: Date, required: true },    // Hujjat sanasi
    DocDueDate: { type: Date, required: false }, // To'lov muddati
    Comments: { type: String, required: false }, // Mijoz kodi
    CardCode: { type: String, required: true }, // Mijoz kodi
    CardName: { type: String, required: true }, // Mijoz nomi
    Phone1: { type: String, required: false }, // Mijoz nomi
    Phone2: { type: String, required: false }, // Mijoz nomi
    DocCur: { type: String, required: false },   // Valyuta kodi
    DocRate: { type: Number, required: false },  // Valyuta kursi
    DocTotal: { type: Number, required: false }, // Umumiy summa
    DocTotalSy: { type: Number, required: false }, // Umumiy summa
    PaidSys: { type: Number, required: false }, // Umumiy summa
    PaidToDate: { type: Number, default: 0 },   // To'langan summa
    SlpCode: { type: Number, required: false },  // Sotuvchi kodi
    U_branch: { type: String, required: false }, // Filial kodi
    U_car: { type: String, required: false }, // Filial kodi
    U_markamashina: { type: String, required: false }, // Filial kodi
    U_merchantturi: { type: String, required: false }, // Filial kodi
    U_merchantfoizi: { type: String, required: false }, // Filial kodi
    U_flayer: { type: String, required: false }, // Filial kodi
    U_vulkanizatsiya: { type: String, required: false }, // Filial kodi
    U_schot: { type: String, required: false }, // Filial kodi
    sap: { type: Boolean, default: true },
    Items: [
        {
            ItemCode: { type: String, required: false },
            Dscription: { type: String, required: false },
            Quantity: { type: Number, required: false },
            Price: { type: Number, required: false },
            DiscPrcnt: { type: Number, default: 0 },
            LineTotal: { type: Number, required: false },
            ItmsGrpCod: { type: String, required: false },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
