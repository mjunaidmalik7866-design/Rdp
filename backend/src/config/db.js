import mongoose from 'mongoose';

export async function connectToDatabase(mongoUri) {
	if (!mongoUri) {
		throw new Error('Missing MONGO_URI');
	}
	mongoose.set('strictQuery', true);
	await mongoose.connect(mongoUri, {
		serverSelectionTimeoutMS: 15000
	});
	return mongoose.connection;
}