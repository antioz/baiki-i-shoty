// Main App — hash routing + paywall state + expanded story
const App = () => {
  const [route, setRoute] = useState(() => parseHash());
  const [paywallStory, setPaywallStory] = useState(null);
  const [expandedStory, setExpandedStory] = useState(null);
  const [unlockTick, setUnlockTick] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);

  function parseHash() {
    const h = window.location.hash.slice(1);
    if (!h || h === '/' || h === '') return { route: 'landing' };
    const m = h.match(/^\/?venue\/([^/?]+)/);
    if (m) return { route: 'venue', slug: m[1] };
    return { route: 'landing' };
  }

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((r) => {
    if (r.route === 'about') { setAboutOpen(true); return; }
    let hash = '#/';
    if (r.route === 'venue') hash = `#/venue/${r.slug}`;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      setRoute(r);
    }
    setExpandedStory(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const openPaywall = (story) => setPaywallStory(story);
  const closePaywall = () => setPaywallStory(null);
  const onPaywallSuccess = (story) => {
    setPaywallStory(null);
    setUnlockTick(t => t + 1);
    // Auto-expand & start playing the just-unlocked story
    setTimeout(() => setExpandedStory(story.id), 100);
  };

  return (
    <div className="bs-app" data-screen-label={route.route === 'landing' ? 'landing' : `venue-${route.slug}`}>
      {route.route === 'landing' && <LandingPage onNavigate={navigate} />}
      {route.route === 'venue' && (
        <VenuePage
          slug={route.slug}
          onNavigate={navigate}
          expandedStory={expandedStory}
          setExpandedStory={setExpandedStory}
          openPaywall={openPaywall}
          unlockTick={unlockTick}
        />
      )}

      {paywallStory && (
        <PaywallModal
          story={paywallStory}
          onClose={closePaywall}
          onSuccess={onPaywallSuccess}
        />
      )}

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </div>
  );
};

const AboutModal = ({ onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="bs-modal-backdrop" onClick={onClose}>
      <div className="bs-modal bs-modal--about" onClick={e => e.stopPropagation()}>
        <button className="bs-modal__close" onClick={onClose} aria-label="Закрыть"><IconClose size={16} /></button>
        <div className="bs-modal__kicker">О ПРОЕКТЕ</div>
        <h3 className="bs-modal__title">Байки и&nbsp;шоты</h3>
        <p className="bs-about__p">
          Аудио-истории о&nbsp;четырёх местах в&nbsp;центре Петербурга: барах, отеле и&nbsp;ресторане,
          у&nbsp;каждого из&nbsp;которых хватает биографии на&nbsp;вечер.
        </p>
        <p className="bs-about__p">
          В&nbsp;заведении над стойкой висит QR-код &mdash; он&nbsp;ведёт сюда. Первая история
          в&nbsp;каждом месте бесплатная, остальные по&nbsp;100&nbsp;₽. Слушать можно
          где угодно, но&nbsp;лучше всего&nbsp;&mdash; не&nbsp;вставая из-за стола.
        </p>
        <div className="bs-about__meta">
          <div className="bs-about__meta-row">
            <span className="bs-about__meta-key">ИСТОРИЙ</span>
            <span className="bs-about__meta-val">16</span>
          </div>
          <div className="bs-about__meta-row">
            <span className="bs-about__meta-key">МЕСТ</span>
            <span className="bs-about__meta-val">4</span>
          </div>
          <div className="bs-about__meta-row">
            <span className="bs-about__meta-key">ВРЕМЯ</span>
            <span className="bs-about__meta-val">~98 МИН</span>
          </div>
          <div className="bs-about__meta-row">
            <span className="bs-about__meta-key">СТАТУС</span>
            <span className="bs-about__meta-val">ДЕМО</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
