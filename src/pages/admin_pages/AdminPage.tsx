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
  nomCompte: string;
  typeCompte: string;
  solde: number;
  user?: User; // relation optionnelle
}




interface Pret {
  id: number;
  montant: number;
  statut: 'APPROUVE' | 'EN_ATTENTE' | 'REJETE';
  user?: User; // relation optionnelle
  duree?: number; // seulement si tu veux gérer une durée côté frontend
}



interface Transaction {
  id: number;
  montant: number;
  createdAt: string;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'PAIEMENT';
  compte: Compte;
  user?: User;
}



interface User {
  id: number;
  userId: string;
  email: string;
  role: string; // ADMIN / CLIENT / etc.
  nom?: string;
  prenom?: string;
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

function initials(name?: string): string {
  if (!name || typeof name !== "string") return "??"; // valeur par défaut
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
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
    const data = await apiFetch<Compte[]>('/comptes/all');
    setComptes(data);
  } catch (err) {
    console.error('Erreur chargement comptes:', err);
    setError("Impossible de charger les comptes depuis le serveur.");
  }
}, []);

const loadPrets = useCallback(async () => {
  try {
    const data = await apiFetch<Pret[]>('/prets/all');
    setPrets(data);
  } catch (err) {
    console.error('Erreur chargement prêts:', err);
    setError("Impossible de charger les prêts depuis le serveur.");
  }
}, []);

const loadTransactions = useCallback(async () => {
  try {
    const data = await apiFetch<Transaction[]>('/transactions/all');
    setTransactions(data);
  } catch (err) {
    console.error('Erreur chargement transactions:', err);
    setError("Impossible de charger les transactions depuis le serveur.");
  }
}, []);

