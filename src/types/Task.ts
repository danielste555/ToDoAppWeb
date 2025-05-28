export interface Task {
    idTache?: string;
    idUser?: string;
    titre: string;
    description?: string | "";
    dateEcheance?: string;
    priorite?: number;
    statut?: string;
    commentaire?: string | "";
    rappelActive?: boolean;
    dateRappel?: string | null;
    dateCreation?: string | null;
    dateModification?: string;
  }
  