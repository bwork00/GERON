import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
import mediaRoutes from './routes/media.routes';
import progressRoutes from './routes/progress.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (images, audio files, downloads)
app.use('/assets', express.static(path.join(__dirname, '../public')));

// Swagger API Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Health Check & Information
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'GERON Sales Training LMS Platform API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/v1/auth',
      content: '/api/v1/content',
      media: '/api/v1/media',
      progress: '/api/v1/progress',
      admin: '/api/v1/admin'
    }
  });
});

// API V1 Routes Registration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 GERON Sales Training API Server running on port ${PORT}`);
  console.log(`📚 Interactive Swagger API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`====================================================`);
});

export default app;
