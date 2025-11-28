import { GoogleGenAI, Type } from "@google/genai";
import { Pet, Message, SOPItem } from '../types';

// Initialize the client. 
// NOTE: We assume process.env.API_KEY is available as per instructions.
// In a real prod app, ensure this runs server-side or use a proxy to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates Standard Operating Procedures (care instructions) for a pet
 * based on its details.
 */
export const generatePetSOPs = async (
  species: string,
  breed: string,
  age: number,
  personality: string
): Promise<SOPItem[]> => {
  try {
    const prompt = `Generate a list of 5 essential care instructions (Standard Operating Procedures) for a ${age}-year-old ${breed} ${species} with a ${personality} personality.
    Focus on feeding, activity, and safety. Keep instructions concise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Short title of the instruction" },
              instruction: { type: Type.STRING, description: "The detailed instruction" }
            },
            required: ["title", "instruction"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const parsed = JSON.parse(text);
    return parsed.map((item: any, index: number) => ({
      id: `sop-${Date.now()}-${index}`,
      title: item.title,
      instruction: item.instruction
    }));

  } catch (error) {
    console.error("Gemini SOP Generation Error:", error);
    // Fallback if AI fails or key is missing
    return [
      { id: 'err-1', title: 'Basic Care', instruction: 'Ensure fresh water is always available.' },
      { id: 'err-2', title: 'Emergency', instruction: 'Contact owner immediately in case of illness.' }
    ];
  }
};

/**
 * Summarizes a chat conversation.
 */
export const summarizeChat = async (messages: Message[]): Promise<string> => {
  if (messages.length === 0) return "No messages to summarize.";

  try {
    const transcript = messages.map(m => `User ${m.senderId}: ${m.text}`).join('\n');
    const prompt = `Summarize the following conversation between a pet owner and a pet sitter. Highlight any agreed-upon times or specific care requirements.\n\n${transcript}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Chat Summary Error:", error);
    return "Summary unavailable at this time.";
  }
};

/**
 * Provides a safety tip for a booking request.
 */
export const getSafetyTip = async (pet: Pet, userRole: string): Promise<string> => {
  try {
    const prompt = `Provide a single, short, crucial safety tip for a ${userRole} dealing with a ${pet.breed} ${pet.species}. Max 20 words.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Always meet in a public place first.";
  } catch (error) {
    return "Ensure emergency contacts are exchanged before the booking.";
  }
};