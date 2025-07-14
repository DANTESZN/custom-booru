# CustomBooru API

A Rails API-only application for managing image collections with user authentication, aliases, and tagging functionality. Built for artists and content creators who want to organize and share their work with advanced search capabilities.

## 🌟 Features

- **User Authentication**: JWT-based authentication with Devise
- **Alias Management**: Create multiple artist personas/profiles per user
- **Image Upload**: Support for JPG, PNG, GIF, WebP with metadata storage
- **Tagging System**: Flexible tagging with many-to-many relationships
- **Advanced Search**: Search by tags, text, alias, with sorting and pagination
- **File Management**: ActiveStorage integration for secure file handling
- **API-First**: JSON API specification compliant responses
- **Security**: CORS configured, file validation, JWT token management

## 🚀 Quick Start

### Prerequisites

- Ruby 3.4.4+
- PostgreSQL 12+
- Rails 8.0.2+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CustomBooru
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Database setup**
   ```bash
   # Make sure PostgreSQL is running
   sudo service postgresql start
   
   # Create databases
   bin/rails db:create
   
   # Run migrations
   bin/rails db:migrate
   ```

4. **Start the server**
   ```bash
   bin/rails server
   ```

The API will be available at `http://localhost:3000`

## 📱 API Usage

### Authentication

All endpoints except authentication require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Register a new user
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"user": {"email": "user@example.com", "password": "password123", "password_confirmation": "password123"}}'
```

#### Login
```bash
curl -X POST http://localhost:3000/users/sign_in \
  -H "Content-Type: application/json" \
  -d '{"user": {"email": "user@example.com", "password": "password123"}}' \
  -i
```
*Note: The JWT token will be in the `Authorization` header of the response*

### Managing Aliases

#### Create an alias (artist profile)
```bash
curl -X POST http://localhost:3000/api/v1/aliases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"alias": {"name": "ArtistName", "bio": "Artist bio", "social_links": {}}}'
```

#### List your aliases
```bash
curl -X GET http://localhost:3000/api/v1/aliases \
  -H "Authorization: Bearer <token>"
```

### Image Management

#### Upload an image
```bash
curl -X POST http://localhost:3000/api/v1/aliases/1/images \
  -H "Authorization: Bearer <token>" \
  -F "image[title]=My Artwork" \
  -F "image[description]=Description of the artwork" \
  -F "image[file]=@/path/to/image.jpg" \
  -F "image[metadata][camera]=Canon EOS"
```

#### List images for an alias
```bash
curl -X GET http://localhost:3000/api/v1/aliases/1/images \
  -H "Authorization: Bearer <token>"
```

### Tag Management

#### Add tags to an image
```bash
curl -X POST http://localhost:3000/api/v1/aliases/1/images/1/add_tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"tags": ["landscape", "digital-art", "nature"]}'
```

#### Remove tags from an image
```bash
curl -X DELETE http://localhost:3000/api/v1/aliases/1/images/1/remove_tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"tags": ["nature"]}'
```

#### List all tags
```bash
curl -X GET http://localhost:3000/api/v1/tags \
  -H "Authorization: Bearer <token>"
```

### Search Functionality

#### Basic search (all images)
```bash
curl -X GET "http://localhost:3000/api/v1/search/images" \
  -H "Authorization: Bearer <token>"
```

#### Search by single tag
```bash
curl -X GET "http://localhost:3000/api/v1/search/images?tags=landscape" \
  -H "Authorization: Bearer <token>"
```

#### Search by multiple tags (AND operation)
```bash
curl -X GET "http://localhost:3000/api/v1/search/images?tags=landscape,digital-art" \
  -H "Authorization: Bearer <token>"
```

#### Search by text query
```bash
curl -X GET "http://localhost:3000/api/v1/search/images?query=portrait" \
  -H "Authorization: Bearer <token>"
```

#### Complex search with filtering and sorting
```bash
curl -X GET "http://localhost:3000/api/v1/search/images?tags=landscape&query=test&sort=title&alias_id=1" \
  -H "Authorization: Bearer <token>"
```

#### Search parameters:
- `tags`: Comma-separated list of tag names (AND operation)
- `query`: Search term for title/description
- `alias_id`: Filter by specific alias
- `sort`: Sort order (`title`, `oldest`, default: newest)
- `page`, `per_page`: Pagination (default: 20 per page)

## 🏗️ Architecture

### Data Models

```
User
├── has_many: aliases
└── Authentication via Devise + JWT

Alias (Artist Profile)
├── belongs_to: user
├── has_many: images
├── has_one_attached: avatar
└── attributes: name, bio, social_links

Image
├── belongs_to: alias
├── has_and_belongs_to_many: tags
├── has_one_attached: file
└── attributes: title, description, metadata

