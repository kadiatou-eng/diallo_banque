import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Landmark, Menu, X, LogOut } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import logo from "../../public/logo.png";

const links = [
  { to: "/accueil", label: "Accueil" },
  { to: "/comptes", label: "Comptes" },
  { to: "/transactions", label: "Transactions" },
  { to: "/produits", label: "Produits" },
  { to: "/pret", label: "Prêt" },
];

export default function AuthNavbar() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <header className="bg-[#0b132b] text-white shadow-md">
      <nav className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/accueil" className="flex items-center gap-2">
          <img
            src={logo}
            alt="DialloBank Logo"
            className="w-40 h-20 hover:drop-shadow-[var(--shadow-gold)] transition"
            style={{ filter: "brightness(1.1)" }}
          />
        </Link>

        {/* Liens desktop */}
        <ul className={`hidden md:flex gap-6 text-sm font-medium`}>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `hover:text-gold transition ${
                    isActive ? "text-gold font-semibold" : ""
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Profil utilisateur (Clerk) */}
        <div className="hidden md:flex items-center gap-4">
          {
            isAdmin && (
              <Link
              to="/admin"
              className="btn-cta-sm bg-gold text-[#0b132b] hover:bg-[#e6c200]"
              >
                Tableau de bord
              </Link>
            )
          }
          <UserButton />
        </div>

        {/* Bouton menu mobile */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden bg-[#111a3a] px-6 py-4 space-y-3">
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `block hover:text-gold ${
                      isActive ? "text-gold font-semibold" : ""
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
