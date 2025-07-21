-- Blog Management System Database Schema
-- Migration: 001_create_blog_tables.sql
-- Description: Creates all tables for the blog management system
-- Date: 2025-07-20

-- Enable UUID extension for future use
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- AUTHORS TABLE
-- =====================================================
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE,
    bio TEXT,
    avatar_url VARCHAR(500),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code for UI
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TAGS TABLE
-- =====================================================
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code for UI
    usage_count INTEGER DEFAULT 0, -- Track tag popularity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BLOG_POSTS TABLE (Main content table)
-- =====================================================
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    
    -- Relationships
    author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Publication status
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    
    -- Media and metadata
    image_url VARCHAR(500),
    image_alt TEXT, -- Accessibility
    read_time VARCHAR(20), -- e.g., "5 min read"
    
    -- SEO and social
    meta_title VARCHAR(200),
    meta_description TEXT,
    social_image_url VARCHAR(500),
    
    -- Analytics (for future use)
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- POST_TAGS TABLE (Many-to-Many relationship)
-- =====================================================
CREATE TABLE post_tags (
    post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Blog posts indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured, published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_created ON blog_posts(created_at DESC);

-- Categories indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(active);

-- Tags indexes
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage ON tags(usage_count DESC);

-- Post tags indexes
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);

-- Authors indexes
CREATE INDEX idx_authors_email ON authors(email);
CREATE INDEX idx_authors_active ON authors(active);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_authors_updated_at 
    BEFORE UPDATE ON authors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at 
    BEFORE UPDATE ON tags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER FOR TAG USAGE COUNT
-- =====================================================

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Apply trigger to post_tags table
CREATE TRIGGER update_tag_usage_count_trigger
    AFTER INSERT OR DELETE ON post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE authors IS 'Blog authors with profile information';
COMMENT ON TABLE categories IS 'Blog post categories for organization';
COMMENT ON TABLE tags IS 'Tags for flexible content labeling';
COMMENT ON TABLE blog_posts IS 'Main blog content with full metadata';
COMMENT ON TABLE post_tags IS 'Many-to-many relationship between posts and tags';

COMMENT ON COLUMN blog_posts.slug IS 'URL-friendly identifier for posts';
COMMENT ON COLUMN blog_posts.featured IS 'Whether post appears in featured sections';
COMMENT ON COLUMN blog_posts.published IS 'Publication status - false means draft';
COMMENT ON COLUMN blog_posts.read_time IS 'Estimated reading time for users';
COMMENT ON COLUMN tags.usage_count IS 'Automatically updated count of tag usage';

-- =====================================================
-- INITIAL CONSTRAINTS AND VALIDATIONS
-- =====================================================

-- Ensure published posts have a published_at timestamp
ALTER TABLE blog_posts ADD CONSTRAINT check_published_at 
    CHECK (
        (published = false) OR 
        (published = true AND published_at IS NOT NULL)
    );

-- Ensure slugs are URL-safe (basic validation)
ALTER TABLE blog_posts ADD CONSTRAINT check_slug_format 
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

ALTER TABLE categories ADD CONSTRAINT check_category_slug_format 
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

ALTER TABLE tags ADD CONSTRAINT check_tag_slug_format 
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

-- Ensure color codes are valid hex (if provided)
ALTER TABLE categories ADD CONSTRAINT check_color_hex 
    CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$');

ALTER TABLE tags ADD CONSTRAINT check_tag_color_hex 
    CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$');

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Log migration completion
INSERT INTO public.schema_migrations (version, description, applied_at) 
VALUES ('001', 'Create blog tables', CURRENT_TIMESTAMP)
ON CONFLICT (version) DO NOTHING;

-- Create schema_migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
