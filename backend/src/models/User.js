import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
	street: { type: String },
	city: { type: String },
	zip: { type: String },
	isDefault: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new mongoose.Schema({
	firebaseUid: { type: String, required: true, unique: true, index: true },
	email: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	roles: { type: [String], default: ['user'] },
	addresses: { type: [AddressSchema], default: [] },
	orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);