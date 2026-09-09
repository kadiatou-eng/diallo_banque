import { useState } from 'react';
import { Calculator, Check, Zap, Clock, EyeOff } from 'lucide-react';

const advantages = [
  {
    icon: Zap,
    title: 'Taux compétitifs',
    text: "Profitez de taux d\u2019intérêt parmi les plus bas du marché.",
  },
  {
    icon: Clock,
    title: 'Réponse rapide',
    text: 'Obtenez une réponse de principe en moins de 24 heures.',
  },
  {
    icon: EyeOff,
    title: 'Sans frais cachés',
    text: 'Transparence totale, aucun frais surprise sur votre prêt.',
  },
];

function formatEuro(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function Pret() {
  const [amount, setAmount] = useState('20000');
  const [duration, setDuration] = useState('24');
  const [result, setResult] = useState<null | {
    monthly: number;
    total: number;
    interest: number;
    rate: number;
  }>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const principal = parseFloat(amount) || 0;
    const months = parseInt(duration) || 1;
    const annualRate = months <= 12 ? 0.039 : months <= 36 ? 0.049 : months <= 60 ? 0.059 : 0.069;
    const monthlyRate = annualRate / 12;
    const monthly =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const total = monthly * months;
    const interest = total - principal;

    setResult({ monthly, total, interest, rate: annualRate * 100 });
  };

  return (
    <div className="page">
      <div className="container page-inner fade-in">
        <section className="hero" style={{ paddingTop: 16, paddingBottom: 32 }}>
          <span className="hero-badge">
            <Calculator size={14} />
            Simulation
          </span>
          <h1 className="hero-title">
            Prêt <span className="text-gold">bancaire</span>
          </h1>
          <p className="hero-subtitle">
            Simulez votre prêt en quelques secondes et découvrez vos mensualités.
          </p>
        </section>

        <form className="card form-card" onSubmit={handleSimulate}>
          <div className="form-group">
            <label className="form-label">Montant du prêt (€)</label>
            <input
              type="number"
              className="form-input"
              placeholder="20000"
              min="1000"
              step="100"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="form-hint">Montant minimum : 1 000 €</p>
          </div>

          <div className="form-group">
            <label className="form-label">Durée de remboursement (mois)</label>
            <select
              className="form-select"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="12">12 mois (1 an)</option>
              <option value="24">24 mois (2 ans)</option>
              <option value="36">36 mois (3 ans)</option>
              <option value="48">48 mois (4 ans)</option>
              <option value="60">60 mois (5 ans)</option>
              <option value="84">84 mois (7 ans)</option>
              <option value="120">120 mois (10 ans)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            <Calculator size={18} />
            Simuler mon prêt
          </button>
        </form>

        {result && (
          <div className="result-box form-card" style={{ maxWidth: 560 }}>
            <h3 className="section-title" style={{ fontSize: '1.3rem', marginBottom: 16 }}>
              Résultat de la simulation
            </h3>
            <div className="result-row">
              <span className="result-label">Mensualité</span>
              <span className="result-value gold">{formatEuro(result.monthly)}</span>
            </div>
            <div className="result-row">
              <span className="result-label">Taux d'intérêt annuel</span>
              <span className="result-value">{result.rate.toFixed(2)} %</span>
            </div>
            <div className="result-row">
              <span className="result-label">Coût total des intérêts</span>
              <span className="result-value red">{formatEuro(result.interest)}</span>
            </div>
            <div className="result-row result-total">
              <span className="result-label">Montant total à rembourser</span>
              <span className="result-value gold">{formatEuro(result.total)}</span>
            </div>
          </div>
        )}

        {/* Advantages */}
        <div style={{ marginTop: 56 }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Pourquoi choisir DialloBank ?
          </h2>
          <div className="advantages">
            {advantages.map((a) => (
              <div key={a.title} className="advantage-card">
                <div className="advantage-check">
                  <Check size={22} />
                </div>
                <h3 className="advantage-title">{a.title}</h3>
                <p className="advantage-text">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
