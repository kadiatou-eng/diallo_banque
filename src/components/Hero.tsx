import { ShieldCheck, ArrowRight, CreditCard, Smartphone, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="accueil" className="hero">
      {/* Glow accents */}
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />

      <div className="hero-grid">
        {/* Left: copy */}
        <div className="hero-copy">
          <span className="hero-badge">
            <ShieldCheck className="w-4 h-4" />
            Banque 100% sécurisée
          </span>

          <h1 className="hero-title">
            Bienvenue dans <span className="text-gold">DialloBank</span>
          </h1>

          <p className="hero-subtitle">
            Gérez vos comptes et transactions en toute sécurité. Une expérience
            bancaire moderne, rapide et accessible à tout moment.
          </p>

          <div className="hero-buttons">
            <Link 
              to={"/sign-in"}
              className="btn-primary"
            >
              Se connecter
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to={"/sign-up"}
              className="btn-outline"
            >
              Créer un compte
            </Link>
          </div>

          {/* Mini stats */}
          <div className="hero-stats">
            {[
              { value: '150K+', label: 'Clients' },
              { value: '24/7', label: 'Support' },
              { value: '99.9%', label: 'Disponibilité' },
            ].map((s) => (
              <div key={s.label}>
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: card + phone illustration */}
        <div className="hero-visual">
          {/* Bank card */}
          <div className="bank-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gold" />
                  <span className="bank-card-brand">
                    Diallo<span className="text-gold">Bank</span>
                  </span>
                </div>
                <p className="bank-card-label">Carte Visa Gold</p>
              </div>
              <Wifi className="w-5 h-5 text-gold rotate-90" />
            </div>
            <div className="bank-card-number">5399 •••• •••• 8842</div>
            <div className="mt-6 flex justify-between items-end">
              <div>
                <p className="bank-card-holder-label">Titulaire</p>
                <p className="bank-card-holder-name">A. DIALLO</p>
              </div>
              <div className="bank-card-visa">VISA</div>
            </div>
            <div className="bank-card-shine" />
          </div>

          {/* Smartphone */}
          <div className="smartphone">
            <div className="smartphone-inner">
              {/* notch */}
              <div className="smartphone-notch">
                <div className="smartphone-notch-pill" />
              </div>
              {/* screen */}
              <div className="smartphone-screen">
                <div className="flex items-center gap-2">
                  <span className="phone-icon-wrapper">
                    <Smartphone className="w-3.5 h-3.5 text-gold" />
                  </span>
                  <span className="smartphone-brand">DialloBank</span>
                </div>

                {/* Balance */}
                <div className="smartphone-balance">
                  <p className="smartphone-balance-label">Solde total</p>
                  <p className="smartphone-balance-amount">12 480 €</p>
                  <p className="smartphone-balance-change">+ 2,4% ce mois</p>
                </div>

                <p className="smartphone-tx-label">Transactions</p>
                {[
                  { n: 'Amazon', a: '-54,99 €' },
                  { n: 'Salaire', a: '+3 200 €' },
                  { n: 'Netflix', a: '-17,99 €' },
                ].map((t) => (
                  <div key={t.n} className="smartphone-tx">
                    <span className="smartphone-tx-name">{t.n}</span>
                    <span
                      className={`tx-amount ${
                        t.a.startsWith('+') ? 'tx-positive' : 'tx-negative'
                      }`}
                    >
                      {t.a}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
