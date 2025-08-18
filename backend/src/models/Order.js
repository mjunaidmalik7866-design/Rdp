import mongoose from 'mongoose';

const OrderProductSchema = new mongoose.Schema({
	productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
	quantity: { type: Number, required: true, min: 1 },
	priceAtPurchase: { type: Number, required: true }
}, { _id: false });

const ShippingSchema = new mongoose.Schema({
	name: String,
	email: String,
	phone: String,
	address: String,
	city: String,
	postalCode: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
	firebaseUid: { type: String, required: true, index: true },
	products: { type: [OrderProductSchema], required: true },
	shippingAddress: { type: ShippingSchema, required: true },
	total: { type: Number, required: true },
	status: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'] },
	paymentMethod: { type: String, enum: ['jazzcash', 'easypaisa', 'bank'], default: 'bank' },
	paymentReference: { type: String }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);