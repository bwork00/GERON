import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { prisma } from '../db/prisma';

const router = Router();
const UPLOADS_DIR = path.join(__dirname, '../../public/audio');

/**
 * @openapi
 * /api/v1/media/audio/{id}:
 *   get:
 *     summary: Stream real client call audio sample (HTTP Range support)
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       206:
 *         description: Partial Content (Audio Stream)
 *       404:
 *         description: Audio file not found
 */
router.get('/audio/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const callSample = await prisma.callSample.findUnique({
      where: { id }
    });

    if (!callSample) {
      return res.status(404).json({ success: false, error: 'Call sample record not found.' });
    }

    const filePath = path.join(UPLOADS_DIR, callSample.audioFileName);

    if (!fs.existsSync(filePath)) {
      // Fallback response or mock stream if file not uploaded yet
      return res.status(404).json({
        success: false,
        error: `Audio file '${callSample.audioFileName}' not found on server storage.`
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @openapi
 * /api/v1/media/script-pdf:
 *   get:
 *     summary: Download GERON Sales Script as PDF
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: PDF file download
 */
router.get('/script-pdf', async (req: Request, res: Response) => {
  try {
    const sections = await prisma.salesScriptSection.findMany({
      orderBy: { stepNumber: 'asc' }
    });

    const doc = new PDFDocument({ margin: 50 });
    const fileName = 'GERON_Sales_Script.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor('#1A202C').text('Школа программирования GERON', { align: 'center' });
    doc.fontSize(14).fillColor('#4A5568').text('Утверждённый скрипт телефонных продаж (2-й этап отбора)', { align: 'center' });
    doc.moveDown(1.5);

    // Intro
    doc.fontSize(10).fillColor('#718096').text('Примечание: Скрипт служит ориентиром и логикой общения. Ведите живой и уважительный диалог.', { align: 'left' });
    doc.moveDown(1);

    sections.forEach((sec) => {
      doc.fontSize(13).fillColor('#2B6CB0').text(`Этап ${sec.stepNumber}. ${sec.title}`);
      if (sec.description) {
        doc.fontSize(10).fillColor('#4A5568').text(`Цель: ${sec.description}`);
      }
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#2D3748').text(sec.content);
      if (sec.scriptTips) {
        doc.moveDown(0.3);
        doc.fontSize(9).fillColor('#D69E2E').text(`💡 Совет: ${sec.scriptTips}`);
      }
      doc.moveDown(1.2);
    });

    doc.end();
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