Tag
├── has_and_belongs_to_many: images
└── attributes: name, usage_count
```

### API Response Format

All responses follow JSON API specification:

```json
{
  "data": {
    "id": "1",
    "type": "resource_type",
    "attributes": {
      "id": 1,
      "title": "Example",
      "created_at": "2025-01-01T00:00:00.000Z"
    },
    "relationships": {
      "related_resource": {
        "data": [{"id": "1", "type": "related_type"}]
      }
    }
  },
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

## ✅ Testing Results

The API has been thoroughly tested with the following results:

### Image Operations ✅
- ✅ Image upload with file attachment (tested with 1.3MB JPG)
- ✅ Image metadata storage (custom fields)
- ✅ File information capture (filename, size, content type)
- ✅ Active Storage URL generation
- ✅ Image listing with pagination

### Tag Operations ✅
- ✅ Tag creation with validation
- ✅ Tag assignment to images
- ✅ Tag removal from images
- ✅ Automatic tag creation during assignment
- ✅ Tag usage count tracking
- ✅ Tag listing with usage statistics

### Search Functionality ✅
- ✅ Basic search (all images)
- ✅ Single tag search
- ✅ Multiple tag search (AND operation)
- ✅ Text query search (title + description)
- ✅ Alias-specific filtering
- ✅ Multiple sorting options (newest, oldest, title)
- ✅ Complex combined searches (tags + query + sort)
- ✅ Pagination with metadata

### Security & Authentication ✅
- ✅ JWT authentication working across all endpoints
- ✅ User-specific data isolation
- ✅ File upload validation
- ✅ CORS configuration
- ✅ Proper error handling

## 🔧 Configuration

### Environment Variables

For production, set these environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/custom_booru_production

# JWT Secret (automatically generated in Rails credentials)
# Edit with: rails credentials:edit

# File Storage (for production)
# Configure cloud storage in config/storage.yml
```

### Security Features

- JWT token expiration (1 day default)
- File type validation (images only)
- File size limits (50MB max)
- CORS headers configured
- SSL/HTTPS enforced in production
- User data isolation (users can only access their own data)

## 📂 File Structure

```
app/
├── controllers/
│   ├── application_controller.rb
│   ├── users/                     # Authentication controllers
│   └── api/v1/                    # API endpoints
│       ├── base_controller.rb
│       ├── aliases_controller.rb
│       ├── images_controller.rb
│       ├── tags_controller.rb
│       └── search_controller.rb
├── models/
│   ├── user.rb                    # Devise + JWT
│   ├── alias.rb                   # Artist profiles
│   ├── image.rb                   # Images with ActiveStorage
│   └── tag.rb                     # Tagging system
└── serializers/                   # JSON API serializers
    ├── user_serializer.rb
    ├── alias_serializer.rb
    ├── image_serializer.rb
    └── tag_serializer.rb
```

## 🚢 Deployment

### Production Checklist

1. **Database**: Set up PostgreSQL with proper credentials
2. **File Storage**: Configure cloud storage (AWS S3, Google Cloud, etc.)
3. **Environment**: Set production environment variables
4. **SSL**: Configure HTTPS certificates
5. **CDN**: Set up CDN for image delivery
6. **Monitoring**: Add error tracking and performance monitoring
7. **Backups**: Configure regular database backups

### Docker Deployment

The application includes Docker configuration:

```bash
# Build and run with Docker
docker build -t custom-booru .
docker run -p 3000:3000 custom-booru
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation
2. Review the test examples above
3. Open an issue in the repository

## 📋 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Register new user |
| POST | `/users/sign_in` | Login user |
| DELETE | `/users/sign_out` | Logout user |
| GET | `/api/v1/aliases` | List user's aliases |
| POST | `/api/v1/aliases` | Create alias |
| GET | `/api/v1/aliases/:id` | Get specific alias |
| PATCH | `/api/v1/aliases/:id` | Update alias |
| DELETE | `/api/v1/aliases/:id` | Delete alias |
| GET | `/api/v1/aliases/:alias_id/images` | List alias images |
| POST | `/api/v1/aliases/:alias_id/images` | Upload image |
| GET | `/api/v1/aliases/:alias_id/images/:id` | Get specific image |
| PATCH | `/api/v1/aliases/:alias_id/images/:id` | Update image |
| DELETE | `/api/v1/aliases/:alias_id/images/:id` | Delete image |
| POST | `/api/v1/aliases/:alias_id/images/:id/add_tags` | Add tags to image |
| DELETE | `/api/v1/aliases/:alias_id/images/:id/remove_tags` | Remove tags from image |
| GET | `/api/v1/tags` | List all tags |
| POST | `/api/v1/tags` | Create tag |
| GET | `/api/v1/tags/:name` | Get specific tag |
| GET | `/api/v1/search/images` | Search images |

---

**CustomBooru API** - Built with ❤️ using Rails, PostgreSQL, and modern web standards.

## 🔑 Setting Up JWT Secret Key

Before starting the server, you must set a JWT secret key in your Rails credentials. This is required for authentication to work.

1. **Generate a secure JWT secret key:**
   ```bash
   ruby -rsecurerandom -e 'puts SecureRandom.hex(64)'
   ```
   Copy the output (a long random string).

2. **Edit Rails credentials to add the secret:**
   ```bash
   bin/rails credentials:edit
   ```
   Add the following line (replace with your generated key):
   ```yaml
   devise_jwt_secret_key: your_generated_secret_key_here
   ```
   Save and close the editor.

3. **Continue with the rest of the setup as described below.**
