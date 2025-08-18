import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = Router();

router.use(verifyFirebaseToken);

router.post('/', async (req, res) => {
	try {
		const firebaseUid = req.user.uid;
		const { items, shippingAddress, paymentMethod, paymentReference } = req.body || {};
		if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });
		const productDocs = await Product.find({ _id: { $in: items.map(i => i.productId) } });
		const productsMap = Object.fromEntries(productDocs.map(p => [String(p._id), p]));
		const orderProducts = items.map(i => ({
			productId: i.productId,
			quantity: i.quantity,
			priceAtPurchase: productsMap[String(i.productId)]?.price || 0
		}));
		const total = orderProducts.reduce((sum, p) => sum + p.priceAtPurchase * p.quantity, 0);
		const order = await Order.create({
			firebaseUid,
			products: orderProducts,
			shippingAddress,
			total,
			status: 'Pending',
			paymentMethod: paymentMethod || 'bank',
			paymentReference
		});
		res.status(201).json(order);
	} catch (err) {
		res.status(500).json({ message: 'Failed to create order', error: err.message });
	}
});

router.get('/me', async (req, res) => {
	const firebaseUid = req.user.uid;
	const orders = await Order.find({ firebaseUid }).sort({ createdAt: -1 });
	res.json(orders);
});

export default router;