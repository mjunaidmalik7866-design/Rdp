import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from './config/firebaseAdmin.js';
import { connectToDatabase } from './config/db.js';

import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));

app.get('/api/health', (req, res) => {
	res.json({ ok: true, message: 'API is healthy', firebaseAdminInitialized: !!admin.apps?.length });
});

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

const PORT = process.env.PORT || 4000;

connectToDatabase(process.env.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
	})
	.catch((err) => {
		console.error('DB connection failed:', err);
		process.exit(1);
	});