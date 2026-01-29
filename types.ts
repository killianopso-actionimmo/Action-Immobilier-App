import React from 'react';

export interface ConnectivityItem {
  name: string;
  details: string; // Ex: "Ligne 1, 9" ou "Boulangerie"
  time: string; // Ex: "5 min"
  type: 'metro' | 'bus' | 'tram' | 'walk' | 'car';
}

export interface SchoolItem {
  name: string;
  level: 'Maternelle' | 'Primaire' | 'Collège' | 'Lycée';
  time: string;
}

export interface HighlightItem {
  title: string;
  description: string;
}

export interface StreetReport {
  address: string;
  identity: {
    ambiance: string;
    keywords: string[];
    accessibility_score: number;
    services_score: number;
  };
  urbanism: {
    building_type: string;
    plu_note: string;
    connectivity: ConnectivityItem[];
  };
  lifestyle: {
    schools: SchoolItem[];
    leisure: string[];
  };
  highlights: HighlightItem[];
  marketing_titles: string[];
}

export interface TechnicalItem {
  equipment_name: string;
  verdict: 'Excellent' | 'Correct' | 'Vieillissant' | 'À remplacer';
  technical_opinion: string;
  consumption_projection: string;
  sales_argument: string;
  negotiation_point: string;
}

export interface TechnicalReport {
  items: TechnicalItem[];
  global_summary: string;
}

export interface HeatingReport {
  configuration: {
    type: string;
    description: string;
    pros_cons: string;
  };
  brand_analysis: {
    positioning: 'Haut de gamme' | 'Rapport Qualité/Prix' | 'Entrée de gamme' | 'Inconnu';
    details: string;
  };
  economic_analysis: {
    rating: 'Économique' | 'Standard' | 'Énergivore';
    dpe_impact: string;
  };
  agent_clarification: string;
  vigilance_points: string[];
}

export interface RenovationReport {
  analysis: {
    visual_diagnosis: string;
    light_strategy: string;
  };
  smart_renovation: Array<{
    area: string; // Sols, Cuisine, Sdb
    suggestion: string;
    impact: string;
  }>;
  estimates: Array<{
    work: string;
    price: string;
  }>;
  sales_arguments: string[];
  expert_secret: string;
}

export interface ChecklistReport {
  physical_checks: string[];
  shock_questions: string[];
  documents_needed: string[];
  strategic_reminder: string;
}

export interface CoproReport {
  summary: string;
  works_voted: string[];
  works_planned: string[];
  financial_alerts: string[];
  legal_alerts: string[];
  sales_argument: string;
}

export interface PigeReport {
  ad_analysis: {
    flaws: string[];
    missing_info: string[];
  };
  call_script: {
    hook: string;
    technical_question: string;
    closing: string;
  };
  expert_argument: string;
}

export interface DpeReport {
  current_analysis: string;
  improvements: Array<{
    work: string;
    cost_estimate: string;
    gain: string;
  }>;
  green_value_argument: string;
}

export interface RedactionReport {
  email_vendor: string;
  social_post_linkedin: string;
  social_post_instagram: string;
}

// Log Entry for History
export interface ProspectionLog {
  id: number;
  zone: string;
  type: 'boitage' | 'porte_a_porte' | 'courrier';
  date: string;
  mois: string;
}

export interface ProspectionArchive {
  archivedAt: string;
  data: ProspectionLog[];
}

export interface Idea {
  id: string;
  content: string;
  createdAt: string;
  category?: string;
}

export interface ProspectionReport {
  assistant_response: string;
  intent: 'log_prospection' | 'reset_campaign' | 'info' | 'unknown';
  data?: {
    zone?: string;
    type?: 'boitage' | 'porte_a_porte' | 'courrier';
    date?: string;
    mois?: string;
  };
}

// Mandate Watch
export interface Mandate {
  id: string;
  title: string;
  price: number;
  surface: number;
  priceSqm: number;
  location: string;
  url: string;
  image: string;
  date: string;
  dpe?: string; // DPE rating (A-G)
  contactName?: string;
  contactPhone?: string;
  publishedDate?: string; // Human-readable date
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type AnalysisMode =
  | 'home'
  | 'street' | 'technical' | 'heating' | 'renovation' | 'checklist'
  | 'copro' | 'pige' | 'dpe' | 'redaction'
  | 'prospection' | 'dashboard' | 'mandate_watch' | 'calculator' | 'estimation_workflow' | 'idea_box'
  | 'goals'; // Suivi objectifs personnelslculator' | 'idea_box'; // New interactive modes

export type MainTab = 'home' | 'estimation' | 'copro' | 'pige' | 'dpe' | 'redaction' | 'prospection' | 'mandate_watch' | 'dashboard' | 'estimation_workflow' | 'calculator' | 'idea_box';