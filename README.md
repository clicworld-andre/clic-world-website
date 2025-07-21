# Clic.World Blog Management System

A comprehensive blog management system with PostgreSQL backend, REST API, and support for both public website and admin interface (ClicMe app).

## 🏗️ Architecture Overview

- **Database**: PostgreSQL with comprehensive schema
- **API**: Express.js REST API with JWT authentication
- **Public Routes**: For website blog display
- **Admin Routes**: For ClicMe app blog management
- **Migration System**: Automated database setup and data migration

## 📁 Project Structure

```
clic-website-2/
├── api/
│   ├── server.js                 # Main API server
│   ├── routes/
│   │   ├── public.js            # Public blog endpoints
│   │   ├── admin.js             # Admin blog management
│   │   └── auth.js              # Authentication endpoints
│   └── middleware/
│       ├── auth.js              # JWT authentication
│       └── errorHandler.js     # Error handling
├── migrations/
│   ├── 001_create_blog_tables.sql    # Database schema
│   ├── 002_seed_initial_data.sql     # Initial data
│   └── 003_create_admin_users.sql    # Admin users
├── src/data/
│   └── blogPosts.js             # Existing blog posts (to migrate)
├── run-migrations.js            # Migration runner
├── migrate-blog-data.js         # Data migration tool
├── setup-blog-database.js      # Complete setup script
└── package.json                # Dependencies
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE clic_blog;
```

### 3. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run Complete Setup

```bash
# Complete database setup (schema + data migration)
npm run setup

# Or run individually:
npm run migrate              # Run schema migrations
npm run data:migrate         # Migrate existing blog posts
```

### 5. Start the API Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3001`

## 📊 Database Schema

### Core Tables

- **authors** - Blog authors and users
- **categories** - Post categories with colors and descriptions
- **tags** - Flexible tagging system with usage tracking
- **blog_posts** - Main content with SEO fields
- **post_tags** - Many-to-many relationship for posts and tags
- **admin_users** - Admin authentication and roles

### Key Features

- **Auto-timestamps** - created_at/updated_at with triggers
- **Slug validation** - URL-safe slugs with uniqueness
- **Featured posts** - Homepage highlighting
- **View counting** - Automatic increment on reads
- **SEO optimization** - Meta titles, descriptions, social images
- **Tag usage tracking** - Automatic count updates

## 🌐 API Endpoints

### Public Endpoints (Website)

```
GET /api/posts                 # Paginated posts with filtering
GET /api/posts/featured        # Featured posts for homepage
GET /api/posts/:slug           # Single post by slug
GET /api/categories            # All categories with post counts
GET /api/tags                  # Popular tags
GET /api/search                # Full-text search
```

### Admin Endpoints (ClicMe App)

Authentication required for all admin endpoints.

```
# Authentication
POST /api/auth/login           # Admin login
POST /api/auth/logout          # Admin logout
GET /api/auth/me               # Current user info
POST /api/auth/register        # Create new admin user (admin only)
PUT /api/auth/change-password  # Change password

# Blog Management
GET /api/admin/posts           # All posts including drafts
GET /api/admin/posts/:id       # Single post by ID
POST /api/admin/posts          # Create new post
PUT /api/admin/posts/:id       # Update post
DELETE /api/admin/posts/:id    # Delete post

# Statistics
GET /api/admin/stats           # Comprehensive blog analytics

# Category Management
GET /api/admin/categories      # All categories for management
POST /api/admin/categories     # Create new category
PUT /api/admin/categories/:id  # Update category

# Tag Management
GET /api/admin/tags            # All tags with usage stats

# Utilities
POST /api/admin/validate-slug  # Check slug availability
```

## 🔐 Authentication

The system uses JWT-based authentication for admin access:

- **Admin**: Full access to all operations
- **Editor**: Can create and edit posts, manage categories
- **Viewer**: Read-only access to admin endpoints

### Default Admin User

```
Username: admin
Email: admin@clic.world
Password: admin123
```

**⚠️ Change the default password in production!**

## 📊 Blog Data Migration

The system includes tools to migrate your existing blog posts:

### Migration Features

- Preserves all existing data (IDs, content, dates)
- Maps authors to database authors
- Creates missing tags automatically
- Handles featured post status
- Maintains SEO-friendly slugs

### Migration Commands

```bash
# Preview migration without executing
npm run data:migrate -- --dry-run

# Run migration (updates existing posts if re-run)
npm run data:migrate

# Force overwrite existing data
npm run data:migrate -- --force
```

## 🛠️ Development Commands

```bash
# Database Management
npm run migrate              # Run pending migrations
npm run migrate:dry-run      # Preview migrations
npm run migrate:reset        # Reset and rebuild database

# Complete Setup
npm run setup                # Full setup (schema + data)
npm run setup -- --dry-run   # Preview complete setup
npm run setup -- --reset     # Fresh rebuild

# Development
npm run dev                  # Start with auto-reload
npm run test                 # Basic migration tests
```

## 📝 Blog Post Structure

### Frontend Integration

```javascript
// Fetch posts for website
const response = await fetch('/api/posts?page=1&limit=10&category=movement');
const { posts, pagination } = await response.json();

// Get single post
const response = await fetch('/api/posts/africa-youth-surge-demographic-dividend-clix-future');
const { post } = await response.json();
```

### Admin Integration

```javascript
// Admin authentication
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const { token } = await response.json();

// Create new post
const response = await fetch('/api/admin/posts', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'New Blog Post',
    content: 'Post content...',
    published: true,
    featured: false,
    tags: ['tag1', 'tag2']
  })
});
```

## 🔧 Configuration Options

### Environment Variables

- **API_PORT**: Server port (default: 3001)
- **DB_*****: Database connection settings
- **JWT_SECRET**: JWT signing secret (change in production!)
- **FRONTEND_URL**: Frontend URL for CORS
- **RATE_LIMIT_MAX_REQUESTS**: API rate limiting

### Database Connection

The system uses connection pooling with these defaults:
- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 2 seconds

## 📈 Monitoring & Analytics

### Built-in Statistics

The admin API provides comprehensive analytics:

- Post counts (total, published, drafts, featured)
- View statistics (total, average, maximum)
- Category distribution
- Author productivity
- Popular posts ranking
- Recent activity (30-day trends)
- Tag usage patterns

### Health Checks

```bash
curl http://localhost:3001/health
```

Returns database connectivity and server status.

## 🚨 Error Handling

The API includes comprehensive error handling:

- Validation errors (400)
- Authentication failures (401)
- Permission denials (403)
- Resource not found (404)
- Conflict errors (409)
- Server errors (500)

All errors include:
- Error message
- Timestamp
- Request path
- Stack trace (development only)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with cost factor 12
- **Rate Limiting**: 100 requests/15min (public), 50 requests/15min (admin)
- **CORS Protection**: Configurable origin whitelist
- **Helmet Security**: Security headers and protections
- **Input Validation**: SQL injection prevention
- **Role-Based Access**: Admin, editor, viewer permissions

## 📚 Next Steps

1. **Frontend Integration**: Connect your React components to the API
2. **Production Deployment**: Set up production database and environment
3. **Content Migration**: Run the data migration for existing posts
4. **User Management**: Create additional admin users as needed
5. **Monitoring**: Set up logging and monitoring for production use

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation for API changes
4. Use the migration system for database changes

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for Clic.World** - *Building tomorrow through community-owned finance*
