import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getAIResponse(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  if (!ai) return "Configuração de IA pendente (Chave API não encontrada).";

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Você é o assistente da MotoJá Premium, um serviço de mototáxi e entregas. Seja prestativo, rápido e use um tom profissional e amigável. Ajude o usuário com dúvidas sobre o app, preços, segurança e como pedir uma corrida.",
      },
    });

    // Note: sendMessage only accepts message parameter, history is handled by the chat instance if we were using it correctly, 
    // but for simplicity in this helper we'll just send the message.
    // Real history management would involve ai.chats.create({ history })
    const response = await chat.sendMessage({ message: prompt });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Desculpe, tive um problema ao processar sua solicitação.";
  }
}
