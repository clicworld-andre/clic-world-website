/**
 * Admin Blog Routes - Complete Implementation
 * Handles all administrative blog operations for ClicMe app
 * Requires authentication - includes draft management, creation, editing
 */

const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Helper function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET /api/admin/posts - Get all posts including drafts
router.get('/posts', asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;
  
  const filters = {
    status: req.query.status,
    category: req.query.category,
    author: req.query.author ? parseInt(req.query.author) : undefined,
    featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
    search: req.query.search,
  };

  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (filters.status === 'published') {
    conditions.push(`bp.published = true`);
  } else if (filters.status === 'draft') {
    conditions.push(`bp.published = false`);
  }

  if (filters.category) {
    conditions.push(`c.slug = $${paramIndex}`);
    params.push(filters.category);
    paramIndex++;
  }

  if (filters.author) {
    conditions.push(`bp.author_id = $${paramIndex}`);
    params.push(filters.author);
    paramIndex++;
  }

  if (filters.featured !== undefined) {
    conditions.push(`bp.featured = $${paramIndex}`);
    params.push(filters.featured);
    paramIndex++;
  }

  if (filters.search) {
    conditions.push(`(bp.title ILIKE $${paramIndex} OR bp.excerpt ILIKE $${paramIndex} OR bp.content ILIKE $${paramIndex})`);
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) FROM blog_posts bp LEFT JOIN categories c ON bp.category_id = c.id ${whereClause}`;
  const countResult = await db.query(countQuery, params);
  const totalPosts = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalPosts / limit);

  const postsQuery = `
    SELECT 
      bp.*,
      a.name as author_name,
      a.email as author_email,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', t.id,
            'name', t.name,
            'slug', t.slug
          ) ORDER BY t.name
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) as tags
    FROM blog_posts bp
    JOIN authors a ON bp.author_id = a.id
    LEFT JOIN categories c ON bp.category_id = c.id
    LEFT JOIN post_tags pt ON bp.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    ${whereClause}
    GROUP BY bp.id, a.id, c.id
    ORDER BY bp.created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const postsResult = await db.query(postsQuery, [...params, limit, offset]);

  const posts = postsResult.rows.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    published: post.published,
    featured: post.featured,
    publishedAt: post.published_at,
    imageUrl: post.image_url,
    imageAlt: post.image_alt,
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
      email: post.author_email,
    },
    category: post.category_name ? {
      id: post.category_id,
      name: post.category_name,
      slug: post.category_slug,
    } : null,
    tags: post.tags,
    timestamps: {
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      publishedAt: post.published_at,
    },
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
    filters,
  });
}));

// GET /api/admin/posts/:id - Get single post by ID (including drafts)
router.get('/posts/:id', asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const postId = parseInt(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({
      error: 'Invalid post ID',
      message: 'Post ID must be a number',
    });
  }

  const query = `
    SELECT 
      bp.*,
      a.name as author_name,
      a.email as author_email,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', t.id,
            'name', t.name,
            'slug', t.slug
          ) ORDER BY t.name
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) as tags
    FROM blog_posts bp
    JOIN authors a ON bp.author_id = a.id
    LEFT JOIN categories c ON bp.category_id = c.id
    LEFT JOIN post_tags pt ON bp.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE bp.id = $1
    GROUP BY bp.id, a.id, c.id
  `;

  const result = await db.query(query, [postId]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: 'Post not found',
      id: postId,
    });
  }

  const post = result.rows[0];

  res.json({
    post: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      published: post.published,
      featured: post.featured,
      publishedAt: post.published_at,
      imageUrl: post.image_url,
      imageAlt: post.image_alt,
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
        email: post.author_email,
      },
      category: post.category_name ? {
        id: post.category_id,
        name: post.category_name,
        slug: post.category_slug,
      } : null,
      tags: post.tags,
      timestamps: {
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        publishedAt: post.published_at,
      },
    },
  });
}));

