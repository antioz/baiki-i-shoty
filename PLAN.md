# Байки и Шоты — план разработки

## Контекст

Кликабельный прототип аудио-историй о зданиях и заведениях центра Санкт-Петербурга. Две точки входа: QR в заведении и лендинг с картой города. Каждая история продаётся отдельно за 100 ₽ (оплата имитируется). Цель прототипа — показать поток, протестировать UX, отдать в работу дизайнеру / следующей итерации.

Полная дизайн-спека: [`design-spec.json`](./design-spec.json).

## Ключевые решения

| Параметр | Значение |
|---|---|
| Уровень готовности | Кликабельный прототип |
| Стек | Next.js 15 (App Router) + TypeScript + Tailwind + react-leaflet + Lucide |
| Хостинг | Vercel |
| Карта | Leaflet, тайлы Stadia Alidade Smooth Dark |
| Данные | Статика в `data/*.json` + mp3 в `/public/audio/` (схема как у будущей БД) |
| Оплата | Имитация: модалка → спиннер → разблок per-story в `localStorage` |
| Разблок | Per-story (не per-venue), ключ `unlocked:<story_id>` |
| Админка | Нет. Контент редактируется через git |
| QR-генерация | Нет в прототипе. Позже отдельный внутренний инструмент |
| Аудио | TTS-заглушки: OpenAI `tts-1` голос `onyx` или Yandex SpeechKit |
| Дизайн | «Ночной Питер»: тёмный, кинематографичный, янтарный акцент |
| Заведения | 4 шт.: Терминал Бар, Цветочки, Гранд Отель Европа, Палкинъ |
| Истории | 4 на заведение = 16 mp3, 1 бесплатная + 3 платные на venue |

## Чего НЕТ в прототипе (out of scope)

- Реальная интеграция оплаты (ЮKassa / CloudPayments)
- Бэкенд / API / БД
- Аутентификация и личные кабинеты
- Админ-панель
- Аналитика, A/B, антифрод
- Deep-link «построить маршрут» к Яндекс.Картам / 2ГИС (человек уже в баре)
- Мини-карта на venue page
- Список заведений на лендинге (карта — единственная навигация)

---

## Фазы разработки

### Фаза 0 — Подготовка контента (off-code)
**Время:** ~1-2 дня (можно параллельно с Фазой 1)

1. Написать тексты 16 историй (по ~300 слов, ~2 мин в озвучке)
   - 4 байки на каждое заведение
   - 1 бесплатная (вводная, цепляющая), 3 платные (подробные)
2. Собрать фото 4 зданий (Wikimedia Commons / Unsplash, проверить лицензии)
3. Зарегистрировать API-ключ для TTS (OpenAI или Yandex)

Артефакты: черновики текстов в `content/drafts/*.md`, фото в `public/img/`.

### Фаза 1 — Скаффолд проекта
**Время:** ~2 часа

```bash
cd ~/Documents/baiki-i-shoty
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir=false --import-alias "@/*"
npm install leaflet react-leaflet lucide-react
npm install -D @types/leaflet
```

Структура:
```
baiki-i-shoty/
├── package.json
├── next.config.ts
├── tailwind.config.ts          ← кастомные цвета из design-spec.json
├── tsconfig.json
├── .env.local                  ← OPENAI_API_KEY (gitignored)
├── public/
│   ├── audio/                  ← 16 mp3 (генерим в Фазе 3)
│   └── img/                    ← фото 4 зданий
├── data/
│   ├── venues.json
│   └── stories.json
├── content/
│   └── drafts/                 ← тексты историй до TTS
├── scripts/
│   └── generate-audio.ts       ← TTS-генератор
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                       ← лендинг
    │   ├── venue/[slug]/page.tsx
    │   └── about/page.tsx                 ← опционально
    ├── components/
    │   ├── CityMap.tsx
    │   ├── Header.tsx
    │   ├── HeroOverlay.tsx
    │   ├── StoryCard.tsx
    │   ├── AudioPlayer.tsx
    │   ├── PaywallModal.tsx
    │   ├── NearbyMiniCard.tsx
    │   └── VenueCover.tsx
    ├── lib/
    │   ├── data.ts             ← getVenue(slug), getStoriesByVenue, etc
    │   ├── unlock.ts           ← localStorage helpers
    │   └── haversine.ts        ← ближайшие места
    └── styles/
        └── globals.css         ← CSS variables из дизайн-спеки
```

