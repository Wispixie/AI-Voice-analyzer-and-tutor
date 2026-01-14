
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    verdict: { type: Type.STRING },
    brutalHonesty: { type: Type.STRING },
    detectedKey: { type: Type.STRING },
    careerDecision: { 
      type: Type.STRING, 
      description: "Must be one of: PROCEED, TRAIN, PIVOT, STOP." 
    },
    identifiedArtist: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name of the artist if recognized (e.g. Ado, Billie Eilish, etc.)." },
        confidence: { type: Type.NUMBER, description: "Confidence in identity from 0-100." },
        isOriginal: { type: Type.BOOLEAN, description: "True ONLY if this is the official studio master of the original artist." },
        signatureReasoning: { type: Type.STRING, description: "Technical reasoning for this ID (e.g. 'Matches Ado's specific 2kHz resonance and growl texture')." },
        notes: { type: Type.STRING, description: "Details on if it's a cover, AI-generated, or pitch-shifted." }
      },
      required: ["name", "confidence", "isOriginal", "signatureReasoning", "notes"]
    },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          score: { type: Type.NUMBER },
          description: { type: Type.STRING }
        },
        required: ["label", "score", "description"]
      }
    },
    musicalTheoryAnalysis: {
      type: Type.OBJECT,
      properties: {
        pitch: { type: Type.STRING },
        timing: { type: Type.STRING },
        timbre: { type: Type.STRING },
        tonalConsistency: { type: Type.STRING }
      },
      required: ["pitch", "timing", "timbre", "tonalConsistency"]
    },
    productionAnalysis: {
      type: Type.OBJECT,
      properties: {
        mixing: { type: Type.STRING },
        levelization: { type: Type.STRING },
        processing: { type: Type.STRING }
      },
      required: ["mixing", "levelization", "processing"]
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    industryViability: { type: Type.STRING },
    redirectionAdvice: { type: Type.STRING },
    recommendedPath: { type: Type.STRING }
  },
  required: ["overallScore", "verdict", "brutalHonesty", "detectedKey", "careerDecision", "identifiedArtist", "metrics", "musicalTheoryAnalysis", "productionAnalysis", "strengths", "industryViability", "redirectionAdvice", "recommendedPath"]
};

async function performSingleAnalysis(base64Data: string, mimeType: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Upgraded to Pro for advanced reasoning
    contents: {
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        {
          text: `You are a world-class Forensic Vocal Scientist and A&R Executive. 

          CRITICAL IDENTIFICATION CHALLENGE: 
          1. DETECT THE SOURCE: You must distinguish between the original artist and cover artists (e.g., Ariana Grande vs. Kristin Chenoweth, Ado vs. a cover singer, Hazbin Hotel cast vs. AmaLee). 
          2. VOCAL PRINTING: Analyze the formant signatures, vibrato rate (Hz), and harmonic series of the voice. Famous artists have unique frequency "fingerprints." 
          3. AUTHENTICITY: If the audio is pitch-shifted, speed-altered, or AI-generated to mimic an artist, call it out in 'signatureReasoning'.
          4. MUSIC THEORY: Verify if the singer is actually in key. If they are off-key, identify the specific dissonance.
          
          Provide a technical, clinical, and brutally honest report in JSON.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
      temperature: 0.2, // Very low temperature for high precision/consistency
      thinkingConfig: { thinkingBudget: 16384 } // High thinking budget for deep reasoning on artist identity
    }
  });

  return JSON.parse(response.text.trim());
}

export async function analyzeVocal(audioFile: File): Promise<AnalysisResult> {
  const base64Data = await fileToBase64(audioFile);
  
  // Consistency check across 3 passes
  const results = await Promise.all([
    performSingleAnalysis(base64Data, audioFile.type),
    performSingleAnalysis(base64Data, audioFile.type),
    performSingleAnalysis(base64Data, audioFile.type)
  ]);

  const avgOverall = Math.round(results.reduce((acc, r) => acc + r.overallScore, 0) / 3);
  const bestResult = results.sort((a, b) => b.overallScore - a.overallScore)[1];

  const avgMetrics = bestResult.metrics.map((m, idx) => ({
    ...m,
    score: Math.round((results[0].metrics[idx].score + results[1].metrics[idx].score + results[2].metrics[idx].score) / 3)
  }));

  // Find most consistent name
  const names = results.map(r => r.identifiedArtist.name);
  const mostCommonName = names.sort((a,b) =>
    names.filter(v => v===a).length - names.filter(v => v===b).length
  ).pop() || "Unknown";

  return {
    ...bestResult,
    overallScore: avgOverall,
    metrics: avgMetrics,
    identifiedArtist: {
      ...bestResult.identifiedArtist,
      name: mostCommonName
    }
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}
