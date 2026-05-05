// src/lib/ai-service.ts
export const transformCV = async (userKey: string, provider: string, cvText: string, jdText: string) => {
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: userKey, cvText, jdText })
  });

  const data = await response.json();
  
  if (!response.ok) throw new Error(data.error || "Failed to reach AI");

  const rawText = data.candidates[0].content.parts[0].text;
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI format");
  
  return JSON.parse(jsonMatch[0]);
};