#!/usr/bin/env node

/**
 * Blog Migration Runner
 * Simple script to run database migrations for the blog system
 * Usage: node run-migrations.js [--dry-run] [--reset]
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration - update these settings for your environment
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'clic_blog',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
};

const pool = new Pool(dbConfig);

// Migration files in order
const migrations = [
  '001_create_blog_tables.sql',
  '002_seed_initial_data.sql',
  '003_create_admin_users.sql'
];

async function createMigrationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(20) PRIMARY KEY,
      description TEXT,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(query);
    console.log('✅ Schema migrations table ready');
  } catch (error) {
    console.error('❌ Error creating migrations table:', error.message);
    throw error;
  }
}

async function getAppliedMigrations() {
  try {
    const result = await pool.query('SELECT version FROM schema_migrations ORDER BY version');
    return result.rows.map(row => row.version);
  } catch (error) {
    // Table might not exist yet
    return [];
  }
}

async function runMigration(filename, dryRun = false) {
  const migrationPath = path.join(__dirname, 'migrations', filename);
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${filename}`);
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const version = filename.split('_')[0];
  
  console.log(`\n🔄 Running migration: ${filename}`);
  
  if (dryRun) {
    console.log('📋 DRY RUN - SQL to be executed:');
    console.log('─'.repeat(50));
    console.log(sql.substring(0, 500) + '...');
    console.log('─'.repeat(50));
    return;
  }
  
  try {
    // Run the migration in a transaction
    await pool.query('BEGIN');
    await pool.query(sql);
    await pool.query('COMMIT');
    
    console.log(`✅ Migration ${filename} completed successfully`);
    
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(`❌ Migration ${filename} failed:`, error.message);
    throw error;
  }
}

async function resetDatabase() {
  console.log('🔄 Resetting database...');
  
  const resetSQL = `
    -- Drop all blog-related tables
    DROP TABLE IF EXISTS post_tags CASCADE;
    DROP TABLE IF EXISTS blog_posts CASCADE;
    DROP TABLE IF EXISTS tags CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
    DROP TABLE IF EXISTS authors CASCADE;
    DROP TABLE IF EXISTS schema_migrations CASCADE;
    
    -- Drop functions
    DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    DROP FUNCTION IF EXISTS update_tag_usage_count() CASCADE;
  `;
  
  try {
    await pool.query(resetSQL);
    console.log('✅ Database reset completed');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    throw error;
  }
}

async function runMigrations(options = {}) {
  const { dryRun = false, reset = false } = options;
  
  console.log('🚀 Blog Migration Runner Starting...');
  console.log(`📊 Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
  
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Reset if requested
    if (reset) {
      await resetDatabase();
    }
    
    // Create migrations table
    await createMigrationsTable();
    
    // Get already applied migrations
    const appliedMigrations = await getAppliedMigrations();
    console.log(`📋 Applied migrations: ${appliedMigrations.length > 0 ? appliedMigrations.join(', ') : 'none'}`);
    
    // Run pending migrations
    let migrationsRun = 0;
    
    for (const migration of migrations) {
      const version = migration.split('_')[0];
      
      if (appliedMigrations.includes(version)) {
        console.log(`⏭️  Skipping ${migration} (already applied)`);
        continue;
      }
      
      await runMigration(migration, dryRun);
      migrationsRun++;
    }
    
    if (migrationsRun === 0) {
      console.log('\n✅ All migrations are up to date!');
    } else if (!dryRun) {
      console.log(`\n✅ Successfully applied ${migrationsRun} migration(s)`);
    } else {
      console.log(`\n📋 Dry run complete - ${migrationsRun} migration(s) would be applied`);
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
    
  } finally {
    await pool.end();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  reset: args.includes('--reset')
};

// Show help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Blog Migration Runner

Usage:
  node run-migrations.js [options]

Options:
  --dry-run    Show what would be executed without running migrations
  --reset      Reset database by dropping all tables (destructive!)
  --help, -h   Show this help message

Environment Variables:
  DB_USER      Database username (default: postgres)
  DB_HOST      Database host (default: localhost)
  DB_NAME      Database name (default: clic_blog)
  DB_PASSWORD  Database password (default: your_password)
  DB_PORT      Database port (default: 5432)

Examples:
  node run-migrations.js                    # Run all pending migrations
  node run-migrations.js --dry-run          # Preview migrations without executing
  node run-migrations.js --reset            # Reset database and run all migrations
  `);
  process.exit(0);
}

// Run migrations
runMigrations(options);
