export interface JuridicalItem {
    id: number;
    category: 'Loi Hoguet' | 'Loi Alur' | 'Diagnostics' | 'Copropriété' | 'Bail';
    title: string;
    content: string;
    tags: string[];
}

export const juridicalData: JuridicalItem[] = [
    // Loi Hoguet
    {
        id: 1,
        category: 'Loi Hoguet',
        title: 'Carte professionnelle obligatoire',
        content: 'Toute personne exerçant une activité de transaction, gestion ou syndic doit détenir une carte professionnelle délivrée par la CCI. Validité 3 ans.',
        tags: ['transaction', 'gestion', 'carte', 'CCI']
    },
    {
        id: 2,
        category: 'Loi Hoguet',
        title: 'Garantie financière',
        content: 'Obligation de souscrire une garantie financière pour protéger les fonds des clients. Montant minimum : 110 000€ pour transaction, 120 000€ pour gestion.',
        tags: ['garantie', 'assurance', 'fonds']
    },
    {
        id: 3,
        category: 'Loi Hoguet',
        title: 'Mandat écrit obligatoire',
        content: 'Tout mandat de vente ou location doit être écrit et mentionner le prix, la durée, les conditions de rémunération et l\'exclusivité éventuelle.',
        tags: ['mandat', 'vente', 'location']
    },

    // Loi Alur
    {
        id: 4,
        category: 'Loi Alur',
        title: 'Encadrement des loyers',
        content: 'Dans les zones tendues, le loyer ne peut dépasser le loyer de référence majoré de 20%. Applicable à Paris, Lyon, Lille, etc.',
        tags: ['loyer', 'location', 'zones tendues']
    },
    {
        id: 5,
        category: 'Loi Alur',
        title: 'Dossier de diagnostic technique',
        content: 'Le DDT doit être annexé au bail et contenir : DPE, CREP, amiante, ERNT, gaz, électricité.',
        tags: ['DDT', 'diagnostics', 'bail']
    },
    {
        id: 6,
        category: 'Loi Alur',
        title: 'Frais d\'agence location',
        content: 'Plafonnement des honoraires de location : max 12€/m² en zone tendue, 10€/m² ailleurs. État des lieux : max 3€/m².',
        tags: ['honoraires', 'location', 'plafond']
    },

    // Diagnostics
    {
        id: 7,
        category: 'Diagnostics',
        title: 'DPE - Diagnostic de Performance Énergétique',
        content: 'Obligatoire pour vente et location. Validité 10 ans. Classes A à G. Opposable depuis juillet 2021.',
        tags: ['DPE', 'énergie', 'vente', 'location']
    },
    {
        id: 8,
        category: 'Diagnostics',
        title: 'Amiante',
        content: 'Obligatoire pour immeubles construits avant 1997. Validité illimitée si négatif, 3 ans si positif.',
        tags: ['amiante', 'santé', 'vente']
    },
    {
        id: 9,
        category: 'Diagnostics',
        title: 'Plomb (CREP)',
        content: 'Obligatoire pour logements avant 1949. Validité 1 an (vente), 6 ans (location) si présence, illimitée si absence.',
        tags: ['plomb', 'CREP', 'santé']
    },
    {
        id: 10,
        category: 'Diagnostics',
        title: 'Gaz et Électricité',
        content: 'Obligatoire si installation > 15 ans. Validité 3 ans. Vérification de la sécurité des installations.',
        tags: ['gaz', 'électricité', 'sécurité']
    },
    {
        id: 11,
        category: 'Diagnostics',
        title: 'Termites',
        content: 'Obligatoire dans zones déclarées à risque. Validité 6 mois. Vérification présence d\'insectes xylophages.',
        tags: ['termites', 'insectes', 'vente']
    },
    {
        id: 12,
        category: 'Diagnostics',
        title: 'ERP - État des Risques et Pollutions',
        content: 'Obligatoire pour tous biens. Validité 6 mois. Informe sur risques naturels, miniers, technologiques, sismiques, radon.',
        tags: ['ERP', 'risques', 'pollution']
    },

    // Copropriété
    {
        id: 13,
        category: 'Copropriété',
        title: 'Règlement de copropriété',
        content: 'Document définissant les droits et obligations des copropriétaires. Doit être annexé à l\'acte de vente.',
        tags: ['règlement', 'copropriété', 'vente']
    },
    {
        id: 14,
        category: 'Copropriété',
        title: 'Charges de copropriété',
        content: 'Distinction charges générales (entretien parties communes) et spéciales (services collectifs). Répartition selon tantièmes.',
        tags: ['charges', 'tantièmes', 'copropriété']
    },
    {
        id: 15,
        category: 'Copropriété',
        title: 'Assemblée générale',
        content: 'AG ordinaire annuelle obligatoire. Convocation 21 jours avant. Vote à majorité simple, absolue ou unanimité selon décisions.',
        tags: ['AG', 'vote', 'copropriété']
    },

    // Bail
    {
        id: 16,
        category: 'Bail',
        title: 'Durée du bail',
        content: 'Bail vide : 3 ans (personne physique), 6 ans (personne morale). Bail meublé : 1 an (9 mois étudiant).',
        tags: ['bail', 'durée', 'location']
    },
    {
        id: 17,
        category: 'Bail',
        title: 'Dépôt de garantie',
        content: 'Maximum 1 mois de loyer (vide), 2 mois (meublé). Restitution sous 1 mois (sans dégradation), 2 mois (avec).',
        tags: ['dépôt', 'garantie', 'caution']
    },
    {
        id: 18,
        category: 'Bail',
        title: 'Révision du loyer',
        content: 'Révision annuelle selon IRL (Indice de Référence des Loyers). Calcul : loyer × (nouvel IRL / ancien IRL).',
        tags: ['loyer', 'révision', 'IRL']
    },
    {
        id: 19,
        category: 'Bail',
        title: 'Préavis locataire',
        content: 'Vide : 3 mois (1 mois en zone tendue). Meublé : 1 mois. Réduction possible pour mutation, perte emploi, santé.',
        tags: ['préavis', 'résiliation', 'bail']
    },
    {
        id: 20,
        category: 'Bail',
        title: 'Congé bailleur',
        content: 'Préavis 6 mois. Motifs : vente, reprise, motif légitime et sérieux. Notification par huissier ou LRAR.',
        tags: ['congé', 'bailleur', 'résiliation']
    }
];
