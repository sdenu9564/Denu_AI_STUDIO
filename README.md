# Denu_AI_STUDIO

# 🧑🏽‍💻 AI Studio – Backend

A complete full-stack implementation of the **AI Studio** assignment with:

- 🛠️ **Backend:** Node.js, Express, TypeScript, PostgreSQL, Multer, JWT, PrismaORM, Joi
- 🧪 **Testing:** Jest, Supertest
- 🐳 **Docker (Optional)** for local deployment
- 📦 **Production-ready folder structure, documentation, and API spec**

---

# 🔥 Features

## 🔒 Authentication

- Signup / Login
- Password hashing with **bcrypt**
- JWT-based auth
- Validation using **Joi**
- Rate limiting & input sanitization

## 🧠 Image Generation (Simulated)

- Upload image
- Pass `prompt` and `style`
- Add artificial delay (1–2 seconds)
- **20% random failure** (model overload)
- Save each generation per user
- Fetch recent generations with limit

## 🧪 Testing Coverage

- Auth API tests
- Generation API tests
- Input validation tests
- Random overload behavior tests

---

# 🧱 Project Structure

/backend

├── src/

├── tests/

├── prisma or db/

├── Dockerfile

└── package.json

---

# ⚙️ Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma or Sequelize
- Multer
- JWT
- Joi validation

### DevOps

- Docker
- Docker Compose
- GitHub Actions (optional)

---

# 🚀 Getting Started (Without Docker)

## Clone repo

```bash
git clone <repo-url>
cd ai-studio
cd backend
npm install
```

## Add environment

JWT_SECRET=your_secret
JWT_EXPIRATION=2d

DATABASE_URL=postgresql://user:password@host:port/db_name?schema=public

## Generate a Private Key

Run:

```bash
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem

```
