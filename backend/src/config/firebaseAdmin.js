import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function initializeAdmin() {
	if (admin.apps.length) return admin;
	const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../../serviceAccountKey.json');
	let credentials = null;
	try {
		if (fs.existsSync(configuredPath)) {
			const raw = fs.readFileSync(configuredPath, 'utf-8');
			credentials = JSON.parse(raw);
		}
	} catch {}
	try {
		if (credentials) {
			admin.initializeApp({
				credential: admin.credential.cert(credentials)
			});
		} else {
			admin.initializeApp({
				credential: admin.credential.applicationDefault()
			});
		}
		return admin;
	} catch (err) {
		throw new Error('Failed to initialize Firebase Admin: ' + err.message);
	}
}

export default initializeAdmin();