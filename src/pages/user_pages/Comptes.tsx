import { Link, useNavigate } from 'react-router-dom';
import VirementAction from "./virements/VirementAction";
import { useUser } from "@clerk/clerk-react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet as WalletIcon,
  Landmark,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Compte {
  id: string;
  nomCompte: string;
  typeCompte: string;
  montant: number;
  numCard: string;
}

const Comptes = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // ✅ récupère l'utilisateur connecté
  const userId = user?.id;
  const role = user?.publicMetadata?.role || "user";

  const [comptes, setComptes] = useState<Compte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComptes = async () => {
      if (!userId) return; // ⚠️ attendre que Clerk charge l'utilisateur

      try {
        const response = await fetch(
          `http://localhost:8080/comptes?userId=${userId}&role=${role}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const data = await response.json();

        if (Array.isArray(data)) {
          const comptesFormatted = data.map((c: any) => ({
            ...c,
            montant: parseFloat(c.montant),
          }));
          setComptes(comptesFormatted);
        } else {
          console.error("Réponse inattendue :", data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des comptes :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComptes();
  }, [userId, role]); // ✅ relancer quand Clerk charge l'utilisateur

  // 🔹 Calculs dynamiques
  const soldeTotal = comptes.reduce((acc, c) => acc + c.montant, 0);
  const comptesActifs = comptes.length;

  const revenusMois = 4078.4;
  const depensesMois = 379.28;

  const summary = [
    { label: 'Solde total', value: `${soldeTotal.toFixed(2)} €`, color: 'var(--gold)', icon: Landmark },
    { label: 'Revenus (mois)', value: `+${revenusMois.toFixed(2)} €`, color: 'var(--green)', icon: TrendingUp },
    { label: 'Dépenses (mois)', value: `−${depensesMois.toFixed(2)} €`, color: 'var(--red)', icon: TrendingDown },
    { label: 'Comptes actifs', value: comptesActifs.toString(), color: 'var(--white)', icon: WalletIcon },
  ];

  return (
    <div className="page">
      <div className="container page-inner fade-in">
        {/* Hero */}
        <section className="hero" style={{ paddingTop: 16, paddingBottom: 32 }}>
          <span className="hero-badge">Espace Client</span>
          <h1 className="hero-title">
            Mes <span className="text-gold">Comptes</span>
          </h1>
          <p className="hero-subtitle">
            Gérez vos finances en toute sécurité et élégance.
          </p>
        </section>

        {/* Summary */}
        <div className="summary-grid">
          {summary.map((s) => (
            <div key={s.label} className="summary-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <s.icon size={18} color={s.color} />
                <span className="summary-label">{s.label}</span>
              </div>
              <p className="summary-value" style={{ color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Accounts */}
        <div className="page-header">
          <div>
            <span className="section-eyebrow">Vos comptes</span>
            <h2 className="section-title">Mes Comptes</h2>
          </div>
          <div className="page-header-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/nouveau-compte')}
            >
              <Plus size={18} />
              Ouvrir un compte
            </button>
              <VirementAction />
          </div>
        </div>

        <div className="accounts-grid">
          {loading ? (
            <p>Chargement des comptes...</p>
          ) : (
            comptes.map(({ id, nomCompte, typeCompte, montant, numCard}) => (
              <div key={id} className="account-card">
                <div className="account-card-glow" />
                <div className="account-card-top">
                  <span className="account-type">{typeCompte}</span>
                </div>
                <h3 className="account-name">{nomCompte}</h3>
                <p className="account-balance-label">Solde disponible</p>
                <p className="account-balance">{montant.toFixed(2)} €</p>
                <p className="account-number">{numCard}</p>
                <div className="account-actions">
                  <Link className="account-action" to={`/virement/${id}`}>
                    Virement
                  </Link>
                  <Link className="account-action" to={`/compte/${id}`}>
                    Détails
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comptes;