Tailwind конфиг — подцепить палитру и шрифты из `design-spec.json` через theme.extend.colors / fontFamily. Глобальные CSS-переменные в `globals.css` зеркалят палитру.

### Фаза 2 — Данные и типы
**Время:** ~1 час

1. Положить `data/venues.json` и `data/stories.json` по схеме из `design-spec.json`.
2. Описать TypeScript типы в `src/lib/types.ts`:
   ```ts
   type Venue = { id, slug, type, name, address, lat, lng, cover, blurb, story_ids[] }
   type Story = { id, venue_id, title, duration_sec, audio_url, is_free, price_rub, text }
   ```
3. Реализовать геттеры в `src/lib/data.ts`:
   - `getAllVenues()`
   - `getVenueBySlug(slug)`
   - `getStoriesByVenue(venueId)`
   - `getNearbyVenues(venueId, count=3)` — через haversine
4. Тексты историй временно — Lorem-плейсхолдеры, заменим в Фазе 3.

### Фаза 3 — Генерация аудио
**Время:** ~30 мин на генерацию + проверка

Скрипт `scripts/generate-audio.ts`:
1. Читает `data/stories.json`.
2. Для каждой истории берёт поле `text`.
3. Дёргает OpenAI TTS (`model: "tts-1-hd"`, `voice: "onyx"`) или Yandex SpeechKit (голос `madirus` / `zahar` / `ermil`).
4. Сохраняет mp3 в `public/audio/<story_id>.mp3`.
5. Считывает длительность через `mp3-duration` или `music-metadata`, пишет `duration_sec` обратно в JSON.

Запуск: `npx tsx scripts/generate-audio.ts`. Ключ из `.env.local`.

Идемпотентность: пропускать stories, у которых mp3 уже есть и `text` не менялся (хэш по тексту в comment).

### Фаза 4 — Базовый layout и темизация
**Время:** ~3 часа

1. `app/layout.tsx`: подгрузить шрифты через `next/font` (PT Serif, Inter, JetBrains Mono).
2. `globals.css`: CSS-переменные из палитры, базовые ресеты, body background `--bg-primary`.
3. `Header.tsx`: фикс-позиция, прозрачный фон, логотип-вордмарк + ссылка «О проекте».
4. Проверить, что `npm run dev` показывает пустой тёмный экран с шапкой.

### Фаза 5 — Лендинг с картой
**Время:** ~4 часа

1. `CityMap.tsx`:
   - Динамический импорт `react-leaflet` (SSR-проблема): `dynamic(() => import('./CityMapClient'), { ssr: false })`.
   - Стайл-инжект Leaflet CSS.
   - Тайлы Stadia, центр СПб, zoom 14.
   - Кастомные маркеры через `L.divIcon({ html: '<div class="marker amber-glow" />' })`.
   - Tooltip on hover: «{name} · {N} историй».
   - Click → router.push(`/venue/${slug}`).
2. `HeroOverlay.tsx`: абсолютно позиционированный блок поверх карты сверху-слева, max-width 640px.
3. `app/page.tsx`: композит Header + CityMap (100vh) + HeroOverlay поверх.
4. Проверить на mobile (карта на 100vh, hero сжимается).

### Фаза 6 — Venue page
**Время:** ~5 часов

1. `app/venue/[slug]/page.tsx`: SSG через `generateStaticParams` по slug'ам.
2. `VenueCover.tsx`: полноэкранная (60vh) фотография с тёмным градиентом снизу, поверх — kicker, h1, address, blurb.
3. `StoryCard.tsx`:
   - Три состояния: `free` / `locked` / `unlocked` (определяется из `localStorage` через хук `useUnlock`).
   - Иконка слева (Lucide play / lock / play), название (serif), длительность mm:ss (mono).
   - Click:
     - `free` или `unlocked` → expand inline player.
     - `locked` → открыть `PaywallModal`.
4. `AudioPlayer.tsx`:
   - Singleton через Zustand или React Context: при play на одной карточке предыдущий плеер ставится на pause.
   - Прогресс-бар, текущее/общее время (mono), кнопки play/pause, speed cycle 1× → 1.25× → 1.5×.
   - На mobile — sticky bar внизу при скролле.
