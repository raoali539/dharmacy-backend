const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({


    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            name: String,               // snapshot of product name
            price: Number,              // snapshot of product price at time of order
            quantity: { type: Number, required: true },
            vendorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        },
    ],

    shippingAddress: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: String,
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: String,
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
    },

    paymentDetails: {
        id: String,
        status: String,
        amount: Number,
        currency: String,
        payment_method: String,
        receipt_url: String,
        created: Number, // timestamp
    },

    totalAmount: {
        type: Number,
        required: true,
    },

    shippingFee: {
        type: Number,
        default: 0,
    },

    taxAmount: {
        type: Number,
        default: 0,
    },

    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing",
    },

    isPaid: {
        type: Boolean,
        default: false,
    },

    paidAt: {
        type: Date,
    },

    deliveredAt: {
        type: Date,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Order", orderSchema);
