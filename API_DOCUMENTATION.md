# GERON Sales Training LMS Platform — Backend API Documentation

Базовый URL: `http://localhost:5000/api/v1`  
Интерактивная документация Swagger UI: `http://localhost:5000/api-docs`

---

## 🔑 Авторизация (Auth & Access)

### 1. Доступ кандидату / Вход по токену
* **POST** `/auth/access`
* **Body:**
```json
{
  "token": "geron-demo-candidate-2026"
}
```
*или регистрация нового кандидата:*
```json
{
  "fullName": "Алексей Петров",
  "phone": "+77070001122"
}
```
* **Response (200 OK / 201 Created):**
```json
{
  "success": true,
  "token": "geron-demo-candidate-2026",
  "candidate": {
    "id": "uuid",
    "fullName": "Иван Иванов (Демо Кандидат)",
    "status": "IN_PROGRESS",
    "checklistState": "[true,true,false,false,false,false,false]"
  }
}
```

### 2. Текущий профиль кандидата
* **GET** `/auth/me`
* **Headers:** `Authorization: Bearer <CANDIDATE_TOKEN>`

### 3. Вход для Админа / Наставника (Admin Login)
* **POST** `/auth/admin/login`
* **Body:**
```json
{
  "username": "admin",
  "password": "geron_admin_2026"
}
```
* **Response (200 OK):** Возвращает JWT токен в поле `token`.

---

## 📚 Обучающие материалы (Content API)

Все эндпоинты контента публичны для фронтенд разработчика:

1. **`GET /content/overview`** — Названия экранов и навигационное меню (7 этапов).
2. **`GET /content/welcome`** — Контент 1-го экрана (Приветствие Олеси).
3. **`GET /content/about`** — Контент 2-го экрана (О школе GERON & 6 ценностей).
4. **`GET /content/programs`** — Контент 3-го экрана (Программы Junior, Middle, High, Expert, Adult + вопросы для самопроверки).
5. **`GET /content/videos`** — Контент 4-го экрана (5 видео уроков с выгодами для родителя).
6. **`GET /content/scripts`** — Контент 5-го экрана (Приветствие Миры Садуовой + 8 этапов скрипта).
7. **`GET /content/calls`** — Контент 6-го экрана (Приветствие наставника + метаданные 5 реальных аудиозвонков).
8. **`GET /content/practice`** — Контент 7-го экрана (Подготовка к офису + 7 пунктов чек-листа).

---

## 🎬 Медиа и Файлы (Media API)

1. **`GET /media/audio/:id`** — Стриминг аудиозаписи реального звонка (поддерживает HTTP Range для перемотки в аудиоплеере).
2. **`GET /media/script-pdf`** — Динамическое скачивание утвержденного скрипта продаж в формате PDF.

---

## 📈 Прогресс и Чек-лист Кандидата (Progress API)

*Требуется заголовок `Authorization: Bearer <CANDIDATE_TOKEN>`*

1. **`GET /progress`** — Получить текущий статус прохождения, чек-лист и ответы кандидата.
2. **`PUT /progress/checklist`** — Обновить состояние чек-листа (7 элементов):
```json
{
  "checklistState": [true, true, true, false, false, false, false]
}
```
3. **`POST /progress/self-check`** — Сохранить ответы кандидату на 7 вопросов самопроверки:
```json
{
  "answers": {
    "1": "Школа GERON обучает созданию технологий, а не просто пользованию ПК...",
    "2": "Развивает алгоритмическое мышление и логику..."
  }
}
```
4. **`POST /progress/call-log`** — Сохранить прослушивание аудиозаписи:
```json
{
  "callSampleId": "call-sample-uuid",
  "listenedSeconds": 120,
  "isCompleted": true
}
```
5. **`POST /progress/complete`** — Завершить 2-й этап и подтвердить готовность к практической встрече в офисе.

---

## 🛡️ Панель Управления Наставника (Admin API)

*Требуется заголовок `Authorization: Bearer <ADMIN_JWT>`*

1. **`GET /admin/candidates`** — Просмотр списка всех кандидатов, их статуса, чек-листов и прослушанных звонков.
2. **`POST /admin/candidates/invite`** — Сгенерировать индивидуальную ссылку и токен доступа для нового кандидата:
```json
{
  "fullName": "Анна Сидорова",
  "phone": "+77771234567"
}
```
3. **`DELETE /admin/candidates/:id`** — Удалить запись кандидата.

---

## ⚙️ Запуск Бэкенда на сервере

```bash
# 1. Установка зависимостей
npm install

# 2. Инициализация базы данных SQLite и наполнение данными
npx prisma db push
npm run db:seed

# 3. Запуск сервера разработки
npm run dev

# 4. Сборка и запуск в продакшн
npm run build
npm run start
```
