#!/usr/bin/env node

/**
 * Blog Data Migration Script
 * Migrates existing blog posts from blogPosts.js to PostgreSQL database
 * Usage: node migrate-blog-data.js [--dry-run] [--force]
 */

const { Pool } = require('pg');
const path = require('path');

// Import the existing blog posts data
const { blogPosts } = require('./src/data/blogPosts.js');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'clic_blog',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
};

const pool = new Pool(dbConfig);

// Author mapping - map existing author strings to database author IDs
const authorMapping = {
  'Andre van Zyl': 1,
  'Andre van Zyl & ClicBrain AI': 1, // Map to Andre for now, can be updated later
  'Clic.World Technical Team': 4,
  'Clic.World Team': 3,
  'Clic Community': 5,
  'Andre & ClicBrain': 6,
  'ClicBrain AI & Community': 2
};

// Category mapping - map category names to database category IDs
const categoryMapping = {
  'Movement': 1,
  'AI & Blockchain': 2,
  'Global Impact': 3,
  'Platform Overview': 4,
  'Virtual Assets': 5,
  'ClicBrain': 6
};

async function getAuthorId(client, authorName) {
  // Try direct mapping first
  if (authorMapping[authorName]) {
    return authorMapping[authorName];
  }
  
  // Try to find by name in database
  const result = await client.query('SELECT id FROM authors WHERE name = $1', [authorName]);
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  // Default to Andre van Zyl if not found
  console.log(`⚠️  Author "${authorName}" not found, using Andre van Zyl as default`);
  return 1;
}

async function getCategoryId(client, categoryName) {
  if (categoryMapping[categoryName]) {
    return categoryMapping[categoryName];
  }
  
  // Try to find by name in database
  const result = await client.query('SELECT id FROM categories WHERE name = $1', [categoryName]);
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  // Default to Movement if not found
  console.log(`⚠️  Category "${categoryName}" not found, using Movement as default`);
  return 1;
}

async function getOrCreateTag(client, tagName) {
  // Create slug from tag name
  const slug = tagName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
  
  // Check if tag exists
  let result = await client.query('SELECT id FROM tags WHERE name = $1 OR slug = $2', [tagName, slug]);
  
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  // Create new tag
  result = await client.query(
    'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id',
    [tagName, slug]
  );
  
  console.log(`📝 Created new tag: "${tagName}" (${slug})`);
  return result.rows[0].id;
}

function extractImageUrl(content, currentImage) {
  // If there's already an image set, use it
  if (currentImage && !currentImage.includes('${process.env.PUBLIC_URL}')) {
    return currentImage;
  }
  
  // Extract from process.env.PUBLIC_URL format
  if (currentImage && currentImage.includes('${process.env.PUBLIC_URL}')) {
    return currentImage.replace('${process.env.PUBLIC_URL}/', './');
  }
  
  // Try to extract from content
  const imageMatch = content.match(/!\[.*?\]\((\.\/[^)]+)\)/);
  if (imageMatch) {
    return imageMatch[1];
  }
  
  // Default fallback
  return './community-group.jpg';
}

function createSlugFromTitle(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function migrateBlogPost(client, post, dryRun = false) {
  console.log(`\n🔄 Processing post: "${post.title}"`);
  
  try {
    // Get author and category IDs
    const authorId = await getAuthorId(client, post.author);
    const categoryId = await getCategoryId(client, post.category);
    
    // Extract and clean data
    const slug = post.slug || createSlugFromTitle(post.title);
    const imageUrl = extractImageUrl(post.content, post.image);
    const publishedAt = new Date(post.date);
    
    // Prepare blog post data
    const postData = {
      id: post.id,
      title: post.title,
      slug: slug,
      excerpt: post.excerpt || '',
      content: post.content,
      author_id: authorId,
      category_id: categoryId,
      featured: post.featured || false,
      published: true, // All existing posts are published
      published_at: publishedAt,
      image_url: imageUrl,
      read_time: post.readTime || '5 min read',
      created_at: publishedAt,
      updated_at: publishedAt
    };
    
    if (dryRun) {
      console.log('📋 Would insert post:', {
        id: postData.id,
        title: postData.title,
        slug: postData.slug,
        author_id: postData.author_id,
        category_id: postData.category_id,
        featured: postData.featured,
        tags: post.tags || []
      });
      return;
    }
    
    // Insert blog post
    const insertPostQuery = `
      INSERT INTO blog_posts (
        id, title, slug, excerpt, content, author_id, category_id,
        featured, published, published_at, image_url, read_time,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        author_id = EXCLUDED.author_id,
        category_id = EXCLUDED.category_id,
        featured = EXCLUDED.featured,
        image_url = EXCLUDED.image_url,
        read_time = EXCLUDED.read_time,
        updated_at = EXCLUDED.updated_at
      RETURNING id;
    `;
    
    const postResult = await client.query(insertPostQuery, [
      postData.id, postData.title, postData.slug, postData.excerpt,
      postData.content, postData.author_id, postData.category_id,
      postData.featured, postData.published, postData.published_at,
      postData.image_url, postData.read_time, postData.created_at,
      postData.updated_at
    ]);
    
    const insertedPostId = postResult.rows[0].id;
    
    // Handle tags
    if (post.tags && post.tags.length > 0) {
      // Clear existing tags for this post
      await client.query('DELETE FROM post_tags WHERE post_id = $1', [insertedPostId]);
      
      // Add new tags
      for (const tagName of post.tags) {
        const tagId = await getOrCreateTag(client, tagName);
        
        await client.query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [insertedPostId, tagId]
        );
      }
      
      console.log(`🏷️  Added ${post.tags.length} tags to post`);
    }
    
    console.log(`✅ Successfully migrated post ID ${post.id}: "${post.title}"`);
    
  } catch (error) {
    console.error(`❌ Error migrating post "${post.title}":`, error.message);
    throw error;
  }
}

