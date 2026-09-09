import { useState } from 'react';
import { Landmark, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, UserButton, useUser } from '@clerk/clerk-react';
import logo from "../../public/logo.png";


const links = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="navbar">
      <nav className="navbar-nav">
        {/* Logo */}
        <a href="/" className="navbar-logo group">
          <img
            src={logo}
            alt="DialloBank Logo"
            className="w-40 h-20 hover:drop-shadow-[var(--shadow-gold)] transition"
            style={{ filter: "brightness(1.1)" }}
          />
        </a>

        {/* Desktop links */}
        <ul className="navbar-links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="navbar-link">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        {
          isSignedIn ? (
            <UserButton />
          ) : (
            <Link 
              to={"/sign-up"} 
              className="btn-cta-sm hidden lg:inline-flex"
            >
              Inscription
            </Link>
          )
        }

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="navbar-toggle"
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="navbar-mobile">
          <ul className="navbar-mobile-list">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="navbar-mobile-link"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#inscription"
                onClick={() => setOpen(false)}
                className="navbar-mobile-cta"
              >
                Inscription
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
