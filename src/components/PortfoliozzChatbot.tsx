import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, TrendingUp, IndianRupee, Search } from 'lucide-react';

const PortfoliozzChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "नमस्ते! Welcome to Portfoliozz, your trusted SEBI-registered research analyst firm.\n\nWe specialize in providing expert analysis and recommendations for the Indian stock market, helping you make informed investment decisions.\n\nOur Premium Services:\n\n🔹 Equity Intraday (₹1,000/month)\n   • 2-4 daily high-probability calls\n   • Real-time market insights\n   • Clear Stop Loss & Target levels\n\n🔹 Option Buy (₹1,000/month)\n   • 4-6 weekly recommendations\n   • Min. Capital: ₹1,00,000\n   • Real-time trade alerts\n\n🔹 Option Sell Strategies (₹10,000/month)\n   • Advanced options strategies\n   • Min. Capital: ₹5,00,000\n   • Professional risk management\n\nHow may I assist you today? Feel free to ask about:\n• Market analysis\n• Stock recommendations\n• Service details\n• Company-specific research",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const GEMINI_API_KEY = 'AIzaSyCbNiFwhjKixb2zTaEghxjHtGam-eB5nCI';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const portfoliozzContext = `
You are Portfoliozz AI Assistant, representing Portfoliozz - a SEBI-registered research analyst firm specializing in the Indian stock market. 

ABOUT PORTFOLIOZZ:
- SEBI-registered research analyst focused on Indian stock market
- Empowers clients with knowledge and tools for informed investment decisions
- Provides comprehensive research and in-depth analysis
- Vision: "To be a trusted partner in clients' financial journeys by upholding the highest standards of research excellence and ethical advisory practices"

CORE VALUES:
1. Our Clients, Our Priority - Placing clients at the heart of everything we do
2. Transparency - Providing clear, honest, and timely information
3. In-House Research - Independently conducting all research activities
4. Built for Durability - Developing long-term successful trading strategies

SERVICES OFFERED:
1. Equity Intraday (₹1,000/month):
   - Real-time stock market insights
   - 2 to 4 high-probability intraday calls per day
   - Clear Stop Loss and Target in every call
   - Instant call delivery via WhatsApp/Telegram

2. Option Buy (₹1,000/month):
   - Minimum Capital Requirement: ₹1,00,000
   - 4 to 6 trades per week
   - Real-time trade alerts
   - Clear Entry, SL & Target levels

3. Option Sell Using Strategies (₹10,000/month):
   - Minimum Capital Requirement: ₹5,00,000
   - 4 to 6 trades per week
   - Real-time trade alerts
   - Clear Entry, SL & Target levels

CONTACT: WhatsApp - 7592833517

STOCK ANALYSIS FRAMEWORK:
When users ask about specific companies or stocks, provide comprehensive analysis in this structured format:

**INVESTMENT ANALYSIS - [COMPANY NAME]**

**Current Market Position**
- Current stock price and market cap
- Recent performance (1-day, 1-week, 1-month, 1-year changes)
- Trading volume analysis

**Financial Performance Highlights**
- Revenue & Profitability (Annual and recent quarterly)
- Key Financial Ratios:
  * Price-to-Earnings Ratio (P/E)
  * Price-to-Book Ratio (P/B)
  * Return on Equity (ROE)
  * Return on Assets (ROA)
  * Debt-to-Equity Ratio
  * Current Ratio
  * EBITDA Margins
- Dividend Yield and payout history

**Growth Trajectory & Business Analysis**
- Revenue growth trends
- Market position and competitive advantages
- Key business segments performance
- Recent corporate developments
- Management quality assessment

**Technical Analysis**
- Support and resistance levels
- Moving averages (50-day, 200-day)
- RSI and momentum indicators
- Volume trends

**Investment Considerations**
**Positives:**
- List 3-4 key strengths
**Concerns:**
- List 3-4 potential risks

**My Professional Recommendation**
- Clear rating: BUY/HOLD/SELL with rationale
- Entry Strategy with specific price levels
- Risk Management guidelines
- Target price and time horizon
- Portfolio allocation suggestion

IMPORTANT GUIDELINES:
- Act as a personal financial advisor
- Provide specific, actionable insights
- Include exact numbers and ratios when discussing financials
- Give clear buy/sell/hold recommendations with reasoning
- Suggest specific entry points and stop-loss levels
- Consider both fundamental and technical aspects
- Address risk management
- Keep the tone professional yet accessible
- Focus only on the requested company - no unnecessary comparisons
- Use rupee symbol (₹) for Indian prices
- NEVER use asterisks (*) or any markdown formatting (**, *, ##, etc.) in responses
- Format section headers and emphasis using plain text only
- Use clear formatting with line breaks and spacing instead of special characters
- Maintain SEBI compliance in all recommendations
- Do not put any disclaimers in the response

Remember: You are providing analysis as a SEBI-registered research analyst would, with proper disclaimers about market risks.
`;

  const detectStockQuery = (message) => {
    const analysisKeywords = ['analyse', 'analyze', 'analysis'];
    const stockKeywords = [
      'stock', 'share', 'company', 'buy', 'sell', 'hold', 
      'recommendation', 'target', 'price', 'invest', 'trading', 'market',
      'financial', 'ratio', 'dividend', 'earnings', 'revenue', 'profit'
    ];
    
    const hasAnalysisKeyword = analysisKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    const hasStockKeyword = stockKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    return hasAnalysisKeyword || hasStockKeyword;
  };

  const generateBotResponse = async (userMessage) => {
    try {
      const isStockQuery = detectStockQuery(userMessage);
      const isAnalysisQuery = userMessage.toLowerCase().includes('analyse') || 
                             userMessage.toLowerCase().includes('analyze') || 
                             userMessage.toLowerCase().includes('analysis');
      
      let prompt;
      if (isAnalysisQuery) {
        // Comprehensive analysis without service promotion
        prompt = `${portfoliozzContext}

User Query: ${userMessage}

This is a request for comprehensive stock analysis. Provide detailed investment analysis following the structured format outlined in the context. Act as a professional financial advisor and give specific, actionable recommendations with clear reasoning.

Do NOT include any service promotions, subscription offers, or contact information in the response. Focus purely on the investment analysis and recommendations.

Important: Provide specific numbers, ratios, and price levels where applicable. Give clear BUY/HOLD/SELL recommendations with entry points and risk management guidelines.`;
      } else if (isStockQuery) {
        // General stock query with subtle service mention
        prompt = `${portfoliozzContext}

User Query: ${userMessage}

This appears to be a stock/investment related query. Provide helpful insights and if appropriate, gently mention our services that could help with their investment needs.

For comprehensive stock analysis, guide users to use "analyse [company name]" format.

Provide relevant insights with professional recommendations where applicable.`;
      } else {
        // General query
        prompt = `${portfoliozzContext}

User Query: ${userMessage}

Please provide a helpful response as the Portfoliozz AI Assistant. Focus on how our services can help the user or provide general market insights as appropriate.

Tip: For detailed stock analysis, suggest users to type "analyse [company name]" for comprehensive investment insights.`;
      }

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        let botResponse = data.candidates[0].content.parts[0].text;
        
        // Remove all markdown formatting
        botResponse = botResponse
          .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markdown **text**
          .replace(/\*(.*?)\*/g, '$1')      // Remove italic markdown *text*
          .replace(/#{1,6}\s/g, '')         // Remove header markdown ### 
          .replace(/^\s*[\*\-\+]\s/gm, '• ') // Replace markdown bullets with bullet points
          .replace(/^\s*\d+\.\s/gm, '')     // Remove numbered list markdown
          .trim();
        
        
        
        return botResponse;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "I apologize, but I'm experiencing some technical difficulties at the moment. Please try again later or contact us directly at WhatsApp: 7592833517 for immediate assistance with your investment queries.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await generateBotResponse(userMessage.text);
      
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "I apologize for the inconvenience. Please try again or contact us directly for assistance.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1e3a8a] hover:bg-[#1e4199] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 group relative"
          aria-label="Open chat"
        >
          <MessageCircle className="h-7 w-7 group-hover:animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            AI
          </div>
        </button>
      )}

      {isOpen && (
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#1e3a8a] text-white p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-25"></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="bg-[#D4AF37] rounded-full p-3 shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Portfoliozz AI</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-slate-200">SEBI Registered • Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 relative z-10 hover:rotate-90"
              aria-label="Close chat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in-50 duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                    message.isBot
                      ? 'bg-gradient-to-br from-slate-50 to-white border border-slate-200 text-gray-800'
                      : 'bg-[#1e3a8a] text-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.isBot && (
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full p-2 mt-1">
                        <Search className="h-4 w-4 text-[#1e3a8a]" />
                      </div>
                    )}
                    {!message.isBot && (
                      <div className="bg-white/20 rounded-full p-2 mt-1">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.isBot ? 'text-[#1e3a8a]' : 'text-slate-200'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-in fade-in-50 duration-300">
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4 max-w-[85%] shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full p-2">
                      <Bot className="h-4 w-4 text-[#1e3a8a]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-slate-600">Analyzing market data...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-slate-200 bg-white">
            <div className="flex space-x-3">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type 'analyse [company name]' for detailed stock analysis or ask general questions..."
                className="flex-1 resize-none border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all duration-200 bg-slate-50/50 focus:bg-white"
                rows="1"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-[#1e3a8a] hover:bg-[#1e4199] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-center mt-3 space-x-2">
              <div className="w-1 h-1 bg-[#1e3a8a] rounded-full"></div>
              <p className="text-xs text-slate-500">
                Powered by Portfoliozz AI • SEBI Registered
              </p>
              <div className="w-1 h-1 bg-[#1e3a8a] rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfoliozzChatbot;
