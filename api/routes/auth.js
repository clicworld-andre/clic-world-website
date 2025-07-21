/**
 * Authentication Routes
 * Handles login, logout, and user management for admin access
 */

const express = require('express');
const router = express.Router();
const { 
  generateToken, 
  hashPassword, 
  verifyPassword, 
  authMiddleware 
} = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/auth/login - Admin login
router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Username and password are required',
    });
  }

  const db = req.app.locals.db;

  // Find user by username or email
  const userQuery = `
    SELECT id, username, email, password_hash, role, active, 
           last_login, created_at
    FROM admin_users 
    WHERE (username = $1 OR email = $1) AND active = true
  `;

  const userResult = await db.query(userQuery, [username]);

  if (userResult.rows.length === 0) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid credentials',
    });
  }

  const user = userResult.rows[0];

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash);

  if (!isValidPassword) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid credentials',
    });
  }

  // Update last login timestamp
  await db.query(
    'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [user.id]
  );

  // Generate JWT token
  const token = generateToken(user);

  // Return success response
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.last_login,
      createdAt: user.created_at,
    },
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}));

// POST /api/auth/logout - Admin logout (optional, mainly for client-side token removal)
router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
  // In a more sophisticated setup, you might want to blacklist the token
  // For now, this is mainly a placeholder for client-side token removal
  res.json({
    message: 'Logout successful',
    timestamp: new Date().toISOString(),
  });
}));

// GET /api/auth/me - Get current user info
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  res.json({
    user: req.user,
  });
}));

// POST /api/auth/register - Register new admin user (restricted)
router.post('/register', authMiddleware, asyncHandler(async (req, res) => {
  // Only existing admins can create new users
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'Only admins can create new users',
    });
  }

  const { username, email, password, role = 'editor' } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Username, email, and password are required',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Password must be at least 8 characters long',
    });
  }

  const validRoles = ['admin', 'editor', 'viewer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      error: 'Validation error',
      message: `Role must be one of: ${validRoles.join(', ')}`,
    });
  }

  const db = req.app.locals.db;

  // Check if user already exists
  const existingUser = await db.query(
    'SELECT id FROM admin_users WHERE username = $1 OR email = $2',
    [username, email]
  );

  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      error: 'User already exists',
      message: 'Username or email already taken',
    });
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const insertQuery = `
    INSERT INTO admin_users (username, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role, active, created_at
  `;

  const result = await db.query(insertQuery, [username, email, passwordHash, role]);
  const newUser = result.rows[0];

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      active: newUser.active,
      createdAt: newUser.created_at,
    },
  });
}));

// PUT /api/auth/change-password - Change user password
router.put('/change-password', authMiddleware, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Current password and new password are required',
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'New password must be at least 8 characters long',
    });
  }

  const db = req.app.locals.db;

  // Get current user with password hash
  const userResult = await db.query(
    'SELECT password_hash FROM admin_users WHERE id = $1',
    [req.user.id]
  );

  const user = userResult.rows[0];

  // Verify current password
  const isValidPassword = await verifyPassword(currentPassword, user.password_hash);

  if (!isValidPassword) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Current password is incorrect',
    });
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await db.query(
    'UPDATE admin_users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [newPasswordHash, req.user.id]
  );

  res.json({
    message: 'Password changed successfully',
    timestamp: new Date().toISOString(),
  });
}));

// GET /api/auth/users - List all admin users (admin only)
router.get('/users', authMiddleware, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'Only admins can view user list',
    });
  }

  const db = req.app.locals.db;

  const usersQuery = `
    SELECT id, username, email, role, active, last_login, created_at, updated_at
    FROM admin_users
    ORDER BY created_at DESC
  `;

  const result = await db.query(usersQuery);

  const users = result.rows.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    active: user.active,
    lastLogin: user.last_login,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }));

  res.json({
    users,
    count: users.length,
  });
}));

module.exports = router;
