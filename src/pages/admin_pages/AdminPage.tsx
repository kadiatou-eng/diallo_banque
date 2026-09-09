import { useState, useEffect, useCallback } from 'react';
import {
  Landmark,
  LayoutDashboard,
  CreditCard,
  Landmark as LoanIcon,
  ArrowLeftRight,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Check,
  XCircle,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import logo from "../../public/logo.png";
import axios from "axios";
// import { networkInterfaces } from 'os';

/* ============================================================
   TYPES
   ============================================================ */
interface Compte {
  id: number;
  nom: string;
  type: string;
  solde: number;
}


interface Pret {
  id: number;
  client: string;
  montant: number;
  duree: number;
  statut: 'pending' | 'approved' | 'rejected';
}

interface Transaction {
  id: number;
  client: string;
  type: 'deposit' | 'withdraw' | 'payment';
  montant: number;
  date: string;
}

interface User {
  id: number;
  nom: string;
  email: string;
  role: 'admin' | 'user';
}

type Section =
  | 'dashboard'
  | 'comptes'
  | 'prets'
  | 'transactions'
  | 'utilisateurs'
  | 'parametres';

/* ============================================================
   API (axios)
   ============================================================ */
const API_BASE = 'http://localhost:8080/admin';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

async function apiFetch<T>(path: string): Promise<T> {
  const res = await api.get<T>(path);
  return res.data;
}

async function apiSend<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  body?: unknown
): Promise<T> {
  const res = await api.request<T>({
    url: path,
    method,
    data: body,
  });
  return res.data;
}

/* ============================================================
   HELPERS
   ============================================================ */
