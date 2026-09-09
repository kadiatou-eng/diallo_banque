import { useEffect, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Receipt,
  Sparkles,
  Search,
} from 'lucide-react';

type TxType = 'deposit' | 'withdraw' | 'payment';

interface Transaction {
  id: number;
  nameTransaction: string;
  typeTransaction: 'Dépot' | 'Retrait' | 'Paiement';
  montant: number;
  createdAt: string;
  txType: TxType;
  icon: typeof Receipt;
}

const filters: { key: TxType | 'all'; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'deposit', label: 'Dépôts' },
  { key: 'withdraw', label: 'Retraits' },
  { key: 'payment', label: 'Paiements' },
];

const badgeClass: Record<TxType, string> = {
  deposit: 'deposit',
  withdraw: 'withdraw',
  payment: 'payment',
};

const badgeLabel: Record<TxType, string> = {
  deposit: 'Dépôt',
  withdraw: 'Retrait',
  payment: 'Paiement',
};

export default function Transactions() {
  const [activeFilter, setActiveFilter] = useState<TxType | 'all'>('all');
  const [query, setQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await fetch('http://localhost:8080/transactions');
        const data = await response.json();

        // 🔹 Mapper les données backend vers le format frontend
        const mapped = data.map((t: any) => {
          let txType: TxType = 'deposit';
          let icon = ArrowDownLeft;

          if (t.typeTransaction === 'Retrait') {
            txType = 'withdraw';
            icon = ArrowUpRight;
          } else if (t.typeTransaction === 'Paiement') {
            txType = 'payment';
            icon = ShoppingBag;
          }

          return {
            id: t.id,
            nameTransaction: t.nameTransaction,
            typeTransaction: t.typeTransaction,
            montant: t.montant,
            createdAt: new Date(t.createdAt).toLocaleDateString('fr-FR'),
            txType,
            icon,
          };
        });

        setTransactions(mapped);
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error);
      }
    };

    getTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchType = activeFilter === 'all' || t.txType === activeFilter;
    const matchQuery = t.nameTransaction.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="page">
      <div className="container page-inner fade-in">
        <section className="hero" style={{ paddingTop: 16, paddingBottom: 32 }}>
          <span className="hero-badge">
            <Sparkles size={14} />
            Historique
          </span>
          <h1 className="hero-title">
            <span className="text-gold">Transactions</span>
          </h1>
          <p className="hero-subtitle">
            Consultez et filtrez l'ensemble de vos opérations bancaires.
          </p>
        </section>

        {/* Search + Filters */}
        <div className="tx-filters">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`btn-ghost ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
          <div style={{ position: 'relative', marginLeft: 'auto', minWidth: 200 }}>
            <Search
              size={16}
              color="var(--gray-muted)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="tx-table-wrap">
          <div className="tx-scroll">
            <table className="tx-table">
              <thead className="tx-thead">
                <tr>
                  <th className="tx-th">Type</th>
                  <th className="tx-th">Montant</th>
                  <th className="tx-th">Date</th>
                </tr>
              </thead>
              <tbody className="tx-tbody">
                {filtered.length > 0 ? (
                  filtered.map((t) => (
                    <tr key={t.id}>
                      <td className="tx-td">
                        <div className="tx-type-cell">
                          <span className="tx-type-icon">
                            <t.icon size={16} color="var(--gold)" />
                          </span>
                          <span>
                            {t.nameTransaction}
                            <span className={`tx-badge ${badgeClass[t.txType]}`}>
                              {badgeLabel[t.txType]}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className={`tx-td tx-amount ${t.txType}`}>
                        {t.txType === 'deposit' ? '+' : '−'}{t.montant} €
                      </td>
                      <td className="tx-td tx-date">{t.createdAt}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="tx-empty">
                      Aucune transaction trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
