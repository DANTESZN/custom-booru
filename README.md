# CustomBooru

A modern, full-stack image gallery and artist management platform. Built with a Rails API backend and a SvelteKit frontend, CustomBooru enables artists and content creators to organize, tag, and share their work with advanced search and robust security.

---

## 🌟 Features
- **User Authentication**: Secure JWT-based login and registration
- **Artist Profiles (Aliases)**: Multiple personas per user, with bios and social links
- **Image Upload & Management**: Drag-and-drop uploads, metadata, tagging, and gallery views
- **Tagging System**: Flexible, many-to-many tags with autocomplete and statistics
- **Advanced Search**: Filter by tags, artist, title, description, and more
- **Responsive UI**: Mobile-first, glassmorphism design, dark mode ready
- **Security**: CORS, file validation, JWT, CSRF/XSS protection, and more

---

## 🏗️ Architecture
- **Backend**: Ruby on Rails 8 API-only, PostgreSQL, Devise + JWT, ActiveStorage
- **Frontend**: SvelteKit, TypeScript, Tailwind CSS, Vite

```
CustomBooru/
├── backend/   # Rails API
└── frontend/  # SvelteKit app
```

---

## 🚀 Quick Start

### Backend (API)
1. **Install dependencies**
   ```bash
   cd backend
   bundle install
   ```
2. **Database setup**
   ```bash
   bin/rails db:create db:migrate
   ```
3. **Start the server**
   ```bash
   bin/rails server
   ```
   API available at `http://localhost:3000`

### Frontend (Web App)
1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the dev server**
   ```bash
   npm run dev
   ```
   App available at `http://localhost:5173` (default)

---

## 🔒 Security Highlights
- **JWT Authentication**: Secure, stateless sessions
- **CORS**: Configurable, restrict in production
- **File Validation**: Type and size checks for uploads
- **CSRF/XSS Protection**: Input sanitization, output encoding
- **Sensitive Data**: All secrets and keys are excluded from version control

---

## 📚 API & Usage
- All API endpoints require a JWT token in the `Authorization` header (except registration/login)
- See `backend/API_DOCUMENTATION.md` for full API details and examples

---

## 🧩 Contribution Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes (TypeScript for frontend, Ruby for backend)
4. Add tests for new features
5. Submit a pull request

---

## 📄 License
MIT License. See LICENSE file for details.

---

Built with ❤️ using Rails, SvelteKit, and modern web technologies. 