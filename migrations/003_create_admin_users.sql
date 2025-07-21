-- Admin Users Table for Blog Management
-- Migration: 003_create_admin_users.sql
-- Description: Creates admin users table for blog authentication
-- Date: 2025-07-20

-- =====================================================
-- ADMIN USERS TABLE
-- =====================================================
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR ADMIN USERS
-- =====================================================

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(active);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- =====================================================
-- TRIGGERS FOR ADMIN USERS
-- =====================================================

-- Apply updated_at trigger to admin_users table
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL ADMIN USER
-- =====================================================

-- Create default admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash for 'admin123' using bcrypt with cost 12
INSERT INTO admin_users (username, email, password_hash, role) VALUES (
    'admin',
    'admin@clic.world',
    '$2b$12$LQv3c1yqBVcRR4e7ZAOHseqI/P0ShKJ6gK0k8j1J8QJ5l5J1qEeKW',
    'admin'
);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE admin_users IS 'Administrative users for blog management system';
COMMENT ON COLUMN admin_users.role IS 'User role: admin (full access), editor (create/edit), viewer (read only)';
COMMENT ON COLUMN admin_users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN admin_users.active IS 'Whether user account is active';
COMMENT ON COLUMN admin_users.last_login IS 'Timestamp of last successful login';

-- =====================================================
-- MIGRATION TRACKING
-- =====================================================

INSERT INTO schema_migrations (version, description, applied_at) 
VALUES ('003', 'Create admin users table', CURRENT_TIMESTAMP)
ON CONFLICT (version) DO NOTHING;
