import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function editImage(imageBuffer: string, mimeType: string, instruction: string) {
  if (!apiKey) throw new Error("Gemini API key is missing");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBuffer.split(",")[1], // Remove data:image/png;base64,
            mimeType: mimeType,
          },
        },
        {
          text: `You are a professional product photo editor. Follow this instruction to edit the image: "${instruction}". 
          Return the edited image as an inline image part. 
          If you are removing an object, ensure the background is clean and matches the surroundings.
          If you are enhancing the photo, make it look professional and appealing for e-commerce.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Model did not return an image. It might have returned text instead: " + response.text);
}
