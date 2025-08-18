import { Router } from 'express';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req, res) => {
	try {
		const { firebaseUid, email, name } = req.body || {};
		if (!firebaseUid || !email || !name) return res.status(400).json({ message: 'Missing fields' });
		const existing = await User.findOne({ $or: [{ firebaseUid }, { email }] });
		if (existing) return res.status(200).json(existing);
		const user = await User.create({ firebaseUid, email, name });
		return res.status(201).json(user);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create user', error: err.message });
	}
});

router.get('/me', verifyFirebaseToken, async (req, res) => {
	const firebaseUid = req.user.uid;
	const user = await User.findOne({ firebaseUid });
	return res.json(user || null);
});

router.patch('/me', verifyFirebaseToken, async (req, res) => {
	try {
		const firebaseUid = req.user.uid;
		const updates = req.body || {};
		const user = await User.findOneAndUpdate({ firebaseUid }, updates, { new: true, upsert: false });
		return res.json(user);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update user', error: err.message });
	}
});

export default router;