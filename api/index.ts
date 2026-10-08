import path from 'path';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'geron_sales_training_secret_key_2026_super_secure';
}

import app from '../src/index';

export default app;
