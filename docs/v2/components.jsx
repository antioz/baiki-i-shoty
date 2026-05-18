// Shared components: Icons, Header, StoryCard, AudioPlayer, PaywallModal, NearbyMiniCard, CityMap
const { useState, useEffect, useRef, useCallback } = React;

// ────────────────────────────────────────────────────────────────────
// Icons — Lucide-style, 1.5px stroke
// ────────────────────────────────────────────────────────────────────
const Icon = ({ children, size = 20, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>{children}</svg>
);
const IconPlay = (p) => <Icon {...p}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" /></Icon>;
const IconPause = (p) => <Icon {...p}><rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/></Icon>;
const IconLock = (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="1.5" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>;
const IconCheck = (p) => <Icon {...p}><polyline points="20 6 9 17 4 12" /></Icon>;
const IconArrowRight = (p) => <Icon {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></Icon>;
const IconArrowLeft = (p) => <Icon {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 6 5 12 11 18"/></Icon>;
const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></Icon>;
const IconMapPin = (p) => <Icon {...p}><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></Icon>;
const IconClose = (p) => <Icon {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></Icon>;
const IconQr = (p) => <Icon {...p}><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><line x1="14" y1="14" x2="14" y2="17"/><line x1="17" y1="14" x2="17" y2="20"/><line x1="20" y1="14" x2="20" y2="17"/><line x1="14" y1="20" x2="20" y2="20"/></Icon>;

// ────────────────────────────────────────────────────────────────────
// Header — fixed, transparent
// ────────────────────────────────────────────────────────────────────
const Header = ({ transparent = true, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const showBg = !transparent || scrolled;
  return (
    <header className={`bs-header ${showBg ? 'bs-header--solid' : ''}`}>
      <div className="bs-header__inner">
        <button className="bs-logo" onClick={() => onNavigate({ route: 'landing' })} aria-label="На главную" />
        <nav className="bs-nav">
          <button className="bs-nav__link" onClick={() => onNavigate({ route: 'about' })}>О проекте</button>
        </nav>
      </div>
    </header>
  );
};

// ────────────────────────────────────────────────────────────────────
// CityMap — Leaflet wrapper. Stadia Alidade Smooth Dark.
// ────────────────────────────────────────────────────────────────────
const CityMap = ({ venues, onMarkerClick, activeSlug }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [59.9335, 30.3340],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);
    // Attribution as a discrete corner element
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('© OpenStreetMap · © CARTO')
      .addTo(map);

    mapRef.current = map;

    venues.forEach(v => {
      const isActive = v.slug === activeSlug;
      const icon = L.divIcon({
        className: 'bs-marker-icon',
        html: `<div class="bs-marker ${isActive ? 'bs-marker--active' : ''}">
                 <div class="bs-marker__dot"></div>
                 <div class="bs-marker__pulse"></div>
                 <div class="bs-marker__label">
                   <span class="bs-marker__label-name">${v.name}</span>
                   <span class="bs-marker__label-meta">${v.stories.length} историй</span>
                 </div>
               </div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const marker = L.marker([v.lat, v.lng], { icon }).addTo(map);
      marker.on('click', () => onMarkerClick(v));
      markersRef.current[v.slug] = marker;
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Invalidate size on resize/show
  useEffect(() => {
    const handler = () => mapRef.current && mapRef.current.invalidateSize();
    window.addEventListener('resize', handler);
    setTimeout(handler, 50);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return <div ref={containerRef} className="bs-map" />;
};

// ────────────────────────────────────────────────────────────────────
// AudioPlayer — mock, singleton via global state
// ────────────────────────────────────────────────────────────────────
const AudioPlayer = ({ story, venueName, onClose }) => {
  const total = window.durationSeconds(story.duration);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const rafRef = useRef(null);
  const lastTickRef = useRef(performance.now());

  useEffect(() => {
    lastTickRef.current = performance.now();
    const tick = (now) => {
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      if (playing) {
        setPos(prev => {
          const next = prev + dt * speed;
          if (next >= total) { setPlaying(false); return total; }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, speed, total]);

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setPos(pct * total);
  };

  const nextSpeed = () => {
    setSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1);
  };

  return (
    <div className="bs-player">
      <div className="bs-player__inner">
        <button className="bs-player__playbtn" onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Пауза' : 'Играть'}>
          {playing ? <IconPause size={18} /> : <IconPlay size={18} />}
        </button>
        <div className="bs-player__meta">
          <div className="bs-player__title">{story.title}</div>
          <div className="bs-player__venue">{venueName}</div>
        </div>
        <div className="bs-player__progress" onClick={seek}>
          <div className="bs-player__progress-fill" style={{ width: `${(pos/total)*100}%` }} />
        </div>
        <div className="bs-player__time">
          <span>{window.formatTime(pos)}</span>
          <span className="bs-player__time-sep">/</span>
          <span className="bs-player__time-total">{window.formatTime(total)}</span>
        </div>
        <button className="bs-player__speed" onClick={nextSpeed}>{speed}×</button>
        {onClose && (
          <button className="bs-player__close" onClick={onClose} aria-label="Закрыть">
            <IconClose size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────
// StoryCard — three states: free / locked / unlocked
// ────────────────────────────────────────────────────────────────────
const StoryCard = ({ story, index, expanded, onToggle, onLockClick, unlocked, venueName }) => {
  const isFree = story.free;
  const accessible = isFree || unlocked;
  const stateLabel = isFree ? 'Бесплатно' : (unlocked ? 'Куплено' : '100 ₽');

  return (
    <div className={`bs-story ${expanded ? 'bs-story--expanded' : ''} ${!accessible ? 'bs-story--locked' : ''}`}>
      <button className="bs-story__row" onClick={() => accessible ? onToggle(story.id) : onLockClick(story)}>
        <div className="bs-story__num">{String(index + 1).padStart(2, '0')}</div>
        <div className="bs-story__icon">
          {accessible ? <IconPlay size={16} /> : <IconLock size={16} />}
        </div>
        <div className="bs-story__title">
          <div className="bs-story__title-text">{story.title}</div>
          <div className="bs-story__intro">{story.intro}</div>
        </div>
        <div className="bs-story__meta">
          <div className="bs-story__label">{stateLabel}</div>
          <div className="bs-story__duration">{story.duration}</div>
        </div>
      </button>
      {expanded && accessible && (
        <div className="bs-story__player">
          <AudioPlayer story={story} venueName={venueName} onClose={() => onToggle(story.id)} />
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────
// NearbyMiniCard — type / name / distance only
// ────────────────────────────────────────────────────────────────────
const NearbyMiniCard = ({ venue, dist, onClick }) => (
  <button className="bs-nearby-card" onClick={() => onClick(venue)}>
    <div className="bs-nearby-card__type">{venue.type}</div>
    <div className="bs-nearby-card__name">{venue.name}</div>
    <div className="bs-nearby-card__row">
      <span className="bs-nearby-card__dist">{window.formatDistance(dist)}</span>
      <IconArrowRight size={14} className="bs-nearby-card__arrow" />
    </div>
  </button>
);

// ────────────────────────────────────────────────────────────────────
// PaywallModal — fake card form, spinner → check → close
// ────────────────────────────────────────────────────────────────────
const PaywallModal = ({ story, onClose, onSuccess }) => {
  const [stage, setStage] = useState('idle'); // idle | processing | success
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const formatCard = (s) => s.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g, '$1 ');
  const formatExpiry = (s) => {
    const d = s.replace(/\D/g,'').slice(0,4);
    return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
  };

  const submit = (e) => {
    e.preventDefault();
    if (stage !== 'idle') return;
    setStage('processing');
    setTimeout(() => {
      setStage('success');
      setTimeout(() => {
        window.markUnlocked(story.id);
        onSuccess(story);
      }, 700);
    }, 1500);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && stage === 'idle') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, onClose]);

  const canSubmit = card.replace(/\s/g,'').length >= 12 && expiry.length >= 4 && cvc.length >= 3;

  return (
    <div className="bs-modal-backdrop" onClick={() => stage === 'idle' && onClose()}>
      <div className="bs-modal" onClick={e => e.stopPropagation()}>
        <button className="bs-modal__close" onClick={onClose} aria-label="Закрыть"><IconClose size={16} /></button>
        <div className="bs-modal__kicker">ИСТОРИЯ · {story.duration}</div>
        <h3 className="bs-modal__title">{story.title}</h3>
        <div className="bs-modal__price">100 ₽</div>

        <form className="bs-modal__form" onSubmit={submit}>
          <label className="bs-field">
            <span className="bs-field__label">НОМЕР КАРТЫ</span>
            <input
              className="bs-field__input"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={card}
              onChange={e => setCard(formatCard(e.target.value))}
              disabled={stage !== 'idle'}
            />
          </label>
          <div className="bs-field-row">
            <label className="bs-field">
              <span className="bs-field__label">СРОК</span>
              <input
                className="bs-field__input"
                inputMode="numeric"
                placeholder="ММ/ГГ"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                disabled={stage !== 'idle'}
              />
            </label>
            <label className="bs-field">
              <span className="bs-field__label">CVC</span>
              <input
                className="bs-field__input"
                inputMode="numeric"
                placeholder="123"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,3))}
                disabled={stage !== 'idle'}
              />
            </label>
          </div>

          <button
            type="submit"
            className={`bs-modal__cta bs-modal__cta--${stage}`}
            disabled={!canSubmit || stage !== 'idle'}
          >
            {stage === 'idle' && <span>ОПЛАТИТЬ 100 ₽</span>}
            {stage === 'processing' && <span className="bs-spinner" />}
            {stage === 'success' && <IconCheck size={20} />}
          </button>

          <div className="bs-modal__disclaimer">
            Это демо. Реальная оплата не списывается.
          </div>
        </form>
      </div>
    </div>
  );
};

// Expose to other scripts
Object.assign(window, {
  Header, CityMap, AudioPlayer, StoryCard, NearbyMiniCard, PaywallModal,
  IconPlay, IconPause, IconLock, IconCheck, IconArrowRight, IconArrowLeft,
  IconClock, IconMapPin, IconClose, IconQr,
});
