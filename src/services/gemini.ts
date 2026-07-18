import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ScanType } from '../types';

export interface GeminiAnalysisResponse {
  verdict: 'Safe' | 'Likely Safe' | 'Suspicious' | 'Likely Scam' | 'Scam Detected' | 'Insufficient Information';
  riskScore: number;
  confidence: number;
  reasoning: string;
  evidence: string[];
  warningSigns: string[];
  safetyTips: string[];
}

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
];

export async function analyzeContentWithGemini(content: string, type: ScanType): Promise<GeminiAnalysisResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const systemInstruction = `
You are an expert AI cyber defense analyst. Analyze the user's input and determine if it represents a threat.

You must follow these strict requirements:
1. Do NOT default to "Fake" or "High Risk". Every input must be evaluated objectively and independently.
2. Respond with one of these exact verdicts:
   - Safe
   - Likely Safe
   - Suspicious
   - Likely Scam
   - Scam Detected
   - Insufficient Information
3. Implement a balanced risk scoring system (0-100):
   - 0 to 20 = Safe
   - 21 to 40 = Likely Safe
   - 41 to 60 = Suspicious
   - 61 to 80 = Likely Scam
   - 81 to 100 = Scam Detected
   Ensure the riskScore matches the selected verdict.
4. Provide the following fields in your JSON response:
   - riskScore (number between 0 and 100)
   - confidence (number between 0 and 100 representing your prediction confidence)
   - reasoning (a detailed markdown sentence explaining the analysis and verdict)
   - evidence (array of strings showing facts or indicators found in the input)
   - warningSigns (array of strings showing patterns or warning signals)
   - safetyTips (array of strings offering actionable safety advice)
5. For URLs: Check URL structure and domain name. Do NOT classify legitimate domains (e.g. google.com, github.com, wikipedia.org, microsoft.com, openai.com, etc.) as fake or malicious.
6. For Screenshots: Judge only based on visible text, elements, or context. If the screenshot lacks sufficient details to judge, state that more information is required, set the verdict to "Insufficient Information", and use a score in the Suspicious (41-60) or Safe (0-20) ranges.
7. For News: Do not claim a headline or article is fake unless there is strong, definitive evidence. If it is speculative or lacks context, use "Insufficient Information" or "Suspicious".
8. If there is not enough information to make a definitive judgment, return "Insufficient Information".

Your entire response must be a single, valid JSON object matching this schema:
{
  "verdict": "Safe" | "Likely Safe" | "Suspicious" | "Likely Scam" | "Scam Detected" | "Insufficient Information",
  "riskScore": number,
  "confidence": number,
  "reasoning": "string",
  "evidence": ["string"],
  "warningSigns": ["string"],
  "safetyTips": ["string"]
}
  `;

  const prompt = `Threat/Content Type: ${type}\nInput Content:\n${content}`;

  let lastError: Error | null = null;
  let resultText = '';

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      resultText = response.text();

      if (resultText) {
        break;
      }
    } catch (err: any) {
      console.warn(`Gemini model ${modelName} call failed:`, err?.message || err);
      lastError = err;
    }
  }

  if (!resultText) {
    const errorMsg = lastError?.message || 'All candidate Gemini models failed to generate a response.';
    throw new Error(`Gemini API error: ${errorMsg}`);
  }

  try {
    const parsed: GeminiAnalysisResponse = JSON.parse(resultText);
    if (parsed.riskScore === undefined || !parsed.verdict) {
      throw new Error('Missing required fields in Gemini response');
    }
    return parsed;
  } catch (err: any) {
    throw new Error(`Failed to parse Gemini analysis output: ${err.message}. Raw output: ${resultText}`);
  }
}
