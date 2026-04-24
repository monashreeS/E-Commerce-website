
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ['Laptops', 'Accessories', 'Mobiles', 'Smart TV', 'Others'],
      required: true,
    },
    description: { type: String, default: '' },
    features: [{ type: String }],
    stock: { type: Number, default: 10 },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    branchRecommendation: [
      { type: String, enum: ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'AIDS', 'IT', 'Other', 'ALL'] },
    ],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
