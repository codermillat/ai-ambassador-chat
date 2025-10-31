import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';
import { geminiService } from '../services/geminiService';
import { ArrowLeftIcon, PaperAirplaneIcon } from './Icons';
import RightSidebar from './RightSidebar';
import type { Part } from '@google/genai';

declare const jspdf: { jsPDF: new (options?: any) => any };

interface ChatViewProps {
  user: User;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ user, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat history? This action cannot be undone.')) {
      localStorage.removeItem(`chatHistory_${user.id}`);
      setMessages([]);
      
      // If it's an AI ambassador, show the initial greeting again
      if (user.isAi) {
        const firstMessage: Message = {
          id: 'initial-greeting',
          text: "Hello! I'm your AI guide for Sharda University, trained to help Bangladeshi students like you. I can answer questions about admissions, courses, life in India, and more based on our official guidance. How can I assist you today?",
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        setMessages([firstMessage]);
        localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify([firstMessage]));
      }
      
      // Restart the chat session
      if (user.isAi) {
        geminiService.startChat();
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedMessagesRaw = localStorage.getItem(`chatHistory_${user.id}`);
    if (savedMessagesRaw) {
      setMessages(JSON.parse(savedMessagesRaw));
    } else if (user.isAi) {
      setIsLoading(true);
      const firstMessage: Message = {
        id: 'initial-greeting',
        text: "Hello! I'm your AI guide for Sharda University, trained to help Bangladeshi students like you. I can answer questions about admissions, courses, life in India, and more based on our official guidance. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setTimeout(() => {
        setMessages([firstMessage]);
        localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify([firstMessage]));
        setIsLoading(false);
      }, 500);
    }
    
    if (user.isAi) {
      geminiService.startChat();
    }
  }, [user.id, user.isAi]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(updatedMessages));

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(currentInput);
      const functionCalls = response.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        const fc = functionCalls[0];
        if (fc.name === 'prepareEmail') {
          
          const chatHistoryText = updatedMessages
            .map(msg => `${msg.sender === 'user' ? 'You' : user.name} (${new Date(msg.timestamp).toLocaleString()}):\n${msg.text}`)
            .join('\n\n');
          
          const subject = `Chat Transcript with ${user.name}`;
          const body = `Here is your conversation with ${user.name}:\n\n---\n\n${chatHistoryText}`;
          
          const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

          const functionResponse: Part = {
            functionResponse: {
              name: 'prepareEmail',
              response: { success: true, message: `Mailto link generated successfully.` },
            },
          };
          
          const finalResponse = await geminiService.sendFunctionResponse(functionResponse);
          
          const aiMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: finalResponse.text,
            sender: 'ai',
            timestamp: new Date().toISOString(),
            mailtoLink: mailtoLink, // Attach the mailto link to the message
          };
          
          const finalMessages = [...updatedMessages, aiMessage];
          setMessages(finalMessages);
          localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(finalMessages));

        } else if (fc.name === 'generatePdf') {
            const generateAndDownloadPdf = () => {
                const { jsPDF } = jspdf;
                const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
                const pageWidth = doc.internal.pageSize.getWidth();
                const margin = 10;
                const maxLineWidth = pageWidth - margin * 2;
                let y = margin;

                const addText = (text: string, options: any = {}) => {
                    const lines = doc.splitTextToSize(text, maxLineWidth);
                    const textHeight = lines.length * 5; // Approximate height
                    if (y + textHeight > doc.internal.pageSize.getHeight() - margin) {
                        doc.addPage();
                        y = margin;
                    }
                    doc.text(lines, margin, y, options);
                    y += textHeight;
                };

                doc.setFontSize(16);
                addText(`Chat Transcript with ${user.name}`, { align: 'center' });
                y += 5;

                doc.setFontSize(11);
                updatedMessages.forEach(msg => {
                    const prefix = `${msg.sender === 'user' ? 'You' : user.name} (${new Date(msg.timestamp).toLocaleString()}):`;
                    doc.setFont(undefined, 'bold');
                    addText(prefix);
                    y += 1;
                    
                    doc.setFont(undefined, 'normal');
                    addText(msg.text);
                    y += 5; // Spacing between messages
                });

                doc.save(`Chat-with-${user.name.replace(/\[|\]|\s/g, '_')}.pdf`);
            };

            const functionResponse: Part = {
              functionResponse: {
                name: 'generatePdf',
                response: { success: true, message: `PDF is ready for download.` },
              },
            };

            const finalResponse = await geminiService.sendFunctionResponse(functionResponse);
          
            const aiMessage: Message = {
              id: (Date.now() + 2).toString(),
              text: finalResponse.text,
              sender: 'ai',
              timestamp: new Date().toISOString(),
              pdfGenerator: generateAndDownloadPdf,
            };
            
            const finalMessages = [...updatedMessages, aiMessage];
            setMessages(finalMessages);
            localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(finalMessages));
        }

      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(finalMessages));
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(finalMessages));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col bg-gray-50">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-4">
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.title}</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              title="Clear chat history"
            >
              Clear Chat
            </button>
          )}
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'ai' && (
                <img src={user.avatar} alt="AI" className="w-8 h-8 rounded-full self-start" />
              )}
              <div className={`max-w-md lg:max-w-xl px-4 py-2.5 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.mailtoLink && (
                    <a
                      href={message.mailtoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Open in Email Client
                    </a>
                  )}
                  {message.pdfGenerator && (
                    <button
                      onClick={message.pdfGenerator}
                      className="mt-3 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Download PDF
                    </button>
                  )}
              </div>
            </div>
          ))}
          {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                  <img src={user.avatar} alt="AI" className="w-8 h-8 rounded-full self-start" />
                  <div className="max-w-md lg:max-w-xl px-4 py-3 rounded-2xl bg-white text-gray-800 border border-gray-200 rounded-bl-none">
                      <div className="flex items-center space-x-2">
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                      </div>
                  </div>
              </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="w-full py-3 pl-4 pr-12 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || input.trim() === ''}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-white bg-blue-600 disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
      <aside className="hidden lg:block w-1/3 xl:w-1/4 p-4 border-l border-gray-200">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default ChatView;