5. Секция «Рядом»: 3 `NearbyMiniCard` (тип, название, расстояние), сортировка по haversine.

### Фаза 7 — Paywall и разблок
**Время:** ~2 часа

1. `PaywallModal.tsx`:
   - Portal в `body`.
   - Backdrop с blur, fade-scale анимация (CSS transitions).
   - Структура: H3 (название истории) → длительность → big «100 ₽» → fake card-number input → fake expiry+cvc row → кнопка «ОПЛАТИТЬ 100 ₽» → дисклеймер мелко.
   - Sequence: click → spinner 1.5s → green check 500ms → закрыть → `unlock(storyId)` → auto-play.
2. `src/lib/unlock.ts`:
   ```ts
   export const isUnlocked = (storyId: string) => localStorage.getItem(`unlocked:${storyId}`) === 'true'
   export const unlock = (storyId: string) => localStorage.setItem(`unlocked:${storyId}`, 'true')
   export const useUnlock = (storyId: string) => { /* hook with state + localStorage subscribe */ }
   ```
3. Тест: «оплатить» → перезагрузить страницу → история всё ещё разблокирована.

### Фаза 8 — Полировка
**Время:** ~3 часа

- Анимации (200ms ease-out на всём, hover-states, marker glow pulse).
- Responsive: проверить iPhone SE, iPhone 14 Pro, iPad, desktop 1440.
- Lighthouse: цель mobile > 90.
- Favicons, og:image, meta-теги, заголовок.
- Audio preload strategy (`metadata` only, чтобы не качать все mp3 сразу).
- Обработка ошибок плеера (audio failed to load → graceful).
- Aria-labels на иконочные кнопки.

### Фаза 9 — Деплой
**Время:** ~30 мин

1. `git init`, первый коммит, push в GitHub (новый репо `baiki-i-shoty`).
2. Vercel: импорт репозитория, deploy, домен `baiki-i-shoty.vercel.app` (или кастомный позже).
3. Проверить вживую с iPhone.
4. Поделиться ссылкой.

---

## Roadmap после прототипа

| Что | Когда | Почему |
|---|---|---|
| Внутренний QR-инструмент | После прототипа | Генератор QR-PNG на `/venue/<slug>?from=qr&utm=...` для печати |
| Миграция данных в Supabase | При 10+ заведениях | JSON-схема уже под Postgres, миграция механическая |
| Реальная оплата (ЮKassa / СБП) | После валидации спроса | Нужно ИП/самозанятый + договор с заведениями (revenue share) |
| Аналитика (Yandex Metrika + custom events) | До запуска платной части | Что слушают, до какого момента, конверсия в оплату |
| Антифрод | После первых платежей | Сейчас разблок в localStorage чистится — для прода нужна серверная привязка |
| Telegram-бот вместо/в дополнение к веб | Если узнаем что СПб-аудитория сидит в TG | Mini App с тем же контентом |
| Локализация EN | После валидации в RU | Питер — туристический город |

---

## Estimate

Чистого времени на прототип (фазы 1-9): **~20-25 часов**. Плюс Фаза 0 (контент) — отдельный трек, ~10-15 часов на написание текстов + сбор фото.

Реалистично за **1 рабочую неделю** в одиночку.

---

## Verification

- `npm run dev` → лендинг показывает тёмную карту с 4 янтарными пинами, hero-оверлей сверху-слева
- Клик пин → переход на venue page, кинематографичная шапка с фото и serif H1
- Free-история разворачивается в плеер, mp3 играет
- Locked-история → PaywallModal с фейк-оплатой → спиннер → разблок → auto-play
- Reload страницы → unlocked-состояние сохранилось в localStorage
- Клик «Рядом» → переход на соседнее заведение, плеер не сбрасывается (если ещё играет)
- Lighthouse mobile > 90
- На Vercel-домене всё работает с iPhone в браузере

---

## Что нужно от пользователя перед стартом

1. Тексты 16 историй (или решение «пиши сам в духе Атлас Обскура»)
2. `OPENAI_API_KEY` для TTS (или ключ Yandex SpeechKit)
3. Vercel account (можно через GitHub-логин)
4. GitHub account (если ещё нет публичного — приватный репо)
