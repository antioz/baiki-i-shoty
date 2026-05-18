# Байки и Шоты

Кликабельный прототип сервиса аудио-историй о зданиях и заведениях центра Санкт-Петербурга. Две точки входа: QR в заведении и лендинг с картой города. Каждая история продаётся отдельно за 100 ₽ (оплата имитируется).

## Контекст и решения

См. [`PLAN.md`](./PLAN.md) — фазы разработки, что в скоупе и что нет.
См. [`design-spec.json`](./design-spec.json) — дизайн-спека: палитра, типографика, структура страниц, компоненты. Это основной артефакт для итерации с Claude Design / V0.

## Стек

Next.js 15 App Router + TypeScript + Tailwind + react-leaflet + Lucide. Hosting Vercel.

## Структура

```
data/         venues.json + stories.json — схема как у будущей Postgres-таблицы
content/
  research/   ресёрч по 4 заведениям (исторические факты, сюжеты) — основа для текстов
  drafts/     черновики 16 аудио-историй (~300 слов каждая, ~2 мин в TTS)
public/
  audio/      16 mp3 (генерим через scripts/generate-audio.ts, gitignored)
  img/        фото 4 зданий
scripts/
  generate-audio.ts   TTS-генератор (OpenAI tts-1-hd voice onyx или Yandex SpeechKit)
src/
  lib/        types, data getters (getVenueBySlug, getStoriesByVenue, getNearbyVenues), haversine, unlock helpers
  components/ UI — будет наполняться из Claude Design output
  app/        Next.js App Router pages — оттуда же
```

## Заведения

4 шт., центр СПб. По 4 истории на каждое: 1 бесплатная, 3 платные по 100 ₽.

| ID | Slug | Тип | Адрес |
|---|---|---|---|
| v_terminal | terminal-bar | БАР | Рубинштейна, 25 |
| v_tsvetochki | tsvetochki | БАР | Гороховая, 49 |
| v_grand_europa | grand-europa | ОТЕЛЬ | Михайловская, 1/7 |
| v_palkin | palkin | РЕСТОРАН | Невский, 47 |

## Дизайн-направление: «Ночной Питер»

Тёмный, кинематографичный, минималистичный. Один янтарный акцент (`#d4a574`). PT Serif для заголовков (weight 400), Inter для UI, JetBrains Mono для метаданных (uppercase). Карта на Stadia Alidade Smooth Dark. 1px границы вместо теней.

## Конвенции

- Никаких эмодзи в UI и контенте
- Разблок per-story (не per-venue), ключ `localStorage["unlocked:<story_id>"]`
- Singleton-плеер: одна история проигрывается за раз
- Лендинг — только hero-overlay поверх полноэкранной карты. Никакого списка заведений, никакого футера
- На venue page — никакой мини-карты и никаких deep-link «построить маршрут» (человек уже в баре)
- Блок «Рядом» на venue page — минимум информации (тип, название, расстояние), без фото и описаний (для бархоппинга)

## Out of scope

Реальная оплата, бэкенд, БД, auth, админка, QR-генератор (будет внутренний инструмент позже), аналитика, антифрод.

## Workflow

1. Ресёрч в `content/research/<venue>.md` (есть фоновый агент)
2. Драфты в `content/drafts/<venue>/<story>.md`
3. Перенос текстов в `data/stories.json` поле `text`
4. TTS-генерация: `npx tsx scripts/generate-audio.ts`
5. Фронт из Claude Design кладётся в `src/`
6. Deploy на Vercel
