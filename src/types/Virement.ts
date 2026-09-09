export interface Compte {
  id: number;
  numeroCompte: string;
  solde: number;
  proprietaire?: string;
}

export interface Virement {
  id: number;
  beneficiaire: string;
  montant: number;
  motif?: string;
  dateVirement: string; // format ISO (ex: "2026-09-03T15:45:00")
  compteSource?: Compte;
  compteDestinataire?: Compte;
}
