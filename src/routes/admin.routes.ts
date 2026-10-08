import { Router, Response } from 'express';
import { prisma } from '../db/prisma';
import { adminAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/v1/admin/candidates:
 *   get:
 *     summary: List all candidates and their stage 2 training progress
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of candidates
 */
router.get('/candidates', adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        progressLogs: {
          include: { callSample: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedCandidates = candidates.map(c => ({
      ...c,
      checklistState: JSON.parse(c.checklistState || '[]'),
      selfCheckAnswers: JSON.parse(c.selfCheckAnswers || '{}')
    }));

    res.json({ success: true, count: candidates.length, candidates: formattedCandidates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/admin/candidates/invite:
 *   post:
 *     summary: Create new candidate invite link & access token
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidate created with invite link
 */
router.post('/candidates/invite', adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, phone, email } = req.body;
    if (!fullName) {
      return res.status(400).json({ success: false, error: 'Full name required.' });
    }

    const token = `geron-invite-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const candidate = await prisma.candidate.create({
      data: {
        fullName,
        phone: phone || null,
        email: email || null,
        token,
        checklistState: JSON.stringify([false, false, false, false, false, false, false])
      }
    });

    const accessUrl = `http://localhost:3000/?token=${candidate.token}`;

    res.status(201).json({
      success: true,
      candidate,
      accessUrl,
      token: candidate.token
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/admin/candidates/{id}:
 *   delete:
 *     summary: Delete a candidate record
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate deleted
 */
router.delete('/candidates/:id', adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.candidate.delete({ where: { id } });
    res.json({ success: true, message: 'Candidate record deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
