# Rdp

Project now includes a full-stack e‑commerce scaffold.

Backend
- Location: `backend/`
- Copy `backend/.env.example` to `.env` and set values
- Copy `backend/serviceAccountKey.example.json` to `serviceAccountKey.json`
- Install and run:
```bash
cd backend
npm install
npm run seed
npm run dev
```

Frontend
- Location: `frontend/`
- Copy `frontend/assets/firebaseConfig.sample.js` to `frontend/assets/firebaseConfig.js` and paste your Firebase Web config
- Serve `frontend/` via a local server (e.g., Live Server). Default backend URL is http://localhost:4000