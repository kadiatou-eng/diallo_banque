import { useEffect, useState } from "react";

const AdminPage = () => {
  const [comptes, setComptes] = useState([]);
  const [prets, setPrets] = useState([]);
  const [newCompte, setNewCompte] = useState({ nomCompte: "", typeCompte: "", solde: 0 });

  // ✅ Charger comptes et prêts au montage
  useEffect(() => {
    fetch("http://localhost:8080/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        setComptes(data.comptes);
        setPrets(data.prets);
      });
  }, []);


  // ✅ Ajouter un compte
  const handleAddCompte = async () => {
    const res = await fetch("http://localhost:8080/comptes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCompte),
    });
    const data = await res.json();
    setComptes([...comptes, data]);
    setNewCompte({ nomCompte: "", typeCompte: "", solde: 0 });
  };

  // ✅ Supprimer un compte
  const handleDeleteCompte = async (id) => {
    await fetch(`http://localhost:8080/comptes/${id}`, { method: "DELETE" });
    setComptes(comptes.filter(c => c.id !== id));
  };

  // ✅ Approuver ou rejeter un prêt
  const handleUpdatePret = async (id, statut) => {
    const res = await fetch(`http://localhost:8080/prets/${id}?statut=${statut}`, {
      method: "PATCH",
    });
    const data = await res.json();
    setPrets(prets.map(p => (p.id === id ? data : p)));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Console d'administration</h1>

      {/* Gestion des comptes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Comptes</h2>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Nom du compte"
            value={newCompte.nomCompte}
            onChange={(e) => setNewCompte({ ...newCompte, nomCompte: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Type"
            value={newCompte.typeCompte}
            onChange={(e) => setNewCompte({ ...newCompte, typeCompte: e.target.value })}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Solde initial"
            value={newCompte.solde}
            onChange={(e) => setNewCompte({ ...newCompte, solde: parseFloat(e.target.value) })}
            className="border p-2"
          />
          <button onClick={handleAddCompte} className="bg-green-600 text-white px-4 py-2 rounded">
            Ajouter
          </button>
        </div>

        <ul>
          {comptes.map((c) => (
            <li key={c.id} className="flex justify-between items-center border-b py-2">
              <span>{c.nomCompte} — {c.typeCompte} — {c.solde} MAD</span>
              <button
                onClick={() => handleDeleteCompte(c.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Gestion des prêts */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Prêts</h2>
        <ul>
          {prets.map((p) => (
            <li key={p.id} className="flex justify-between items-center border-b py-2">
              <span>
                {p.client} — {p.montant} MAD — Statut: {p.statut}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdatePret(p.id, "APPROUVE")}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleUpdatePret(p.id, "REJETE")}
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                >
                  Rejeter
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminPage;