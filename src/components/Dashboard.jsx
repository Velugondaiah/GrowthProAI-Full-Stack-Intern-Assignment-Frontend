import { useState } from "react";
import BusinessForm from "./BusinessForm";
import BusinessCard from "./BusinessCard";
import "./Dashboard.css";

const HEADLINES = [
  "Why {name} is {location}'s Sweetest Spot in 2025",
  "Discover {location}'s Best at {name}!",
  "{name}: The Heart of {location}'s Dessert Scene",
  "{location}'s Favorite Cakes Await at {name}",
  "Experience Sweet Perfection at {name}, {location}",
  "{name} - Where {location} Celebrates Every Occasion",
  "Taste the Magic of {location} at {name}",
  "{name}: Making {location} Sweeter Since 2020",
  "Why Locals Love {name} in {location}",
  "{name}: The Secret Ingredient to {location}'s Happiness"
];

function getRandomHeadlineIdx(excludeIdx = -1) {
  let idx;
  do {
    idx = Math.floor(Math.random() * HEADLINES.length);
  } while (HEADLINES.length > 1 && idx === excludeIdx);
  return idx;
}

function personalizeHeadline(template, name, location) {
  return template.replace(/{name}/g, name).replace(/{location}/g, location);
}

// Starfield config
const BLINK_CLASSES = ["blink1", "blink2", "blink3", "blink4"];
const BLINKING_STARS = Array.from({ length: 100 }).map((_, i) => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  blinkClass: BLINK_CLASSES[Math.floor(Math.random() * BLINK_CLASSES.length)]
}));
const CLUSTER_TOPLEFT = Array.from({ length: 8 }).map((_, i) => ({
  left: Math.random() * 8,
  top: Math.random() * 8,
  blinkClass: BLINK_CLASSES[Math.floor(Math.random() * BLINK_CLASSES.length)]
}));
const CLUSTER_BOTTOMRIGHT = Array.from({ length: 8 }).map((_, i) => ({
  left: 92 + Math.random() * 8,
  top: 92 + Math.random() * 8,
  blinkClass: BLINK_CLASSES[Math.floor(Math.random() * BLINK_CLASSES.length)]
}));
// Moving stars from bottom-left to top-right (near moon)
const MOVING_STARS = Array.from({ length: 5 }).map((_, i) => ({
  left: Math.random() * 10,
  top: 80 + Math.random() * 10,
  delay: Math.random() * 7,
  blinkClass: BLINK_CLASSES[Math.floor(Math.random() * BLINK_CLASSES.length)]
}));

