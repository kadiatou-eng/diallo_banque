import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  ArrowRight,
  CreditCard,
  PiggyBank,
  Wallet,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Sécurité de pointe',
    text: 'Vos données et transactions sont protégées par un chiffrement bancaire de niveau supérieur.',
  },
  {
    icon: Zap,
    title: 'Rapidité 24/7',
    text: 'Effectuez vos virements et paiements en quelques secondes, à tout moment de la journée.',
  },
  {
    icon: Smartphone,
    title: 'Accessible partout',
    text: 'Gérez vos comptes depuis votre mobile, votre tablette ou votre ordinateur.',
  },
];

const stats = [
  { value: '150K+', label: 'Clients satisfaits', icon: Users },
  { value: '24/7', label: 'Support disponible', icon: Clock },
  { value: '99,9%', label: 'Disponibilité', icon: TrendingUp },
  { value: '3', label: 'Comptes actifs', icon: CreditCard },
];

const shortcuts = [
  { to: '/comptes', icon: CreditCard, title: 'Mes Comptes', text: 'Consultez votre solde et gérez vos comptes' },
  { to: '/transactions', icon: Wallet, title: 'Transactions', text: 'Suivez toutes vos opérations en temps réel' },
  { to: '/pret', icon: PiggyBank, title: 'Simuler un prêt', text: 'Calculez vos mensualités en quelques clics' },
  { to: '/produits', icon: Sparkles, title: 'Nos produits', text: 'Découvrez notre gamme bancaire complète' },
];

export default function Accueil() {
  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container" style={{ position: 'relative' }}>
          <span className="hero-badge">
            <Sparkles size={14} />
            Bienvenue sur DialloBank
          </span>
          <h1 className="hero-title">
            Votre banque, <span className="text-gold">simple</span> et <span className="text-gold">sécurisée</span>
          </h1>
          <p className="hero-subtitle">
            Gérez vos comptes, suivez vos transactions et simulez vos prêts —
            le tout dans une interface élégante et intuitive.
          </p>
          <div className="hero-actions">
            <Link to="/comptes" className="btn-primary">
              Accéder à mes comptes
              <ArrowRight size={18} />
            </Link>
            <Link to="/produits" className="btn-outline">
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="container" style={{ marginTop: 16 }}>
        <div className="summary-grid">
          {stats.map((s) => (
            <div key={s.label} className="summary-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <s.icon size={18} color="var(--gold)" />
                <span className="summary-label">{s.label}</span>
              </div>
              <p className="summary-value" style={{ color: 'var(--white)' }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="container page-inner" style={{ paddingTop: 48 }}>
        <div className="page-header">
          <div>
            <span className="section-eyebrow">Raccourcis</span>
            <h2 className="section-title">Accès rapide</h2>
          </div>
        </div>

        <div className="accounts-grid">
          {shortcuts.map((s) => (
            <Link key={s.to} to={s.to} className="account-card" style={{ display: 'block' }}>
              <div className="account-card-glow" />
              <div className="account-card-top">
                <span className="account-icon">
                  <s.icon size={24} color="var(--gold)" strokeWidth={2} />
                </span>
              </div>
              <h3 className="account-name">{s.title}</h3>
              <p className="account-text" style={{ fontSize: '0.85rem', color: 'var(--gray-muted)', marginTop: 8, lineHeight: 1.5 }}>
                {s.text}
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                Accéder
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="container" style={{ paddingBottom: 64 }}>
        <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto 40px' }}>
          <span className="section-eyebrow">Pourquoi DialloBank</span>
          <h2 className="section-title">La banque pensée pour vous</h2>
          <p className="section-subtitle" style={{ margin: '8px auto 0' }}>
            Trois engagements qui font de DialloBank votre partenaire de confiance au quotidien.
          </p>
        </div>

        <div className="produits-grid">
          {features.map((f) => (
            <div key={f.title} className="produit-card">
              <div className="produit-halo" />
              <div className="produit-icon">
                <f.icon size={28} color="var(--gold)" strokeWidth={2} />
              </div>
              <h3 className="produit-title">{f.title}</h3>
              <p className="produit-text">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
