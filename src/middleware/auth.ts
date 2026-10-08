import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';

export interface AuthenticatedRequest extends Request {
  candidate?: any;
  admin?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'geron_sales_training_secret_key_2026';

export async function candidateAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required. Provide Bearer token or ?token= query parameter.'
      });
    }

    // Check candidate token in DB
    const candidate = await prisma.candidate.findUnique({
      where: { token }
    });

    if (!candidate) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired candidate access token.'
      });
    }

    req.candidate = candidate;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Authentication error' });
  }
}

export async function adminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Admin JWT Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded || !decoded.adminId) {
      return res.status(403).json({ success: false, error: 'Invalid admin token.' });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    });

    if (!admin) {
      return res.status(403).json({ success: false, error: 'Admin account not found.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}