function Dashboard() {
  const [form, setForm] = useState({ name: "", location: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [headlineIdx, setHeadlineIdx] = useState(null);

  const validate = (values) => {
    const errs = {};
    if (!values.name) errs.name = "Business name is required";
    if (!values.location) errs.location = "Location is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate({ ...form, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ name: true, location: true });
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch("http://localhost:3001/business-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to fetch business data");
      const result = await res.json();
      const elapsed = Date.now() - start;
      const minTime = 1200;
      if (elapsed < minTime) {
        setTimeout(() => {
          setCardData(result);
          setSubmitted(true);
          setLoading(false);
        }, minTime - elapsed);
      } else {
        setCardData(result);
        setSubmitted(true);
        setLoading(false);
      }
    } catch (err) {
      setErrors({ api: err.message });
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(
        `http://localhost:3001/regenerate-headline?name=${encodeURIComponent(form.name)}&location=${encodeURIComponent(form.location)}`
      );
      if (!res.ok) throw new Error("Failed to regenerate headline");
      const result = await res.json();
      const elapsed = Date.now() - start;
      const minTime = 1200;
      if (elapsed < minTime) {
        setTimeout(() => {
          setCardData((prev) => ({ ...prev, headline: result.headline }));
          setLoading(false);
        }, minTime - elapsed);
      } else {
        setCardData((prev) => ({ ...prev, headline: result.headline }));
        setLoading(false);
      }
    } catch (err) {
      setErrors({ api: err.message });
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-bg-animated">
      <div className="stars-bg">
        {/* Blinking stars */}
        {BLINKING_STARS.map((star, i) => (
          <div
            key={"blink-"+i}
            className={"star " + star.blinkClass}
            style={{
              left: `${star.left}vw`,
              top: `${star.top}vh`,
            }}
          />
        ))}
        {/* Clustered stars top-left */}
        {CLUSTER_TOPLEFT.map((star, i) => (
          <div
            key={"topleft-"+i}
            className={"star cluster-topleft " + star.blinkClass}
            style={{
              left: `${star.left}vw`,
              top: `${star.top}vh`,
            }}
          />
        ))}
        {/* Clustered stars bottom-right */}
        {CLUSTER_BOTTOMRIGHT.map((star, i) => (
          <div
            key={"bottomright-"+i}
            className={"star cluster-bottomright " + star.blinkClass}
            style={{
              left: `${star.left}vw`,
              top: `${star.top}vh`,
            }}
          />
        ))}
        {/* Moving stars from bottom-left to top-right (near moon) */}
        {MOVING_STARS.map((star, i) => (
          <div
            key={"move-"+i}
            className={"star move " + star.blinkClass}
            style={{
              left: `${star.left}vw`,
              top: `${star.top}vh`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
        {/* Moon */}
        <div className="moon" />
        {/* Santa Claus Sleigh SVG */}
        <svg className="santa-sleigh" width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Santa Claus sleigh with reindeer">
          {/* Reindeer (4) */}
          <g>
            <ellipse cx="25" cy="40" rx="8" ry="5" fill="#bfa77a" />
            <ellipse cx="45" cy="38" rx="8" ry="5" fill="#bfa77a" />
            <ellipse cx="65" cy="36" rx="8" ry="5" fill="#bfa77a" />
            <ellipse cx="85" cy="34" rx="8" ry="5" fill="#bfa77a" />
            {/* Heads */}
            <ellipse cx="17" cy="37" rx="3" ry="2.5" fill="#bfa77a" />
            <ellipse cx="37" cy="35" rx="3" ry="2.5" fill="#bfa77a" />
            <ellipse cx="57" cy="33" rx="3" ry="2.5" fill="#bfa77a" />
            <ellipse cx="77" cy="31" rx="3" ry="2.5" fill="#bfa77a" />
            {/* Noses */}
            <circle cx="14.5" cy="37" r="1.2" fill="#e53e3e" />
            <circle cx="34.5" cy="35" r="1.2" fill="#e53e3e" />
            <circle cx="54.5" cy="33" r="1.2" fill="#e53e3e" />
            <circle cx="74.5" cy="31" r="1.2" fill="#e53e3e" />
            {/* Antlers (simple lines) */}
            <polyline points="16,34 13,30" stroke="#8d6748" strokeWidth="1" />
            <polyline points="18,34 21,30" stroke="#8d6748" strokeWidth="1" />
            <polyline points="36,32 33,28" stroke="#8d6748" strokeWidth="1" />
            <polyline points="38,32 41,28" stroke="#8d6748" strokeWidth="1" />
            <polyline points="56,30 53,26" stroke="#8d6748" strokeWidth="1" />
            <polyline points="58,30 61,26" stroke="#8d6748" strokeWidth="1" />
            <polyline points="76,28 73,24" stroke="#8d6748" strokeWidth="1" />
            <polyline points="78,28 81,24" stroke="#8d6748" strokeWidth="1" />
          </g>
          {/* Sleigh */}
          <g>
            <rect x="100" y="30" width="38" height="16" rx="6" fill="#d32f2f" stroke="#b71c1c" strokeWidth="2" />
            <ellipse cx="119" cy="46" rx="19" ry="6" fill="#b71c1c" />
            {/* Sleigh runners */}
            <path d="M100 46 Q95 54 110 54 Q125 54 138 46" stroke="#bfa77a" strokeWidth="2" fill="none" />
          </g>
          {/* Santa */}
          <g>
            <circle cx="110" cy="36" r="4" fill="#fff" /> {/* beard */}
            <circle cx="110" cy="32" r="3" fill="#e53e3e" /> {/* hat */}
            <circle cx="110" cy="38" r="2.2" fill="#f9d3b4" /> {/* face */}
            <rect x="108.5" y="40" width="3" height="6" fill="#e53e3e" /> {/* body */}
            <rect x="108" y="46" width="1.5" height="3" fill="#fff" /> {/* hand */}
          </g>
          {/* Gifts */}
          <g>
            <rect x="135" y="32" width="6" height="6" fill="#4fd1c5" stroke="#319795" strokeWidth="1" />
            <rect x="142" y="34" width="5" height="5" fill="#f6e05e" stroke="#b7791f" strokeWidth="1" />
            <rect x="148" y="31" width="4" height="4" fill="#f687b3" stroke="#b83280" strokeWidth="1" />
          </g>
          {/* Sleigh rope to reindeer */}
          <polyline points="100,38 85,34 65,36 45,38 25,40" stroke="#bfa77a" strokeWidth="2" fill="none" />
        </svg>
      </div>
      {loading && <div className="loading-overlay"><span className="spinner spinner-lg"></span></div>}
      <div className="dashboard-main dashboard-main-attractive">
        <h1 className="dashboard-title">Mini Local Business Dashboard</h1>
        <BusinessForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          errors={errors}
          touched={touched}
        />
        {submitted && cardData && (
          <div className="dashboard-card-wrapper">
            <BusinessCard
              data={cardData}
              loading={loading}
              onRegenerate={handleRegenerate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard; 