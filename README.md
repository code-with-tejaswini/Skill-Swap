# ⟡ SkillSwap Platform

A full-stack skill exchange platform where users trade knowledge instead of money.

---

## 🗂 Project Structure

```
skillswap/
├── backend/                  # Node.js + Express API
│   ├── models/
│   │   ├── User.js           # User schema (name, email, skills, rating)
│   │   ├── Request.js        # Skill exchange request schema
│   │   └── Review.js         # Review & rating schema
│   ├── routes/
│   │   ├── auth.js           # Register, Login, /me
│   │   ├── users.js          # Profile, Skills, Search, Matches
│   │   ├── requests.js       # Send, Accept, Reject, Complete
│   │   └── reviews.js        # Submit & Fetch reviews
│   ├── middleware/
│   │   └── auth.js           # JWT protect middleware + token generator
│   ├── server.js             # Express app entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
└── frontend/                 # React app
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js  # Global auth state + axios instance
        ├── components/
        │   ├── Navbar.js         # Sticky navbar with user menu
        │   ├── UserCard.js       # Reusable user profile card
        │   ├── SendRequestModal.js # Skill swap request modal
        │   └── ProtectedRoute.js # Auth guard for routes
        ├── pages/
        │   ├── Home.js           # Landing page (hero, features, CTA)
        │   ├── Login.js          # Login form with validation
        │   ├── Register.js       # Register form with password strength
        │   ├── Dashboard.js      # Profile, Skills, Matches, Reviews
        │   ├── Search.js         # Search users by skill
        │   └── Requests.js       # Manage requests + submit reviews
        ├── App.js                # Router + route protection
        ├── index.js              # React entry point
        └── styles.css            # Global CSS design system
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

---

### 1. Backend Setup

```bash
cd skillswap/backend
npm install
```

Edit `.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: `https://skill-swap-s01i.onrender.com`

---

### 2. Frontend Setup

```bash
cd skillswap/frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

> The frontend uses `"proxy": "https://skill-swap-s01i.onrender.com"` in `package.json`, so API calls work automatically.

---

## 📡 API Reference

### Auth

| Method | Endpoint             | Auth | Description       |
| ------ | -------------------- | ---- | ----------------- |
| POST   | `/api/auth/register` | No   | Register new user |
| POST   | `/api/auth/login`    | No   | Login & get JWT   |
| GET    | `/api/auth/me`       | Yes  | Get current user  |

### Users

| Method | Endpoint                    | Auth | Description                 |
| ------ | --------------------------- | ---- | --------------------------- |
| GET    | `/api/users`                | Yes  | All users (paginated)       |
| GET    | `/api/users/search?skill=X` | Yes  | Search by skill             |
| GET    | `/api/users/matches`        | Yes  | Smart complementary matches |
| GET    | `/api/users/:id`            | Yes  | Get user profile            |
| PUT    | `/api/users/profile`        | Yes  | Update own profile          |
| PUT    | `/api/users/skills`         | Yes  | Update teach/learn skills   |

### Requests

| Method | Endpoint                     | Auth | Description             |
| ------ | ---------------------------- | ---- | ----------------------- |
| POST   | `/api/requests`              | Yes  | Send skill swap request |
| GET    | `/api/requests/all`          | Yes  | Get all my requests     |
| GET    | `/api/requests/sent`         | Yes  | Get sent requests       |
| GET    | `/api/requests/received`     | Yes  | Get received requests   |
| PUT    | `/api/requests/:id/accept`   | Yes  | Accept request          |
| PUT    | `/api/requests/:id/reject`   | Yes  | Reject request          |
| PUT    | `/api/requests/:id/complete` | Yes  | Mark as completed       |

### Reviews

| Method | Endpoint                    | Auth | Description                              |
| ------ | --------------------------- | ---- | ---------------------------------------- |
| POST   | `/api/reviews`              | Yes  | Submit review (completed exchanges only) |
| GET    | `/api/reviews/user/:userId` | Yes  | Get reviews for a user                   |
| GET    | `/api/reviews/given`        | Yes  | Reviews I've given                       |

---

## 🗄️ Database Schemas

### User

```js
{
  name: String,           // required
  email: String,          // required, unique
  password: String,       // hashed with bcrypt
  bio: String,
  location: String,
  teachSkills: [String],  // skills user can teach
  learnSkills: [String],  // skills user wants to learn
  averageRating: Number,  // 0–5, auto-updated after reviews
  totalReviews: Number,
  isActive: Boolean,
  createdAt, updatedAt
}
```

### Request

```js
{
  senderId: ObjectId,     // ref: User
  receiverId: ObjectId,   // ref: User
  senderSkill: String,    // what sender will teach
  receiverSkill: String,  // what sender wants to learn
  message: String,        // optional intro message
  status: 'pending' | 'accepted' | 'rejected' | 'completed',
  createdAt, updatedAt
}
```

### Review

```js
{
  reviewerId: ObjectId,   // ref: User (who wrote it)
  receiverId: ObjectId,   // ref: User (who receives it)
  requestId: ObjectId,    // ref: Request (must be 'completed')
  rating: Number,         // 1–5
  comment: String,        // min 10 chars
  skillExchanged: String,
  createdAt, updatedAt
}
```

---

## ✨ Features

- **JWT Authentication** — Secure login/register with token-based auth
- **Skill Management** — Add/remove skills you teach and want to learn
- **Smart Matching** — Algorithm scores users by complementary skill overlap
- **Search** — Filter users by any skill keyword
- **Request Flow** — Send → Accept/Reject → Complete → Review
- **Rating System** — 1–5 star reviews, auto-computed averages
- **Responsive UI** — Dark theme with modern design system
- **Protected Routes** — All dashboard pages require authentication

---

## 🛠 Tech Stack

| Layer       | Technology                             |
| ----------- | -------------------------------------- |
| Frontend    | React 18, React Router v6              |
| Styling     | Custom CSS (design tokens, dark theme) |
| HTTP Client | Axios with interceptors                |
| Backend     | Node.js, Express 4                     |
| Database    | MongoDB with Mongoose                  |
| Auth        | JWT + bcryptjs                         |
| Dev Tools   | nodemon                                |

---

## 🔧 Environment Variables

```env
# backend/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
```

For MongoDB Atlas, replace `MONGODB_URI` with your connection string.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT — feel free to use and modify.
