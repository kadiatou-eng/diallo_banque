import { ShieldCheck, Zap, Smartphone } from 'lucide-react';

const cards = [
  {
    icon: ShieldCheck,
    title: 'Sécurité',
    text: 'Nous protégeons vos données et transactions avec des technologies de pointe.',
  },
  {
    icon: Zap,
    title: 'Rapidité',
    text: 'Effectuez vos opérations en quelques secondes, 24h/24 et 7j/7.',
  },
  {
    icon: Smartphone,
    title: 'Accessibilité',
    text: 'Accédez à vos comptes depuis votre mobile ou ordinateur.',
  },
];

export default function About() {
  return (
    <section id="apropos" className="about">
      <div className="container-base">
        <div className="about-header">
          <span className="section-eyebrow">Pourquoi nous choisir</span>
          <h2 className="section-title">La banque pensée pour vous</h2>
          <p className="section-subtitle">
            Trois engagements qui font de DialloBank votre partenaire de
            confiance au quotidien.
          </p>
        </div>

        <div className="about-cards">
          {cards.map((c) => (
            <div key={c.title} className="about-card group">
              <div className="about-card-overlay" />
              <div className="about-card-content">
                <span className="about-card-icon">
                  <c.icon className="w-7 h-7 text-gold" strokeWidth={2} />
                </span>
                <h3 className="about-card-title">{c.title}</h3>
                <p className="about-card-text">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
