#!/usr/bin/env node

/**
 * Complete Blog Migration Setup
 * Runs database schema setup and data migration in sequence
 * Usage: node setup-blog-database.js [--dry-run] [--reset]
 */

const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function setupBlogDatabase(options = {}) {
  const { dryRun = false, reset = false } = options;
  
  console.log('🚀 Complete Blog Database Setup Starting...');
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Run database schema migrations
    console.log('\n📊 Step 1: Setting up database schema...');
    const migrationArgs = ['run-migrations.js'];
    if (dryRun) migrationArgs.push('--dry-run');
    if (reset) migrationArgs.push('--reset');
    
    await runCommand('node', migrationArgs);
    
    if (dryRun) {
      console.log('\n📋 DRY RUN: Would proceed to data migration...');
      return;
    }
    
    // Step 2: Migrate blog post data
    console.log('\n📝 Step 2: Migrating existing blog posts...');
    const dataArgs = ['migrate-blog-data.js'];
    if (reset) dataArgs.push('--force'); // Force overwrite if we reset
    
    await runCommand('node', dataArgs);
    
    // Step 3: Success summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Blog Database Setup Complete!');
    console.log('\nNext Steps:');
    console.log('1. Update your .env file with database credentials');
    console.log('2. Test database connection with a query');
    console.log('3. Begin Phase 4: API Development');
    console.log('\nDatabase is ready for:');
    console.log('- ✅ Blog post storage and retrieval');
    console.log('- ✅ Category and tag management');
    console.log('- ✅ Author management');
    console.log('- ✅ Featured post functionality');
    console.log('- ✅ Search and filtering capabilities');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check PostgreSQL is running');
    console.log('2. Verify database credentials in .env');
    console.log('3. Ensure database exists and is accessible');
    console.log('4. Check npm install has been run (pg package)');
    process.exit(1);
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
Complete Blog Database Setup

Usage:
  node setup-blog-database.js [options]

Options:
  --dry-run    Preview all operations without executing
  --reset      Reset database and migrate all data fresh
  --help, -h   Show this help message

This script will:
1. Create database schema (tables, indexes, triggers)
2. Populate initial data (authors, categories, tags)
3. Migrate existing blog posts from blogPosts.js
4. Provide setup summary and next steps

Environment Variables:
  DB_USER      Database username (default: postgres)
  DB_HOST      Database host (default: localhost)
  DB_NAME      Database name (default: clic_blog)
  DB_PASSWORD  Database password (default: your_password)
  DB_PORT      Database port (default: 5432)

Examples:
  node setup-blog-database.js                    # Complete setup
  node setup-blog-database.js --dry-run          # Preview all operations
  node setup-blog-database.js --reset            # Fresh reset and setup
  `);
  process.exit(0);
}

// Run complete setup
setupBlogDatabase(options);
