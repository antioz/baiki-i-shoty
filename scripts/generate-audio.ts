/**
 * TTS-генератор аудио-историй.
 *
 * Использование:
 *   1. Заполни data/stories.json — поле `text` для каждой истории
 *   2. Положи ключ в .env.local:
 *        OPENAI_API_KEY=sk-...
 *      или для Yandex SpeechKit:
 *        YANDEX_API_KEY=...
 *        YANDEX_FOLDER_ID=...
 *   3. Запусти: `npx tsx scripts/generate-audio.ts`
 *
 * Идемпотентность: пропускает истории, у которых mp3 уже есть И text не менялся
 * (хэш текста сохраняется в .tts-cache.json).
 *
 * Провайдер выбирается через переменную TTS_PROVIDER ('openai' | 'yandex'),
 * по умолчанию openai (если есть OPENAI_API_KEY) либо yandex.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const STORIES_PATH = join(ROOT, 'data', 'stories.json');
const AUDIO_DIR = join(ROOT, 'public', 'audio');
const CACHE_PATH = join(ROOT, 'scripts', '.tts-cache.json');

type Story = {
  id: string;
  venue_id: string;
  title: string;
  duration_sec: number;
  audio_url: string;
  is_free: boolean;
  price_rub: number;
  text: string;
};

type StoriesFile = { stories: Story[] };
type Cache = Record<string, { text_hash: string; duration_sec: number }>;

function loadEnv() {
  const envPath = join(ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function pickProvider(): 'openai' | 'yandex' {
  const explicit = process.env.TTS_PROVIDER;
  if (explicit === 'openai' || explicit === 'yandex') return explicit;
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.YANDEX_API_KEY) return 'yandex';
  throw new Error('No TTS provider configured. Set OPENAI_API_KEY or YANDEX_API_KEY in .env.local');
}

async function ttsOpenAI(text: string): Promise<Buffer> {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      voice: 'onyx',
      input: text,
      response_format: 'mp3',
      speed: 1.0,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI TTS failed: ${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function ttsYandex(text: string): Promise<Buffer> {
  const params = new URLSearchParams({
    text,
    lang: 'ru-RU',
    voice: 'ermil',
    emotion: 'neutral',
    speed: '1.0',
    format: 'mp3',
    folderId: process.env.YANDEX_FOLDER_ID ?? '',
  });
  const res = await fetch('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', {
    method: 'POST',
    headers: {
      Authorization: `Api-Key ${process.env.YANDEX_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  if (!res.ok) throw new Error(`Yandex TTS failed: ${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

function estimateDurationSec(text: string): number {
  // ~150 слов в минуту русской речи в среднем темпе
  const words = text.trim().split(/\s+/).length;
  return Math.round((words / 150) * 60);
}

async function main() {
  loadEnv();
  const provider = pickProvider();
  console.log(`[tts] provider: ${provider}`);

  if (!existsSync(AUDIO_DIR)) mkdirSync(AUDIO_DIR, { recursive: true });

  const stories: StoriesFile = JSON.parse(readFileSync(STORIES_PATH, 'utf-8'));
  const cache: Cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, 'utf-8')) : {};

  let processed = 0;
  let skipped = 0;

  for (const story of stories.stories) {
    if (!story.text || story.text.trim().length === 0) {
      console.log(`[tts] skip ${story.id}: empty text`);
      continue;
    }

    const hash = createHash('sha256').update(story.text).digest('hex').slice(0, 16);
    const mp3Path = join(AUDIO_DIR, `${story.id}.mp3`);

    if (existsSync(mp3Path) && cache[story.id]?.text_hash === hash) {
      story.duration_sec = cache[story.id].duration_sec;
      skipped++;
      continue;
    }

    console.log(`[tts] generating ${story.id}...`);
    const audio = provider === 'openai' ? await ttsOpenAI(story.text) : await ttsYandex(story.text);
    writeFileSync(mp3Path, audio);

    const duration = estimateDurationSec(story.text);
    story.duration_sec = duration;
    cache[story.id] = { text_hash: hash, duration_sec: duration };
    processed++;
  }

  writeFileSync(STORIES_PATH, JSON.stringify(stories, null, 2) + '\n');
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');

  console.log(`[tts] done. generated: ${processed}, skipped: ${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
