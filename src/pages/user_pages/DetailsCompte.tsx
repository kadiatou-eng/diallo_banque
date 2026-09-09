import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Compte {
  id: number;
  nomCompte: string;
  typeCompte: string;
  montant: number;
  numCard: number;
}

const DetailsComptePage = () => {
  const { id } = useParams();
  const [compte, setCompte] = useState<Compte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetailsCompte = async () => {
      try {
        const response = await fetch(`http://localhost:8080/comptes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Compte introuvable");
        }

        const data = await response.json();
        setCompte(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du compte :", error);
      } finally {
        setLoading(false);
      }
    };

    getDetailsCompte();
  }, [id]);

  if (loading) return <p>Chargement des détails du compte...</p>;
  if (!compte) return <p>Aucun compte trouvé pour l’ID {id}</p>;

  return (
    <div className="page bg-[var(--navy)] min-h-screen text-[var(--white)]">
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-[var(--gold)] mb-8">
          Détails du compte {compte.nomCompte}
        </h1>

        <div className="bg-[var(--navy-2)] rounded-[var(--radius)] shadow-[var(--shadow-gold)] p-6">
          <p className="mb-2">
            <span className="text-[var(--gray-muted)]">Type :</span> {compte.typeCompte}
          </p>
          <p className="mb-2">
            <span className="text-[var(--gray-muted)]">Numéro de carte :</span> {compte.numCard}
          </p>
          <p className="mb-2">
            <span className="text-[var(--gray-muted)]">Solde :</span>{" "}
            <span className="text-[var(--gold)] font-semibold">{compte.montant} €</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsComptePage;
