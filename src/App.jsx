import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Globe, Loader2, MessageCircle, Settings } from 'lucide-react';

const WebQAApp = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hi! I can search the web and answer questions for you. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate web search (in a real app, this would call your backend)
  const simulateWebSearch = async (query) => {
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock search results based on query
    const mockResponses = {
      weather: "Based on current weather data, temperatures are moderate with partly cloudy skies in most major cities today.",
      news: "Recent developments include advances in AI technology, economic updates, and various global events. For the most current information, I'd recommend checking reputable news sources.",
      technology: "The latest in technology includes developments in artificial intelligence, quantum computing, and renewable energy innovations.",
      default: `I found several relevant sources about "${query}". Here's what I discovered: This topic involves multiple aspects that are currently being discussed across various platforms. For the most accurate and up-to-date information, I'd recommend checking recent sources directly.`
    };

    const searchTerms = query.toLowerCase();
    if (searchTerms.includes('weather')) return mockResponses.weather;
    if (searchTerms.includes('news')) return mockResponses.news;
    if (searchTerms.includes('tech')) return mockResponses.technology;
    
    return mockResponses.default;
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Add thinking message
      const thinkingMessage = {
        type: 'assistant',
        content: '🔍 Searching the web...',
        timestamp: new Date(),
        isThinking: true
      };
      setMessages(prev => [...prev, thinkingMessage]);

      // Simulate web search
      const response = await simulateWebSearch(inputValue);

      // Remove thinking message and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isThinking);
        return [...filtered, {
          type: 'assistant',
          content: response,
          timestamp: new Date(),
          sources: [
            'web-search-result-1.com',
            'reliable-source-2.org',
            'current-info-3.net'
          ]
        }];
      });

    } catch (error) {
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isThinking);
        return [...filtered, {
          type: 'assistant',
          content: 'Sorry, I encountered an error while searching. Please try again.',
          timestamp: new Date(),
          isError: true
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-3xl px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : message.isError 
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-gray-100 text-gray-800'
        }`}>
          {!isUser && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <Globe size={14} />
              <span>AI Assistant</span>
            </div>
          )}
          
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {message.sources && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="text-xs text-gray-600 mb-1">Sources:</div>
              {message.sources.map((source, idx) => (
                <div key={idx} className="text-xs text-blue-600 hover:underline cursor-pointer">
                  📎 {source}
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs opacity-60 mt-2">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Search className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Web Q&A Assistant</h1>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-medium text-yellow-800 mb-2">Settings</h3>
            <div className="flex items-center gap-3">
              <label className="text-sm text-yellow-700">OpenAI API Key:</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="px-3 py-1 border border-yellow-300 rounded text-sm bg-white"
              />
              <span className="text-xs text-yellow-600">
                (Required for real web search functionality)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-1">
          {messages.map((message, idx) => (
            <MessageBubble key={idx} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-gray-600">Searching...</span>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything... I'll search the web for answers!"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isLoading}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send size={18} />
              Ask
            </button>
          </div>
          
          <div className="mt-3 text-center text-xs text-gray-500">
            This is a demo app. For real web search, you'd need to connect to a backend API.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebQAApp;
