// Landing page — fullscreen map + hero overlay
const LandingPage = ({ onNavigate }) => {
  const totalStories = window.VENUES.reduce((acc, v) => acc + v.stories.length, 0);
  const totalDuration = Math.round(
    window.VENUES.flatMap(v => v.stories).reduce((acc, s) => acc + window.durationSeconds(s.duration), 0) / 60
  );

  return (
    <div className="bs-landing">
      <Header transparent={true} onNavigate={onNavigate} />

      <div className="bs-landing__map">
        <CityMap
          venues={window.VENUES}
          onMarkerClick={(v) => onNavigate({ route: 'venue', slug: v.slug })}
        />
      </div>

      <div className="bs-landing__hero">
        <div className="bs-landing__hero-inner">
          <div className="bs-landing__kicker">
            <span className="bs-landing__kicker-dot" />
            АУДИО-ИСТОРИИ · ЦЕНТР ПЕТЕРБУРГА
          </div>
          <h1 className="bs-landing__h1">
            Байки<br />и шоты
          </h1>
          <p className="bs-landing__lead">
            Истории о зданиях, людях и&nbsp;призраках в&nbsp;тех самых местах,
            где их&nbsp;можно слушать. Зайдите в&nbsp;бар, отсканируйте QR над стойкой
            — и&nbsp;дом начнёт рассказывать о&nbsp;себе.
          </p>
          <div className="bs-landing__meta">
            <span>{totalStories} ИСТОРИЙ</span>
            <span className="bs-landing__meta-sep">·</span>
            <span>{window.VENUES.length} МЕСТА</span>
            <span className="bs-landing__meta-sep">·</span>
            <span>~{totalDuration} МИН</span>
          </div>
          <div className="bs-landing__hint">
            <IconMapPin size={14} />
            <span>Нажмите на&nbsp;точку, чтобы начать</span>
          </div>
        </div>
      </div>

      <div className="bs-landing__corner">
        <div className="bs-landing__corner-line" />
        <div className="bs-landing__corner-text">
          <div>59°56′02″ N</div>
          <div>30°20′04″ E</div>
        </div>
      </div>
    </div>
  );
};

window.LandingPage = LandingPage;
