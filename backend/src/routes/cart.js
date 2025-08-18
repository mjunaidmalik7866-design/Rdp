import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import Cart from '../models/Cart.js';

const router = Router();

router.use(verifyFirebaseToken);

router.get('/', async (req, res) => {
	const firebaseUid = req.user.uid;
	const cart = await Cart.findOne({ firebaseUid }) || await Cart.create({ firebaseUid, items: [] });
	res.json(cart);
});

router.post('/', async (req, res) => {
	const firebaseUid = req.user.uid;
	const { productId, quantity } = req.body || {};
	if (!productId) return res.status(400).json({ message: 'Missing productId' });
	let cart = await Cart.findOne({ firebaseUid });
	if (!cart) cart = await Cart.create({ firebaseUid, items: [] });
	const existing = cart.items.find(i => String(i.productId) === String(productId));
	if (existing) existing.quantity += Math.max(1, quantity || 1);
	else cart.items.push({ productId, quantity: Math.max(1, quantity || 1) });
	await cart.save();
	res.json(cart);
});

router.patch('/', async (req, res) => {
	const firebaseUid = req.user.uid;
	const { productId, quantity } = req.body || {};
	let cart = await Cart.findOne({ firebaseUid });
	if (!cart) return res.status(404).json({ message: 'Cart not found' });
	cart.items = cart.items.map(i => String(i.productId) === String(productId) ? { ...i.toObject(), quantity: Math.max(1, quantity) } : i);
	await cart.save();
	res.json(cart);
});

router.delete('/', async (req, res) => {
	const firebaseUid = req.user.uid;
	const { productId } = req.body || {};
	let cart = await Cart.findOne({ firebaseUid });
	if (!cart) return res.status(404).json({ message: 'Cart not found' });
	cart.items = cart.items.filter(i => String(i.productId) !== String(productId));
	await cart.save();
	res.json(cart);
});

export default router;