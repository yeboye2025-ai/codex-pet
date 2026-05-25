export type AnalysisSignal = {
  name: string;
  observation: string;
  meaning: string;
};

export type AnalysisRecord = {
  id: string;
  imageDataUrl: string;
  createdAt: string;
  emotionLabel: string;
  emotionSummary: string;
  confidenceNote: string;
  signals: AnalysisSignal[];
  scientificInterpretation: string;
  innerMonologue: string;
  disclaimer: string;
  isFavorited: boolean;
};
