import { Router, Response } from 'express';
import { prisma } from '../db/prisma';
import { candidateAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/v1/progress:
 *   get:
 *     summary: Get candidate progress and checklist state
 *     tags: [Progress]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Progress state object
 */
router.get('/', candidateAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const candidate = req.candidate;
    const callLogs = await prisma.callProgress.findMany({
      where: { candidateId: candidate.id }
    });

    res.json({
      success: true,
      candidateId: candidate.id,
      status: candidate.status,
      checklistState: JSON.parse(candidate.checklistState || '[]'),
      selfCheckAnswers: JSON.parse(candidate.selfCheckAnswers || '{}'),
      startedAt: candidate.startedAt,
      completedAt: candidate.completedAt,
      callLogs
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/progress/checklist:
 *   put:
 *     summary: Update candidate's 7 checklist items state
 *     tags: [Progress]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checklistState
 *             properties:
 *               checklistState:
 *                 type: array
 *                 items:
 *                   type: boolean
 *     responses:
 *       200:
 *         description: Checklist updated
 */
router.put('/checklist', candidateAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { checklistState } = req.body;
    if (!Array.isArray(checklistState)) {
      return res.status(400).json({ success: false, error: 'checklistState must be an array of booleans.' });
    }

    const updated = await prisma.candidate.update({
      where: { id: req.candidate.id },
      data: {
        checklistState: JSON.stringify(checklistState)
      }
    });

    res.json({
      success: true,
      checklistState: JSON.parse(updated.checklistState)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/progress/self-check:
 *   post:
 *     summary: Save candidate self-check answers
 *     tags: [Progress]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: object
 *     responses:
 *       200:
 *         description: Answers saved
 */
router.post('/self-check', candidateAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { answers } = req.body;
    const updated = await prisma.candidate.update({
      where: { id: req.candidate.id },
      data: {
        selfCheckAnswers: JSON.stringify(answers || {})
      }
    });

    res.json({
      success: true,
      selfCheckAnswers: JSON.parse(updated.selfCheckAnswers)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/progress/call-log:
 *   post:
 *     summary: Log candidate audio call listening progress
 *     tags: [Progress]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - callSampleId
 *             properties:
 *               callSampleId:
 *                 type: string
 *               listenedSeconds:
 *                 type: integer
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.post('/call-log', candidateAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { callSampleId, listenedSeconds, isCompleted } = req.body;
    if (!callSampleId) {
      return res.status(400).json({ success: false, error: 'callSampleId required.' });
    }

    const log = await prisma.callProgress.upsert({
      where: {
        candidateId_callSampleId: {
          candidateId: req.candidate.id,
          callSampleId
        }
      },
      update: {
        listenedSeconds: listenedSeconds || 0,
        isCompleted: isCompleted || false
      },
      create: {
        candidateId: req.candidate.id,
        callSampleId,
        listenedSeconds: listenedSeconds || 0,
        isCompleted: isCompleted || false
      }
    });

    res.json({ success: true, log });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/progress/complete:
 *   post:
 *     summary: Mark 2nd stage training complete & submit readiness
 *     tags: [Progress]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Training completed
 */
router.post('/complete', candidateAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await prisma.candidate.update({
      where: { id: req.candidate.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "Поздравляем! Вы успешно завершили теоретический этап. Ждем вас на практическую встречу в офисе GERON!",
      candidate: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
