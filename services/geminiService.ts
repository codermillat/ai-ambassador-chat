import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { SYSTEM_PROMPT, PREPARE_EMAIL_TOOL, GENERATE_PDF_TOOL } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

class GeminiService {
  private chat: Chat | null = null;

  startChat(): void {
    this.chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: [PREPARE_EMAIL_TOOL, GENERATE_PDF_TOOL] }],
      },
    });
  }

  async sendMessage(message: string): Promise<GenerateContentResponse> {
    if (!this.chat) {
      this.startChat();
    }
    
    if (this.chat) {
      const response = await this.chat.sendMessage({ message });
      return response;
    }
    throw new Error("Chat not initialized. Unable to send message.");
  }

  async sendFunctionResponse(functionResponse: Part): Promise<GenerateContentResponse> {
    if (!this.chat) {
      throw new Error("Chat not initialized. Unable to send function response.");
    }
    const response = await this.chat.sendMessage({ message: [functionResponse] });
    return response;
  }
}

export const geminiService = new GeminiService();