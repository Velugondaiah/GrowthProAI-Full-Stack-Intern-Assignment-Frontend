import "./BusinessCard.css";

function BusinessCard({ data, loading, onRegenerate }) {
  return (
    <div className="business-card animate-in">
      <div className="business-rating">
        {data.rating}
        <span className="star" aria-label="Google Rating">★</span>
      </div>
      <div className="business-reviews">{data.reviews} Reviews</div>
      <div className="business-headline">{data.headline}</div>
      <button className="regenerate-btn" onClick={onRegenerate} disabled={loading} aria-busy={loading}>
        Regenerate SEO Headline
      </button>
    </div>
  );
}

export default BusinessCard; 