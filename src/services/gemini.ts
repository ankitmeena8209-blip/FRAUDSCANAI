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
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
];

const API_VERSIONS = ['v1', 'v1beta'];

async function analyzeContentWithChatGPT(
  content: string,
  type: ScanType,
  apiKey: string,
  systemInstruction: string
): Promise<GeminiAnalysisResponse> {
  const prompt = `Threat/Content Type: ${type}\nInput Content:\n${content}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`ChatGPT API error (${res.status}): ${errText || res.statusText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('ChatGPT API returned an empty response.');
  }

  const parsed: GeminiAnalysisResponse = JSON.parse(text);
  if (parsed.riskScore === undefined || !parsed.verdict) {
    throw new Error('Missing required fields in ChatGPT response');
  }
  return parsed;
}

export async function analyzeContentWithGemini(content: string, type: ScanType): Promise<GeminiAnalysisResponse> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const chatGptApiKey = import.meta.env.VITE_CHATGPT_API || import.meta.env.VITE_CHATGPT_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;

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

  let resultText = '';
  let lastGeminiError = '';

  // Stage 1: Try Gemini API if key exists
  if (geminiApiKey) {
    // Stage 1a: Direct REST API endpoints (v1 and v1beta)
    for (const version of API_VERSIONS) {
      for (const model of CANDIDATE_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${geminiApiKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemInstruction }]
              },
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }]
                }
              ],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.1
              }
            })
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              resultText = text;
              break;
            }
          } else {
            const errData = await res.json().catch(() => null);
            lastGeminiError = errData?.error?.message || res.statusText || `HTTP ${res.status}`;
          }
        } catch (err: any) {
          lastGeminiError = err?.message || 'Network error';
        }
      }
      if (resultText) break;
    }

    // Stage 1b: Fallback to SDK execution if REST calls were unfulfilled
    if (!resultText) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
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

            if (resultText) break;
          } catch (err: any) {
            lastGeminiError = err?.message || lastGeminiError;
          }
        }
      } catch (err: any) {
        lastGeminiError = err?.message || lastGeminiError;
      }
    }
  } else {
    lastGeminiError = 'VITE_GEMINI_API_KEY is not defined in environment variables.';
  }

  // Stage 2: Return Gemini result if successful
  if (resultText) {
    try {
      const parsed: GeminiAnalysisResponse = JSON.parse(resultText);
      if (parsed.riskScore !== undefined && parsed.verdict) {
        return parsed;
      }
    } catch {
      // Ignore parse error and proceed to ChatGPT fallback if available
    }
  }

  // Stage 3: Immediate Fallback to ChatGPT API if Gemini failed or gave an error
  if (chatGptApiKey) {
    console.warn(`Gemini analysis unfulfilled (${lastGeminiError}). Redirecting immediately to ChatGPT API fallback...`);
    try {
      return await analyzeContentWithChatGPT(content, type, chatGptApiKey, systemInstruction);
    } catch (chatGptErr: any) {
      throw new Error(`AI Engine Error: Gemini (${lastGeminiError}) & ChatGPT (${chatGptErr.message}) both failed.`);
    }
  }

  // Stage 4: If neither engine worked, throw informative error
  throw new Error(`Gemini API Error: ${lastGeminiError || 'Failed to generate analysis'}. Please verify VITE_GEMINI_API_KEY or VITE_CHATGPT_API in Vercel Environment Variables.`);
}
