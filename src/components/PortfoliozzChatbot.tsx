import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, TrendingUp, IndianRupee, Search, AlertTriangle } from 'lucide-react';

const PortfoliozzChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "नमस्ते! Welcome to Portfoliozz, your trusted SEBI-registered research analyst firm.\n\nWe specialize in providing expert analysis and recommendations for the Indian stock market, helping you make informed investment decisions.\n\nOur Premium Services:\n\n🔹 Equity Intraday (₹1,000/month)\n   • 2-4 daily high-probability calls\n   • Real-time market insights\n   • Clear Stop Loss & Target levels\n\n🔹 Option Buy (₹1,000/month)\n   • 4-6 weekly recommendations\n   • Min. Capital: ₹1,00,000\n   • Real-time trade alerts\n\n🔹 Option Sell Strategies (₹10,000/month)\n   • Advanced options strategies\n   • Min. Capital: ₹5,00,000\n   • Professional risk management\n\nHow may I assist you today? Feel free to ask about:\n• Market analysis\n• Stock recommendations\n• Service details\n• Company-specific research\n\nTip: Type 'analyse [company name]' for detailed stock analysis with real market data!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
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

  // Search for stocks using Yahoo Finance API
  const searchStocks = async (query) => {
    if (!query || query.length < 2) return [];
    
    try {
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const targetUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0&listsCount=0`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch search results: ${response.status}`);
      }
      
      const responseData = await response.json();
      const data = JSON.parse(responseData.contents);
      
      if (!data.quotes || data.quotes.length === 0) {
        return [];
      }
      
      // Filter for Indian stocks and indices
      const filteredResults = data.quotes
        .filter((quote) => 
          quote.exchange === 'NSI' || 
          quote.exchange === 'BSE' || 
          (quote.quoteType === 'INDEX' && quote.market === 'in_market') ||
          quote.symbol.includes('.NS') ||
          quote.symbol.includes('.BO')
        )
        .map((quote) => ({
          symbol: quote.symbol,
          name: quote.longname || quote.shortname || quote.symbol,
          exchange: quote.exchange
        }));
      
      return filteredResults;
      
    } catch (error) {
      console.error("Error searching stocks:", error);
      return [];
    }
  };

  // Fetch real stock data using Yahoo Finance API
  const fetchRealStockData = async (stockSymbol) => {
    try {
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?interval=1d&range=1y`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const responseData = await response.json();
      const data = JSON.parse(responseData.contents);
      
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error("No data available for this symbol");
      }
      
      const result = data.chart.result[0];
      const meta = result.meta;
      const timestamps = result.timestamp;
      const indicators = result.indicators.quote[0];
      
      // Process the data
      const processedData = {
        symbol: meta.symbol,
        currency: meta.currency,
        exchangeName: meta.exchangeName,
        currentPrice: meta.regularMarketPrice,
        previousClose: meta.previousClose,
        dayChange: meta.regularMarketPrice - meta.previousClose,
        dayChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
        marketCap: meta.regularMarketPrice * (meta.sharesOutstanding || 0),
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
        volume: meta.regularMarketVolume,
        avgVolume: meta.averageDailyVolume10Day,
        priceData: timestamps?.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toLocaleDateString(),
          timestamp: timestamp,
          open: indicators.open[index],
          high: indicators.high[index],
          low: indicators.low[index],
          close: indicators.close[index],
          volume: indicators.volume[index]
        })).filter(item => item.close !== null) || []
      };
      
      return processedData;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  };

  const extractCompanyName = (message) => {
    const words = message.toLowerCase().split(' ');
    const analyzeIndex = words.findIndex(word => word.includes('analys') || word.includes('analyze'));
    
    if (analyzeIndex !== -1 && analyzeIndex < words.length - 1) {
      // Get all words after "analyse/analyze"
      return words.slice(analyzeIndex + 1).join(' ').replace(/[^\w\s.-]/g, '').trim();
    }
    
    return null;
  };

  const formatStockDataForAnalysis = (stockData) => {
    if (!stockData) return "No stock data available.";
    
    const recentData = stockData.priceData.slice(-30); // Last 30 days
    const currentPrice = stockData.currentPrice;
    const dayChange = stockData.dayChange;
    const dayChangePercent = stockData.dayChangePercent;
    
    // Helper function to format numbers safely
    const safeFormat = (value, decimals = 2) => {
      if (value == null || isNaN(value) || value === undefined) return 'N/A';
      return value.toFixed(decimals);
    };
    
    const safeFormatInteger = (value) => {
      if (value == null || isNaN(value) || value === undefined || value === 0) return 'N/A';
      return value.toLocaleString();
    };
    
    const safeFormatCrores = (value) => {
      if (value == null || isNaN(value) || value === undefined || value === 0) return 'N/A';
      return (value / 10000000).toFixed(0);
    };
    
    // Calculate technical indicators
    const prices = recentData.map(d => d.close).filter(p => p !== null && !isNaN(p));
    const sma20 = prices.length >= 20 ? prices.slice(-20).reduce((a, b) => a + b) / 20 : null;
    const sma50 = prices.length >= 50 ? prices.slice(-50).reduce((a, b) => a + b) / 50 : null;
    
    // Calculate RSI (simplified)
    const calculateRSI = (prices, period = 14) => {
      if (prices.length < period + 1) return null;
      
      let gains = 0, losses = 0;
      for (let i = prices.length - period; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses += Math.abs(change);
      }
      
      const avgGain = gains / period;
      const avgLoss = losses / period;
      if (avgLoss === 0) return 100;
      const rs = avgGain / avgLoss;
      return 100 - (100 / (1 + rs));
    };
    
    const rsi = calculateRSI(prices);
    
    // Support and resistance levels
    const highs = recentData.map(d => d.high).filter(h => h !== null && !isNaN(h));
    const lows = recentData.map(d => d.low).filter(l => l !== null && !isNaN(l));
    const resistance = highs.length > 0 ? Math.max(...highs) : null;
    const support = lows.length > 0 ? Math.min(...lows) : null;
    
    return `
REAL-TIME STOCK DATA ANALYSIS FOR ${stockData.symbol}

Current Market Data:
- Current Price: ₹${safeFormat(currentPrice)}
- Day Change: ₹${safeFormat(dayChange)} (${safeFormat(dayChangePercent)}%)
- Previous Close: ₹${safeFormat(stockData.previousClose)}
- 52-Week High: ₹${safeFormat(stockData.fiftyTwoWeekHigh)}
- 52-Week Low: ₹${safeFormat(stockData.fiftyTwoWeekLow)}
- Market Cap: ₹${safeFormatCrores(stockData.marketCap)} Cr
- Volume: ${safeFormatInteger(stockData.volume)}
- Avg Volume: ${safeFormatInteger(stockData.avgVolume)}

Technical Indicators:
- 20-Day SMA: ₹${safeFormat(sma20)}
- 50-Day SMA: ₹${safeFormat(sma50)}
- RSI (14): ${safeFormat(rsi)}
- Support Level: ₹${safeFormat(support)}
- Resistance Level: ₹${safeFormat(resistance)}

Price Trend (Last 10 Days):
${recentData.slice(-10).map(d => 
  `${d.date}: Open ₹${safeFormat(d.open)}, High ₹${safeFormat(d.high)}, Low ₹${safeFormat(d.low)}, Close ₹${safeFormat(d.close)}`
).join('\n')}

Exchange: ${stockData.exchangeName || 'N/A'}
Currency: ${stockData.currency || 'N/A'}
`;
  };

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
When provided with real stock data, analyze it comprehensively in this structured format:

**INVESTMENT ANALYSIS - [COMPANY NAME]**

**Current Market Position**
- Use the real-time data provided including current price, market cap, volume and do not show any values if its 0.
- Calculate percentage changes and trends from the actual data but do not include undefined or NaN responses
- Comment on trading volume vs average volume

**Technical Analysis (Based on Real Data)**
- Analyze the actual support and resistance levels provided
- Comment on moving averages (SMA 20, SMA 50) relative to current price
- Interpret RSI levels for momentum
- Analyze recent price action from the 10-day trend data
- Do not give undefined responses

**Price Action & Momentum**
- Evaluate the recent price movements but do not include undefined or NaN responses
- Identify if stock is in uptrend, downtrend, or sideways
- Comment on volume patterns
- Assess 52-week high/low positioning

**Investment Recommendation**
- Clear rating: BUY/HOLD/SELL with specific reasoning based on technical data
- Entry Strategy with specific price levels based on support/resistance
- Stop-loss recommendations using technical levels
- Target price calculations based on resistance/support analysis
- Risk-reward ratio assessment

**Risk Management Guidelines**
- Position sizing recommendations
- Risk management based on volatility
- Time horizon suggestions

IMPORTANT GUIDELINES:
- Base ALL analysis on the real stock data provided
- Do not give undefined responses
- Do not give NaN responses
- Give specific price levels for entry, stop-loss, and targets
- Use actual technical indicators in your reasoning
- Provide actionable insights based on current market data
- Include exact numbers from the data provided
- NEVER use asterisks (*) or any markdown formatting (**, *, ##, etc.) in responses
- Format section headers and emphasis using plain text only
- Use clear formatting with line breaks and spacing instead of special characters
- Maintain SEBI compliance in all recommendations
- Always include a disclaimer about market risks and the need for due diligence

Remember: You are analyzing REAL market data, not hypothetical scenarios. Base your recommendations on the actual technical indicators and price levels provided.
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
      let stockDataText = "";
      
      if (isAnalysisQuery) {
        // Extract company name and search for it
        const companyName = extractCompanyName(userMessage);
        
        if (companyName) {
          try {
            // Show searching message
            const searchingMessage = {
              id: messages.length + Date.now(),
              text: `Searching for "${companyName}" in Indian stock markets...`,
              isBot: true,
              timestamp: new Date(),
              isLoading: true
            };
            setMessages(prev => [...prev, searchingMessage]);
            
            // Search for the company
            const searchResults = await searchStocks(companyName);
            
            if (searchResults.length === 0) {
              // Remove searching message
              setMessages(prev => prev.filter(msg => !msg.isLoading));
              
              return `I couldn't find any Indian stock matching "${companyName}". 

Please try:
1. Using the exact company name (e.g., "Reliance Industries", "Tata Consultancy Services")
2. Using the stock symbol (e.g., "RELIANCE", "TCS", "INFY")
3. Check the spelling and try again

Popular examples to try:
- analyse Reliance Industries
- analyse TCS
- analyse HDFC Bank
- analyse Infosys

For immediate assistance, contact us at WhatsApp: 7592833517`;
            }
            
            // Use the first search result (most relevant)
            const selectedStock = searchResults[0];
            
            // Update searching message
            setMessages(prev => prev.map(msg => 
              msg.isLoading ? 
                {...msg, text: `Found ${selectedStock.name} (${selectedStock.symbol}). Fetching real-time market data...`} : 
                msg
            ));
            
            // Fetch real stock data
            const fetchedStockData = await fetchRealStockData(selectedStock.symbol);
            setStockData(fetchedStockData);
            stockDataText = formatStockDataForAnalysis(fetchedStockData);
            
            // Remove loading message
            setMessages(prev => prev.filter(msg => !msg.isLoading));
            
            prompt = `${portfoliozzContext}

User Query: ${userMessage}
Company Found: ${selectedStock.name} (${selectedStock.symbol})

REAL STOCK DATA PROVIDED:
${stockDataText}

This is a request for comprehensive stock analysis using REAL market data. Provide detailed investment analysis following the structured format outlined in the context. Base your entire analysis on the actual stock data provided above.

Act as a professional SEBI-registered financial advisor and give specific, actionable recommendations with clear reasoning based on the real technical indicators and price levels.

Do NOT include any service promotions in the response. Focus purely on the investment analysis using the real data.

Important: Use the actual numbers, ratios, and price levels from the real data provided. Give clear BUY/HOLD/SELL recommendations with specific entry points and risk management guidelines based on the technical analysis of real market data.`;
          } catch (error) {
            console.error('Error in stock analysis:', error);
            // Remove loading message
            setMessages(prev => prev.filter(msg => !msg.isLoading));
            
            return `I encountered an error while fetching data for "${companyName}". This could be due to:

1. Network connectivity issues
2. Market data temporarily unavailable
3. Invalid or delisted stock symbol

Please try again in a moment or try with a different company name.

For immediate assistance, you can contact us at WhatsApp: 7592833517`;
          }
        } else {
          return `To provide you with accurate analysis using real market data, please specify the company name in your query.

Format: "analyse [COMPANY_NAME]"

Examples:
- analyse Reliance Industries
- analyse Tata Consultancy Services
- analyse HDFC Bank
- analyse Infosys
- analyse Asian Paints

I'll search for the company in Indian stock markets and provide comprehensive technical analysis with specific buy/sell recommendations, entry points, and risk management guidelines using real-time data.`;
        }
      } else if (isStockQuery) {
        // General stock query with subtle service mention
        prompt = `${portfoliozzContext}

User Query: ${userMessage}

This appears to be a stock/investment related query. Provide helpful insights and if appropriate, gently mention our services that could help with their investment needs.

For comprehensive stock analysis with real market data, guide users to use "analyse [company name]" format.

Provide relevant insights with professional recommendations where applicable.`;
      } else {
        // General query
        prompt = `${portfoliozzContext}

User Query: ${userMessage}

Please provide a helpful response as the Portfoliozz AI Assistant. Focus on how our services can help the user or provide general market insights as appropriate.

Tip: For detailed stock analysis with real-time data, suggest users to type "analyse [company name]" for comprehensive investment insights using live market data.`;
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
          .replace(/\*\*(.*?)\*\*/g, '$1')  
          .replace(/\*(.*?)\*/g, '$1')      
          .replace(/#{1,6}\s/g, '')         
          .replace(/^\s*[\*\-\+]\s/gm, '• ') 
          .replace(/^\s*\d+\.\s/gm, '')     
          .trim();
        
        // Add disclaimer for stock analysis
        if (isAnalysisQuery && stockDataText) {
          botResponse += "\n\nDISCLAIMER: This analysis is based on technical indicators and historical data. Stock market investments are subject to market risks. Please read all related documents carefully and consult with a financial advisor before making investment decisions. Past performance does not guarantee future results.";
        }
        
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
                  <p className="text-sm text-slate-200">SEBI Registered • Real-Time Data</p>
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
                      ? message.isLoading
                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 text-gray-800'
                        : 'bg-gradient-to-br from-slate-50 to-white border border-slate-200 text-gray-800'
                      : 'bg-[#1e3a8a] text-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.isBot && (
                      <div className={`rounded-full p-2 mt-1 ${
                        message.isLoading 
                          ? 'bg-yellow-200' 
                          : 'bg-gradient-to-br from-slate-100 to-slate-200'
                      }`}>
                        {message.isLoading ? (
                          <Search className="h-4 w-4 text-yellow-600 animate-spin" />
                        ) : (
                          <Bot className="h-4 w-4 text-[#1e3a8a]" />
                        )}
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