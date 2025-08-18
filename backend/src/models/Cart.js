import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
	productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
	quantity: { type: Number, default: 1, min: 1 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
	firebaseUid: { type: String, required: true, unique: true, index: true },
	items: { type: [CartItemSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);