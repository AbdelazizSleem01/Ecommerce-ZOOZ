import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  images: { type: [String], required: true },
  price: {
    type: Number,
    required: true,
    min: [0.5, 'Price must be at least 0.50 EGP'],
    set: val => Math.round(val * 100) / 100
  },
  description: { type: String, required: true },
  sizes: { type: [String], default: [], required: true },
  colors: { type: [String], default: [], required: true },
  countInStock: { type: Number, required: true },
  isFeatured: { type: Boolean, default: false },
  banner: { type: String },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;