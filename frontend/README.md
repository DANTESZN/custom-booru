# CustomBooru Frontend

A modern, responsive web application for managing image collections with artist profiles, tags, and search functionality. Built with SvelteKit, TypeScript, and Tailwind CSS.

## Overview

CustomBooru is a full-featured image gallery application that allows users to:
- Create and manage artist profiles (aliases)
- Upload and organize images with metadata
- Tag images for better organization
- Search images by tags, artists, titles, and descriptions
- View detailed image information
- Manage user authentication and sessions

## 🚀 Features

### Authentication & User Management
- **User Registration & Login** - Secure JWT-based authentication
- **Session Management** - Automatic token refresh with graceful logout handling
- **User Profile Dropdown** - Avatar display with logout functionality
- **Protected Routes** - Secure access to user-specific content

### Artist Management (Aliases)
- **Artist Profiles** - Create and manage multiple artist personas
- **Bio & Social Links** - Rich profile information with external links
- **Artist Dashboard** - Individual artist pages with image galleries
- **Artist Statistics** - Image count and activity tracking

### Image Management
- **Image Upload** - Drag & drop file upload with preview
- **Metadata Support** - Width, height, source URLs, and custom metadata
- **Tag Management** - Add existing tags or create new ones during upload
- **Image Gallery** - Grid view with responsive design
- **Image Detail View** - Full-size image display with complete metadata
- **File Information** - Filename, size, type, and upload date

### Tag System
- **Tag Creation** - Create new tags or use existing ones
- **Tag Autocomplete** - Smart suggestions while typing
- **Tag Usage Statistics** - See how many images use each tag
- **Tag Management** - Add/remove tags from images

### Search & Discovery
- **Advanced Search** - Search by tags, artist, title, and description
- **Filter Options** - Sort by date, title, or relevance
- **Search Results** - Grid view with pagination
- **Tag Filtering** - Multiple tag search with AND logic

### UI/UX Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Glassmorphism UI** - Beautiful gradient backgrounds and blur effects
- **Dark Mode Ready** - Prepared for dark theme implementation
- **Loading States** - Smooth loading animations and feedback
- **Error Handling** - Graceful error messages and recovery
- **Navigation** - Intuitive breadcrumb navigation
- **Pagination** - Efficient browsing of large image collections

## 🛠️ Technology Stack

### Frontend Framework
- **SvelteKit** - Full-stack web framework with SSR capabilities
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Fast build tool and development server

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **Gradients & Glassmorphism** - Modern visual effects
- **Responsive Design** - Mobile-first approach
- **Custom Components** - Reusable UI components

### State Management
- **Svelte Stores** - Reactive state management
- **Authentication Store** - User session management
- **Image Store** - Image data and operations
- **Tag Store** - Tag management and caching
- **Alias Store** - Artist profile management

### API Integration
- **REST API Client** - Type-safe API communication
- **JWT Authentication** - Secure token-based auth
- **File Upload** - FormData support for image uploads
- **Error Handling** - Comprehensive error management
- **Token Refresh** - Automatic session management

## 📁 Project Structure

```
src/
├── routes/                    # SvelteKit routes
│   ├── +layout.svelte        # Main layout with navigation
│   ├── +page.svelte          # Home page
│   ├── login/                # Authentication pages
│   ├── register/
│   ├── aliases/              # Artist management
│   │   ├── +page.svelte      # Artist list
│   │   ├── create/           # Create new artist
│   │   └── [id]/             # Individual artist pages
│   │       ├── +page.svelte  # Artist profile
│   │       └── images/       # Image management
│   │           ├── +page.svelte     # Image gallery
│   │           ├── upload/          # Image upload
│   │           └── [image_id]/      # Individual image view
│   ├── images/               # Global image gallery
│   ├── tags/                 # Tag management
│   └── search/               # Search functionality
├── lib/
│   ├── api/                  # API client modules
│   │   ├── client.ts         # Base API client
│   │   ├── auth.ts           # Authentication API
│   │   ├── aliases.ts        # Artist API
│   │   ├── images.ts         # Image API
│   │   ├── tags.ts           # Tag API
│   │   └── search.ts         # Search API
│   ├── stores/               # Svelte stores
│   │   ├── auth.ts           # Authentication state
│   │   ├── aliases.ts        # Artist data
│   │   ├── images.ts         # Image data
│   │   └── tags.ts           # Tag data
│   └── types/                # TypeScript definitions
│       └── index.ts          # Type definitions
├── app.css                   # Global styles
└── app.html                  # HTML template
```

## 🎨 UI Components & Pages

### Layout Components
- **Navigation Bar** - Responsive navigation with user dropdown
- **Breadcrumbs** - Contextual navigation for nested pages
- **Footer** - (Ready for implementation)

### Authentication Pages
- **Login Page** (`/login`) - User authentication with email/password
- **Register Page** (`/register`) - New user registration
- **Logout Notification** - Session expiration alerts

### Artist Management
- **Artist List** (`/aliases`) - Grid view of all artists
- **Artist Profile** (`/aliases/[id]`) - Individual artist page with bio, social links, and recent images
- **Create Artist** (`/aliases/create`) - Form to create new artist profiles
- **Artist Images** (`/aliases/[id]/images`) - Gallery of all images by artist

