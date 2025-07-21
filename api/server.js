/**
 * Blog API Server
 * Express.js server providing REST API for blog management
 * Supports both public endpoints (website) and admin endpoints (ClicMe app)
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
require('dotenv').config();

// Import route modules
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.API_PORT || 3001;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'clic_blog',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Make database available to routes
app.locals.db = pool;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', // React development server
      'http://localhost:3001', // API server
      'https://clic.world', // Production website
      'https://www.clic.world', // Production website with www
      process.env.FRONTEND_URL, // Environment-specific frontend URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // More restrictive for admin endpoints
  message: {
    error: 'Too many admin requests from this IP, please try again later.',
  },
});

app.use('/api/', limiter);
app.use('/api/admin/', adminLimiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Increase limit for blog post content
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    });
  }
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Clic.World Blog API',
    version: '1.0.0',
    description: 'REST API for blog management supporting both public and admin operations',
    endpoints: {
      public: {
        'GET /api/posts': 'Get published blog posts with pagination and filtering',
        'GET /api/posts/:slug': 'Get single blog post by slug',
        'GET /api/posts/featured': 'Get featured blog posts',
        'GET /api/categories': 'Get all categories',
        'GET /api/tags': 'Get all tags',
        'GET /api/search': 'Search blog posts',
      },
      admin: {
        'POST /api/auth/login': 'Admin login',
        'GET /api/admin/posts': 'Get all posts including drafts (requires auth)',
        'POST /api/admin/posts': 'Create new blog post (requires auth)',
        'PUT /api/admin/posts/:id': 'Update blog post (requires auth)',
        'DELETE /api/admin/posts/:id': 'Delete blog post (requires auth)',
        'GET /api/admin/stats': 'Get blog statistics (requires auth)',
      },
    },
    documentation: 'See README.md for detailed API documentation',
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 Blog API Server started');
  console.log(`📊 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${process.env.DB_NAME || 'clic_blog'} on ${process.env.DB_HOST || 'localhost'}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

module.exports = app;
