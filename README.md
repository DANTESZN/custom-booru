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

### 🐳 Docker Development (Recommended)

**Prerequisites:**
- Docker and Docker Compose installed
- Git (for cloning the repository)

**Setup:**
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd custom-booru
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Rails master key:
   ```bash
   # Generate a new Rails master key
   cd backend && bin/rails credentials:edit
   # Copy the master key from config/master.key to .env
   ```

3. **Start all services**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Initialize the database** (first time only)
   ```bash
   # In a new terminal, run database migrations
   docker-compose -f docker-compose.dev.yml exec backend bin/rails db:create db:migrate
   ```

**Access the application:**
- **Frontend**: http://localhost:4173
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5434

**Development workflow:**
- Code changes are automatically reflected (hot reload)
- Database data persists between container restarts
- Use `docker-compose -f docker-compose.dev.yml down` to stop all services

---

### 📦 Manual Setup (Alternative)

#### Backend (API)
1. **Install dependencies**
   ```bash
   cd backend
   bundle install
   ```
2. **Database setup**
   ```bash
   bin/rails db:create db:migrate
   ```
3. **Generate a secure JWT secret key:**
   ```bash
   ruby -rsecurerandom -e 'puts SecureRandom.hex(64)'
   ```
   Copy the output (a long random string).

4. **Edit Rails credentials to add the secret:**
   ```bash
   bin/rails credentials:edit
   ```
   Add the following line (replace with your generated key):
   ```yaml
   devise_jwt_secret_key: your_generated_secret_key_here
   ```
   Save and close the editor.
5. **Start the server**
   ```bash
   bin/rails server
   ```
   API available at `http://localhost:3000`

#### Frontend (Web App)
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