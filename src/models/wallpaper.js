const mongoose = require('mongoose');

const wallpaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  wallpaperId: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  size: { type: String, required: true },
  colorOptions: [String],
  stock: { type: Number, default: 0, required: true, min: 0 },
  images: [String],
  sold: { type: Number, default: 0, min: 0 },

}, { timestamps: true });


wallpaperSchema.pre('save', function (next) {
  if (this.stock < 0) {
    throw new Error('Stock cannot be negative');
  }
  next();
});


module.exports = mongoose.model('Wallpaper', wallpaperSchema);