// POST /api/admin/posts - Create new blog post
router.post('/posts', requireRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  
  const {
    title,
    slug,
    excerpt,
    content,
    categoryId,
    featured = false,
    published = false,
    imageUrl,
    imageAlt,
    readTime,
    seo = {},
    tags = [],
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Title and content are required',
    });
  }

  const finalSlug = slug || createSlug(title);

  const slugCheck = await db.query('SELECT id FROM blog_posts WHERE slug = $1', [finalSlug]);
  if (slugCheck.rows.length > 0) {
    return res.status(409).json({
      error: 'Slug already exists',
      message: 'Please choose a different slug or title',
      slug: finalSlug,
    });
  }

  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    const insertPostQuery = `
      INSERT INTO blog_posts (
        title, slug, excerpt, content, author_id, category_id,
        featured, published, published_at, image_url, image_alt,
        read_time, meta_title, meta_description, social_image_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ) RETURNING *
    `;

    const publishedAt = published ? new Date() : null;
    
    const postResult = await client.query(insertPostQuery, [
      title,
      finalSlug,
      excerpt || '',
      content,
      req.user.id,
      categoryId || null,
      featured,
      published,
      publishedAt,
      imageUrl || null,
      imageAlt || null,
      readTime || null,
      seo.metaTitle || null,
      seo.metaDescription || null,
      seo.socialImageUrl || null,
    ]);

    const newPost = postResult.rows[0];

    if (tags.length > 0) {
      for (const tagName of tags) {
        let tagResult = await client.query('SELECT id FROM tags WHERE name = $1', [tagName]);
        
        let tagId;
        if (tagResult.rows.length === 0) {
          const newTagResult = await client.query(
            'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id',
            [tagName, createSlug(tagName)]
          );
          tagId = newTagResult.rows[0].id;
        } else {
          tagId = tagResult.rows[0].id;
        }

        await client.query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
          [newPost.id, tagId]
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
        published: newPost.published,
        featured: newPost.featured,
        createdAt: newPost.created_at,
      },
    });

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

