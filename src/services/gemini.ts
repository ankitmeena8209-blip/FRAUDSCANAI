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

export async function analyzeContentWithGemini(content: string, type: ScanType): Promise<GeminiAnalysisResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined. Please add VITE_GEMINI_API_KEY to your .env.local file in the project root.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: `System Instructions:\n${systemInstruction}\n\nThreat/Content Type: ${type}\nInput Content:\n${content}` }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedError;
    try {
      parsedError = JSON.parse(errorText);
    } catch {
      parsedError = errorText;
    }
    const message = parsedError?.error?.message || response.statusText || 'Unknown API error';
    throw new Error(`Gemini API error: ${message}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Invalid response structure returned by Gemini API');
  }

  try {
    const parsed: GeminiAnalysisResponse = JSON.parse(text);
    // Extra validation to ensure API conforms to specifications
    if (parsed.riskScore === undefined || parsed.verdict === undefined) {
      throw new Error('Missing required fields in Gemini response');
    }
    return parsed;
  } catch (err: any) {
    throw new Error(`Failed to parse Gemini analysis output: ${err.message}. Raw output: ${text}`);
  }
}
