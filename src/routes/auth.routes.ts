import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import { candidateAuth } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'geron_sales_training_secret_key_2026';

/**
 * @openapi
 * /api/v1/auth/access:
 *   post:
 *     summary: Authenticate candidate via Token or Register new candidate
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 */
router.post('/access', async (req: Request, res: Response) => {
  try {
    const { token, fullName, phone } = req.body;

    if (token) {
      const candidate = await prisma.candidate.findUnique({
        where: { token }
      });
      if (!candidate) {
        return res.status(404).json({ success: false, error: 'Candidate not found for this token.' });
      }
      return res.json({
        success: true,
        candidate,
        token: candidate.token
      });
    }

    if (!fullName) {
      return res.status(400).json({ success: false, error: 'Full name or token is required.' });
    }

    // Auto-generate candidate token for new registrations
    const newToken = `geron-cand-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const candidate = await prisma.candidate.create({
      data: {
        fullName,
        phone: phone || null,
        token: newToken,
        checklistState: JSON.stringify([false, false, false, false, false, false, false])
      }
    });

    return res.status(201).json({
      success: true,
      candidate,
      token: candidate.token
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current candidate details
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate details
 */
router.get('/me', candidateAuth, async (req: any, res: Response) => {
  res.json({
    success: true,
    candidate: req.candidate
  });
});

/**
 * @openapi
 * /api/v1/auth/admin/login:
 *   post:
 *     summary: Admin / Mentor Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
 */
router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required.' });
    }

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const jwtToken = jwt.sign(
      { adminId: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token: jwtToken,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