function formatEuro(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/* ============================================================
   NAVIGATION CONFIG
   ============================================================ */
const navItems: { key: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'comptes', label: 'Comptes', icon: CreditCard },
  { key: 'prets', label: 'Prêts', icon: LoanIcon },
  { key: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { key: 'utilisateurs', label: 'Utilisateurs', icon: Users },
  { key: 'parametres', label: 'Paramètres', icon: Settings },
];

const sectionTitles: Record<Section, string> = {
  dashboard: 'Tableau de bord',
  comptes: 'Gestion des comptes',
  prets: 'Demandes de prêts',
  transactions: 'Transactions',
  utilisateurs: 'Gestion des utilisateurs',
  parametres: 'Paramètres',
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function AdminPage() {
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [comptes, setComptes] = useState<Compte[]>([]);
  const [prets, setPrets] = useState<Pret[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { signOut } = useClerk();

  /* ---- Data loading depuis le backend ---- */
  const loadComptes = useCallback(async () => {
    try {
      const data = await apiFetch<Compte[]>('/comptes');
      setComptes(data);
    } catch (err) {
      console.error('Erreur chargement comptes:', err);
      setError("Impossible de charger les comptes depuis le serveur.");
    }
  }, []);

  const loadPrets = useCallback(async () => {
    try {
      const data = await apiFetch<Pret[]>('/prets');
      setPrets(data);
    } catch (err) {
      console.error('Erreur chargement prêts:', err);
      setError("Impossible de charger les prêts depuis le serveur.");
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      const data = await apiFetch<Transaction[]>('/transactions');
      setTransactions(data);
    } catch (err) {
      console.error('Erreur chargement transactions:', err);
      setError("Impossible de charger les transactions depuis le serveur.");
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const data = await apiFetch<User[]>('/users');
      setUsers(data);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setError("Impossible de charger les utilisateurs depuis le serveur.");
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([loadComptes(), loadPrets(), loadTransactions(), loadUsers()]);
      setLoading(false);
    };
    loadAll();
  }, [loadComptes, loadPrets, loadTransactions, loadUsers]);

  /* ---- CRUD: Comptes ---- */
  const [newCompte, setNewCompte] = useState({ nom: '', type: 'Courant', solde: '' });

  const handleAddCompte = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompte.nom || !newCompte.solde) return;
    const payload = {
      nom: newCompte.nom,
      type: newCompte.type,
      solde: parseFloat(newCompte.solde),
    };
    try {
      const created = await apiSend<Compte>('/comptes', 'POST', payload);
      setComptes((prev) => [...prev, created]);
      setNewCompte({ nom: '', type: 'Courant', solde: '' });
    } catch (err) {
      console.error('Erreur ajout compte:', err);
      setError("Échec de l'ajout du compte.");
    }
  };

  const handleDeleteCompte = async (id: number) => {
    try {
      await apiSend<void>(`/comptes/${id}`, 'DELETE');
      setComptes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Erreur suppression compte:', err);
      setError('Échec de la suppression du compte.');
    }
  };

  /* ---- CRUD: Prêts ---- */
  const handlePretAction = async (id: number, statut: 'approved' | 'rejected') => {
    try {
      const updated = await apiSend<Pret>(`/prets/${id}`, 'PATCH', { statut });
      setPrets((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    } catch (err) {
      console.error('Erreur mise à jour prêt:', err);
      setError('Échec de la mise à jour du prêt.');
    }
  };

  /* ---- CRUD: Users ---- */
  const handleChangeRole = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const updated = await apiSend<User>(`/users/${id}`, 'PATCH', { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    } catch (err) {
      console.error('Erreur changement de rôle:', err);
      setError("Échec du changement de rôle.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await apiSend<void>(`/users/${id}`, 'DELETE');
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Erreur suppression utilisateur:', err);
      setError("Échec de la suppression de l'utilisateur.");
    }
  };

  /* ---- Derived stats ---- */
  const comptesActifs = comptes.length;
  const volumeTransactions = transactions.reduce((sum, t) => sum + Math.abs(t.montant), 0);
  const pretsEnCours = prets.filter((p) => p.statut === 'pending').length;
  const alertes = prets.filter((p) => p.statut === 'pending').length + users.filter((u) => u.role === 'user').length;

  return (
    <div className="admin-layout">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="DialloBank Logo"
            className="w-44 h-24 hover:drop-shadow-[var(--shadow-gold)] transition"
            style={{ filter: "brightness(1.1)" }}
          />
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${section === item.key ? 'active' : ''}`}
              onClick={() => {
                setSection(item.key);
                setSidebarOpen(false);
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-nav-item" onClick={() => signOut()}>
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>


      {/* Main area */}
      <div className="admin-main">
        {/* Content */}
        <div className="admin-content">
          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: '12px 18px',
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--red)',
                fontSize: '0.85rem',
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="admin-empty">Chargement des données…</div>
          ) : (
            <>
              {section === 'dashboard' && (
                <Dashboard
                  comptesActifs={comptesActifs}
                  volumeTransactions={volumeTransactions}
                  pretsEnCours={pretsEnCours}
                  alertes={alertes}
                  recentTransactions={transactions.slice(0, 5)}
                />
              )}

              {section === 'comptes' && (
                <ComptesSection
                  comptes={comptes}
                  newCompte={newCompte}
                  setNewCompte={setNewCompte}
                  onAdd={handleAddCompte}
                  onDelete={handleDeleteCompte}
                />
              )}

              {section === 'prets' && (
                <PretsSection prets={prets} onAction={handlePretAction} />
              )}

              {section === 'transactions' && <TransactionsSection transactions={transactions} />}

              {section === 'utilisateurs' && (
                <UsersSection
                  users={users}
                  onChangeRole={handleChangeRole}
                  onDelete={handleDeleteUser}
                />
              )}

              {section === 'parametres' && <ParametresSection />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({
  comptesActifs,
  volumeTransactions,
  pretsEnCours,
  alertes,
  recentTransactions,
}: {
  comptesActifs: number;
  volumeTransactions: number;
  pretsEnCours: number;
  alertes: number;
  recentTransactions: Transaction[];
}) {
  const stats = [
    { label: 'Comptes actifs', value: String(comptesActifs), icon: CreditCard, color: 'gold' as const, change: '+2 ce mois' },
    { label: 'Volume transactions', value: formatEuro(volumeTransactions), icon: TrendingUp, color: 'green' as const, change: '+12,5%' },
    { label: 'Prêts en cours', value: String(pretsEnCours), icon: LoanIcon, color: 'blue' as const, change: '3 en attente' },
    { label: 'Alertes', value: String(alertes), icon: AlertTriangle, color: 'red' as const, change: 'À traiter' },
  ];

  return (
    <div>
      {/* Stat cards */}
      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-top">
              <span className={`admin-stat-icon ${s.color}`}>
                <s.icon size={22} />
              </span>
            </div>
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value">{s.value}</p>
            <p
              className="admin-stat-change"
              style={{ color: s.color === 'red' ? 'var(--red)' : s.color === 'green' ? 'var(--green)' : 'var(--gray-muted)' }}
            >
              {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <h2 className="section-title" style={{ fontSize: '1.3rem', marginBottom: 16 }}>
        Transactions récentes
      </h2>
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Client</th>
                <th className="admin-th">Type</th>
                <th className="admin-th">Montant</th>
                <th className="admin-th">Date</th>
              </tr>
            </thead>
            <tbody className="admin-tbody">
              {recentTransactions.map((t) => (
                <tr key={t.id}>
                  <td className="admin-td">
                    <div className="admin-cell-name">
                      <span className="admin-cell-avatar">{initials(t.client)}</span>
                      {t.client}
                    </div>
                  </td>
                  <td className="admin-td">
                    <span className={`tx-badge ${t.type}`}>
                      {t.type === 'deposit' ? 'Dépôt' : t.type === 'withdraw' ? 'Retrait' : 'Paiement'}
                    </span>
                  </td>
                  <td className={`admin-td tx-amount ${t.type}`}>
                    {t.type === 'deposit' ? '+' : '−'}
                    {formatEuro(t.montant)}
                  </td>
                  <td className="admin-td muted">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPTES SECTION
   ============================================================ */
function ComptesSection({
  comptes,
  newCompte,
  setNewCompte,
  onAdd,
  onDelete,
}: {
  comptes: Compte[];
  newCompte: { nom: string; type: string; solde: string };
  setNewCompte: React.Dispatch<React.SetStateAction<{ nom: string; type: string; solde: string }>>;
  onAdd: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div>
      {/* Add form */}
      <form className="admin-form-inline" onSubmit={onAdd}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Nom du compte</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Compte Vacances"
            value={newCompte.nom}
            onChange={(e) => setNewCompte((p) => ({ ...p, nom: e.target.value }))}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={newCompte.type}
            onChange={(e) => setNewCompte((p) => ({ ...p, type: e.target.value }))}
          >
            <option value="Courant">Courant</option>
            <option value="Épargne">Épargne</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Solde (€)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0,00"
            min="0"
            step="0.01"
            value={newCompte.solde}
            onChange={(e) => setNewCompte((p) => ({ ...p, solde: e.target.value }))}
            required
          />
        </div>
        <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
          <Plus size={18} />
          Ajouter
        </button>
      </form>

      {/* Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Nom</th>
                <th className="admin-th">Type</th>
                <th className="admin-th">Solde</th>
                <th className="admin-th" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="admin-tbody">
              {comptes.length > 0 ? (
                comptes.map((c) => (
                  <tr key={c.id}>
                    <td className="admin-td">
                      <div className="admin-cell-name">
                        <span className="admin-cell-avatar">
                          <CreditCard size={15} />
                        </span>
                        {c.nom}
                      </div>
                    </td>
                    <td className="admin-td muted">{c.type}</td>
                    <td className="admin-td" style={{ color: 'var(--gold)', fontWeight: 600, fontFamily: 'Courier New, monospace' }}>
                      {formatEuro(c.solde)}
                    </td>
                    <td className="admin-td">
                      <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="admin-action-btn" title="Modifier">
                          <Pencil size={15} />
                        </button>
                        <button
                          className="admin-action-btn danger"
                          title="Supprimer"
                          onClick={() => onDelete(c.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="admin-empty">Aucun compte.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PRETS SECTION
   ============================================================ */
function PretsSection({
  prets,
  onAction,
}: {
  prets: Pret[];
  onAction: (id: number, statut: 'approved' | 'rejected') => void;
}) {
  return (
    <div className="admin-table-wrap">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Client</th>
              <th className="admin-th">Montant</th>
              <th className="admin-th">Durée</th>
              <th className="admin-th">Statut</th>
              <th className="admin-th" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody className="admin-tbody">
            {prets.length > 0 ? (
              prets.map((p) => (
                <tr key={p.id}>
                  <td className="admin-td">
                    <div className="admin-cell-name">
                      <span className="admin-cell-avatar">{initials(p.client)}</span>
                      {p.client}
                    </div>
                  </td>
                  <td className="admin-td" style={{ color: 'var(--gold)', fontWeight: 600, fontFamily: 'Courier New, monospace' }}>
                    {formatEuro(p.montant)}
                  </td>
                  <td className="admin-td muted">{p.duree} mois</td>
                  <td className="admin-td">
                    <span className={`admin-status ${p.statut}`}>
                      {p.statut === 'pending' ? 'En attente' : p.statut === 'approved' ? 'Approuvé' : 'Rejeté'}
                    </span>
                  </td>
                  <td className="admin-td">
                    {p.statut === 'pending' ? (
                      <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="admin-btn-sm approve"
                          onClick={() => onAction(p.id, 'approved')}
                        >
                          <Check size={14} />
                          Approuver
                        </button>
                        <button
                          className="admin-btn-sm reject"
                          onClick={() => onAction(p.id, 'rejected')}
                        >
                          <XCircle size={14} />
                          Rejeter
                        </button>
                      </div>
                    ) : (
                      <span className="admin-td muted" style={{ textAlign: 'right', display: 'block', fontSize: '0.82rem' }}>
                        Traité
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="admin-empty">Aucune demande de prêt.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   TRANSACTIONS SECTION
   ============================================================ */
function TransactionsSection({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="admin-table-wrap">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Client</th>
              <th className="admin-th">Type</th>
              <th className="admin-th">Montant</th>
              <th className="admin-th">Date</th>
            </tr>
          </thead>
          <tbody className="admin-tbody">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td className="admin-td">
                    <div className="admin-cell-name">
                      <span className="admin-cell-avatar">{initials(t.client)}</span>
                      {t.client}
                    </div>
                  </td>
                  <td className="admin-td">
                    <span className={`tx-badge ${t.type}`}>
                      {t.type === 'deposit' ? 'Dépôt' : t.type === 'withdraw' ? 'Retrait' : 'Paiement'}
                    </span>
                  </td>
                  <td className={`admin-td tx-amount ${t.type}`}>
                    {t.type === 'deposit' ? '+' : '−'}
                    {formatEuro(t.montant)}
                  </td>
                  <td className="admin-td muted">{t.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="admin-empty">Aucune transaction.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   USERS SECTION
   ============================================================ */
function UsersSection({
  users,
  onChangeRole,
  onDelete,
}: {
  users: User[];
  onChangeRole: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="admin-table-wrap">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Nom</th>
              <th className="admin-th">Email</th>
              <th className="admin-th">Rôle</th>
              <th className="admin-th" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody className="admin-tbody">
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="admin-td">
                    <div className="admin-cell-name">
                      <span className="admin-cell-avatar">{initials(u.nom)}</span>
                      {u.nom}
                    </div>
                  </td>
                  <td className="admin-td muted">{u.email}</td>
                  <td className="admin-td">
                    <span
                      className="admin-status"
                      style={
                        u.role === 'admin'
                          ? { background: 'rgba(249,168,38,0.12)', color: 'var(--gold)' }
                          : { background: 'rgba(255,255,255,0.06)', color: 'var(--gray)' }
                      }
                    >
                      {u.role === 'admin' ? 'Admin' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="admin-td">
                    <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="admin-action-btn"
                        title={u.role === 'admin' ? 'Rétrograder' : 'Promouvoir'}
                        onClick={() => onChangeRole(u.id)}
                      >
                        <Shield size={15} />
                      </button>
                      <button
                        className="admin-action-btn danger"
                        title="Supprimer"
                        onClick={() => onDelete(u.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="admin-empty">Aucun utilisateur.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   PARAMETRES SECTION
   ============================================================ */
function ParametresSection() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [twoFA, setTwoFA] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  const toggles1 = [
    { label: 'Notifications email', value: notifEmail, setter: setNotifEmail },
    { label: 'Authentification à deux facteurs', value: twoFA, setter: setTwoFA },
  ];

  const toggles2 = [
    { label: 'Approbation automatique des prêts', value: autoApprove, setter: setAutoApprove },
    { label: 'Mode maintenance', value: maintenance, setter: setMaintenance },
  ];

  return (
    <div className="admin-settings-grid">
      <div className="admin-settings-card">
        <h3>Sécurité</h3>
        {toggles1.map((t) => (
          <div key={t.label} className="admin-toggle-row">
            <span className="admin-toggle-label">{t.label}</span>
            <Toggle on={t.value} onClick={() => t.setter(!t.value)} />
          </div>
        ))}
      </div>

      <div className="admin-settings-card">
        <h3>Système</h3>
        {toggles2.map((t) => (
          <div key={t.label} className="admin-toggle-row">
            <span className="admin-toggle-label">{t.label}</span>
            <Toggle on={t.value} onClick={() => t.setter(!t.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button className={`admin-switch ${on ? 'on' : ''}`} onClick={onClick} aria-label="Toggle">
      <span className="admin-switch-knob" />
    </button>
  );
}