const loadUsers = useCallback(async () => {
  try {
    const data = await apiFetch<User[]>('/users/all');
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
  const [newCompte, setNewCompte] = useState({ nomCompte: '', typeCompte: 'Courant', solde: '' });

  const handleAddCompte = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompte.nomCompte || !newCompte.solde) return;
    const payload = {
      nomCompte: newCompte.nomCompte,
      type: newCompte.typeCompte,
      solde: parseFloat(newCompte.solde),
    };
    try {
      const created = await apiSend<Compte>('/comptes', 'POST', payload);
      setComptes((prev) => [...prev, created]);
      setNewCompte({ nomCompte: '', typeCompte: 'Courant', solde: '' });
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
      const handlePretAction = async (id: number, statut: 'APPROUVE' | 'REJETE'): Promise<void> => {
        try {
          const updated = await apiSend<Pret>(`/prets/${id}`, 'PATCH', { statut });

          setPrets((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
          );
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
 /* ---- Derived stats ---- */
const comptesActifs = comptes.length;
const volumeTransactions = transactions.reduce((sum, t) => sum + Math.abs(t.montant), 0);
const pretsEnCours = prets.filter((p) => p.statut === 'EN_ATTENTE').length;
const alertes =
  prets.filter((p) => p.statut === 'EN_ATTENTE').length +
  users.filter((u) => u.role === 'user').length;


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
                <th className="admin-th">Compte</th>
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
                      <span className="admin-cell-avatar">{initials(t.compte?.nomCompte ?? "")}</span>
                      {t.compte?.nomCompte ?? "—"}
                    </div>
                  </td>
                  <td className="admin-td">
                    <span className={`tx-badge ${t.typeTransaction}`}>
                      {t.typeTransaction === 'DEPOT' ? 'Dépôt' : t.typeTransaction === 'RETRAIT' ? 'Retrait' : 'Paiement'}
                    </span>
                  </td>
                  <td className={`admin-td tx-amount ${t.typeTransaction}`}>
                    {t.typeTransaction === 'DEPOT' ? '+' : '−'}
                    {formatEuro(t.montant)}
                  </td>
                  <td className="admin-td muted">{t.createdAt}</td>
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
  newCompte: { nomCompte: string; typeCompte: string; solde: string };
  setNewCompte: React.Dispatch<React.SetStateAction<{ nomCompte: string; typeCompte: string; solde: string }>>;
  onAdd: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div>
      {/* Formulaire d’ajout */}
      <form onSubmit={onAdd} className="admin-form">
        <input
          type="text"
          placeholder="Nom du compte"
          value={newCompte.nomCompte}
          onChange={(e) => setNewCompte({ ...newCompte, nomCompte: e.target.value })}
        />
        <select
          value={newCompte.typeCompte}
          onChange={(e) => setNewCompte({ ...newCompte, typeCompte: e.target.value })}
        >
          <option value="Courant">Courant</option>
          <option value="Épargne">Épargne</option>
        </select>
        <input
          type="number"
          placeholder="Solde initial"
          value={newCompte.solde}
          onChange={(e) => setNewCompte({ ...newCompte, solde: e.target.value })}
        />
        <button type="submit">Ajouter</button>
      </form>

      {/* Tableau des comptes */}
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
                    <td className="admin-td">{c.nomCompte}</td>
                    <td className="admin-td">{c.typeCompte}</td>
                    <td className="admin-td">{formatEuro(c.solde)}</td>
                    <td className="admin-td">
                      <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
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
  onAction: (id: number, statut: 'APPROUVE' | 'REJETE') => void;
}) {
  return (
    <div className="admin-table-wrap">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Client</th>
              <th className="admin-th">Montant</th>
              <th className="admin-th">Durée (mois)</th>
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
                      <span className="admin-cell-avatar">{initials(p.user?.nom ?? "")}</span>
                      {p.user?.nom ?? "—"}
                    </div>
                  </td>
                  <td className="admin-td">{formatEuro(p.montant)}</td>
                  <td className="admin-td">{p.duree ?? "—"}</td>
                  <td className="admin-td">
                    <span
                      className="admin-status"
                      style={
                        p.statut === 'APPROUVE'
                          ? { background: 'rgba(38,249,94,0.12)', color: 'var(--green)' }
                          : p.statut === 'REJETE'
                          ? { background: 'rgba(249,38,38,0.12)', color: 'var(--red)' }
                          : { background: 'rgba(255,255,255,0.06)', color: 'var(--gray)' }
                      }
                    >
                      {p.statut === 'APPROUVE'
                        ? 'Approuvé'
                        : p.statut === 'REJETE'
                        ? 'Rejeté'
                        : 'En attente'}
                    </span>
                  </td>
                  <td className="admin-td">
                    {p.statut === 'EN_ATTENTE' && (
                      <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="admin-action-btn"
                          title="Approuver"
                          onClick={() => onAction(p.id, 'APPROUVE')}
                        >
                          ✔
                        </button>
                        <button
                          className="admin-action-btn danger"
                          title="Rejeter"
                          onClick={() => onAction(p.id, 'REJETE')}
                        >
                          ✖
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="admin-empty">Aucun prêt.</td>
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
function TransactionsSection({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="admin-table-wrap">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">Compte</th>
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
                      <span className="admin-cell-avatar">
                        {initials(t.compte?.nomCompte ?? "")}
                      </span>
                      {t.compte?.nomCompte ?? "—"}
                    </div>
                  </td>
                  <td className="admin-td">
                    <span className={`tx-badge ${t.typeTransaction}`}>
                      {t.typeTransaction === "DEPOT"
                        ? "Dépôt"
                        : t.typeTransaction === "RETRAIT"
                        ? "Retrait"
                        : "Paiement"}
                    </span>
                  </td>
                  <td className={`admin-td tx-amount ${t.typeTransaction}`}>
                    {t.typeTransaction === "DEPOT" ? "+" : "−"}
                    {formatEuro(t.montant)}
                  </td>
                  {/* ✅ Utiliser dateCreation (backend) au lieu de createdAt */}
                  <td className="admin-td muted">{t.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="admin-empty">
                  Aucune transaction.
                </td>
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
              <th className="admin-th">User ID</th>
              <th className="admin-th">Nom</th>
              <th className="admin-th">Prénom</th>
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
                      <span className="admin-cell-avatar"> {initials(`${u.nom ?? ""} ${u.prenom ?? ""}`)}</span>{u.userId}

                    </div>
                  </td>
                  <td className="admin-td">{u.nom ?? "—"}</td>
                  <td className="admin-td">{u.prenom ?? "—"}</td>
                  <td className="admin-td muted">{u.email}</td>
                  <td className="admin-td">
                    <span
                      className="admin-status"
                      style={
                        u.role === 'ADMIN'
                          ? { background: 'rgba(249,168,38,0.12)', color: 'var(--gold)' }
                          : { background: 'rgba(255,255,255,0.06)', color: 'var(--gray)' }
                      }
                    >
                      {u.role === 'ADMIN' ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td className="admin-td">
                    <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="admin-action-btn"
                        title={u.role === 'ADMIN' ? 'Rétrograder en Client' : 'Promouvoir en Admin'}
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
                <td colSpan={6} className="admin-empty">Aucun utilisateur.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ============================================================
   PARAMÈTRES SECTION
   ============================================================ */
function ParametresSection() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [twoFA, setTwoFA] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  // ✅ Factorisation des toggles
  const toggles = [
    {
      group: "Sécurité",
      items: [
        { label: "Notifications email", value: notifEmail, setter: setNotifEmail },
        { label: "Authentification à deux facteurs", value: twoFA, setter: setTwoFA },
      ],
    },
    {
      group: "Système",
      items: [
        { label: "Approbation automatique des prêts", value: autoApprove, setter: setAutoApprove },
        { label: "Mode maintenance", value: maintenance, setter: setMaintenance },
      ],
    },
  ];

  return (
    <div className="admin-settings-grid">
      {toggles.map((group) => (
        <div key={group.group} className="admin-settings-card">
          <h3>{group.group}</h3>
          {group.items.map((t) => (
            <div key={t.label} className="admin-toggle-row">
              <span className="admin-toggle-label">{t.label}</span>
              <Toggle on={t.value} onClick={() => t.setter(!t.value)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   TOGGLE COMPONENT
   ============================================================ */
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      className={`admin-switch ${on ? "on" : ""}`}
      onClick={onClick}
      aria-pressed={on}
      aria-label={on ? "Désactiver" : "Activer"}
    >
      <span className="admin-switch-knob" />
    </button>
  );
}
