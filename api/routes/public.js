/**
 * Public Blog API Routes
 * Handles all public-facing blog endpoints for the website
 * No authentication required - serves published content only
 */

const express = require('express');
const router = express.Router();

// Helper function to build WHERE clause for filtering
function buildWhereClause(filters = {}) {
  const conditions = ['bp.published = true']; // Always filter to published posts
  const params = [];
  let paramIndex = 1;

  if (filters.category) {
    conditions.push(`c.slug = $${paramIndex}`);
    params.push(filters.category);
    paramIndex++;
  }

  if (filters.tag) {
    conditions.push(`EXISTS (
      SELECT 1 FROM post_tags pt 
      JOIN tags t ON pt.tag_id = t.id 
      WHERE pt.post_id = bp.id AND t.slug = $${paramIndex}
    )`);
    params.push(filters.tag);
    paramIndex++;
  }

  if (filters.author) {
    conditions.push(`a.id = $${paramIndex}`);
    params.push(filters.author);
    paramIndex++;
  }

  if (filters.featured !== undefined) {
    conditions.push(`bp.featured = $${paramIndex}`);
    params.push(filters.featured);
    paramIndex++;
  }

  if (filters.search) {
    conditions.push(`(
      bp.title ILIKE $${paramIndex} OR 
      bp.excerpt ILIKE $${paramIndex} OR 
      bp.content ILIKE $${paramIndex}
    )`);
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
}

// GET /api/posts - Get published blog posts with pagination and filtering
router.get('/posts', async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50 posts per page
    const offset = (page - 1) * limit;
    
    const filters = {
      category: req.query.category,
      tag: req.query.tag,
      author: req.query.author ? parseInt(req.query.author) : undefined,
      featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
      search: req.query.search,
    };

    const { whereClause, params } = buildWhereClause(filters);

    // Base query for posts with relationships
    const baseQuery = `
      FROM blog_posts bp
      JOIN authors a ON bp.author_id = a.id
      LEFT JOIN categories c ON bp.category_id = c.id
      ${whereClause}
    `;

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await db.query(countQuery, params);
    const totalPosts = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / limit);

    // Get posts with all related data
    const postsQuery = `
      SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.content,
        bp.featured,
        bp.published_at,
        bp.image_url,
        bp.read_time,
        bp.view_count,
        bp.like_count,
        bp.meta_title,
        bp.meta_description,
        bp.social_image_url,
        a.id as author_id,
        a.name as author_name,
        a.bio as author_bio,
        a.avatar_url as author_avatar,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color,
        -- Get tags as JSON array
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'slug', t.slug,
              'color', t.color
            ) ORDER BY t.name
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as tags
      ${baseQuery}
      LEFT JOIN post_tags pt ON bp.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY bp.id, a.id, c.id
      ORDER BY bp.published_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const postsResult = await db.query(postsQuery, [...params, limit, offset]);

    // Format response
    const posts = postsResult.rows.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured: post.featured,
      publishedAt: post.published_at,
      imageUrl: post.image_url,
      readTime: post.read_time,
      viewCount: post.view_count,
      likeCount: post.like_count,
      seo: {
        metaTitle: post.meta_title,
        metaDescription: post.meta_description,
        socialImageUrl: post.social_image_url,
      },
      author: {
        id: post.author_id,
        name: post.author_name,
        bio: post.author_bio,
        avatarUrl: post.author_avatar,
      },
      category: post.category_id ? {
        id: post.category_id,
        name: post.category_name,
        slug: post.category_slug,
        color: post.category_color,
      } : null,
      tags: post.tags,
    }));

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: filters,
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      error: 'Failed to fetch blog posts',
      message: error.message,
    });
  }
});

// GET /api/posts/featured - Get featured posts
router.get('/posts/featured', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const limit = Math.min(parseInt(req.query.limit) || 6, 20);

    const query = `
      SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.published_at,
        bp.image_url,
        bp.read_time,
        a.name as author_name,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color
      FROM blog_posts bp
      JOIN authors a ON bp.author_id = a.id
      LEFT JOIN categories c ON bp.category_id = c.id
      WHERE bp.published = true AND bp.featured = true
      ORDER BY bp.published_at DESC
      LIMIT $1
    `;

    const result = await db.query(query, [limit]);

    const posts = result.rows.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.published_at,
      imageUrl: post.image_url,
      readTime: post.read_time,
      author: {
        name: post.author_name,
      },
      category: post.category_name ? {
        name: post.category_name,
        slug: post.category_slug,
        color: post.category_color,
      } : null,
    }));

    res.json({ posts });

  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({
      error: 'Failed to fetch featured posts',
      message: error.message,
    });
  }
});

// GET /api/posts/:slug - Get single blog post by slug
router.get('/posts/:slug', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { slug } = req.params;

    const query = `
      SELECT 
        bp.*,
        a.name as author_name,
        a.bio as author_bio,
        a.avatar_url as author_avatar,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color,
        c.description as category_description,
        -- Get tags as JSON array
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'slug', t.slug,
              'color', t.color
            ) ORDER BY t.name
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as tags
      FROM blog_posts bp
      JOIN authors a ON bp.author_id = a.id
      LEFT JOIN categories c ON bp.category_id = c.id
      LEFT JOIN post_tags pt ON bp.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE bp.slug = $1 AND bp.published = true
      GROUP BY bp.id, a.id, c.id
    `;

    const result = await db.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Post not found',
        slug: slug,
      });
    }

    const post = result.rows[0];

    // Increment view count (fire and forget)
    db.query('UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1', [post.id])
      .catch(err => console.error('Error updating view count:', err));

    // Format response
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured: post.featured,
      publishedAt: post.published_at,
      imageUrl: post.image_url,
      readTime: post.read_time,
      viewCount: post.view_count + 1, // Return incremented count
      likeCount: post.like_count,
      seo: {
        metaTitle: post.meta_title || post.title,
        metaDescription: post.meta_description || post.excerpt,
        socialImageUrl: post.social_image_url || post.image_url,
      },
      author: {
        id: post.author_id,
        name: post.author_name,
        bio: post.author_bio,
        avatarUrl: post.author_avatar,
      },
      category: post.category_name ? {
        id: post.category_id,
        name: post.category_name,
        slug: post.category_slug,
        color: post.category_color,
        description: post.category_description,
      } : null,
      tags: post.tags,
      timestamps: {
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        publishedAt: post.published_at,
      },
    };

    res.json({ post: formattedPost });

  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      error: 'Failed to fetch blog post',
      message: error.message,
    });
  }
});

// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const db = req.app.locals.db;

    const query = `
      SELECT 
        c.*,
        COUNT(bp.id) as post_count
      FROM categories c
      LEFT JOIN blog_posts bp ON c.id = bp.category_id AND bp.published = true
      WHERE c.active = true
      GROUP BY c.id
      ORDER BY c.name
    `;

    const result = await db.query(query);

    const categories = result.rows.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      color: cat.color,
      postCount: parseInt(cat.post_count),
    }));

    res.json({ categories });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message,
    });
  }
});

// GET /api/tags - Get all tags
router.get('/tags', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const limit = parseInt(req.query.limit) || 50;

    const query = `
      SELECT 
        t.*,
        COUNT(pt.post_id) as post_count
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      LEFT JOIN blog_posts bp ON pt.post_id = bp.id AND bp.published = true
      GROUP BY t.id
      HAVING COUNT(pt.post_id) > 0
      ORDER BY COUNT(pt.post_id) DESC, t.name
      LIMIT $1
    `;

    const result = await db.query(query, [limit]);

    const tags = result.rows.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      color: tag.color,
      postCount: parseInt(tag.post_count),
    }));

    res.json({ tags });

  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      error: 'Failed to fetch tags',
      message: error.message,
    });
  }
});

// GET /api/search - Search blog posts
router.get('/search', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const query = req.query.q;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters long',
      });
    }

    const searchQuery = `
      SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.published_at,
        bp.image_url,
        bp.read_time,
        a.name as author_name,
        c.name as category_name,
        c.slug as category_slug,
        -- Simple relevance scoring
        (
          CASE WHEN bp.title ILIKE $1 THEN 100 ELSE 0 END +
          CASE WHEN bp.excerpt ILIKE $1 THEN 50 ELSE 0 END +
          CASE WHEN bp.content ILIKE $1 THEN 10 ELSE 0 END
        ) as relevance_score
      FROM blog_posts bp
      JOIN authors a ON bp.author_id = a.id
      LEFT JOIN categories c ON bp.category_id = c.id
      WHERE bp.published = true AND (
        bp.title ILIKE $1 OR 
        bp.excerpt ILIKE $1 OR 
        bp.content ILIKE $1
      )
      ORDER BY relevance_score DESC, bp.published_at DESC
      LIMIT $2
    `;

    const result = await db.query(searchQuery, [`%${query}%`, limit]);

    const posts = result.rows.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.published_at,
      imageUrl: post.image_url,
      readTime: post.read_time,
      relevanceScore: post.relevance_score,
      author: {
        name: post.author_name,
      },
      category: post.category_name ? {
        name: post.category_name,
        slug: post.category_slug,
      } : null,
    }));

    res.json({
      query: query,
      results: posts,
      count: posts.length,
    });

  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message,
    });
  }
});

module.exports = router;
