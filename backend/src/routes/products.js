import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
	const products = await Product.find({}).sort({ createdAt: -1 }).limit(100);
	res.json(products);
});

router.get('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ message: 'Not found' });
		res.json(product);
	} catch {
		res.status(400).json({ message: 'Invalid id' });
	}
});

export default router;