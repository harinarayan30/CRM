# Humera — Consultation Recording Manager

A full-stack web application for consultants to upload, manage, search, and analyze consultation recordings.

## Features

- 🔐 JWT Authentication (Register / Login)
- 📁 Upload audio and video recordings (drag-and-drop)
- 🎵 Built-in custom audio/video player
- 📝 Add and edit consultation notes
- 🔍 Search and filter by client name, title, date, status
- 📊 Analytics dashboard with charts
- ⬇️ Download recordings
- 🌙 Dark mode (default)
- 📱 Fully responsive design
- 📄 Pagination

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS v3
- Axios
- React Router v6
- Framer Motion (animations)
- Recharts (analytics charts)
- Lucide React (icons)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- Multer (file uploads)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### Backend

```bash
cd backend
npm install
# Edit .env if needed
npm run dev
```

Backend runs on: http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/consultations | List consultations (filter/search/sort) |
| POST | /api/consultations | Create consultation + upload file |
| GET | /api/consultations/:id | Get single consultation |
| PUT | /api/consultations/:id | Update consultation |
| DELETE | /api/consultations/:id | Delete consultation |
| GET | /api/consultations/analytics/summary | Analytics data |

## Project Structure

```
humera/
├── backend/
│   ├── config/        # DB + Multer config
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Auth + error handler
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routers
│   ├── uploads/       # Stored files (gitignored)
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/       # Axios instance
│       ├── components/# Reusable components
│       ├── context/   # AuthContext
│       ├── pages/     # Route pages
│       └── utils/     # Format helpers
└── README.md
```

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/humera
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
```

## License
MIT
