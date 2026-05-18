// v2 components — Helvetica, light editorial, mid-2000s
// Wrapped in IIFE to avoid colliding with v1 globals.

(() => {
const { useState, useEffect, useRef, useCallback } = React;

// ─── Icons ─────────────────────────────────────────────────────────
const Icon = ({ children, size = 20, stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="square" strokeLinejoin="miter">{children}</svg>
);
const Play = (p) => <Icon {...p}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" /></Icon>;
const Pause = (p) => <Icon {...p}><rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/></Icon>;
const Lock = (p) => <Icon {...p}><rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Icon>;
const Check = (p) => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>;
const ArrowR = (p) => <Icon {...p}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></Icon>;
const ArrowL = (p) => <Icon {...p}><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10 6 4 12 10 18"/></Icon>;
const X = (p) => <Icon {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></Icon>;

// ─── Header ────────────────────────────────────────────────────────
const Header = ({ onNavigate }) => (
  <header className="v2-header">
    <div className="v2-header__inner">
      <button className="v2-logo" onClick={() => onNavigate({ route: 'landing' })} aria-label="На главную">
      </button>
      <div className="v2-stamp">
        Saint Petersburg <span className="v2-stamp__dot" /> 59.9335° N
      </div>
      <nav className="v2-nav">
        <button className="v2-nav__link" onClick={() => onNavigate({ route: 'about' })}>О проекте</button>
        <button className="v2-nav__link" onClick={() => onNavigate({ route: 'landing' })}>Карта</button>
      </nav>
    </div>
  </header>
);

// ─── Map (Positron light) ──────────────────────────────────────────
const CityMap = ({ venues, onMarkerClick }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [59.9320, 30.3340],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 19,
    }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 19,
    }).addTo(map);
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('© CARTO · © OpenStreetMap').addTo(map);
    mapRef.current = map;

    venues.forEach((v, i) => {
      const icon = L.divIcon({
        className: 'v2-marker-icon',
        html: `<div class="v2-marker">
                 <div class="v2-marker__pin">${i + 1}</div>
                 <div class="v2-marker__label">
                   <span class="v2-marker__label-name">${v.name}</span>
                   <span class="v2-marker__label-meta">${v.stories.length} ИСТОРИЙ · ${v.addressShort}</span>
                 </div>
               </div>`,
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      L.marker([v.lat, v.lng], { icon }).on('click', () => onMarkerClick(v)).addTo(map);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const h = () => mapRef.current && mapRef.current.invalidateSize();
    window.addEventListener('resize', h);
    setTimeout(h, 60);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <>
      <div ref={containerRef} className="v2-map" />
      <div className="v2-map__overlay">
        <span className="v2-map__overlay-dot" />
        <span>Центр · 4 места</span>
      </div>
    </>
  );
};

// ─── Audio Player ──────────────────────────────────────────────────
const AudioPlayer = ({ story, venueName }) => {
  const audioRef = useRef(null);
  const [pos, setPos] = useState(0);
  const [total, setTotal] = useState(window.durationSeconds(story.duration));
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onMeta = () => setTotal(a.duration || total);
    const onTime = () => setPos(a.currentTime);
    const onEnded = () => setPlaying(false);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnded);
    a.playbackRate = speed;
    a.play().catch(() => setPlaying(false));
    return () => {
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnded);
      a.pause();
    };
  }, [story.id]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const newPos = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * total;
    if (audioRef.current) audioRef.current.currentTime = newPos;
    setPos(newPos);
  };
  const cycleSpeed = () => setSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1);

  return (
    <div className="v2-player">
      <audio ref={audioRef} src={story.audio} preload="metadata" />
      <div className="v2-player__head">
        <span><span className="v2-player__head-dot" /> {playing ? 'ВОСПРОИЗВЕДЕНИЕ' : 'ПАУЗА'} · {venueName}</span>
        <span>TRK 01 / DEMO</span>
      </div>
      <div className="v2-player__body">
        <button className="v2-player__play" onClick={() => setPlaying(p => !p)} aria-label="play/pause">
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div className="v2-player__progress" onClick={seek}>
          <div className="v2-player__progress-fill" style={{ width: `${total ? (pos/total)*100 : 0}%` }} />
        </div>
        <div className="v2-player__time">
          <span>{window.formatTime(pos)}</span>
          <span className="v2-player__time-sep">/</span>
          <span className="v2-player__time-total">{window.formatTime(total)}</span>
        </div>
        <button className="v2-player__speed" onClick={cycleSpeed}>{speed}×</button>
      </div>
    </div>
  );
};

