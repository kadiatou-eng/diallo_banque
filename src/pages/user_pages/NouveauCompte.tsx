import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, UserPlus } from 'lucide-react';
import axios from 'axios';

export default function NouveauCompte() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [created, setCreated] = useState(false);
  const [form, setForm] = useState({
    name: '',
    accountType: 'courant',
    initialAmount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/comptes', {
        montant: parseFloat(form.initialAmount) || 0,
        nomCompte: form.name,
        typeCompte: form.accountType,
      });

      if (response.status === 200) {
        console.log('Compte créé avec succès :', response.data);
        setCreated(true);
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
    }
  };

  if (created) {
    return (
      <div className="page">
        <div className="container page-inner fade-in" style={{ textAlign: 'center' }}>
          <div className="card form-card" style={{ textAlign: 'center' }}>
            <CheckCircle2 size={56} color="var(--gold)" style={{ margin: '0 auto 20px' }} />
            <h2 className="section-title">Compte créé avec succès !</h2>
            <p className="section-subtitle" style={{ margin: '12px auto 28px' }}>
              Votre compte « {form.name || 'Nouveau compte'} » est maintenant actif.
            </p>
            <button className="btn-primary" onClick={() => navigate('/comptes')}>
              <ArrowLeft size={18} />
              Retour aux comptes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container page-inner fade-in">
        <section className="hero" style={{ paddingTop: 16, paddingBottom: 32 }}>
          <span className="hero-badge">
            <UserPlus size={14} />
            Nouveau compte
          </span>
          <h1 className="hero-title">
            Créer un <span className="text-gold">compte</span>
          </h1>
          <p className="hero-subtitle">
            Ouvrez un nouveau compte bancaire en quelques secondes.
          </p>
        </section>

        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du compte</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Compte Vacances"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type de compte</label>
              <select
                className="form-select"
                value={form.accountType}
                onChange={(e) => setForm({ ...form, accountType: e.target.value })}
              >
                <option value="courant">Compte Courant</option>
                <option value="epargne">Compte Épargne</option>
                <option value="wallet">Portefeuille</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Montant initial (€)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0,00"
                min="0"
                step="0.01"
                value={form.initialAmount}
                onChange={(e) => setForm({ ...form, initialAmount: e.target.value })}
              />
            </div>
          </div>

          <label className="checkbox-group">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span className="checkbox-custom">
              {accepted && <CheckCircle2 size={14} color="var(--navy)" />}
            </span>
            <span className="checkbox-label">
              J'accepte les <span className="link">conditions générales</span> et la
              politique de confidentialité de DialloBank.
            </span>
          </label>

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={!accepted}>
            Créer mon compte
          </button>

          <p className="form-hint" style={{ textAlign: 'center', marginTop: 16 }}>
            Votre compte sera actif immédiatement après création.
          </p>
        </form>
      </div>
    </div>
  );
}
