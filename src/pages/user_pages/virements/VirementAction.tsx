import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";

export default function VirementAction() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      {/* Bouton principal */}
      <button
        className="btn-primary flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Plus size={18} />
        Effectuer un virement
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--navy-2)] rounded-[var(--radius)] shadow-lg p-6 w-[400px]">
            <h2 className="text-xl font-bold text-[var(--gold)] mb-4">
              Choisissez le type de virement
            </h2>
            <div className="space-y-3">
              <button
                className="w-full bg-[var(--gold)] text-[var(--navy)] font-semibold rounded-[var(--radius-sm)] py-2 flex items-center justify-between hover:bg-[var(--gold-dark)]"
                onClick={() => {
                  setOpen(false);
                  navigate("/virement/interne");
                }}
              >
                Entre mes comptes
                <ArrowRight size={16} />
              </button>
              <button
                className="w-full bg-[var(--navy-3)] text-[var(--white)] font-semibold rounded-[var(--radius-sm)] py-2 flex items-center justify-between hover:bg-[var(--navy-4)]"
                onClick={() => {
                  setOpen(false);
                  navigate("/virement/externe");
                }}
              >
                Vers un nouveau bénéficiaire
                <ArrowRight size={16} />
              </button>
            </div>
            <button
              className="mt-4 text-sm text-[var(--gray-muted)] hover:text-[var(--white)]"
              onClick={() => setOpen(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