// PUT /api/admin/posts/:id - Update blog post
router.put('/posts/:id', requireRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const postId = parseInt(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({
      error: 'Invalid post ID',
      message: 'Post ID must be a number',
    });
  }

  const existingPost = await db.query('SELECT id, author_id, published, slug FROM blog_posts WHERE id = $1', [postId]);
  
  if (existingPost.rows.length === 0) {
    return res.status(404).json({
      error: 'Post not found',
      id: postId,
    });
  }

  const post = existingPost.rows[0];

  if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'You can only edit your own posts',
    });
  }

  const {
    title,
    slug,
    excerpt,
    content,
    categoryId,
    featured,
    published,
    imageUrl,
    imageAlt,
    readTime,
    seo = {},
    tags = [],
  } = req.body;

  const finalSlug = slug || (title ? createSlug(title) : post.slug);
  if (finalSlug !== post.slug) {
    const slugCheck = await db.query('SELECT id FROM blog_posts WHERE slug = $1 AND id != $2', [finalSlug, postId]);
    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        error: 'Slug already exists',
        message: 'Please choose a different slug or title',
        slug: finalSlug,
      });
    }
  }

  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      params.push(title);
      paramIndex++;
    }

    if (finalSlug !== post.slug) {
      updates.push(`slug = $${paramIndex}`);
      params.push(finalSlug);
      paramIndex++;
    }

    if (excerpt !== undefined) {
      updates.push(`excerpt = $${paramIndex}`);
      params.push(excerpt);
      paramIndex++;
    }

    if (content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      params.push(content);
      paramIndex++;
    }

    if (categoryId !== undefined) {
      updates.push(`category_id = $${paramIndex}`);
      params.push(categoryId);
      paramIndex++;
    }

    if (featured !== undefined) {
      updates.push(`featured = $${paramIndex}`);
      params.push(featured);
      paramIndex++;
    }

    if (published !== undefined) {
      updates.push(`published = $${paramIndex}`);
      params.push(published);
      paramIndex++;

      if (published && !post.published) {
        updates.push(`published_at = CURRENT_TIMESTAMP`);
      } else if (!published) {
        updates.push(`published_at = NULL`);
      }
    }

    if (imageUrl !== undefined) {
      updates.push(`image_url = $${paramIndex}`);
      params.push(imageUrl);
      paramIndex++;
    }

    if (imageAlt !== undefined) {
      updates.push(`image_alt = $${paramIndex}`);
      params.push(imageAlt);
      paramIndex++;
    }

    if (readTime !== undefined) {
      updates.push(`read_time = $${paramIndex}`);
      params.push(readTime);
      paramIndex++;
    }

    if (seo.metaTitle !== undefined) {
      updates.push(`meta_title = $${paramIndex}`);
      params.push(seo.metaTitle);
      paramIndex++;
    }

    if (seo.metaDescription !== undefined) {
      updates.push(`meta_description = $${paramIndex}`);
      params.push(seo.metaDescription);
      paramIndex++;
    }

    if (seo.socialImageUrl !== undefined) {
      updates.push(`social_image_url = $${paramIndex}`);
      params.push(seo.socialImageUrl);
      paramIndex++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length > 1) {
      const updateQuery = `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
      params.push(postId);
      await client.query(updateQuery, params);
    }

    if (tags !== undefined) {
      await client.query('DELETE FROM post_tags WHERE post_id = $1', [postId]);

      for (const tagName of tags) {
        if (!tagName) continue;

        let tagResult = await client.query('SELECT id FROM tags WHERE name = $1', [tagName]);
        
        let tagId;
        if (tagResult.rows.length === 0) {
          const newTagResult = await client.query(
            'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id',
            [tagName, createSlug(tagName)]
          );
          tagId = newTagResult.rows[0].id;
        } else {
          tagId = tagResult.rows[0].id;
        }

        await client.query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [postId, tagId]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      message: 'Post updated successfully',
      postId: postId,
    });

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

// DELETE /api/admin/posts/:id - Delete blog post
router.delete('/posts/:id', requireRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const postId = parseInt(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({
      error: 'Invalid post ID',
      message: 'Post ID must be a number',
    });
  }

  const existingPost = await db.query('SELECT id, author_id, title, published FROM blog_posts WHERE id = $1', [postId]);
  
  if (existingPost.rows.length === 0) {
    return res.status(404).json({
      error: 'Post not found',
      id: postId,
    });
  }

  const post = existingPost.rows[0];

  if (req.user.role !== 'admin' && post.author_id !== req.user.id) {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'You can only delete your own posts',
    });
  }

  await db.query('DELETE FROM blog_posts WHERE id = $1', [postId]);

  res.json({
    message: 'Post deleted successfully',
    deletedPost: {
      id: postId,
      title: post.title,
      wasPublished: post.published,
    },
  });
}));

// GET /api/admin/stats - Blog statistics and analytics
router.get('/stats', requireRole(['admin', 'editor', 'viewer']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;

  const [postStats, categoryStats, authorStats, popularPosts, recentActivity, tagStats] = await Promise.all([
    db.query(`
      SELECT 
        COUNT(*) as total_posts,
        COUNT(*) FILTER (WHERE published = true) as published_posts,
        COUNT(*) FILTER (WHERE published = false) as draft_posts,
        COUNT(*) FILTER (WHERE featured = true AND published = true) as featured_posts,
        AVG(view_count) as avg_views,
        MAX(view_count) as max_views,
        SUM(view_count) as total_views
      FROM blog_posts
    `),

    db.query(`
      SELECT 
        c.name as category_name,
        c.slug as category_slug,
        COUNT(bp.id) as post_count,
        COUNT(bp.id) FILTER (WHERE bp.published = true) as published_count
      FROM categories c
      LEFT JOIN blog_posts bp ON c.id = bp.category_id
      GROUP BY c.id, c.name, c.slug
      ORDER BY post_count DESC
    `),

    db.query(`
      SELECT 
        a.name as author_name,
        a.email as author_email,
        COUNT(bp.id) as post_count,
        COUNT(bp.id) FILTER (WHERE bp.published = true) as published_count,
        AVG(bp.view_count) as avg_views
      FROM authors a
      LEFT JOIN blog_posts bp ON a.id = bp.author_id
      GROUP BY a.id, a.name, a.email
      ORDER BY post_count DESC
    `),

    db.query(`
      SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.view_count,
        bp.like_count,
        bp.published_at,
        a.name as author_name,
        c.name as category_name
      FROM blog_posts bp
      JOIN authors a ON bp.author_id = a.id
      LEFT JOIN categories c ON bp.category_id = c.id
      WHERE bp.published = true
      ORDER BY bp.view_count DESC
      LIMIT 10
    `),

    db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as posts_created,
        COUNT(*) FILTER (WHERE published = true) as posts_published
      FROM blog_posts
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `),

    db.query(`
      SELECT 
        t.name,
        t.slug,
        COUNT(pt.post_id) as usage_count,
        COUNT(pt.post_id) FILTER (WHERE bp.published = true) as published_usage
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      LEFT JOIN blog_posts bp ON pt.post_id = bp.id
      GROUP BY t.id, t.name, t.slug
      HAVING COUNT(pt.post_id) > 0
      ORDER BY usage_count DESC
      LIMIT 20
    `)
  ]);

  const stats = {
    overview: {
      totalPosts: parseInt(postStats.rows[0].total_posts),
      publishedPosts: parseInt(postStats.rows[0].published_posts),
      draftPosts: parseInt(postStats.rows[0].draft_posts),
      featuredPosts: parseInt(postStats.rows[0].featured_posts),
      totalViews: parseInt(postStats.rows[0].total_views) || 0,
      averageViews: parseFloat(postStats.rows[0].avg_views) || 0,
      maxViews: parseInt(postStats.rows[0].max_views) || 0,
    },
    categories: categoryStats.rows.map(cat => ({
      name: cat.category_name,
      slug: cat.category_slug,
      totalPosts: parseInt(cat.post_count),
      publishedPosts: parseInt(cat.published_count),
    })),
    authors: authorStats.rows.map(author => ({
      name: author.author_name,
      email: author.author_email,
      totalPosts: parseInt(author.post_count),
      publishedPosts: parseInt(author.published_count),
      averageViews: parseFloat(author.avg_views) || 0,
    })),
    popularPosts: popularPosts.rows.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      viewCount: post.view_count,
      likeCount: post.like_count,
      publishedAt: post.published_at,
      author: post.author_name,
      category: post.category_name,
    })),
    recentActivity: recentActivity.rows.map(activity => ({
      date: activity.date,
      postsCreated: parseInt(activity.posts_created),
      postsPublished: parseInt(activity.posts_published),
    })),
    topTags: tagStats.rows.map(tag => ({
      name: tag.name,
      slug: tag.slug,
      totalUsage: parseInt(tag.usage_count),
      publishedUsage: parseInt(tag.published_usage),
    })),
    generatedAt: new Date().toISOString(),
  };

  res.json(stats);
}));

