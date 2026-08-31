const mongoose = require("mongoose");
const objectId=mongoose.Schema.Types.ObjectId;

const invoiceModel= mongoose.Schema({
    patient: {
        type: objectId,
        ref: "Patient",
        required: true,
    },
    doctor:{
        type: objectId,
        ref: "Doctor",
        required: true,
    },
    visit:{
        type: objectId,
        ref: "Visit",
        required :true,
        unique: true
    },
    createdBy:{
        type: objectId,
        ref: "User",
        required :true
    },
    status: {
            type: String,
            enum: [
                "unpaid",
                "partially_paid",
                "paid",
                "cancelled"
            ],
            default: "unpaid",
            required:true
        },
    items: [
            {
                serviceType: {
                    type: String,
                    enum:[
                        "visit",
                        "consultation",
                        "laboratory",
                        "radiology",
                        "pharmacy",
                        "other"
                    ],
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                    trim: true
                },
                sourceRef: {
                    type: objectId
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                unitPrice: {
                    type: Number,
                    required: true,
                    min: 0
                },
                totalPrice: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },  
    payments: [
            {
                amount: {
                    type: Number,
                    required: true,
                    min: 0
                },

                paymentMethod: {
                    type: String,
                    enum: [
                        "cash",
                        "banck_transfer",
                        "instapay",
                        "vodafone_cash",
                        "other"
                    ],
                    required: true
                },
                paidAt:{
                type: Date,
                default: Date.now,
                },
            }
        ],
    notes:{
        type:String,
        trim:true,
        maxlength: 500
    },
},{timestamps: true},);

invoiceModel.index({patient: 1,createdAt: -1});
invoiceModel.index({doctor: 1,createdAt: -1});
invoiceModel.index({status: 1,createdAt: -1});

module.exports=mongoose.Model("Invoice",invoiceModel)