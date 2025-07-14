# CustomBooru API Documentation

## Overview

CustomBooru is a Rails API-only application for managing image collections with user authentication, aliases, and tagging functionality. It uses JWT authentication and provides a RESTful API for all operations.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. All endpoints except authentication ones require a valid JWT token in the Authorization header.

### Authentication Endpoints

#### Register
- **POST** `/users`
- **Body**: `{ "user": { "email": "user@example.com", "password": "password", "password_confirmation": "password" } }`
- **Response**: User details and success message

#### Login
- **POST** `/users/sign_in`
- **Body**: `{ "user": { "email": "user@example.com", "password": "password" } }`
- **Response**: User details and JWT token in Authorization header

#### Logout
- **DELETE** `/users/sign_out`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

## API Endpoints

All API endpoints are prefixed with `/api/v1/` and require authentication unless specified.

### Aliases

Aliases represent artist personas/profiles that belong to a user.

#### List User's Aliases
- **GET** `/api/v1/aliases`
- **Response**: Array of alias objects with associated images

#### Get Specific Alias
- **GET** `/api/v1/aliases/:id`
- **Response**: Alias object with associated images

#### Create Alias
- **POST** `/api/v1/aliases`
- **Body**: `{ "alias": { "name": "ArtistName", "bio": "Artist bio", "social_links": {} } }`
- **Response**: Created alias object

#### Update Alias
- **PATCH/PUT** `/api/v1/aliases/:id`
- **Body**: `{ "alias": { "name": "UpdatedName", "bio": "Updated bio" } }`
- **Response**: Updated alias object

#### Delete Alias
- **DELETE** `/api/v1/aliases/:id`
- **Response**: Success message

### Images

Images belong to aliases and can have multiple tags.

#### List Alias Images
- **GET** `/api/v1/aliases/:alias_id/images`
- **Query Params**: `page`, `per_page` (for pagination)
- **Response**: Paginated array of image objects with metadata

#### Get Specific Image
- **GET** `/api/v1/aliases/:alias_id/images/:id`
- **Response**: Image object with tags

#### Upload Image
- **POST** `/api/v1/aliases/:alias_id/images`
- **Body**: `{ "image": { "title": "Image Title", "description": "Description", "file": <file>, "metadata": {} } }`
- **Response**: Created image object

#### Update Image
- **PATCH/PUT** `/api/v1/aliases/:alias_id/images/:id`
- **Body**: `{ "image": { "title": "Updated Title", "description": "Updated description" } }`
- **Response**: Updated image object

#### Delete Image
- **DELETE** `/api/v1/aliases/:alias_id/images/:id`
- **Response**: Success message

#### Add Tags to Image
- **POST** `/api/v1/aliases/:alias_id/images/:id/add_tags`
- **Body**: `{ "tags": ["tag1", "tag2", "tag3"] }`
- **Response**: Updated image object with new tags

#### Remove Tags from Image
- **DELETE** `/api/v1/aliases/:alias_id/images/:id/remove_tags`
- **Body**: `{ "tags": ["tag1", "tag2"] }`
- **Response**: Updated image object with removed tags

### Tags

Tags are used to categorize images and can be shared across the system.

#### List All Tags
- **GET** `/api/v1/tags`
- **Query Params**: `popular=true`, `search=term`, `page`, `per_page`
- **Response**: Paginated array of tag objects

#### Get Specific Tag
- **GET** `/api/v1/tags/:name`
- **Response**: Tag object with associated images

#### Create Tag
- **POST** `/api/v1/tags`
- **Body**: `{ "tag": { "name": "tagname" } }`
- **Response**: Created tag object

### Search

Search functionality for finding images based on various criteria.

#### Search Images
- **GET** `/api/v1/search/images`
- **Query Params**:
  - `tags`: Comma-separated list of tag names
  - `query`: Search term for title/description
  - `alias_id`: Filter by specific alias
  - `sort`: Sort order (`title`, `oldest`, default: newest)
  - `page`, `per_page`: Pagination
- **Response**: Paginated array of matching images with tags and alias info

## Data Models

### User
- `id`: Integer
- `email`: String (unique)
- `created_at`: DateTime
- `has_many`: aliases

### Alias
- `id`: Integer
- `name`: String (unique per user)
- `bio`: Text
- `social_links`: JSON object
- `user_id`: Foreign key
- `created_at`, `updated_at`: DateTime
- `belongs_to`: user
- `has_many`: images
- `has_one_attached`: avatar

### Image
- `id`: Integer
- `title`: String
- `description`: Text
- `metadata`: JSON object
- `alias_id`: Foreign key
- `created_at`, `updated_at`: DateTime
- `belongs_to`: alias
- `has_and_belongs_to_many`: tags
- `has_one_attached`: file

### Tag
- `id`: Integer
- `name`: String (unique)
- `created_at`, `updated_at`: DateTime
- `has_and_belongs_to_many`: images

## Response Format

All API responses follow the JSON:API specification format:

```json
{
  "data": {
    "id": "1",
    "type": "resource_type",
    "attributes": {
      // Resource attributes
    },
    "relationships": {
      // Related resources
    }
  },
  "meta": {
    // Pagination info for collections
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

## Error Handling

Errors return appropriate HTTP status codes with descriptive JSON responses:

```json
{
  "error": "Error message",
  "details": {
    // Validation errors or additional details
  }
}
```

## Security Features

- JWT authentication with token expiration
- CORS configured for cross-origin requests
- File upload validation for image types
- User authorization (users can only access their own resources)
- SSL/HTTPS enforcement in production
- Secure password handling with Devise

## Development Setup

1. Install PostgreSQL
2. Run `bundle install`
3. Run `bin/rails db:create db:migrate`
4. Start server: `bin/rails server`

## Production Considerations

- Configure environment variables for JWT secret
- Set up proper SSL certificates
- Configure cloud storage for ActiveStorage (S3, GCS, etc.)
- Set up CDN for image delivery
- Implement rate limiting and monitoring
- Regular database backups

## File Uploads

Images are handled via ActiveStorage with the following considerations:
- Supported formats: PNG, JPG, JPEG, GIF, WebP
- Maximum file size: 50MB (configurable)
- Files are stored locally in development, configure cloud storage for production

This API provides a complete backend for a custom booru-style application with user management, image organization, and search capabilities.