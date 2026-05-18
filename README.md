# Байки и Шоты

Аудио-истории о зданиях и заведениях центра Санкт-Петербурга. Кликабельный прототип.

## Документы

- [`PLAN.md`](./PLAN.md) — план разработки по фазам
- [`design-spec.json`](./design-spec.json) — дизайн-спека для Claude Design / V0

## Структура

```
data/         venues.json + stories.json (схема как у будущей БД)
content/
  research/   материал по 4 заведениям для текстов историй
  drafts/     черновики 16 аудио-историй
public/
  audio/      mp3 (16 шт., gitignored)
  img/        фото зданий
scripts/      generate-audio.ts (TTS)
src/
  lib/        types, data getters, haversine, unlock
  components/ UI (придёт из Claude Design)
  app/        Next.js App Router (придёт из Claude Design)
```

## Workflow

1. Заполнить `content/research/*.md` фактами (есть фоновый агент)
2. Написать тексты историй в `content/drafts/*.md`
3. Перенести тексты в `data/stories.json` (поле `text`)
4. `cp .env.local.example .env.local`, добавить ключ
5. `npx tsx scripts/generate-audio.ts` — 16 mp3 в `public/audio/`
6. Подложить фронт из Claude Design, `npm run dev`
7. Deploy на Vercel

## Заведения

| Slug | Тип | Адрес |
|---|---|---|
| terminal-bar | БАР | Рубинштейна, 25 |
| tsvetochki | БАР | Гороховая, 49 |
| grand-europa | ОТЕЛЬ | Михайловская, 1/7 |
| palkin | РЕСТОРАН | Невский, 47 |
