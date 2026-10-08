import { prisma } from './db/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding GERON database...');

  // 1. Seed Admin Account
  const existingAdmin = await prisma.admin.findUnique({ where: { username: 'admin' } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('geron_admin_2026', 10);
    await prisma.admin.create({
      data: {
        username: 'admin',
        passwordHash,
        role: 'ADMIN'
      }
    });
    console.log('Created default admin account: admin / geron_admin_2026');
  }

  // 2. Seed Programs
  const programsData = [
    {
      code: 'JUNIOR',
      title: 'JUNIOR | 7–8 лет',
      ageRange: '7–8 лет',
      subtitle: 'Первые шаги в программировании',
      description: 'Дети знакомятся с устройством компьютера, развивают логику и алгоритмическое мышление, осваивают компьютерную грамотность.',
      tools: JSON.stringify(['Scratch', 'Kodu', 'Piskel App']),
      valueForParents: 'Ребёнок начинает не просто играть за компьютером, а понимать принципы работы цифровых инструментов и создавать собственные небольшие проекты.',
      sortOrder: 1
    },
    {
      code: 'MIDDLE_1',
      title: 'MIDDLE 1 — HIGH 1 | 8–11 лет',
      ageRange: '8–11 лет',
      subtitle: 'От первых игр к собственным приложениям',
      description: 'Учащиеся знакомятся с офисными программами, 3D-моделированием, дизайном, графическими редакторами и разработкой мобильных приложений.',
      tools: JSON.stringify(['Scratch 3', 'Construct 3', 'Thunkable', 'MIT App Inventor']),
      valueForParents: 'Ребёнок расширяет круг интересов, развивает техническое и творческое мышление, учится превращать идеи в цифровые проекты.',
      sortOrder: 2
    },
    {
      code: 'HIGH_2',
      title: 'HIGH 2 — SUPER 2 | 11–14 лет',
      ageRange: '11–14 лет',
      subtitle: 'Настоящие языки программирования',
      description: 'Учащиеся знакомятся с веб-разработкой, базами данных, языками программирования и основами интерфейсного дизайна.',
      tools: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'PHP', 'Python', 'C++', 'WordPress', 'Arduino', 'Figma']),
      valueForParents: 'Подросток получает представление о реальной разработке программ, сайтов и приложений и может осознаннее выбирать интересующие его IT-направления.',
      sortOrder: 3
    },
    {
      code: 'EXPERT',
      title: 'EXPERT 1 — EXPERT 3 | 14–17 лет',
      ageRange: '14–17 лет',
      subtitle: 'Углублённое изучение IT',
      description: 'Учащиеся изучают объектно-ориентированное программирование, создание игр в Unity, 3D-моделирование и анимацию в Blender.',
      tools: JSON.stringify(['C#', 'Java', 'Unity', 'Blender', 'Android-разработка']),
      valueForParents: 'Подросток получает возможность развивать более сложные технические навыки, создавать серьезные проекты и готовиться к дальнейшему профильному обучению.',
      sortOrder: 4
    },
    {
      code: 'ADULT',
      title: 'Программы для взрослых | 18+',
      ageRange: '18+ лет',
      subtitle: 'Освоение современных цифровых профессий',
      description: 'Профессиональное обучение взрослым по самым востребованным IT-направлениям рынка.',
      tools: JSON.stringify(['Frontend (React/HTML/CSS)', 'Backend', 'UX/UI Design', '3D Blender', 'Unity', 'ИИ-технологии']),
      valueForParents: 'Знакомство с современными инструментами, развитие профессиональных навыков и создание портфолио для трудоустройства.',
      sortOrder: 5
    }
  ];

  for (const prog of programsData) {
    await prisma.program.upsert({
      where: { code: prog.code },
      update: prog,
      create: prog
    });
  }
  console.log('Seeded Educational Programs');

  // 3. Seed Video Lessons
  const videosData = [
    {
      programCode: 'JUNIOR',
      title: 'Видео 1. JUNIOR — 7–8 лет',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyTakeaways: JSON.stringify([
        'Дети 7–8 лет учатся основам логики и компьютерной грамотности.',
        'Создают первые анимации и пиксельные рисунки в Piskel App.',
        'Выгода родителя: ребёнок переходит от компьютерных игр к созиданию.'
      ]),
      sortOrder: 1
    },
    {
      programCode: 'MIDDLE_1',
      title: 'Видео 2. MIDDLE / HIGH — 8–11 лет',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyTakeaways: JSON.stringify([
        'Создание игр на Construct 3 и приложений на Thunkable.',
        'Развитие пространственного и математического мышления.',
        'Выгода родителя: ребёнок учится воплощать творческие идеи в реальные приложения.'
      ]),
      sortOrder: 2
    },
    {
      programCode: 'HIGH_2',
      title: 'Видео 3. HIGH / SUPER — 11–14 лет',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyTakeaways: JSON.stringify([
        'Изучение HTML/CSS/JS, Python и физики робототехники в Arduino.',
        'Основы веб-дизайна в Figma.',
        'Выгода родителя: подросток пробует себя в настоящих IT-специальностях.'
      ]),
      sortOrder: 3
    },
    {
      programCode: 'EXPERT',
      title: 'Видео 4. EXPERT — 14–17 лет',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyTakeaways: JSON.stringify([
        'C#, Java, разработка 3D-игр в Unity.',
        '3D-моделирование профессионального уровня в Blender.',
        'Выгода родителя: подготовка к поступлению в IT-вузы и созданию стартапов.'
      ]),
      sortOrder: 4
    },
    {
      programCode: 'ADULT',
      title: 'Видео 5. Программы для взрослых — 18+',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyTakeaways: JSON.stringify([
        'Интенсивная практика и разработка коммерческих проектов.',
        'Подготовка порфолио для работы во Frontend/Backend/UI-UX.',
        'Выгода: быстрая смен профессии и практические IT-навыки.'
      ]),
      sortOrder: 5
    }
  ];

  for (let i = 0; i < videosData.length; i++) {
    const v = videosData[i];
    const existing = await prisma.videoLesson.findFirst({ where: { title: v.title } });
    if (!existing) {
      await prisma.videoLesson.create({ data: v });
    }
  }
  console.log('Seeded Video Lessons');

  // 4. Seed Sales Script Sections
  const scriptData = [
    {
      stepNumber: 1,
      title: 'Приветствие и установление контакта',
      description: 'Поприветствовать родителя, представить школу GERON и вызвать доверие.',
      content: 'Здравствуйте, [Имя Родителя]! Меня зовут [Имя Менеджера], школа программирования GERON. Вы оставляли заявку на знакомство с нашей школой. Вам удобно сейчас говорить?',
      scriptTips: 'Улыбайтесь во время разговора — интонация голоса передает доброжелательность.'
    },
    {
      stepNumber: 2,
      title: 'Уточнение обращения и возраста ребёнка',
      description: 'Узнать имя и возраст ребёнка для выбора корректного курса.',
      content: 'Подскажите, пожалуйста, как зовут вашего ребёнка и сколько ему лет? Занимался ли он ранее чем-то подобным или это будет первый опыт?',
      scriptTips: 'Запишите имя ребёнка и используйте его во время всего дальнейшего диалога.'
    },
    {
      stepNumber: 3,
      title: 'Выявление интересов и потребностей',
      description: 'Понять, чем увлекается ребёнок и чего ждет родитель.',
      content: 'Чем [Имя ребёнка] больше всего увлечён? Любит играть в компьютерные игры, рисовать или что-то конструировать? Какую главную цель вы ставите перед обучением?',
      scriptTips: 'Слушайте 80% времени, говорите 20%. Задавайте открытые вопросы.'
    },
    {
      stepNumber: 4,
      title: 'Презентация подходящей программы',
      description: 'Рассказать о конкретном направлении школы GERON через выгоды.',
      content: 'Для возраста [Возраст] у нас разработана программа [Название Программы]. В процессе обучения [Имя ребёнка] научится не просто играть, а создавать собственные проекты на [Инструменты]. Для вас это возможность дать ребёнку полезный навык!',
      scriptTips: 'Рассказывайте о результатах ребёнка, а не только о сухих названиях программ.'
    },
    {
      stepNumber: 5,
      title: 'Работа с вопросами и возражениями',
      description: 'Снять сомнения родителя («он и так много сидит в компьютере»).',
      content: 'Понимаю ваше опасение! Именно поэтому в GERON мы переводим время у экрана из бесцельного сидения в создание собственных технологий. Ребёнок видит результат своего труда!',
      scriptTips: 'Никогда не спорьте с родителем. Согласитесь с его заботой и покажите ценность.'
    },
    {
      stepNumber: 6,
      title: 'Приглашение на пробный урок',
      description: 'Записать ребёнка на бесплатное практическое занятие.',
      content: 'Чтобы [Имя ребёнка] сам попробовал создать свой первый проект, я приглашаю вас на наш бесплатный пробный урок в офисе GERON!',
      scriptTips: 'Акцентируйте внимание на том, что урок бесплатный и ни к чему не обязывает.'
    },
    {
      stepNumber: 7,
      title: 'Согласование даты и времени',
      description: 'Выбрать удобный день с помощью техники «Выбор без выбора».',
      content: 'Вам удобнее прийти в будний день в 16:00 или в субботу в 12:00?',
      scriptTips: 'Давайте два конкретных варианта на выбор.'
    },
    {
      stepNumber: 8,
      title: 'Подтверждение договорённости',
      description: 'Зафиксировать запись и отправить памятку с адресом.',
      content: 'Отлично! Записал вас на [Дата и Время]. Сейчас я отправлю вам в WhatsApp адрес нашей школы и напоминание. Будем рады видеть вас!',
      scriptTips: 'Обязательно отправьте сообщение-напоминание сразу после разговора.'
    }
  ];

  for (const s of scriptData) {
    await prisma.salesScriptSection.upsert({
      where: { stepNumber: s.stepNumber },
      update: s,
      create: s
    });
  }
  console.log('Seeded Sales Script Sections');

  // 5. Seed Call Samples
  const callsData = [
    {
      title: 'Аудио 1. Первый контакт с родителем',
      category: 'FIRST_CONTACT',
      audioFileName: 'call_1_first_contact.mp3',
      durationSeconds: 145,
      description: 'Пример установления живого контакта, приветствия и вызова доверия родителя.',
      sortOrder: 1
    },
    {
      title: 'Аудио 2. Выявление потребностей родителя',
      category: 'NEEDS_DISCOVERY',
      audioFileName: 'call_2_needs_discovery.mp3',
      durationSeconds: 210,
      description: 'Менеджер задает вопросы об интересах 9-летнего ребёнка и выявляет истинную мотивацию.',
      sortOrder: 2
    },
    {
      title: 'Аудио 3. Презентация образовательной программы',
      category: 'PROGRAM_PRESENTATION',
      audioFileName: 'call_3_presentation.mp3',
      durationSeconds: 185,
      description: 'Грамотное представление программы Middle/High со Scratch 3 и Construct 3.',
      sortOrder: 3
    },
    {
      title: 'Аудио 4. Работа со сложными возражениями',
      category: 'OBJECTIONS',
      audioFileName: 'call_4_objections.mp3',
      durationSeconds: 240,
      description: 'Ответ на возражения «у нас нет времени» и «он и так много сидит в телефоне».',
      sortOrder: 4
    },
    {
      title: 'Аудио 5. Запись на пробный урок',
      category: 'TRIAL_LESSON_BOOKING',
      audioFileName: 'call_5_trial_booking.mp3',
      durationSeconds: 120,
      description: 'Увереное подведение разговора к выбору даты и фиксация визита в офис GERON.',
      sortOrder: 5
    }
  ];

  for (let i = 0; i < callsData.length; i++) {
    const c = callsData[i];
    const existing = await prisma.callSample.findFirst({ where: { title: c.title } });
    if (!existing) {
      await prisma.callSample.create({ data: c });
    }
  }
  console.log('Seeded Audio Call Samples');

  // 6. Create demo candidate for testing
  const demoToken = 'geron-demo-candidate-2026';
  await prisma.candidate.upsert({
    where: { token: demoToken },
    update: {},
    create: {
      fullName: 'Иван Иванов (Демо Кандидат)',
      phone: '+7 707 123 45 67',
      email: 'ivan@example.com',
      token: demoToken,
      checklistState: JSON.stringify([true, true, false, false, false, false, false])
    }
  });

  console.log(`Demo candidate created with token: ${demoToken}`);
  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding DB:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
