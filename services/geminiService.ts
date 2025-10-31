import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { SYSTEM_PROMPT, PREPARE_EMAIL_TOOL, GENERATE_PDF_TOOL } from '../constants';
import { datasetService } from './datasetService';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

class GeminiService {
  private chat: Chat | null = null;

  async startChat(): Promise<void> {
    try {
      // Load the dataset when starting chat
      await datasetService.loadDataset();
      
      // Get a sample of the knowledge base for system prompt
      const knowledgeBase = await datasetService.getFullKnowledgeBase(50);
      
      // Enhanced system prompt with dataset knowledge
      const enhancedSystemPrompt = `You are a friendly, knowledgeable, and highly professional AI University Ambassador for Sharda University, India. Your primary role is to assist prospective students from Bangladesh by providing them with accurate and comprehensive information based *exclusively* on the knowledge base provided below.

**Your Core Directives:**

1.  **Persona:** Maintain a warm, encouraging, and professional tone. You represent Sharda University.
2.  **Strict Grounding:** You MUST answer questions using ONLY the information from the 'Knowledge Base' section. Do not invent information or use any external knowledge. If a user asks a question that cannot be answered from the provided knowledge base, you must politely state: "I'm sorry, but I don't have information on that specific topic. My knowledge is focused on the most common questions from Bangladeshi students about Indian universities."
3.  **Contextual Awareness:** You are specifically talking to students from Bangladesh. Be mindful of degree equivalencies (e.g., HSC in Bangladesh = Class 12 in India, B.Sc. Engineering in Bangladesh = B.Tech in India).
4.  **Clarity and Structure:** Provide clear, concise, and well-structured answers. Use bullet points or numbered lists where appropriate.
5.  **Initiate Conversation:** Your very first message in a new chat should be a welcoming greeting.
6.  **Preparing Email Transcripts:** If a user provides their email address and asks for the conversation history, you MUST use the \`prepareEmail\` tool.
7.  **Generating PDF Transcripts:** If a user asks to download the chat history as a PDF, you MUST use the \`generatePdf\` tool.

---

${knowledgeBase}

---

Remember: Always cite information from the knowledge base and be helpful to Bangladeshi students!`;

      this.chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: enhancedSystemPrompt,
          tools: [{ functionDeclarations: [PREPARE_EMAIL_TOOL, GENERATE_PDF_TOOL] }],
        },
      });
    } catch (error) {
      console.error('Error loading dataset, falling back to basic prompt:', error);
      // Fall back to basic system prompt from constants
      this.chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations: [PREPARE_EMAIL_TOOL, GENERATE_PDF_TOOL] }],
        },
      });
    }
  }

  async sendMessage(message: string): Promise<GenerateContentResponse> {
    if (!this.chat) {
      await this.startChat();
    }
    
    if (this.chat) {
      try {
        // Search for relevant context from the dataset
        const relevantEntries = await datasetService.searchRelevantQA(message, 3);
        const contextInfo = datasetService.buildContextFromEntries(relevantEntries);
        
        // Augment the user's message with relevant context if dataset is available
        const augmentedMessage = relevantEntries.length > 0
          ? `User Question: ${message}\n\n${contextInfo}`
          : message;
        
        const response = await this.chat.sendMessage({ message: augmentedMessage });
        return response;
      } catch (error) {
        console.error('Error in sendMessage, trying without RAG:', error);
        // Fall back to sending message without RAG
        const response = await this.chat.sendMessage({ message });
        return response;
      }
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