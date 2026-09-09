import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Virement } from "../../../types/Virement";




const VirementPage = () => {
  const { id } = useParams(); // compte source
  const [beneficiaire, setBeneficiaire] = useState("");
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [message, setMessage] = useState("");
  const [virements, setVirements] = useState([]);

  // 🔹 Charger les virements existants au montage
  useEffect(() => {
    const fetchVirements = async () => {
      try {
        const response = await fetch("http://localhost:8080/virements");
        if (!response.ok) throw new Error("Erreur lors du chargement des virements");
        const data = await response.json();
        setVirements(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVirements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/virements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            beneficiaire,
            montant: parseFloat(montant),
            motif,
            dateVirement: new Date().toISOString(),
            compte_source_id: id,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors du virement");

      const data = await response.json();
      setMessage(`✅ Virement effectué avec succès (ID: ${data.id})`);

      // reset du formulaire
      setBeneficiaire("");
      setMontant("");
      setMotif("");

    } catch (error) {
      console.error(error);
      setMessage("❌ Une erreur est survenue. Vérifie les informations.");
    }
  };

  return (
    <div className="page bg-[var(--navy)] min-h-screen text-[var(--white)]">
      <div className="container mx-auto py-12 max-w-lg">
        <h1 className="text-3xl font-bold text-[var(--gold)] mb-8">
          Virement depuis le compte {id}
        </h1>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--navy-2)] rounded-[var(--radius)] shadow-[var(--shadow-gold)] p-6 space-y-4"
        >
          <div>
            <label className="block text-[var(--gray-muted)] mb-1">
              Bénéficiaire
            </label>
            <input
              type="text"
              value={beneficiaire}
              onChange={(e) => setBeneficiaire(e.target.value)}
              className="w-full p-2 rounded-[var(--radius-sm)] bg-[var(--navy-3)] text-[var(--white)] border border-[var(--gray-dark)] focus:border-[var(--gold)] focus:ring-[var(--gold)]"
              required
            />
          </div>

          <div>
            <label className="block text-[var(--gray-muted)] mb-1">Montant</label>
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full p-2 rounded-[var(--radius-sm)] bg-[var(--navy-3)] text-[var(--white)] border border-[var(--gray-dark)] focus:border-[var(--gold)] focus:ring-[var(--gold)]"
              required
            />
          </div>

          <div>
            <label className="block text-[var(--gray-muted)] mb-1">Motif</label>
            <input
              type="text"
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className="w-full p-2 rounded-[var(--radius-sm)] bg-[var(--navy-3)] text-[var(--white)] border border-[var(--gray-dark)] focus:border-[var(--gold)] focus:ring-[var(--gold)]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--gold)] text-[var(--navy)] font-semibold rounded-[var(--radius-sm)] py-2 shadow-[var(--shadow-gold)] transition hover:bg-[var(--gold-dark)]"
          >
            Valider le virement
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-[var(--gold-light)] font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VirementPage;
