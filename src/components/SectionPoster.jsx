function SectionPoster({ id, headline, imageSrc, imageAlt, reverse = false }) {
  return (
    <section id={id} className="panel panel--poster" aria-label={headline}>
      <div className={`content-wrap poster-grid ${reverse ? 'poster-grid--reverse' : ''}`}>
        <h2>{headline}</h2>
        <figure className="poster-image">
          <img src={imageSrc} alt={imageAlt} loading="lazy" />
        </figure>
      </div>
    </section>
  );
}

export default SectionPoster;
