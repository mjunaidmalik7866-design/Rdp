import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { connectToDatabase } from '../src/config/db.js';
import Product from '../src/models/Product.js';

dotenv.config();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../data/connect.json');

async function run() {
	await connectToDatabase(process.env.MONGO_URI);
	if (!fs.existsSync(dataPath)) {
		console.log('No connect.json found, skipping seeding.');
		process.exit(0);
	}
	const raw = fs.readFileSync(dataPath, 'utf-8');
	const data = JSON.parse(raw);
	const products = data.products || [];
	if (products.length) {
		await Product.deleteMany({});
		await Product.insertMany(products.map(p => ({
			name: p.name,
			description: p.description,
			images: [p.imageUrl].filter(Boolean),
			price: p.price,
			stock: p.stock ?? 100,
			categories: [p.category].filter(Boolean),
			rating: p.rating ?? 0
		})));
		console.log(`Seeded ${products.length} products.`);
	}
	process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });