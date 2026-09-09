import { useState, useEffect } from "react";

const VirementInternePage = () => {
  const [compteSource, setCompteSource] = useState("");
  const [compteDest, setCompteDest] = useState("");
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [message, setMessage] = useState("");
  const [comptes, setComptes] = useState<any[]>([]);

  useEffect(() => {
    const fetchComptes = async () => {
      try {
        const response = await fetch("http://localhost:8080/comptes");
        const data = await response.json();
        setComptes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComptes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/virements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compteSourceId: compteSource,
          compteDestinataireId: compteDest,
          montant: parseFloat(montant),
          motif,
          dateVirement: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Erreur lors du virement");
      const data = await response.json();
      setMessage(`✅ Virement interne effectué avec succès (ID: ${data.id})`);

      setCompteSource("");
      setCompteDest("");
      setMontant("");
      setMotif("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Une erreur est survenue.");
    }
  };

  return (
    <div className="page bg-[var(--navy)] min-h-screen text-[var(--white)]">
      <div className="container mx-auto py-12 max-w-lg">
        <h1 className="text-3xl font-bold text-[var(--gold)] mb-8">
          Virement entre mes comptes
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--navy-2)] rounded-[var(--radius)] shadow-[var(--shadow-gold)] p-6 space-y-4"
        >
          <div>
            <label className="block mb-1">Compte source</label>
            <select
              value={compteSource}
              onChange={(e) => setCompteSource(e.target.value)}
              className="form-input"
              required
            >
              <option value="">-- Sélectionner --</option>
              {comptes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nomCompte} (Solde: {c.montant} €)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Compte destinataire</label>
            <select
              value={compteDest}
              onChange={(e) => setCompteDest(e.target.value)}
              className="form-input"
              required
            >
              <option value="">-- Sélectionner --</option>
              {comptes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nomCompte} (Solde: {c.montant} €)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Montant</label>
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Motif</label>
            <input
              type="text"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Valider le virement
          </button>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default VirementInternePage;
