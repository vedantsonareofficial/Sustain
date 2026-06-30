/* ================================================
   EcoTrack — Personal Carbon Footprint Tracker
   React App (CDN build)
   ================================================ */

const { useState, useEffect, useMemo, useCallback, useRef } = React;

// ─── Carbon Emission Factors ───

// Transport: kg CO2 per km
const TRANSPORT_PER_KM = {
  'car-petrol': 0.21,
  'car-diesel': 0.17,
  'car-electric': 0.05,
  'bus': 0.089,
  'train': 0.041,
  'flight': 0.255,
  'walk-cycle': 0,
};

// Food: kg CO2 per day
const FOOD_FACTORS = {
  'meat-heavy': 7.19,
  'mixed': 5.63,
  'vegetarian': 3.81,
  'vegan': 2.89,
};

// Shopping: kg CO2 per day (amortized)
const SHOPPING_FACTORS = {
  'electronics': 3.5,
  'clothes': 1.5,
  'none': 0,
};

const ELECTRICITY_FACTOR = 0.82; // kg CO2 per kWh
const GAS_DAILY_EMISSION = 2.0;  // kg CO2/day if gas used
const SOLAR_REDUCTION = 0.3;     // 30% reduction if solar

// ─── Tips Database ───

const TIPS_DB = {
  transport: [
    { title: 'Switch to public transit', desc: 'Taking the bus or train instead of driving can cut your transport emissions by up to 70%. Even 2-3 days a week makes a big difference.' },
    { title: 'Try carpooling', desc: 'Sharing rides with coworkers or neighbors can halve your per-person transport emissions and save money on fuel.' },
    { title: 'Consider an e-bike', desc: 'Electric bikes produce zero direct emissions and are perfect for commutes under 15km. They\'re faster than buses in traffic too.' },
    { title: 'Avoid short flights', desc: 'A single short flight can emit 10x more CO2 than the same trip by train. Choose rail for distances under 500km.' },
    { title: 'Walk for short trips', desc: 'Trips under 2km take just 20 minutes on foot. You save emissions AND get 150 calories of exercise.' },
  ],
  energy: [
    { title: 'Switch to LED bulbs', desc: 'LED lights use 75% less energy than incandescent bulbs. Replacing just 5 bulbs saves ~40 kWh per month.' },
    { title: 'Unplug standby devices', desc: 'Devices on standby use 5-10% of home energy. Use power strips to easily cut phantom power drain.' },
    { title: 'Optimize thermostat', desc: 'Lowering heating by 1°C saves about 10% on your heating bill and reduces ~300kg CO2 per year.' },
    { title: 'Consider solar panels', desc: 'Residential solar can offset 40-80% of electricity emissions. Many areas offer subsidies that cover 30%+ of costs.' },
    { title: 'Air dry your laundry', desc: 'Skipping the dryer for a year saves roughly 320kg of CO2. A clothesline or drying rack works great.' },
  ],
  food: [
    { title: 'Try Meatless Mondays', desc: 'Replacing beef with plant protein just once a week saves ~600kg CO2 per year — equivalent to driving 2,400km less.' },
    { title: 'Buy local produce', desc: 'Locally sourced food travels fewer miles, reducing transport emissions. Visit farmers markets for the freshest options.' },
    { title: 'Reduce food waste', desc: 'The average household wastes 30% of food. Meal planning and proper storage can cut waste by half.' },
    { title: 'Choose seasonal foods', desc: 'Out-of-season produce often needs energy-intensive greenhouses or long-distance shipping, tripling its carbon footprint.' },
    { title: 'Explore plant proteins', desc: 'Lentils, chickpeas, and tofu produce 10-50x less CO2 than beef per gram of protein. They\'re also cheaper.' },
  ],
  shopping: [
    { title: 'Buy refurbished electronics', desc: 'Choosing refurbished laptops and phones avoids ~80% of manufacturing emissions and saves 30-50% on cost.' },
    { title: 'Embrace secondhand fashion', desc: 'Thrift shopping prevents textile waste — the fashion industry produces 10% of global emissions. Vintage is trendy too.' },
    { title: 'Quality over quantity', desc: 'One durable item that lasts 5 years is greener than 5 cheap replacements. Look for warranties and reviews.' },
    { title: 'Repair before replacing', desc: 'Fixing a smartphone screen costs 90% less carbon than buying new. Many cities have free repair cafés.' },
    { title: 'Use a shopping list', desc: 'Impulse buys increase consumption by 20-30%. A list helps you buy only what you truly need.' },
  ],
};

// ─── Helper functions ───

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getDayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}

function getScoreColor(score) {
  if (score < 5) return 'var(--score-green)';
  if (score <= 15) return 'var(--score-yellow)';
  return 'var(--score-red)';
}

function getVerdict(score) {
  if (score < 5) return { emoji: '🌱', text: 'Eco Hero', color: 'var(--score-green)' };
  if (score <= 15) return { emoji: '🌍', text: 'Average', color: 'var(--score-yellow)' };
  return { emoji: '🔥', text: 'High Impact', color: 'var(--score-red)' };
}

function loadHistory() {
  try {
    const data = JSON.parse(localStorage.getItem('ecotrack_history') || '{}');
    return data;
  } catch {
    return {};
  }
}

function saveToHistory(score, breakdown) {
  const history = loadHistory();
  history[getTodayKey()] = { score: Math.round(score * 100) / 100, breakdown, timestamp: Date.now() };
  localStorage.setItem('ecotrack_history', JSON.stringify(history));
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

// ─── Components ───

// ── Option Button ──
function OptionButton({ label, icon, selected, onClick, id }) {
  return (
    <button
      id={id}
      className={`option-btn${selected ? ' selected' : ''}`}
      onClick={onClick}
      type="button"
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

// ── Gauge Component ──
function GaugeChart({ score, maxScore = 30 }) {
  const clampedScore = Math.min(score, maxScore);
  const percentage = clampedScore / maxScore;
  const color = getScoreColor(score);

  // Arc math: semicircle path
  const cx = 110, cy = 115, r = 90;
  const startAngle = Math.PI;
  const endAngle = 0;
  const totalArc = Math.PI * r;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const pathD = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  const dashOffset = totalArc * (1 - percentage);

  return (
    <div className="gauge-wrapper">
      <div className="gauge-svg-container">
        <svg className="gauge-svg" viewBox="0 0 220 130">
          <path d={pathD} className="gauge-track" />
          <path
            d={pathD}
            className="gauge-fill"
            style={{
              stroke: color,
              strokeDasharray: totalArc,
              strokeDashoffset: dashOffset,
            }}
          />
        </svg>
        <div className="gauge-value">
          <div className="gauge-number" style={{ color }}>
            {score.toFixed(1)}
          </div>
          <div className="gauge-unit">kg CO₂ / day</div>
        </div>
      </div>
      <div className="gauge-verdict" style={{ color: getVerdict(score).color }}>
        <span style={{ fontSize: '1.6rem' }}>{getVerdict(score).emoji}</span>
        {getVerdict(score).text}
      </div>
    </div>
  );
}

// ── Comparison Card ──
function ComparisonCard({ label, avgKgDay, userKgDay, color }) {
  const pct = Math.min((userKgDay / (avgKgDay * 1.5)) * 100, 100);
  return (
    <div className="card comparison-card">
      <div className="comparison-label">{label}</div>
      <div className="comparison-value">{avgKgDay.toFixed(1)}</div>
      <div className="comparison-unit">kg CO₂ / day</div>
      <div className="comparison-bar-container">
        <div
          className="comparison-bar"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />
      </div>
      <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        You: {userKgDay.toFixed(1)} kg/day
        {userKgDay < avgKgDay ? ' ✅' : ' ⚠️'}
      </div>
    </div>
  );
}

// ── Category Breakdown ──
function CategoryBreakdown({ breakdown }) {
  const categories = [
    { key: 'transport', icon: '🚗', name: 'Transport' },
    { key: 'energy', icon: '⚡', name: 'Home Energy' },
    { key: 'food', icon: '🍽️', name: 'Food' },
    { key: 'shopping', icon: '🛍️', name: 'Shopping' },
  ];

  const maxVal = Math.max(...Object.values(breakdown), 1);

  return (
    <div className="card breakdown-card">
      <div className="card-title">
        <span className="card-title-icon">📊</span>
        Emission Breakdown
      </div>
      <div className="breakdown-list">
        {categories.map((cat) => (
          <div key={cat.key} className="breakdown-item">
            <div className="breakdown-icon">{cat.icon}</div>
            <div className="breakdown-info">
              <div className="breakdown-name">{cat.name}</div>
              <div className="breakdown-bar-wrap">
                <div
                  className="breakdown-bar-fill"
                  style={{ width: `${(breakdown[cat.key] / maxVal) * 100}%` }}
                />
              </div>
            </div>
            <div className="breakdown-value">{breakdown[cat.key].toFixed(1)} kg</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tips Section ──
function TipsSection({ breakdown }) {
  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const topCategories = sorted.slice(0, 3).map(([key]) => key);

  const tips = topCategories.map((cat) => {
    const pool = TIPS_DB[cat] || TIPS_DB.transport;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  // Dedupe tips
  const uniqueTips = [];
  const seenTitles = new Set();
  for (const tip of tips) {
    if (!seenTitles.has(tip.title)) {
      seenTitles.add(tip.title);
      uniqueTips.push(tip);
    }
  }
  // Fill up to 3 if needed
  while (uniqueTips.length < 3) {
    const allTips = Object.values(TIPS_DB).flat();
    const tip = allTips[Math.floor(Math.random() * allTips.length)];
    if (!seenTitles.has(tip.title)) {
      seenTitles.add(tip.title);
      uniqueTips.push(tip);
    }
  }

  return (
    <div className="card tips-container section-gap">
      <div className="card-title">
        <span className="card-title-icon">💡</span>
        Personalized Tips
      </div>
      <div className="tips-grid">
        {uniqueTips.slice(0, 3).map((tip, i) => (
          <div key={i} className="tip-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="tip-number">{i + 1}</div>
            <div className="tip-content">
              <div className="tip-title">{tip.title}</div>
              <div className="tip-desc">{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Progress Chart ──
function ProgressChart() {
  const history = loadHistory();
  const last7 = getLast7Days();
  const today = getTodayKey();

  const entries = last7.map((day) => ({
    date: day,
    label: getDayLabel(day),
    score: history[day]?.score || 0,
    hasData: !!history[day],
    isToday: day === today,
  }));

  const maxScore = Math.max(...entries.map(e => e.score), 5);
  const hasAnyData = entries.some(e => e.hasData);

  if (!hasAnyData) {
    return (
      <div className="card progress-container section-gap">
        <div className="card-title">
          <span className="card-title-icon">📈</span>
          7-Day Progress
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-text">
            No data yet! Your daily scores will appear here as you track your footprint.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card progress-container section-gap">
      <div className="card-title">
        <span className="card-title-icon">📈</span>
        7-Day Progress
      </div>
      <div className="chart-wrapper">
        <div className="chart-bars">
          {entries.map((entry, i) => {
            const height = entry.hasData
              ? Math.max((entry.score / maxScore) * 100, 8)
              : 4;
            const barColor = entry.hasData
              ? getScoreColor(entry.score)
              : 'rgba(255,255,255,0.06)';

            return (
              <div key={entry.date} className="chart-bar-group">
                <div
                  className="chart-bar"
                  style={{
                    height: `${height}%`,
                    background: entry.hasData
                      ? `linear-gradient(180deg, ${barColor}, ${barColor}88)`
                      : barColor,
                    transitionDelay: `${i * 0.08}s`,
                  }}
                >
                  {entry.hasData && (
                    <div className="chart-bar-tooltip">
                      {entry.score.toFixed(1)} kg
                    </div>
                  )}
                </div>
                <span className={`chart-label${entry.isToday ? ' today' : ''}`}>
                  {entry.isToday ? 'Today' : entry.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="chart-legend">
          <div className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: 'var(--score-green)' }} />
            &lt; 5 kg
          </div>
          <div className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: 'var(--score-yellow)' }} />
            5–15 kg
          </div>
          <div className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: 'var(--score-red)' }} />
            &gt; 15 kg
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───

function App() {
  // Form state
  const [transport, setTransport] = useState('');
  const [transportDistance, setTransportDistance] = useState('');
  const [electricityUnits, setElectricityUnits] = useState('');
  const [hasGas, setHasGas] = useState(false);
  const [hasSolar, setHasSolar] = useState(false);
  const [foodType, setFoodType] = useState('');
  const [shoppingType, setShoppingType] = useState('');

  // Results
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef(null);

  // Stable tips ref to avoid re-randomizing on re-render
  const tipsRef = useRef(null);

  const transportOptions = [
    { key: 'car-petrol', label: 'Car (Petrol)', icon: '⛽' },
    { key: 'car-diesel', label: 'Car (Diesel)', icon: '🛢️' },
    { key: 'car-electric', label: 'Car (EV)', icon: '🔋' },
    { key: 'bus', label: 'Bus', icon: '🚌' },
    { key: 'train', label: 'Train', icon: '🚆' },
    { key: 'flight', label: 'Flight', icon: '✈️' },
    { key: 'walk-cycle', label: 'Walk / Cycle', icon: '🚶' },
  ];

  const foodOptions = [
    { key: 'meat-heavy', label: 'Meat-heavy', icon: '🥩' },
    { key: 'mixed', label: 'Mixed', icon: '🍱' },
    { key: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { key: 'vegan', label: 'Vegan', icon: '🌱' },
  ];

  const shoppingOptions = [
    { key: 'electronics', label: 'Electronics', icon: '📱' },
    { key: 'clothes', label: 'Clothes', icon: '👕' },
    { key: 'none', label: 'No shopping', icon: '✨' },
  ];

  const canSubmit = transport && foodType && shoppingType;

  const calculateFootprint = useCallback(() => {
    // Transport: per-km factor × distance
    const km = parseFloat(transportDistance) || 0;
    const transportCO2 = (TRANSPORT_PER_KM[transport] || 0) * km;

    // Energy: electricity + gas toggle + solar reduction
    const elec = parseFloat(electricityUnits) || 0;
    let energyCO2 = elec * ELECTRICITY_FACTOR;
    if (hasGas) energyCO2 += GAS_DAILY_EMISSION;
    if (hasSolar) energyCO2 *= (1 - SOLAR_REDUCTION);

    const foodCO2 = FOOD_FACTORS[foodType] || 0;
    const shoppingCO2 = SHOPPING_FACTORS[shoppingType] || 0;

    const totalScore = transportCO2 + energyCO2 + foodCO2 + shoppingCO2;
    const breakdown = {
      transport: transportCO2,
      energy: energyCO2,
      food: foodCO2,
      shopping: shoppingCO2,
    };

    saveToHistory(totalScore, breakdown);
    tipsRef.current = null; // Reset tips on new calc

    setResults({ totalScore, breakdown });
    setShowResults(true);

    // Smooth scroll to results after a brief delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, [transport, transportDistance, electricityUnits, hasGas, hasSolar, foodType, shoppingType]);

  const handleReset = () => {
    setShowResults(false);
    setResults(null);
    setTransport('');
    setTransportDistance('');
    setElectricityUnits('');
    setHasGas(false);
    setHasSolar(false);
    setFoodType('');
    setShoppingType('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Render ──
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="header-logo-icon">🌿</div>
          <h1>EcoTrack</h1>
        </div>
        <p className="header-subtitle">Track your daily carbon footprint</p>
      </header>

      {/* Show either form or results */}
      {!showResults ? (
        <InputForm
          transport={transport} setTransport={setTransport}
          transportDistance={transportDistance} setTransportDistance={setTransportDistance}
          electricityUnits={electricityUnits} setElectricityUnits={setElectricityUnits}
          hasGas={hasGas} setHasGas={setHasGas}
          hasSolar={hasSolar} setHasSolar={setHasSolar}
          foodType={foodType} setFoodType={setFoodType}
          shoppingType={shoppingType} setShoppingType={setShoppingType}
          transportOptions={transportOptions}
          foodOptions={foodOptions}
          shoppingOptions={shoppingOptions}
          canSubmit={canSubmit}
          onSubmit={calculateFootprint}
        />
      ) : (
        <ResultsView
          results={results}
          tipsRef={tipsRef}
          onBack={handleReset}
        />
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '32px 0 16px',
        color: 'var(--text-dim)',
        fontSize: '0.82rem',
        fontWeight: 400,
      }}>
        Made with 💚 for the planet · All calculations run locally in your browser
      </footer>
    </div>
  );
}

// ── Input Form Component ──

function InputForm({
  transport, setTransport,
  transportDistance, setTransportDistance,
  electricityUnits, setElectricityUnits,
  hasGas, setHasGas,
  hasSolar, setHasSolar,
  foodType, setFoodType,
  shoppingType, setShoppingType,
  transportOptions, foodOptions, shoppingOptions,
  canSubmit, onSubmit,
}) {
  return (
    <div className="card">
      <div className="card-title">
        <span className="card-title-icon">📝</span>
        Log Today's Activities
      </div>

      {/* Transport */}
      <div className="form-section">
        <div className="section-label">
          <span>🚗 Transport</span>
        </div>
        <div className="option-grid">
          {transportOptions.map((opt) => (
            <OptionButton
              key={opt.key}
              id={`transport-${opt.key}`}
              label={opt.label}
              icon={opt.icon}
              selected={transport === opt.key}
              onClick={() => setTransport(opt.key)}
            />
          ))}
        </div>
        {transport && transport !== 'walk-cycle' && (
          <div className="number-input-group" style={{ marginTop: 12 }}>
            <input
              id="distance-input"
              type="number"
              className="number-input"
              placeholder="0"
              min="0"
              value={transportDistance}
              onChange={(e) => setTransportDistance(e.target.value)}
            />
            <span className="number-input-label">km travelled today</span>
          </div>
        )}
      </div>

      {/* Home Energy */}
      <div className="form-section">
        <div className="section-label">
          <span>⚡ Home Energy</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="number-input-group">
            <input
              id="electricity-input"
              type="number"
              className="number-input"
              placeholder="0"
              min="0"
              value={electricityUnits}
              onChange={(e) => setElectricityUnits(e.target.value)}
            />
            <span className="number-input-label">kWh electricity used today</span>
          </div>
          <div className="number-input-group">
            <span className="number-input-label" style={{ marginRight: 4 }}>Gas usage?</span>
            <div className="toggle-group">
              <button
                id="gas-yes"
                type="button"
                className={`toggle-btn${hasGas ? ' active' : ''}`}
                onClick={() => setHasGas(true)}
              >
                🔥 Yes
              </button>
              <button
                id="gas-no"
                type="button"
                className={`toggle-btn${!hasGas ? ' active' : ''}`}
                onClick={() => setHasGas(false)}
              >
                No
              </button>
            </div>
          </div>
          <div className="number-input-group">
            <span className="number-input-label" style={{ marginRight: 4 }}>Solar panels?</span>
            <div className="toggle-group">
              <button
                id="solar-yes"
                type="button"
                className={`toggle-btn${hasSolar ? ' active' : ''}`}
                onClick={() => setHasSolar(true)}
              >
                ☀️ Yes
              </button>
              <button
                id="solar-no"
                type="button"
                className={`toggle-btn${!hasSolar ? ' active' : ''}`}
                onClick={() => setHasSolar(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Food */}
      <div className="form-section">
        <div className="section-label">
          <span>🍽️ Food</span>
        </div>
        <div className="option-grid">
          {foodOptions.map((opt) => (
            <OptionButton
              key={opt.key}
              id={`food-${opt.key}`}
              label={opt.label}
              icon={opt.icon}
              selected={foodType === opt.key}
              onClick={() => setFoodType(opt.key)}
            />
          ))}
        </div>
      </div>

      {/* Shopping */}
      <div className="form-section">
        <div className="section-label">
          <span>🛍️ Shopping</span>
        </div>
        <div className="option-grid">
          {shoppingOptions.map((opt) => (
            <OptionButton
              key={opt.key}
              id={`shopping-${opt.key}`}
              label={opt.label}
              icon={opt.icon}
              selected={shoppingType === opt.key}
              onClick={() => setShoppingType(opt.key)}
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        id="submit-btn"
        className="submit-btn"
        onClick={onSubmit}
        disabled={!canSubmit}
        style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
      >
        <span>📊</span>
        Calculate My Footprint
      </button>
    </div>
  );
}

// ── Results View ──

function ResultsView({ results, tipsRef, onBack }) {
  const { totalScore, breakdown } = results;
  const avgIndianDaily = 1900 / 365; // 1.9 tons/year → kg/day
  const avgWorldDaily = 4700 / 365;  // 4.7 tons/year → kg/day

  // Generate tips once and cache in ref
  if (!tipsRef.current) {
    const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    const topCategories = sorted.slice(0, 3).map(([key]) => key);
    const tips = [];
    const seenTitles = new Set();

    for (const cat of topCategories) {
      const pool = TIPS_DB[cat] || TIPS_DB.transport;
      // Shuffle and pick one not yet seen
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      for (const tip of shuffled) {
        if (!seenTitles.has(tip.title)) {
          seenTitles.add(tip.title);
          tips.push(tip);
          break;
        }
      }
    }
    while (tips.length < 3) {
      const allTips = Object.values(TIPS_DB).flat();
      const tip = allTips[Math.floor(Math.random() * allTips.length)];
      if (!seenTitles.has(tip.title)) {
        seenTitles.add(tip.title);
        tips.push(tip);
      }
    }
    tipsRef.current = tips;
  }

  return (
    <div className="results-container">
      <button id="back-btn" className="back-btn" onClick={onBack}>
        ← Track New Day
      </button>

      {/* Score Gauge */}
      <div className="card gauge-card">
        <div className="card-title">
          <span className="card-title-icon">🎯</span>
          Your Daily Carbon Score
        </div>
        <GaugeChart score={totalScore} />
      </div>

      {/* Comparisons */}
      <div className="results-grid section-gap">
        <ComparisonCard
          label="Average Indian"
          avgKgDay={avgIndianDaily}
          userKgDay={totalScore}
          color="var(--score-green)"
        />
        <ComparisonCard
          label="World Average"
          avgKgDay={avgWorldDaily}
          userKgDay={totalScore}
          color="var(--score-yellow)"
        />
      </div>

      {/* Category Breakdown */}
      <div className="section-gap">
        <CategoryBreakdown breakdown={breakdown} />
      </div>

      {/* Tips */}
      <div className="card tips-container section-gap">
        <div className="card-title">
          <span className="card-title-icon">💡</span>
          Personalized Tips
        </div>
        <div className="tips-grid">
          {tipsRef.current.slice(0, 3).map((tip, i) => (
            <div key={i} className="tip-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="tip-number">{i + 1}</div>
              <div className="tip-content">
                <div className="tip-title">{tip.title}</div>
                <div className="tip-desc">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Chart */}
      <ProgressChart />
    </div>
  );
}

// ─── Mount ───

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