// GET /api/admin/categories - Get all categories for management
router.get('/categories', requireRole(['admin', 'editor', 'viewer']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;

  const query = `
    SELECT 
      c.*,
      COUNT(bp.id) as post_count,
      COUNT(bp.id) FILTER (WHERE bp.published = true) as published_count
    FROM categories c
    LEFT JOIN blog_posts bp ON c.id = bp.category_id
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
    active: cat.active,
    postCount: parseInt(cat.post_count),
    publishedCount: parseInt(cat.published_count),
    createdAt: cat.created_at,
    updatedAt: cat.updated_at,
  }));

  res.json({ categories });
}));

// POST /api/admin/categories - Create new category
router.post('/categories', requireRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { name, description, color } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Category name is required',
    });
  }

  const slug = createSlug(name);

  // Check if category already exists
  const existingCategory = await db.query(
    'SELECT id FROM categories WHERE name = $1 OR slug = $2',
    [name, slug]
  );

  if (existingCategory.rows.length > 0) {
    return res.status(409).json({
      error: 'Category already exists',
      message: 'A category with this name already exists',
    });
  }

  const insertQuery = `
    INSERT INTO categories (name, slug, description, color)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const result = await db.query(insertQuery, [name, slug, description || null, color || null]);
  const newCategory = result.rows[0];

  res.status(201).json({
    message: 'Category created successfully',
    category: {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description,
      color: newCategory.color,
      active: newCategory.active,
      createdAt: newCategory.created_at,
    },
  });
}));

