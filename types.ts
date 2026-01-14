
export interface VocalMetric {
  label: string;
  score: number; // 0-100
  description: string;
}

export type CareerDecision = "PROCEED" | "TRAIN" | "PIVOT" | "STOP";

export interface AnalysisResult {
  overallScore: number;
  verdict: string;
  brutalHonesty: string;
  detectedKey: string;
  careerDecision: CareerDecision;
  identifiedArtist: {
    name: string;
    confidence: number; // 0-100
    isOriginal: boolean;
    signatureReasoning: string; // New field for forensic details
    notes: string;
  };
  metrics: VocalMetric[];
  musicalTheoryAnalysis: {
    pitch: string;
    timing: string;
    timbre: string;
    tonalConsistency: string;
  };
  productionAnalysis: {
    mixing: string;
    levelization: string;
    processing: string;
  };
  industryViability: string;
  redirectionAdvice: string;
  recommendedPath: string;
  strengths: string[];
}

export interface AnalysisState {
  loading: boolean;
  result: AnalysisResult | null;
  error: string | null;
  file: File | null;
}