### Image Management
- **Image Upload** (`/aliases/[id]/images/upload`) - File upload with metadata and tags
- **Image Gallery** (`/aliases/[id]/images`) - Grid view of artist's images
- **Image Detail** (`/aliases/[id]/images/[image_id]`) - Full image view with metadata
- **Global Gallery** (`/images`) - All images across artists

### Search & Discovery
- **Search Page** (`/search`) - Advanced search with filters
- **Tag Management** (`/tags`) - Browse and manage tags
- **Search Results** - Paginated results with image previews

### Utility Pages
- **Home Page** (`/`) - Welcome page with quick navigation
- **404 Page** - Error handling for missing routes

## 🔧 API Integration

### Authentication Flow
1. User logs in with email/password
2. Server returns JWT token in Authorization header
3. Token stored in localStorage
4. All subsequent requests include Bearer token
5. Automatic logout on token expiration

### Image Upload Process
1. User selects file and fills metadata
2. Form data created with image, metadata, and tags
3. File uploaded via FormData POST request
4. Server processes image and creates database record
5. Response includes serialized image data with URLs

### Search Functionality
1. User enters search criteria (tags, artist, title, description)
2. Query parameters built dynamically
3. Search API called with filters
4. Results returned with pagination metadata
5. Images displayed in responsive grid

## 🎯 Key Features Implemented

### Tag Management in Upload
- **Tag Autocomplete** - Shows existing tags while typing
- **New Tag Creation** - Create tags that don't exist
- **Tag Removal** - Remove tags with X button
- **Visual Feedback** - Purple badges for selected tags

### Responsive Image Gallery
- **Grid Layout** - Responsive grid that adapts to screen size
- **Image Previews** - Aspect-ratio maintained thumbnails
- **Hover Effects** - Smooth scale transitions
- **Loading States** - Skeleton loading for better UX

### Session Management
- **Token Validation** - Check token validity on page focus
- **Graceful Logout** - Custom event-based logout notification
- **Session Expiration** - 7-day token expiration with renewal
- **Navigation Persistence** - Maintain session across page navigation

### Search Experience
- **Multi-filter Search** - Combine tags, artist, title, and description
- **Sort Options** - Sort by date, title, or relevance
- **Pagination** - Navigate through large result sets
- **Visual Results** - Grid view with image previews and metadata

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm or pnpm
- Rails backend API running on port 3000

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
# API Configuration
PUBLIC_VITE_API_BASE_URL=http://localhost:3000

# Add other environment variables as needed
```

### Development Commands
```bash
# Run development server
npm run dev

# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## 🔒 Security Features

### Authentication Security
- **JWT Token Management** - Secure token storage and validation
- **CSRF Protection** - Cross-site request forgery protection
- **XSS Prevention** - Input sanitization and output encoding
- **Session Timeout** - Automatic logout on token expiration

### File Upload Security
- **File Type Validation** - Only allow image files
- **Size Limits** - Prevent large file uploads
- **Virus Scanning** - (Ready for implementation)
- **Content Validation** - Verify file contents match extension

## 📱 Responsive Design

### Breakpoints
- **Mobile** - 320px - 640px
- **Tablet** - 641px - 1024px
- **Desktop** - 1025px+

### Responsive Features
- **Navigation** - Collapsible mobile menu
- **Image Grid** - Adaptive column counts
- **Forms** - Touch-friendly inputs
- **Typography** - Scalable text sizes

## 🎨 Design System

### Color Palette
- **Primary** - Purple gradients (#7C3AED - #EC4899)
- **Secondary** - Blue gradients (#3B82F6 - #1D4ED8)
- **Success** - Green (#10B981)
- **Error** - Red (#EF4444)
- **Warning** - Orange (#F59E0B)

### Typography
- **Headings** - Inter font family
- **Body** - System font stack
- **Code** - Monospace fonts

### Components
- **Buttons** - Gradient backgrounds with hover effects
- **Cards** - Glassmorphism with backdrop blur
- **Forms** - Rounded inputs with focus states
- **Tags** - Colorful badges with removal buttons

## 🔮 Future Enhancements

### Planned Features
- **Dark Mode** - Toggle between light and dark themes
- **Bulk Operations** - Select multiple images for batch operations
- **Image Editing** - Basic image editing tools
- **Comments** - User comments on images
- **Favorites** - Save favorite images
- **Collections** - Create custom image collections
- **Export** - Export image collections
- **Analytics** - Usage statistics and insights

### Technical Improvements
- **PWA** - Progressive Web App features
- **Offline Support** - Cache images and data for offline use
- **Performance** - Virtual scrolling for large galleries
- **Accessibility** - WCAG compliance improvements
- **Testing** - Unit and integration tests
- **Documentation** - API documentation with examples

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

### Testing
- Write unit tests for utilities
- Test API integration
- Verify responsive design
- Check accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **SvelteKit** - Amazing full-stack framework
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Vite** - Fast build tool
- **TypeScript** - Type safety and developer experience

---

Built with ❤️ using SvelteKit and modern web technologies.