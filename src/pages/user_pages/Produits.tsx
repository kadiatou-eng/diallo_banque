import { PiggyBank, CreditCard, Landmark, ArrowRight, Sparkles } from 'lucide-react';

const products = [
  {
    icon: PiggyBank,
    title: 'Compte Épargne',
    text: "Faites fructifier votre argent avec un taux d\u2019intérêt attractif et un accès permanent à vos fonds.",
    features: ["Taux jusqu\u2019à 3,5 %", "Sans frais d\u2019ouverture", "Retrait libre"],
  },
  {
    icon: CreditCard,
    title: 'Carte Visa Gold',
    text: "Une carte premium avec plafonds élevés, assurances incluses et cashback sur tous vos achats.",
    features: ['Cashback 2 %', 'Assurance voyage', 'Plafond 8 000 €/mois'],
  },
  {
    icon: Landmark,
    title: 'Compte Courant',
    text: "Un compte complet pour gérer votre quotidien : virements, prélèvements et carte bancaire incluse.",
    features: ['Carte incluse', 'Virements illimités', 'App mobile premium'],
  },
];

export default function Produits() {
  return (
    <div className="page">
      <div className="container page-inner fade-in">
        <section className="hero" style={{ paddingTop: 16, paddingBottom: 32 }}>
          <span className="hero-badge">
            <Sparkles size={14} />
            Catalogue
          </span>
          <h1 className="hero-title">
            Nos <span className="text-gold">produits</span>
          </h1>
          <p className="hero-subtitle">
            Découvrez la gamme complète de produits bancaires DialloBank.
          </p>
        </section>

        <div className="produits-grid">
          {products.map((p, i) => (
            <div
              key={p.title}
              className={`produit-card fade-in-delay-${i + 1}`}
            >
              <div className="produit-halo" />
              <div className="produit-icon">
                <p.icon size={28} color="var(--gold)" strokeWidth={2} />
              </div>
              <h3 className="produit-title">{p.title}</h3>
              <p className="produit-text">{p.text}</p>
              <ul className="produit-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="produit-action">
                <button className="btn-outline">
                  En savoir plus
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
