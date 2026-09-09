import { Landmark, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href="#accueil" className="footer-logo">
          <span className="footer-logo-icon">
            <Landmark className="w-4.5 h-4.5 text-gold" strokeWidth={2.4} />
          </span>
          <span className="footer-logo-text">
            Diallo<span className="text-gold">Bank</span>
          </span>
        </a>

        <p className="footer-text">
          © 2026 DialloBank — Sécurité et confiance avant tout.
          <Heart className="w-3.5 h-3.5 text-gold fill-gold" />
        </p>
      </div>
    </footer>
  );
}
