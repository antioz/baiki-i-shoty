// Venues and stories — synced from data/stories.json

window.VENUES = [
  {
    slug: "terminal-bar",
    type: "БАР",
    name: "Терминал Бар",
    address: "Рубинштейна, 25",
    addressShort: "РУБИНШТЕЙНА, 25",
    lat: 59.9272,
    lng: 30.347,
    blurb: "Бар на самой барной улице страны. Двадцать пять метров от Достоевского до похмелья.",
    cover: "linear-gradient(135deg, #2a1f15 0%, #1a1410 60%, #0a0a0a 100%)",
    coverAccent: "#3b2818",
    stories: [
      { id: "tb-1", title: "Магнит-кнопка вместо двери", duration: "02:00", free: true,
        intro: "Март две тысячи десятого, Рубинштейна ещё пустая, по тротуару ходит редкая собака и редкая мысль." },
      { id: "tb-2", title: "Стойка пятнадцать метров и принцип без столов", duration: "02:00", free: false,
        intro: "Стойка была длиной в пятнадцать метров, и эта длина была не от хорошей жизни, а от того, что помещение оказалось узким и кишкообразным, как сама судьба питерского арендатора." },
      { id: "tb-3", title: "Довлатов в соседнем подъезде и квартира за двести миллионов", duration: "02:00", free: false,
        intro: "Дом двадцать три на Рубинштейна стоит вплотную к двадцать пятому, между ними одна стена, и эта стена помнит больше, чем любая голова в этом городе." },
      { id: "tb-4", title: "Закрытие как демонстрация", duration: "02:00", free: false,
        intro: "Арендодатель пришёл и сказал короткую фразу из трёх слов: съехать через неделю." },
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
    blurb: "Маленький бар на улице, где жил Распутин и творил Достоевский. Дворовый Питер в одной двери.",
    cover: "linear-gradient(135deg, #1f1a22 0%, #15131a 60%, #0a0a0a 100%)",
    coverAccent: "#2a1f30",
    stories: [
      { id: "ts-1", title: "Коктейль Довлатов и адрес писателя", duration: "02:00", free: true,
        intro: "Коктейль называется Довлатов, и в нём ничего экстраординарного." },
      { id: "ts-2", title: "Шот Нефть и страна, в которой его пьют", duration: "02:00", free: false,
        intro: "В меню Цветочков есть шот, который называется Нефть." },
      { id: "ts-3", title: "Распутин в трёх кварталах", duration: "02:00", free: false,
        intro: "В пяти минутах ходьбы от Цветочков стоит дом шестьдесят четыре по Гороховой." },
      { id: "ts-4", title: "Словолитня Лемана и буквы империи", duration: "02:00", free: false,
        intro: "Осип Иванович Леман открыл свою словолитню в тысяча восемьсот пятьдесят четвёртом году." },
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
    blurb: "Сто пятьдесят лет роскоши и шпионских историй. Здесь умер Чайковский и пил Кокто.",
    cover: "linear-gradient(135deg, #221a14 0%, #181410 60%, #0a0a0a 100%)",
    coverAccent: "#332518",
    stories: [
      { id: "ge-1", title: "Электричество раньше, чем у царя", duration: "02:00", free: true,
        intro: "Двадцать восьмого января тысяча восемьсот семьдесят пятого года в ресторане Гранд Отеля Европа зажглись электрические лампы." },
      { id: "ge-2", title: "Медовый месяц Чайковского и его последний обед", duration: "02:00", free: false,
        intro: "В июле тысяча восемьсот семьдесят седьмого Пётр Ильич Чайковский привёз в Гранд Отель Европа Антонину Милюкову, свою свежую жену." },
      { id: "ge-3", title: "Блокадный госпиталь номер девятьсот девяносто один", duration: "02:00", free: false,
        intro: "Сентябрь сорок первого." },
      { id: "ge-4", title: "Жучки в люстрах и Элтон Джон под наблюдением", duration: "02:00", free: false,
        intro: "Семидесятые, восьмидесятые." },
    ]
  },
  {
    slug: "palkin",
    type: "РЕСТОРАН",
    name: "Палкинъ",
    address: "Невский, 47",
    addressShort: "НЕВСКИЙ, 47",
    lat: 59.9335,
    lng: 30.3441,
    blurb: "Работает с 1785 года. Здесь ужинал Достоевский и обсуждал водку Менделеев.",
    cover: "linear-gradient(135deg, #1a1612 0%, #14110d 60%, #0a0a0a 100%)",
    coverAccent: "#2d2418",
    stories: [
      { id: "pl-1", title: "Бассейн со стерлядью и котлета по-палкински", duration: "02:00", free: true,
        intro: "В главном зале Палкина стоял бассейн." },
      { id: "pl-2", title: "Достоевский этажом ниже правит Бесов", duration: "02:00", free: false,
        intro: "В тысяча восемьсот семьдесят втором в этом же доме, со стороны Владимирского, открылась типография купца Траншеля." },
      { id: "pl-3", title: "Учёные обеды Менделеева и враги за одним столом", duration: "02:00", free: false,
        intro: "Дмитрий Иванович Менделеев был человеком крупным, бородатым и пьющим." },
      { id: "pl-4", title: "От Палкина к тюрьме и кинотеатру Титан", duration: "02:00", free: false,
        intro: "В семнадцатом году в Палкин зашёл последний посетитель." },
    ]
  },
];

window.getVenue = (slug) => window.VENUES.find(v => v.slug === slug);
window.distanceMeters = (a, b) => {
  const R = 6371000, toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const x = Math.sin(dLat/2)**2 + Math.sin(dLng/2)**2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * R * Math.asin(Math.sqrt(x)));
};
window.getNearby = (venue, count = 3) => window.VENUES
  .filter(v => v.slug !== venue.slug)
  .map(v => ({ venue: v, dist: window.distanceMeters(venue, v) }))
  .sort((a, b) => a.dist - b.dist).slice(0, count);
window.formatDistance = (m) => m < 1000 ? `${m} М` : `${(m/1000).toFixed(1).replace('.', ',')} КМ`;
window.isUnlocked = (storyId) => { try { return localStorage.getItem('unlocked:' + storyId) === 'true'; } catch { return false; } };
window.markUnlocked = (storyId) => { try { localStorage.setItem('unlocked:' + storyId, 'true'); } catch {} };
window.durationSeconds = (mmss) => { const [m, s] = mmss.split(':').map(Number); return m * 60 + s; };
window.formatTime = (sec) => `${Math.floor(sec/60).toString().padStart(2,'0')}:${Math.floor(sec%60).toString().padStart(2,'0')}`;