// PUT /api/admin/categories/:id - Update category
router.put('/categories/:id', requireRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const categoryId = parseInt(req.params.id);
  const { name, description, color, active } = req.body;

  if (isNaN(categoryId)) {
    return res.status(400).json({
      error: 'Invalid category ID',
      message: 'Category ID must be a number',
    });
  }

  // Check if category exists
  const existingCategory = await db.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
  
  if (existingCategory.rows.length === 0) {
    return res.status(404).json({
      error: 'Category not found',
      id: categoryId,
    });
  }

  const updates = [];
  const params = [];
  let paramIndex = 1;

  if (name !== undefined) {
    const slug = createSlug(name);
    
    // Check for name/slug conflicts
    const conflictCheck = await db.query(
      'SELECT id FROM categories WHERE (name = $1 OR slug = $2) AND id != $3',
      [name, slug, categoryId]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(409).json({
        error: 'Category name conflict',
        message: 'A category with this name already exists',
      });
    }

    updates.push(`name = ${paramIndex}`, `slug = ${paramIndex + 1}`);
    params.push(name, slug);
    paramIndex += 2;
  }

  if (description !== undefined) {
    updates.push(`description = ${paramIndex}`);
    params.push(description);
    paramIndex++;
  }

  if (color !== undefined) {
    updates.push(`color = ${paramIndex}`);
    params.push(color);
    paramIndex++;
  }

  if (active !== undefined) {
    updates.push(`active = ${paramIndex}`);
    params.push(active);
    paramIndex++;
  }

  if (updates.length === 0) {
    return res.status(400).json({
      error: 'No updates provided',
      message: 'At least one field must be provided for update',
    });
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);

  const updateQuery = `
    UPDATE categories 
    SET ${updates.join(', ')}
    WHERE id = ${paramIndex}
    RETURNING *
  `;

  params.push(categoryId);
  const result = await db.query(updateQuery, params);
  const updatedCategory = result.rows[0];

  res.json({
    message: 'Category updated successfully',
    category: {
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      description: updatedCategory.description,
      color: updatedCategory.color,
      active: updatedCategory.active,
      updatedAt: updatedCategory.updated_at,
    },
  });
}));

// GET /api/admin/tags - Get all tags for management
router.get('/tags', requireRole(['admin', 'editor', 'viewer']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const limit = parseInt(req.query.limit) || 100;

  const query = `
    SELECT 
      t.*,
      COUNT(pt.post_id) as usage_count,
      COUNT(pt.post_id) FILTER (WHERE bp.published = true) as published_usage
    FROM tags t
    LEFT JOIN post_tags pt ON t.id = pt.tag_id
    LEFT JOIN blog_posts bp ON pt.post_id = bp.id
    GROUP BY t.id
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
    usageCount: parseInt(tag.usage_count),
    publishedUsage: parseInt(tag.published_usage),
    createdAt: tag.created_at,
    updatedAt: tag.updated_at,
  }));

  res.json({ tags });
}));

// POST /api/admin/validate-slug - Validate slug uniqueness
router.post('/validate-slug', requireRole(['admin', 'editor']), asyncHandler(async (req, res) => {
  const db = req.app.locals.db;
  const { slug, excludeId } = req.body;

  if (!slug) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Slug is required',
    });
  }

  let query = 'SELECT id FROM blog_posts WHERE slug = $1';
  const params = [slug];

  if (excludeId) {
    query += ' AND id != $2';
    params.push(excludeId);
  }

  const result = await db.query(query, params);

  res.json({
    slug: slug,
    available: result.rows.length === 0,
    conflictId: result.rows.length > 0 ? result.rows[0].id : null,
  });
}));

module.exports = router;