async function migrateBlogData(options = {}) {
  const { dryRun = false, force = false } = options;
  
  console.log('🚀 Blog Data Migration Starting...');
  console.log(`📊 Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
  console.log(`📝 Found ${blogPosts.length} blog posts to migrate`);
  
  const client = await pool.connect();
  
  try {
    // Check if data already exists
    const existingPosts = await client.query('SELECT COUNT(*) FROM blog_posts');
    const postCount = parseInt(existingPosts.rows[0].count);
    
    if (postCount > 0 && !force) {
      console.log(`⚠️  Database already contains ${postCount} blog posts`);
      console.log('Use --force to overwrite existing data');
      return;
    }
    
    if (dryRun) {
      console.log('\n📋 DRY RUN MODE - No data will be inserted');
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    let migratedCount = 0;
    
    // Migrate each blog post
    for (const post of blogPosts) {
      await migrateBlogPost(client, post, dryRun);
      migratedCount++;
    }
    
    if (!dryRun) {
      await client.query('COMMIT');
      console.log(`\n✅ Successfully migrated ${migratedCount} blog posts to database`);
      
      // Show summary statistics
      const stats = await client.query(`
        SELECT 
          COUNT(*) as total_posts,
          COUNT(*) FILTER (WHERE featured = true) as featured_posts,
          COUNT(DISTINCT category_id) as categories_used,
          COUNT(DISTINCT author_id) as authors_used
        FROM blog_posts
      `);
      
      const tagStats = await client.query(`
        SELECT COUNT(DISTINCT tag_id) as unique_tags
        FROM post_tags
      `);
      
      console.log('\n📊 Migration Summary:');
      console.log(`   Total posts: ${stats.rows[0].total_posts}`);
      console.log(`   Featured posts: ${stats.rows[0].featured_posts}`);
      console.log(`   Categories used: ${stats.rows[0].categories_used}`);
      console.log(`   Authors used: ${stats.rows[0].authors_used}`);
      console.log(`   Unique tags: ${tagStats.rows[0].unique_tags}`);
      
    } else {
      await client.query('ROLLBACK');
      console.log(`\n📋 Dry run complete - ${migratedCount} posts would be migrated`);
    }
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:', error.message);
    throw error;
    
  } finally {
    client.release();
    await pool.end();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  force: args.includes('--force')
};

// Show help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Blog Data Migration Script

Usage:
  node migrate-blog-data.js [options]

Options:
  --dry-run    Preview migration without inserting data
  --force      Overwrite existing blog posts in database
  --help, -h   Show this help message

Environment Variables:
  DB_USER      Database username (default: postgres)
  DB_HOST      Database host (default: localhost)
  DB_NAME      Database name (default: clic_blog)
  DB_PASSWORD  Database password (default: your_password)
  DB_PORT      Database port (default: 5432)

Examples:
  node migrate-blog-data.js                    # Migrate blog posts to database
  node migrate-blog-data.js --dry-run          # Preview migration without executing
  node migrate-blog-data.js --force            # Overwrite existing posts
  `);
  process.exit(0);
}

// Run migration
migrateBlogData(options)
  .then(() => {
    console.log('\n🎉 Blog data migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  });
