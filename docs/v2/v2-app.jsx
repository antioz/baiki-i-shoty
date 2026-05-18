// v2 pages — Landing, Venue, App
(() => {
const { useState, useEffect, useCallback, Header, CityMap, StoryRow, Paywall, AboutModal, ArrowR, ArrowL } = window.__v2;

// ─── Landing page ──────────────────────────────────────────────────
const LandingPage = ({ onNavigate }) => {
  const total = window.VENUES.reduce((a, v) => a + v.stories.length, 0);
  const totalMin = Math.round(window.VENUES.flatMap(v => v.stories)
    .reduce((a, s) => a + window.durationSeconds(s.duration), 0) / 60);
  return (
    <div className="v2-landing">
      <section className="v2-hero">
        <div className="v2-hero__left">
          <div>
            <div className="v2-hero__kicker">
              <span className="v2-hero__kicker-rule" />
              ПЕЙ ГУЛЯЙ КОНТЕНТ ПОТРЕБЛЯЙ
            </div>
            <h1 className="v2-hero__h1">
              Байки<br/>
              <em>и</em> Шоты
            </h1>
            <p className="v2-hero__lead">
              Истории о&nbsp;зданиях, людях и&nbsp;призраках&nbsp;&mdash; в&nbsp;тех самых барах, отелях
              и&nbsp;ресторанах, где их&nbsp;можно слушать. Зайдите внутрь, отсканируйте
              QR-код над стойкой&nbsp;&mdash; и&nbsp;дом начнёт рассказывать о&nbsp;себе.
            </p>
          </div>
          <div className="v2-hero__meta">
            <div className="v2-hero__meta-item">
              <div className="v2-hero__meta-num">{total}</div>
              <div className="v2-hero__meta-label">историй</div>
            </div>
            <div className="v2-hero__meta-item">
              <div className="v2-hero__meta-num">{window.VENUES.length}</div>
              <div className="v2-hero__meta-label">места</div>
            </div>
            <div className="v2-hero__meta-item">
              <div className="v2-hero__meta-num">~{totalMin}</div>
              <div className="v2-hero__meta-label">минут</div>
            </div>
            <div className="v2-hero__meta-item">
              <div className="v2-hero__meta-num">100<span style={{fontSize:13,marginLeft:2,color:'var(--brick)'}}>₽</span></div>
              <div className="v2-hero__meta-label">за историю</div>
            </div>
          </div>
        </div>
        <div className="v2-hero__right">
          <CityMap venues={window.VENUES} onMarkerClick={(v) => onNavigate({ route: 'venue', slug: v.slug })} />
        </div>
      </section>

      <section className="v2-venuelist">
        {window.VENUES.map((v, i) => (
          <button key={v.slug} className="v2-venuelist__item"
            onClick={() => onNavigate({ route: 'venue', slug: v.slug })}>
            <div className="v2-venuelist__num">№ 0{i + 1} / 04</div>
            <div className="v2-venuelist__type">{v.type}</div>
            <div className="v2-venuelist__name">{v.name}</div>
            <div className="v2-venuelist__addr">{v.address}</div>
            <div className="v2-venuelist__foot">
              <div className="v2-venuelist__count">{v.stories.length} историй</div>
              <ArrowR size={16} />
            </div>
          </button>
        ))}
      </section>

      <div className="v2-bottom">
        <span>© 2026 Б&amp;Ш · ДЕМО-ПРОТОТИП</span>
        <span className="v2-bottom__center">
          <span className="v2-bottom__brick">●</span>
          ВЫПУСК 0.2 · «SPB ’06»
        </span>
        <span>СДЕЛАНО ДЛЯ ВЕЧЕРНЕГО СЛУШАНИЯ</span>
      </div>
    </div>
  );
};

// ─── Venue page ────────────────────────────────────────────────────
const VenuePage = ({ slug, onNavigate, expandedStory, setExpandedStory, openPaywall }) => {
  const venue = window.getVenue(slug);
  if (!venue) return <div style={{padding:80, textAlign:'center'}}>Не найдено</div>;
  const nearby = window.getNearby(venue, 3);
  const free = venue.stories.filter(s => s.free).length;
  const paid = venue.stories.length - free;
  const totalMin = Math.round(venue.stories.reduce((a, s) => a + window.durationSeconds(s.duration), 0) / 60);

  return (
    <div className="v2-venue" data-screen-label={`venue-${slug}`}>
      <button className="v2-back" onClick={() => onNavigate({ route: 'landing' })}>
        <ArrowL size={14} stroke={2} /> НА КАРТУ · {venue.addressShort}
      </button>

      <section className="v2-venuetop">
        <div className="v2-venuetop__left">
          <div className="v2-venuetop__kicker">
            <span className="v2-venuetop__type">{venue.type}</span>
            <span className="v2-venuetop__sep" />
            <span>{venue.addressShort}</span>
            <span className="v2-venuetop__sep" />
            <span>{venue.lat.toFixed(2)}° N, {venue.lng.toFixed(2)}° E</span>
          </div>
          <h1 className="v2-venuetop__h1">{venue.name}</h1>
          <p className="v2-venuetop__blurb">{venue.blurb}</p>
        </div>
        <div className="v2-venuetop__right">
          <div className="v2-venuetop__right-stamp">DOSSIER</div>
          <div className="v2-venuetop__stats">
            <div className="v2-stat">
              <div className="v2-stat__value">{venue.stories.length}</div>
              <div className="v2-stat__label">историй</div>
            </div>
            <div className="v2-stat">
              <div className="v2-stat__value">{totalMin}<span className="v2-stat__unit">мин</span></div>
              <div className="v2-stat__label">всего</div>
            </div>
            <div className="v2-stat">
              <div className="v2-stat__value">{free}</div>
              <div className="v2-stat__label">бесплатно</div>
            </div>
            <div className="v2-stat">
              <div className="v2-stat__value">{paid}<span className="v2-stat__unit">× 100₽</span></div>
              <div className="v2-stat__label">платных</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="v2-section-head">
          <h2 className="v2-section-head__h2">Истории</h2>
          <div className="v2-section-head__meta">
            <span className="v2-section-head__meta-brick">{free} БЕСПЛАТНО</span> · {paid} ПО 100 ₽
          </div>
        </div>
        <div className="v2-stories">
          {venue.stories.map((s, i) => (
            <StoryRow key={s.id} story={s} index={i}
              expanded={expandedStory === s.id}
              onToggle={(id) => setExpandedStory(p => p === id ? null : id)}
              onLockClick={openPaywall}
              unlocked={window.isUnlocked(s.id)}
              venueName={venue.name} />
          ))}
        </div>
      </section>

      <section>
        <div className="v2-section-head">
          <h2 className="v2-section-head__h2">Рядом</h2>
          <div className="v2-section-head__meta">в радиусе пешей доступности</div>
        </div>
        <div className="v2-nearby">
          {nearby.map(({ venue: v, dist }) => (
            <button key={v.slug} className="v2-nearby-card"
              onClick={() => onNavigate({ route: 'venue', slug: v.slug })}>
              <div className="v2-nearby-card__type">{v.type} · {v.addressShort}</div>
              <div className="v2-nearby-card__name">{v.name}</div>
              <div className="v2-nearby-card__foot">
                <div className="v2-nearby-card__dist">↗ {window.formatDistance(dist)}</div>
                <ArrowR size={16} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="v2-foot">
        <span>{venue.name.toUpperCase()} · {venue.addressShort}</span>
        <span><span className="v2-foot__r">●</span> БАЙКИ &amp; ШОТЫ · ДЕМО</span>
        <button className="v2-nav__link" onClick={() => onNavigate({ route: 'landing' })}>↑ К КАРТЕ</button>
      </div>
    </div>
  );
};

// ─── App ───────────────────────────────────────────────────────────
const App = () => {
  const [route, setRoute] = useState(() => parseHash());
  const [paywallStory, setPaywallStory] = useState(null);
  const [expandedStory, setExpandedStory] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [tick, setTick] = useState(0);

  function parseHash() {
    const h = window.location.hash.slice(1);
    if (!h || h === '/') return { route: 'landing' };
    const m = h.match(/^\/?venue\/([^/?]+)/);
    if (m) return { route: 'venue', slug: m[1] };
    return { route: 'landing' };
  }

  useEffect(() => {
    const h = () => setRoute(parseHash());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const navigate = useCallback((r) => {
    if (r.route === 'about') { setAboutOpen(true); return; }
    const hash = r.route === 'venue' ? `#/venue/${r.slug}` : '#/';
    if (window.location.hash !== hash) window.location.hash = hash;
    else setRoute(r);
    setExpandedStory(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div data-screen-label={route.route === 'landing' ? 'landing' : `venue-${route.slug}`}>
      <Header onNavigate={navigate} />
      {route.route === 'landing' && <LandingPage onNavigate={navigate} />}
      {route.route === 'venue' && (
        <VenuePage slug={route.slug} onNavigate={navigate}
          expandedStory={expandedStory} setExpandedStory={setExpandedStory}
          openPaywall={setPaywallStory} key={`venue-${route.slug}-${tick}`} />
      )}
      {paywallStory && (
        <Paywall story={paywallStory}
          onClose={() => setPaywallStory(null)}
          onSuccess={(s) => { setPaywallStory(null); setTick(t => t + 1); setTimeout(() => setExpandedStory(s.id), 100); }} />
      )}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
})();
