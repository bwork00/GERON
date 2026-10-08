#!/usr/bin/env node

/**
 * Railway startup script — initializes the database and seeds it if empty.
 * Runs before the main server starts.
 */

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function init() {
  console.log('🔧 Initializing GERON database...');

  // 1. Push the Prisma schema to create tables
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✅ Prisma schema applied');
  } catch (err) {
    console.error('❌ Failed to apply Prisma schema:', err.message);
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    // 2. Check if data already exists
    const videoCount = await prisma.videoLesson.count();
    if (videoCount === 0) {
      console.log('📦 Database is empty, running seed...');
      execSync('node dist/seed.js', { stdio: 'inherit' });
      console.log('✅ Database seeded');
    } else {
      console.log(`✅ Database already has ${videoCount} video lesson(s), skipping seed`);
    }
  } catch (err) {
    console.error('⚠️ Seed check failed (non-fatal):', err.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('🚀 Database ready!');
}

init().catch((e) => {
  console.error('❌ Init error:', e);
  process.exit(1);
});
