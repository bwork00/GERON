const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixVideos() {
  const updates = [
    { programCode: 'JUNIOR',   videoUrl: 'https://www.youtube.com/embed/4DjBxajVDuM' },
    { programCode: 'MIDDLE_1', videoUrl: 'https://www.youtube.com/embed/E_jUl_Si_ms' },
    { programCode: 'HIGH_2',   videoUrl: 'https://www.youtube.com/embed/tAd_oFPIbiA' },
    { programCode: 'EXPERT',   videoUrl: 'https://www.youtube.com/embed/OsUiH0Ck1xQ' },
    { programCode: 'ADULT',    videoUrl: 'https://www.youtube.com/embed/-SrPMsYl0Xg' },
  ];

  for (const u of updates) {
    const result = await prisma.videoLesson.updateMany({
      where: { programCode: u.programCode },
      data: { videoUrl: u.videoUrl },
    });
    console.log(`Updated ${u.programCode}: ${result.count} row(s) -> ${u.videoUrl}`);
  }

  console.log('Done!');
  await prisma.$disconnect();
}

fixVideos().catch(e => { console.error(e); process.exit(1); });
