import { Mandate } from '../types';

export const fetchMandates = async (): Promise<Mandate[]> => {
    try {
        const response = await fetch('/mandates.json');
        if (!response.ok) {
            console.warn('Failed to fetch mandates.json, returning empty array.');
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching mandates:', error);
        return [];
    }
};

export interface OpportunityAnalysis {
    rating: 'EXCELLENT' | 'BON' | 'MOYEN' | 'CHER';
    details: string;
    color: string;
}

export const analyzeOpportunity = (mandate: Mandate): OpportunityAnalysis => {
    // Estimation of market averages (Summer 2025 proj) based on user input
    const MARKET_AVERAGES: Record<string, number> = {
        'Lille': 3850,
        'Faches-Thumesnil': 2950,
        'Ronchin': 2850,
        'Unknown': 3500
    };

    // Determine key based on partial match or default
    let cityKey = 'Unknown';
    if (mandate.location.includes('Lille')) cityKey = 'Lille';
    else if (mandate.location.includes('Faches')) cityKey = 'Faches-Thumesnil';
    else if (mandate.location.includes('Ronchin')) cityKey = 'Ronchin';

    const AVG_PRICE_SQM = MARKET_AVERAGES[cityKey];

    const diff = ((mandate.priceSqm - AVG_PRICE_SQM) / AVG_PRICE_SQM) * 100;

    if (diff < -15) {
        return {
            rating: 'EXCELLENT',
            details: `Prix ${Math.abs(diff).toFixed(0)}% sous la moyenne secteur (${AVG_PRICE_SQM}€/m²)`,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
        };
    } else if (diff < -5) {
        return {
            rating: 'BON',
            details: `Prix ${Math.abs(diff).toFixed(0)}% sous la moyenne secteur`,
            color: 'text-blue-600 bg-blue-50 border-blue-100'
        };
    } else if (diff < 10) {
        return {
            rating: 'MOYEN',
            details: `Prix conforme au marché`,
            color: 'text-amber-600 bg-amber-50 border-amber-100'
        };
    } else {
        return {
            rating: 'CHER',
            details: `Prix ${diff.toFixed(0)}% au-dessus du marché`,
            color: 'text-red-600 bg-red-50 border-red-100'
        };
    }
};
