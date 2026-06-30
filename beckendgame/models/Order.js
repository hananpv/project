const mongoose = require("mongoose");
console.log("NEW ORDER MODEL LOADED");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        gameId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game",
          required: true,
        },
        title: String,
        image: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    address: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cod"],
      required: true,
    },

    paymentDetails: {
      cardNumber: String,
      cardHolderName: String,
      cardExpiry: String,
      upiId: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);