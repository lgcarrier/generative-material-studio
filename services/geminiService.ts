
import { GoogleGenAI, Modality, Part } from "@google/genai";

// Ensure process.env.API_KEY is defined in your environment
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export const generateNextTexture = async (
  userPrompt: string,
  previousImage: { data: string; mimeType: string; } | null
): Promise<string> => {
  const systemPrompt = `You are an expert material artist for a AAA game studio. Your task is to generate a single texture based on a user's request.

Rules:
1. The output MUST be a single, high-quality, tileable texture with a square (1:1 aspect ratio).
2. If you are given a "Previous State" image, your task is to generate the *next logical evolution* of that texture according to the user's transformation description. The change should be incremental and believable.
3. If you are NOT given a "Previous State" image, you must generate the *starting state* of the transformation described by the user.
4. You MUST ONLY output the image. Do not output any text, explanations, or any other content.`;

  const parts: Part[] = [{ text: systemPrompt }];

  if (previousImage) {
    parts.push({ text: `User request: "${userPrompt}". Here is the previous state:` });
    parts.push({ inlineData: { data: previousImage.data, mimeType: previousImage.mimeType } });
  } else {
    parts.push({ text: `User request: "${userPrompt}". Generate the starting state.` });
  }
  
  try {
    const result = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (result.candidates && result.candidates[0]) {
      const imagePart = result.candidates[0].content.parts.find(p => p.inlineData);
      if (imagePart && imagePart.inlineData) {
        return imagePart.inlineData.data;
      }
    }
    throw new Error("The AI did not return a valid image.");

  } catch (error) {
    console.error("Error calling Gemini API for texture generation:", error);
    throw new Error("Failed to generate the next texture state from the API.");
  }
};


export const generateShaderLogic = async (userPrompt: string): Promise<string> => {
    const systemPrompt = `You are an expert shader programmer for a AAA game studio. A developer has described a material transformation that will be driven by 4 texture states.

Your task is to:
1. Read the user's description of the material transformation: "${userPrompt}".
2. Write a high-level description, in plain English, of the logic for a procedural shader that blends between the 4 texture states.
3. The blending should be controlled by a single float uniform, for example, 'transitionFactor', which ranges from 0.0 to 1.0.
4. Explain how different ranges of the 'transitionFactor' map to the blending between textures (e.g., 0.0-0.33 for state 1 to 2, 0.33-0.66 for state 2 to 3, etc.).
5. Do not write actual code (like GLSL or HLSL). Provide a clear, conceptual explanation that a programmer can easily implement.
6. The output must be ONLY this text description. Do not add titles or other explanations.`;

    const parts: Part[] = [{ text: systemPrompt }];

    try {
        const result = await ai.models.generateContent({
            model: model, 
            contents: { parts },
            config: {
                responseModalities: [Modality.TEXT],
            },
        });
        return result.text;
    } catch (error) {
        console.error("Error calling Gemini API for shader logic:", error);
        throw new Error("Failed to generate shader logic from the API.");
    }
};
