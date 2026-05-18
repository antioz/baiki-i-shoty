// Venues and stories for Байки и шоты
// 4 venues × 4 stories = 16 total. 1 free per venue, 3 paid.

window.VENUES = [
  {
    slug: "terminal-bar",
    type: "БАР",
    name: "Терминал Бар",
    address: "Рубинштейна, 25",
    addressShort: "РУБИНШТЕЙНА, 25",
    lat: 59.9272,
    lng: 30.3470,
    blurb: "Угловой дом на самой шумной улице города. В разное время здесь жили купцы первой гильдии, революционеры с фальшивыми паспортами и писатель, чей памятник теперь стоит за углом.",
    cover: "linear-gradient(135deg, #2a1f15 0%, #1a1410 60%, #0a0a0a 100%)",
    coverAccent: "#3b2818",
    stories: [
      { id: "tb-1", title: "Улица, где никто не живёт", duration: "04:12", free: true,
        intro: "Как Рубинштейна за двадцать лет превратилась из тихого жилого переулка в самую плотную ресторанную милю Европы — и куда делись её жильцы." },
      { id: "tb-2", title: "Довлатов и дом напротив", duration: "06:48", free: false,
        intro: "Дом 23 по Рубинштейна, коммуналка, пишущая машинка и редакция, в которую он так и не попал." },
      { id: "tb-3", title: "Сайгон: кофе за 12 копеек", duration: "05:30", free: false,
        intro: "Угол Невского и Владимирского, кафетерий «Сайгон» — где Бродский, Гребенщиков и Цой пили двойной маленький за прилавком." },
      { id: "tb-4", title: "Доходный дом купца Зайцева", duration: "07:15", free: false,
        intro: "Кто строил эти стены в 1879-м, какие квартиры сдавал внаём и почему в 1907-м здесь искали бомбистов." }
    ]
  },
  {
    slug: "tsvetochki",
    type: "БАР",
    name: "Цветочки",
    address: "Гороховая, 49",
    addressShort: "ГОРОХОВАЯ, 49",
    lat: 59.9248,
    lng: 30.3211,
    blurb: "Гороховая — третий луч от Адмиралтейства. Улица ювелиров, аптекарей и одного старца, чья квартира до сих пор отмечена на туристических картах.",
    cover: "linear-gradient(135deg, #1f1a22 0%, #15131a 60%, #0a0a0a 100%)",
    coverAccent: "#2a1f30",
    stories: [
      { id: "ts-1", title: "Гороховая до Распутина", duration: "05:04", free: true,
        intro: "Лучевая улица, проложенная по линейке Петра. Купцы, ювелиры, первая в городе аптека Пеля — и почему «горохом» здесь и не пахло." },
      { id: "ts-2", title: "Квартира 20 на Гороховой 64", duration: "08:22", free: false,
        intro: "Адрес, который старушки на улице до сих пор показывают шёпотом. Распутин, его дочери, и ночь с 16 на 17 декабря." },
      { id: "ts-3", title: "Дом 2: ВЧК", duration: "06:58", free: false,
        intro: "Бывшая гостиница, потом штаб-квартира Дзержинского. Что происходило в подвалах в 1918–1921 и кого здесь допрашивали." },
      { id: "ts-4", title: "Аптекарь Пель и его башня", duration: "05:40", free: false,
        intro: "Семь поколений аптекарей, грифоны во дворе, секрет числа в каменной кладке — и легенда, в которую верят и сейчас." }
    ]
  },
  {
    slug: "grand-europa",
    type: "ОТЕЛЬ",
    name: "Гранд Отель Европа",
    address: "Михайловская, 1/7",
    addressShort: "МИХАЙЛОВСКАЯ, 1/7",
    lat: 59.9358,
    lng: 30.3293,
    blurb: "Перестроенный Карлом Росси и достроенный фон Гогеном. За полтора века здесь останавливались Чайковский, Тургенев, Стравинский, Кларк Гейбл и Пол Маккартни.",
    cover: "linear-gradient(135deg, #221a14 0%, #181410 60%, #0a0a0a 100%)",
    coverAccent: "#332518",
    stories: [
      { id: "ge-1", title: "Медовый месяц Чайковского", duration: "06:12", free: true,
        intro: "Июль 1877 года, номер на третьем этаже, неудачная женитьба — и побег в Швейцарию через десять дней." },
      { id: "ge-2", title: "Маккартни так и не приехал", duration: "07:33", free: false,
        intro: "1968-й, бронь на имя «Mr. James», отменённая в последний момент. Кто пытался привезти Beatles в Ленинград и почему всё сорвалось." },
      { id: "ge-3", title: "Крыша «Европейской»", duration: "05:48", free: false,
        intro: "Ресторан под стеклянной крышей. Бродский за столиком у окна, Довлатов за соседним, Хиль в кабинете напротив." },
      { id: "ge-4", title: "Росси и площадь Искусств", duration: "08:04", free: false,
        intro: "Как один человек спроектировал целый ансамбль — Михайловский дворец, площадь, улицу — и почему отель оказался последним кирпичом этого пазла." }
    ]
  },
  {
    slug: "palkin",
    type: "РЕСТОРАН",
    name: "Палкинъ",
    address: "Невский, 47",
    addressShort: "НЕВСКИЙ ПР., 47",
    lat: 59.9335,
    lng: 30.3441,
    blurb: "Старейший ресторан города. Открыт ярославским крестьянином Палкиным в 1785-м, закрыт большевиками в 1925-м, найден заново в 1990-х — с нетронутыми фресками в подвалах.",
    cover: "linear-gradient(135deg, #1a1612 0%, #14110d 60%, #0a0a0a 100%)",
    coverAccent: "#2d2418",
    stories: [
      { id: "pl-1", title: "Анисим Палкин из Ярославля", duration: "04:55", free: true,
        intro: "Как крестьянин из-под Углича открыл трактир, который пережил пять царей, две революции и восемьдесят лет советской власти." },
      { id: "pl-2", title: "Достоевский за угловым столом", duration: "07:20", free: false,
        intro: "«Идиот», глава одиннадцатая. Описание ресторана с балкона над Невским — и почему биографы спорят, ужинал ли здесь сам автор." },
      { id: "pl-3", title: "Фрески 1874 года", duration: "06:30", free: false,
        intro: "Подвал, заложенный кирпичом в 1925-м и вскрытый в 1995-м. Что нашли реставраторы под слоями побелки." },
      { id: "pl-4", title: "Декрет о закрытии трактиров", duration: "05:50", free: false,
        intro: "1925-й, последний ужин. Кто был за столами, что подавали и куда уехал последний из Палкиных." }
    ]
  }
];

// Helpers
window.getVenue = (slug) => window.VENUES.find(v => v.slug === slug);

// Haversine distance in meters for "nearby"
window.distanceMeters = (a, b) => {
  const R = 6371000;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat/2)**2 + Math.sin(dLng/2)**2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * R * Math.asin(Math.sqrt(x)));
};

window.getNearby = (venue, count = 3) => {
  return window.VENUES
    .filter(v => v.slug !== venue.slug)
    .map(v => ({ venue: v, dist: window.distanceMeters(venue, v) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count);
};

// Format meters → "850 М" or "1.2 КМ"
window.formatDistance = (m) => {
  if (m < 1000) return `${m} М`;
  return `${(m/1000).toFixed(1).replace('.', ',')} КМ`;
};

// localStorage unlock state
window.isUnlocked = (storyId) => {
  try { return localStorage.getItem('unlocked:' + storyId) === 'true'; }
  catch { return false; }
};
window.markUnlocked = (storyId) => {
  try { localStorage.setItem('unlocked:' + storyId, 'true'); } catch {}
};

// Convert mm:ss to seconds
window.durationSeconds = (mmss) => {
  const [m, s] = mmss.split(':').map(Number);
  return m * 60 + s;
};
window.formatTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
};
