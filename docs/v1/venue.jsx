// Venue page — cover, stories list, nearby
const VenuePage = ({ slug, onNavigate, expandedStory, setExpandedStory, openPaywall, unlockTick }) => {
  const venue = window.getVenue(slug);
  if (!venue) {
    return (
      <div className="bs-empty">
        <p>Место не найдено.</p>
        <button className="bs-link" onClick={() => onNavigate({ route: 'landing' })}>← На карту</button>
      </div>
    );
  }

  const nearby = window.getNearby(venue, 3);
  const free = venue.stories.filter(s => s.free).length;
  const paid = venue.stories.filter(s => !s.free).length;
  const totalSec = venue.stories.reduce((acc, s) => acc + window.durationSeconds(s.duration), 0);
  const totalMin = Math.round(totalSec / 60);

  return (
    <div className="bs-venue" data-screen-label={`venue-${slug}`}>
      <Header transparent={true} onNavigate={onNavigate} />

      <div className="bs-cover" style={{ background: venue.cover }}>
        <div className="bs-cover__pattern" style={{ '--accent-tint': venue.coverAccent }} />
        <button className="bs-cover__back" onClick={() => onNavigate({ route: 'landing' })}>
          <IconArrowLeft size={16} />
          <span>НА КАРТУ</span>
        </button>

        <div className="bs-cover__inner">
          <div className="bs-cover__kicker">
            <span>{venue.type}</span>
            <span className="bs-cover__kicker-sep" />
            <span>{venue.addressShort}</span>
          </div>
          <h1 className="bs-cover__h1">{venue.name}</h1>
          <p className="bs-cover__blurb">{venue.blurb}</p>

          <div className="bs-cover__stats">
            <div className="bs-stat">
              <div className="bs-stat__value">{venue.stories.length}</div>
              <div className="bs-stat__label">историй</div>
            </div>
            <div className="bs-stat">
              <div className="bs-stat__value">{totalMin}<span className="bs-stat__unit">мин</span></div>
              <div className="bs-stat__label">всего</div>
            </div>
            <div className="bs-stat">
              <div className="bs-stat__value">{free}<span className="bs-stat__unit">/ {venue.stories.length}</span></div>
              <div className="bs-stat__label">бесплатно</div>
            </div>
          </div>
        </div>

        <div className="bs-cover__qr-hint">
          <IconQr size={14} />
          <span>QR-код в&nbsp;заведении</span>
        </div>
      </div>

      <main className="bs-venue__main">
        <section className="bs-stories">
          <div className="bs-section-head">
            <h2 className="bs-h2">Истории</h2>
            <div className="bs-section-meta">
              {free} БЕСПЛАТНО · {paid} ПО 100 ₽
            </div>
          </div>

          <div className="bs-stories__list">
            {venue.stories.map((story, i) => (
              <StoryCard
                key={story.id}
                story={story}
                index={i}
                expanded={expandedStory === story.id}
                onToggle={(id) => setExpandedStory(prev => prev === id ? null : id)}
                onLockClick={(s) => openPaywall(s)}
                unlocked={window.isUnlocked(story.id)}
                venueName={venue.name}
              />
            ))}
          </div>
        </section>

        <section className="bs-nearby">
          <h2 className="bs-h-mono">МОЖНО ПРОЙТИСЬ</h2>
          <div className="bs-nearby__grid">
            {nearby.map(({ venue: v, dist }) => (
              <NearbyMiniCard
                key={v.slug}
                venue={v}
                dist={dist}
                onClick={(vv) => onNavigate({ route: 'venue', slug: vv.slug })}
              />
            ))}
          </div>
        </section>

        <footer className="bs-venue__footer">
          <div className="bs-venue__footer-line" />
          <div className="bs-venue__footer-text">
            <div>БАЙКИ И ШОТЫ · ДЕМО-ПРОТОТИП</div>
            <button className="bs-link" onClick={() => onNavigate({ route: 'landing' })}>
              ВЕРНУТЬСЯ К КАРТЕ <IconArrowRight size={12} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

window.VenuePage = VenuePage;