// ─── Story Row ─────────────────────────────────────────────────────
const StoryRow = ({ story, index, expanded, onToggle, onLockClick, unlocked, venueName }) => {
  const accessible = story.free || unlocked;
  let tagClass = 'v2-story__tag--free';
  let tagText = 'Бесплатно';
  if (!story.free) {
    if (unlocked) { tagClass = 'v2-story__tag--owned'; tagText = 'Куплено'; }
    else { tagClass = 'v2-story__tag--paid'; tagText = '100 ₽'; }
  }
  return (
    <div className={`v2-story ${expanded ? 'v2-story--expanded' : ''} ${!accessible ? 'v2-story--locked' : ''}`}>
      <button className="v2-story__row" onClick={() => accessible ? onToggle(story.id) : onLockClick(story)}>
        <div className="v2-story__num">№ {String(index + 1).padStart(2, '0')}</div>
        <div className="v2-story__body">
          <div className="v2-story__title">{story.title}</div>
          <div className="v2-story__intro">{story.intro}</div>
        </div>
        <div className="v2-story__dur">{story.duration}</div>
        <div className={`v2-story__tag ${tagClass}`}>{tagText}</div>
        <div className="v2-story__btn">
          {accessible ? (expanded ? <Pause size={14} /> : <Play size={14} />) : <Lock size={14} />}
        </div>
      </button>
      {expanded && accessible && (
        <div className="v2-story__player-wrap">
          <AudioPlayer story={story} venueName={venueName} />
        </div>
      )}
    </div>
  );
};

