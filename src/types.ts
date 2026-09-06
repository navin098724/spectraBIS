export type StandardStatus = 'ACTIVE' | 'SUPERSEDED' | 'WITHDRAWN';
export type RecommendationClassification = 'HIGHLY_APPLICABLE' | 'POTENTIALLY_APPLICABLE' | 'RELATED' | 'NOT_APPLICABLE';

export interface StandardRelationship {
  type: 'NORMATIVE_REFERENCE' | 'TEST_METHOD' | 'SAFETY' | 'INSTALLATION' | 'RELATED' | 'SUPERSEDES' | 'SUPERSEDED_BY' | 'AMENDED_BY' | 'CERTIFICATION_RELATED';
  targetIsNumber: string;
}

export interface Standard {
  isNumber: string;
  title: string;
  productCategory: string;
  scope: string;
  year: number;
  status: StandardStatus;
  revision: number;
  reaffirmationYear: number | null;
  amendments: { number: number; year: number }[];
  certificationInformation: string;
  relationships: StandardRelationship[];
  sourceUrl: string;
  evidenceNotes: string;
  lastVerifiedDate: string;
  dateIntroduced: string;
  keywords: string[];
}

export interface RequirementAnalysis {
  product: string;
  intendedUse: string;
  requirements: string[];
  classification: 'CLEAR' | 'INCOMPLETE' | 'AMBIGUOUS' | 'CONTRADICTORY';
  missingInfo: string[];
  keywords: string[];
  detectedLanguage?: string;
  normalizedRequirement?: string;
}

export interface StandardRecommendation {
  standard: Standard;
  relevanceScore: number;
  classification: RecommendationClassification;
  whyRecommended: string;
  evidence: string;
  humanVerificationRequired: boolean;
}

export interface GapAnalysis {
  issue: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  whyItMatters: string;
  recommendedAction: string;
}

export interface ConflictAnalysis {
  conflict: string;
  certainty: 'CERTAIN' | 'POTENTIAL';
  details: string;
}

export interface ProcurementReport {
  requirements: RequirementAnalysis;
  recommendations: StandardRecommendation[];
  gaps: GapAnalysis[];
  conflicts: ConflictAnalysis[];
}

export interface AnalysisHistoryRecord {
  id: string;
  timestamp: string;
  input: string;
  report: ProcurementReport;
  status: string;
}

export interface SelectedStandardForTender {
  standard: Standard;
  addedAt: string;
}
