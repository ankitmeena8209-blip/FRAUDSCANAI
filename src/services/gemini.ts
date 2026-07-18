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

const SUPPORTED_GEMINI_MODEL = 'gemini-2.5-flash';
const GROQ_CANDIDATE_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];

/**
 * Silent fallback runner for Groq AI Provider
 */
async function analyzeContentWithGroq(
  content: string,
  type: ScanType,
  apiKey: string,
  systemInstruction: string
): Promise<GeminiAnalysisResponse> {
  const prompt = `Threat/Content Type: ${type}\nInput Content:\n${content}`;

  let lastGroqError = '';

  for (const model of GROQ_CANDIDATE_MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          const parsed: GeminiAnalysisResponse = JSON.parse(text);
          if (parsed.riskScore !== undefined && parsed.verdict) {
            return parsed;
          }
        }
      } else {
        const errData = await res.json().catch(() => null);
        lastGroqError = errData?.error?.message || res.statusText || `HTTP ${res.status}`;
      }
    } catch (err: any) {
      lastGroqError = err?.message || 'Network error during Groq API request';
    }
  }

  throw new Error(`Groq provider fallback failed: ${lastGroqError || 'Empty response'}`);
}

/**
 * Primary AI Analysis Entrypoint with Automatic Provider Fallback (Gemini -> Groq)
 */
export async function analyzeContentWithGemini(content: string, type: ScanType): Promise<GeminiAnalysisResponse> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

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
  let lastGeminiError = '';

  // Step 1: Attempt Gemini API Primary Provider
  if (geminiApiKey) {
    // Try stable v1 REST API endpoint first
    try {
      const v1Url = `https://generativelanguage.googleapis.com/v1/models/${SUPPORTED_GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;
      const res = await fetch(v1Url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed: GeminiAnalysisResponse = JSON.parse(text);
          if (parsed.riskScore !== undefined && parsed.verdict) {
            return parsed;
          }
        }
      } else {
        const errData = await res.json().catch(() => null);
        lastGeminiError = errData?.error?.message || res.statusText || `HTTP ${res.status}`;
      }
    } catch (err: any) {
      lastGeminiError = err?.message || 'Network request failed';
    }

    // Try GoogleGenerativeAI SDK fallback as secondary Gemini attempt
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: SUPPORTED_GEMINI_MODEL,
        systemInstruction,
        generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        const parsed: GeminiAnalysisResponse = JSON.parse(text);
        if (parsed.riskScore !== undefined && parsed.verdict) {
          return parsed;
        }
      }
    } catch (err: any) {
      lastGeminiError = err?.message || lastGeminiError;
    }
  } else {
    lastGeminiError = 'VITE_GEMINI_API_KEY is not defined';
  }

  // Step 2: Silent Automatic Fallback to Groq AI Provider on ANY Gemini failure
  if (groqApiKey) {
    try {
      return await analyzeContentWithGroq(content, type, groqApiKey, systemInstruction);
    } catch (groqErr: any) {
      console.warn('Groq provider fallback error:', groqErr?.message || groqErr);
    }
  }

  // Step 3: Friendly user error if both AI providers failed
  throw new Error('Analysis service is currently unavailable. Please verify API keys in environment settings.');
}