// ─── Paywall Modal ─────────────────────────────────────────────────
const Paywall = ({ story, onClose, onSuccess }) => {
  const [stage, setStage] = useState('idle');
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState('4242 4242 ');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const fmtCard = s => s.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g, '$1 ');
  const fmtExp = s => { const d = s.replace(/\D/g,'').slice(0,4); return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };

  const finalize = (delay) => {
    setStage('processing');
    setTimeout(() => {
      setStage('success');
      setTimeout(() => { window.markUnlocked(story.id); onSuccess(story); }, 700);
    }, delay);
  };
  const submit = (e) => { e.preventDefault(); if (stage !== 'idle') return; finalize(1500); };
  const paySbp = () => { if (stage !== 'idle') return; finalize(900); };

  const tabStyle = (active) => ({
    flex: 1, padding: '10px 12px', cursor: stage==='idle'?'pointer':'default',
    background: active ? '#d4a574' : 'transparent',
    color: active ? '#0a0a0a' : '#f5f1ea',
    border: `1px solid ${active ? '#d4a574' : '#2a2a2a'}`,
    borderRadius: 4, fontFamily: 'inherit', fontSize: 12,
    letterSpacing: '0.08em', fontWeight: 500, textTransform: 'uppercase',
    transition: 'all 150ms ease-out',
  });

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && stage === 'idle' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [stage, onClose]);

  const can = card.replace(/\s/g,'').length >= 12 && expiry.length >= 4 && cvc.length >= 3;

  return (
    <div className="v2-backdrop" onClick={() => stage === 'idle' && onClose()}>
      <div className="v2-modal" onClick={e => e.stopPropagation()}>
        <div className="v2-modal__head">
          <span className="v2-modal__head-left"><span className="v2-modal__head-dot" /> ОПЛАТА · ДЕМО</span>
          <button className="v2-modal__close" onClick={onClose} aria-label="Закрыть"><X size={14} stroke={2} /></button>
        </div>
        <div className="v2-modal__body">
          <div className="v2-modal__kicker">ИСТОРИЯ · {story.duration} · АУДИО</div>
          <h3 className="v2-modal__title">{story.title}</h3>

          <div className="v2-modal__price">
            <span className="v2-modal__price-amount">100</span>
            <span className="v2-modal__price-cur">₽</span>
            <span className="v2-modal__price-meta">ОДНОРАЗОВО<br/>БЕЗ ПОДПИСКИ</span>
          </div>

          {/* Stripe-style payment method picker */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => stage==='idle' && setMethod('card')}
              disabled={stage!=='idle'}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between', gap:8,
                padding:'14px 14px', cursor: stage==='idle'?'pointer':'default',
                background: method==='card' ? '#1a1410' : '#0f0f0f',
                border: `1.5px solid ${method==='card' ? '#d4a574' : '#2a2a2a'}`,
                borderRadius: 6, transition:'all 150ms ease-out', textAlign:'left',
                fontFamily:'inherit', color:'#f5f1ea',
              }}>
              <span style={{ fontSize:13, fontWeight:500, letterSpacing:'0.04em' }}>Карта</span>
              <span style={{ display:'flex', gap:4, alignItems:'center' }}>
                <span style={{ fontSize:9, fontWeight:700, background:'#1a1f71', color:'#fff', padding:'3px 6px', borderRadius:3, letterSpacing:'0.02em' }}>VISA</span>
                <span style={{ display:'inline-flex', gap:0 }}>
                  <span style={{ width:14, height:14, borderRadius:'50%', background:'#eb001b', display:'inline-block' }} />
                  <span style={{ width:14, height:14, borderRadius:'50%', background:'#f79e1b', display:'inline-block', marginLeft:-5, mixBlendMode:'screen' }} />
                </span>
                <span style={{ fontSize:9, fontWeight:700, background:'#0f754e', color:'#fff', padding:'3px 6px', borderRadius:3, letterSpacing:'0.02em' }}>МИР</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => { if (stage==='idle') { setMethod('sbp'); paySbp(); } }}
              disabled={stage!=='idle'}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between', gap:8,
                padding:'14px 14px', cursor: stage==='idle'?'pointer':'default',
                background: method==='sbp' ? '#1a1410' : '#0f0f0f',
                border: `1.5px solid ${method==='sbp' ? '#d4a574' : '#2a2a2a'}`,
                borderRadius: 6, transition:'all 150ms ease-out', textAlign:'left',
                fontFamily:'inherit', color:'#f5f1ea',
              }}>
              <span style={{ fontSize:13, fontWeight:500, letterSpacing:'0.04em' }}>СБП</span>
              <span style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                width:38, height:22, borderRadius:4,
                background:'linear-gradient(135deg, #5b2d90 0%, #e9358f 60%, #ffd14d 100%)',
                fontSize:9, fontWeight:700, color:'#fff', letterSpacing:'0.04em',
              }}>СБП</span>
            </button>
          </div>

          {method === 'card' && (
            <form className="v2-form" onSubmit={submit}>
              <label className="v2-field">
                <span className="v2-field__label">НОМЕР КАРТЫ</span>
                <input className="v2-field__input" inputMode="numeric" placeholder="0000 0000 0000 0000"
                  value={card} onChange={e => setCard(fmtCard(e.target.value))} disabled={stage !== 'idle'} />
              </label>
              <div className="v2-field-row">
                <label className="v2-field">
                  <span className="v2-field__label">СРОК</span>
                  <input className="v2-field__input" inputMode="numeric" placeholder="ММ/ГГ"
                    value={expiry} onChange={e => setExpiry(fmtExp(e.target.value))} disabled={stage !== 'idle'} />
                </label>
                <label className="v2-field">
                  <span className="v2-field__label">CVC</span>
                  <input className="v2-field__input" inputMode="numeric" placeholder="•••"
                    value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,3))} disabled={stage !== 'idle'} />
                </label>
              </div>
              <button type="submit" className={`v2-cta v2-cta--${stage}`} disabled={!can || stage !== 'idle'}>
                {stage === 'idle' && <span>ОПЛАТИТЬ 100 ₽</span>}
                {stage === 'processing' && <span className="v2-spinner" />}
                {stage === 'success' && <Check size={18} stroke={2.5} />}
              </button>
              <div className="v2-disclaimer">Это демо. Реальная оплата не списывается.</div>
            </form>
          )}

          {method === 'sbp' && (
            <div className="v2-form">
              <button type="button" className={`v2-cta v2-cta--${stage}`} disabled>
                {stage === 'processing' && <span className="v2-spinner" />}
                {stage === 'success' && <Check size={18} stroke={2.5} />}
                {stage === 'idle' && <span>ОТКРЫВАЕМ СБП…</span>}
              </button>
              <div className="v2-disclaimer">Это демо. Реальная оплата не списывается.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AboutModal = ({ onClose }) => {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="v2-backdrop" onClick={onClose}>
      <div className="v2-modal v2-modal--about" onClick={e => e.stopPropagation()}>
        <div className="v2-modal__head">
          <span className="v2-modal__head-left"><span className="v2-modal__head-dot" /> О ПРОЕКТЕ</span>
          <button className="v2-modal__close" onClick={onClose} aria-label="Закрыть"><X size={14} stroke={2} /></button>
        </div>
        <div className="v2-modal__body">
          <div className="v2-modal__kicker">SPB · 2006-style · demo</div>
          <h3 className="v2-modal__title">Байки и Шоты</h3>
          <p className="v2-about__p" style={{marginTop: 12}}>
            Аудио-истории о четырёх местах в центре Петербурга: барах, отеле и ресторане.
            В каждом заведении над стойкой висит QR-код — он ведёт сюда.
          </p>
          <p className="v2-about__p">
            Первая история в каждом месте бесплатная, остальные по 100 ₽.
            Слушать можно где угодно, но лучше всего — не вставая из-за стола.
          </p>
          <div className="v2-about__grid">
            <div className="v2-about__cell"><div className="v2-about__cell-key">ИСТОРИЙ</div><div className="v2-about__cell-val">16</div></div>
            <div className="v2-about__cell"><div className="v2-about__cell-key">МЕСТ</div><div className="v2-about__cell-val">4</div></div>
            <div className="v2-about__cell"><div className="v2-about__cell-key">ВРЕМЯ</div><div className="v2-about__cell-val">~98 мин</div></div>
            <div className="v2-about__cell"><div className="v2-about__cell-key">СТАТУС</div><div className="v2-about__cell-val">демо</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export for next file
window.__v2 = { useState, useEffect, useRef, useCallback, Header, CityMap, StoryRow, Paywall, AboutModal, ArrowR, ArrowL };
})();
