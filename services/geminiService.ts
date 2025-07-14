
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a response from the Gemini AI.
 * @param prompt The user prompt to send to the AI.
 * @returns A promise that resolves with the AI-generated text.
 */
export const generateAiResponse = async (prompt: string): Promise<string> => {
  console.log(`Calling Gemini API with prompt: "${prompt}"`);

  try {
    // A chave de API deve ser configurada como uma variável de ambiente no seu ambiente de build/servidor.
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set.");
      return "Erro de configuração: a chave da API Gemini não foi definida no servidor.";
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful assistant for a chatbot.",
        // Otimização para baixa latência, ideal para chatbots.
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    
    // Acessa o texto da resposta diretamente.
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Desculpe, não consegui processar sua solicitação de IA no momento. Verifique a configuração da API.";
  }
};
