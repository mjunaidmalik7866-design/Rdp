import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	images: { type: [String], default: [] },
	price: { type: Number, required: true },
	stock: { type: Number, default: 0 },
	categories: { type: [String], default: [] },
	variants: { type: [Object], default: [] },
	rating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);