
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, TrendingUp, IndianRupee, Search, AlertTriangle } from 'lucide-react';

const PortfoliozzChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "नमस्ते! Welcome to Portfoliozz, I can help you with stock analysis, company information, quarterly results, and market insights. Just ask me about any Indian company!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const GEMINI_API_KEY = 'AIzaSyCbNiFwhjKixb2zTaEghxjHtGam-eB5nCI';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Popular Indian companies database for better detection
  const POPULAR_COMPANIES = [
    // IT Companies
    'TCS', 'Tata Consultancy Services', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra', 'LTI', 'Mindtree',
    // Banking
    'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'SBI', 'Axis Bank', 'Kotak Mahindra Bank', 'IndusInd Bank',
    // Conglomerates
    'Reliance Industries', 'Reliance', 'Tata Motors', 'Bajaj Finance', 'Bajaj Finserv', 'Larsen & Toubro', 'L&T',
    // FMCG
    'Hindustan Unilever', 'HUL', 'ITC', 'Nestle India', 'Britannia Industries', 'Dabur India',
    // Pharma
    'Sun Pharma', 'Dr Reddys Labs', 'Cipla', 'Lupin', 'Aurobindo Pharma', 'Divi\'s Labs',
    // Auto
    'Maruti Suzuki', 'Mahindra & Mahindra', 'Hero MotoCorp', 'Bajaj Auto', 'Eicher Motors',
    // Telecom
    'Bharti Airtel', 'Airtel', 'Jio', 'Reliance Jio',
    // Others
    'Asian Paints', 'UltraTech Cement', 'JSW Steel', 'Tata Steel', 'ONGC', 'NTPC', 'PowerGrid', 'Coal India',
    'HDFC', 'Life Insurance Corporation', 'LIC', 'Adani Enterprises', 'Adani Ports', 'Grasim Industries'
  ];

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

  // Enhanced company name extraction
  // 1. Enhanced extractCompanyFromQuery function
const extractCompanyFromQuery = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // First, check for direct company name matches
  for (const company of POPULAR_COMPANIES) {
    if (lowerMessage.includes(company.toLowerCase())) {
      return company;
    }
  }
  
  // Enhanced pattern-based extraction with more flexible patterns
  const patterns = [
    // Opinion/analysis patterns
    /(?:opinion|view|analysis|thoughts?|recommendation|suggest(?:ion)?|advice)\s+(?:about|on|regarding|for|of)\s+([A-Za-z\s&'.-]+?)(?:\s|$|[?.!])/i,
    
    // What about / How about patterns
    /(?:what|how)\s+about\s+([A-Za-z\s&'.-]+?)(?:\s+(?:stock|share|company)|[?.!]|\s|$)/i,
    
    // Company name with question words
    /(?:how|what|tell me)\s+(?:is|about|regarding)\s+([A-Za-z\s&'.-]+?)(?:\s+(?:stock|share|company|performing|doing|going)|[?.!]|\s|$)/i,
    
    // Direct mentions with stock/share
    /(?:about|regarding|on|for|of|analyze|analyse|tell me about|how is|what about)\s+([A-Za-z\s&'.-]+?)(?:\s+(?:stock|share|company|performance|quarterly|results|financials|going|doing)|\s*[?.!]|$)/i,
    
    // Company name followed by stock/share
    /([A-Za-z\s&'.-]+?)\s+(?:stock|share|equity|performance|analysis|data|results|quarterly|financials|going|doing)/i,
    
    // Simple company name extraction (more flexible)
    /^(?:what|how|tell|analyze|analyse|opinion|view|thoughts?|recommendation|suggest(?:ion)?|advice)?\s*(?:is|about|on|regarding|for|of)?\s*([A-Za-z\s&'.-]{3,}?)(?:\s+(?:stock|share|company|performance|opinion|view|analysis|thoughts?|recommendation|suggest(?:ion)?|advice)|[?.!]|$)/i,
    
    // Company name at start of message
    /^([A-Za-z\s&'.-]{3,}?)(?:\s+(?:stock|share|performance|analysis|data|results|quarterly|financials|going|doing|opinion|view|thoughts?|recommendation))/i,
    
    // NEW: Direct company mentions with buying/selling
    /(?:talk about|opinion|view|thoughts?|analysis)\s+([A-Za-z\s&'.-]+?)\s+(?:with|about|regarding|for|stock|share|buying|selling)/i,
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      let extractedName = match[1].trim();
      
      // Clean up the extracted name
      const excludeWords = [
        'stock', 'share', 'company', 'market', 'price', 'value', 'analysis', 'report', 'news', 
        'the', 'what', 'how', 'when', 'where', 'why', 'which', 'has', 'have', 'had', 'is', 
        'are', 'was', 'were', 'been', 'being', 'do', 'does', 'did', 'will', 'would', 'should',
        'could', 'may', 'might', 'must', 'can', 'performance', 'performed', 'performing',
        'over', 'last', 'year', 'years', 'month', 'months', 'quarter', 'quarters', 'past',
        'this', 'that', 'these', 'those', 'and', 'or', 'but', 'so', 'if', 'then', 'now',
        'latest', 'recent', 'current', 'today', 'yesterday', 'tomorrow', 'going', 'doing',
        'opinion', 'view', 'analysis', 'thoughts', 'recommendation', 'suggestion', 'advice',
        'tell', 'me', 'about', 'on', 'regarding', 'for', 'of', 'analyze', 'analyse',
        'buy', 'sell', 'hold', 'invest', 'investment', 'purchase', 'get', 'take', 'buying', 'selling',
        'with', 'talk'
      ];
      
      // Remove exclude words
      const words = extractedName.split(' ');
      const filteredWords = words.filter(word => 
        !excludeWords.includes(word.toLowerCase()) && 
        word.length > 1
      );
      
      if (filteredWords.length > 0) {
        extractedName = filteredWords.join(' ');
        
        // Additional validation
        if (extractedName.length > 1 && 
            !excludeWords.includes(extractedName.toLowerCase()) &&
            !/^\d+$/.test(extractedName) && 
            !/^[0-9\s]+$/.test(extractedName)) {
          return extractedName;
        }
      }
    }
  }
  
  return null;
};

// NEW: Fallback function to search for stocks by individual words
const searchStocksByWords = async (message) => {
  const words = message.toLowerCase().split(' ');
  const excludeWords = [
    'do', 'i', 'buy', 'sell', 'hold', 'invest', 'investment', 'purchase', 'get', 'take',
    'stock', 'share', 'company', 'market', 'price', 'value', 'analysis', 'report', 'news',
    'the', 'what', 'how', 'when', 'where', 'why', 'which', 'has', 'have', 'had', 'is',
    'are', 'was', 'were', 'been', 'being', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'performance', 'performed', 'performing',
    'over', 'last', 'year', 'years', 'month', 'months', 'quarter', 'quarters', 'past',
    'this', 'that', 'these', 'those', 'and', 'or', 'but', 'so', 'if', 'then', 'now',
    'latest', 'recent', 'current', 'today', 'yesterday', 'tomorrow', 'going', 'doing',
    'opinion', 'view', 'thoughts', 'recommendation', 'suggestion', 'advice',
    'tell', 'me', 'about', 'on', 'regarding', 'for', 'of', 'analyze', 'analyse',
    'buying', 'selling', 'with', 'talk'
  ];
  
  // Filter meaningful words and also try combinations
  const meaningfulWords = words.filter(word => 
    word.length > 2 && 
    !excludeWords.includes(word) &&
    !/^\d+$/.test(word)
  );
  
  console.log('Meaningful words to search:', meaningfulWords);
  
  // First try individual words
  for (const word of meaningfulWords) {
    try {
      const results = await searchStocks(word);
      if (results.length > 0) {
        console.log(`Found results for word "${word}":`, results);
        return { word, results };
      }
    } catch (error) {
      console.log(`No results for word "${word}"`);
      continue;
    }
  }
  
  // Then try word combinations (2-word combinations)
  for (let i = 0; i < meaningfulWords.length - 1; i++) {
    const combination = meaningfulWords[i] + ' ' + meaningfulWords[i + 1];
    try {
      const results = await searchStocks(combination);
      if (results.length > 0) {
        console.log(`Found results for combination "${combination}":`, results);
        return { word: combination, results };
      }
    } catch (error) {
      console.log(`No results for combination "${combination}"`);
      continue;
    }
  }
  
  return null;
};

  // Search for stocks using Yahoo Finance API
  // Search for stocks using Yahoo Finance API - NSE ONLY
const searchStocks = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    // Enhanced search queries with better matching
    const searchQueries = [
      query,
      query + ' limited',
      query + ' ltd',
      query + ' technologies',
      query + ' tech',
      query + ' stock',
      query + '.NS',
      // Handle specific cases
      query.replace(/\s+tech$|technologies$/i, ' Technologies'),
    ];
    
    for (const searchQuery of searchQueries) {
      try {
        const proxyUrl = "https://api.allorigins.win/get?url=";
        const targetUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(searchQuery)}&quotesCount=20&newsCount=0&listsCount=0`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          console.log(`Search failed for ${searchQuery}, trying next...`);
          continue;
        }
        
        const responseData = await response.json();
        const data = JSON.parse(responseData.contents);
        
        if (data.quotes && data.quotes.length > 0) {
          // MODIFIED: Filter for NSE stocks ONLY
          const filteredResults = data.quotes
            .filter((quote) => {
              const symbol = (quote.symbol || '').toUpperCase();
              const exchange = (quote.exchange || '').toUpperCase();
              const market = (quote.market || '').toLowerCase();
              const longName = (quote.longname || '').toLowerCase();
              const shortName = (quote.shortname || '').toLowerCase();
              
              // Check for NSE stocks ONLY (removed BSE filtering)
              const isNSEStock = (
                exchange === 'NSI' || 
                exchange === 'NSE' ||
                symbol.includes('.NS') ||
                market === 'in_market' ||
                market.includes('india')
              );
              
              // Enhanced name matching
              const queryLower = query.toLowerCase();
              const nameMatch = (
                longName.includes(queryLower) ||
                shortName.includes(queryLower) ||
                symbol.toLowerCase().includes(queryLower.replace(/\s+/g, ''))
              );
              
              // Additional NSE validation - exclude BSE symbols
              const isNotBSE = !symbol.includes('.BO');
              
              return isNSEStock && nameMatch && isNotBSE && quote.quoteType !== 'CRYPTOCURRENCY';
            })
            .map((quote) => ({
              symbol: quote.symbol,
              name: quote.longname || quote.shortname || quote.symbol,
              exchange: quote.exchange,
              quoteType: quote.quoteType,
              market: quote.market
            }))
            .slice(0, 10);
          
          if (filteredResults.length > 0) {
            return filteredResults;
          }
        }
      } catch (searchError) {
        console.log(`Error searching for ${searchQuery}:`, searchError);
        continue;
      }
    }
    
    return [];
    
  } catch (error) {
    console.error("Error in stock search:", error);
    return [];
  }
};


  // Fetch real stock data using Yahoo Finance API
  const fetchRealStockData = async (stockSymbol) => {
  try {
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?interval=1d&range=1y&includePrePost=false`;
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    if (!responseData.contents) {
      throw new Error("No data received from proxy");
    }
    
    const data = JSON.parse(responseData.contents);
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error("No chart data available for this symbol");
    }
    
    const result = data.chart.result[0];
    const meta = result.meta;
    const timestamps = result.timestamp || [];
    const indicators = result.indicators?.quote?.[0] || {};
    
    // Ensure we have valid data
    if (!meta) {
      throw new Error("No metadata available");
    }
    
    // Process the data with better error handling
    const processedData = {
      symbol: meta.symbol || stockSymbol,
      currency: meta.currency || 'INR',
      exchangeName: meta.exchangeName || 'NSE',
      currentPrice: meta.regularMarketPrice || meta.previousClose || 0,
      previousClose: meta.previousClose || 0,
      dayChange: (meta.regularMarketPrice || 0) - (meta.previousClose || 0),
      dayChangePercent: meta.previousClose ? (((meta.regularMarketPrice || 0) - meta.previousClose) / meta.previousClose) * 100 : 0,
      marketCap: (meta.regularMarketPrice || 0) * (meta.sharesOutstanding || 0),
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
      volume: meta.regularMarketVolume || 0,
      avgVolume: meta.averageDailyVolume10Day || 0,
      companyName: meta.longName || meta.shortName || stockSymbol,
      priceData: timestamps.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toLocaleDateString('en-IN'),
        timestamp: timestamp,
        open: indicators.open?.[index] || null,
        high: indicators.high?.[index] || null,
        low: indicators.low?.[index] || null,
        close: indicators.close?.[index] || null,
        volume: indicators.volume?.[index] || null
      })).filter(item => item.close !== null && !isNaN(item.close))
    };
    
    return processedData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error(`Failed to fetch data for ${stockSymbol}: ${error.message}`);
  }
};

  const formatStockDataForAnalysis = (stockData) => {
  if (!stockData) return "No stock data available.";
  
  const recentData = stockData.priceData.slice(-30);
  const currentPrice = stockData.currentPrice;
  const dayChange = stockData.dayChange;
  const dayChangePercent = stockData.dayChangePercent;
  
  // Helper functions with better null handling
  const safeFormat = (value, decimals = 2) => {
    if (value == null || isNaN(value) || value === undefined) return 'N/A';
    return Number(value).toFixed(decimals);
  };
  
  const safeFormatInteger = (value) => {
    if (value == null || isNaN(value) || value === undefined || value === 0) return 'N/A';
    return Number(value).toLocaleString('en-IN');
  };
  
  const safeFormatCrores = (value) => {
    if (value == null || isNaN(value) || value === undefined || value === 0) return 'N/A';
    return (Number(value) / 10000000).toFixed(0);
  };
  
  // Enhanced technical analysis
  const prices = recentData.map(d => d.close).filter(p => p !== null && !isNaN(p) && p > 0);
  
  let sma20 = null, sma50 = null, rsi = null;
  
  if (prices.length >= 20) {
    sma20 = prices.slice(-20).reduce((a, b) => a + b) / 20;
    
    if (prices.length >= 50) {
      sma50 = prices.slice(-50).reduce((a, b) => a + b) / 50;
    }
    
    // Calculate RSI
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
    
    rsi = calculateRSI(prices);
  }
  
  // Support and resistance levels
  const highs = recentData.map(d => d.high).filter(h => h !== null && !isNaN(h) && h > 0);
  const lows = recentData.map(d => d.low).filter(l => l !== null && !isNaN(l) && l > 0);
  const resistance = highs.length > 0 ? Math.max(...highs) : null;
  const support = lows.length > 0 ? Math.min(...lows) : null;
  
  // Market sentiment analysis
  const getMarketSentiment = () => {
    if (dayChangePercent > 2) return "Strongly Bullish 🚀";
    if (dayChangePercent > 0.5) return "Bullish 📈";
    if (dayChangePercent < -2) return "Strongly Bearish 📉";
    if (dayChangePercent < -0.5) return "Bearish 🔻";
    return "Neutral ➡️";
  };
  
  const getTechnicalSignal = () => {
    if (!sma20 || !currentPrice) return "Insufficient Data";
    
    if (currentPrice > sma20 * 1.02) return "Strong Buy Signal";
    if (currentPrice > sma20) return "Buy Signal";
    if (currentPrice < sma20 * 0.98) return "Strong Sell Signal";
    if (currentPrice < sma20) return "Sell Signal";
    return "Hold";
  };
  
  return `
📊 REAL-TIME ANALYSIS FOR ${stockData.companyName} (${stockData.symbol})

💰 CURRENT MARKET DATA:
Current Price: ₹${safeFormat(currentPrice)}
Day Change: ₹${safeFormat(dayChange)} (${safeFormat(dayChangePercent)}%)
Previous Close: ₹${safeFormat(stockData.previousClose)}
Market Sentiment: ${getMarketSentiment()}

📈 PRICE RANGE:
52-Week High: ₹${safeFormat(stockData.fiftyTwoWeekHigh)}
52-Week Low: ₹${safeFormat(stockData.fiftyTwoWeekLow)}
From 52W High: ${stockData.fiftyTwoWeekHigh ? safeFormat(((currentPrice - stockData.fiftyTwoWeekHigh) / stockData.fiftyTwoWeekHigh) * 100) : 'N/A'}%
From 52W Low: ${stockData.fiftyTwoWeekLow ? safeFormat(((currentPrice - stockData.fiftyTwoWeekLow) / stockData.fiftyTwoWeekLow) * 100) : 'N/A'}%

📊 TECHNICAL INDICATORS:
20-Day SMA: ₹${safeFormat(sma20)}
50-Day SMA: ₹${safeFormat(sma50)}
RSI (14): ${safeFormat(rsi)}
Technical Signal: ${getTechnicalSignal()}
Support Level: ₹${safeFormat(support)}
Resistance Level: ₹${safeFormat(resistance)}

💼 TRADING DATA:
Today's Volume: ${safeFormatInteger(stockData.volume)}
Avg Daily Volume: ${safeFormatInteger(stockData.avgVolume)}
Market Cap: ₹${safeFormatCrores(stockData.marketCap)} Crores

📅 RECENT PRICE PERFORMANCE (Last 7 Days):
${recentData.slice(-7).map(d => 
  `${d.date}: Close ₹${safeFormat(d.close)} (H: ₹${safeFormat(d.high)}, L: ₹${safeFormat(d.low)})`
).join('\n')}

🏪 Exchange: ${stockData.exchangeName}
💱 Currency: ${stockData.currency}
⏰ Data as of: ${new Date().toLocaleString('en-IN')}
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

RESPONSE GUIDELINES:
- Answer any question about Indian companies using real-time market data when available
- Provide comprehensive analysis for any company-related query
- Use actual market data and technical indicators in your responses
- Give specific insights based on current market conditions
- Do not use markdown formatting (**, *, ##, etc.) - use plain text only
- Format responses with clear line breaks and spacing
- Always base analysis on real data provided
- Include relevant disclaimers for investment advice
- Be conversational and helpful while maintaining professional expertise

Remember: You can answer ANY question about Indian companies - quarterly results, financial performance, market position, technical analysis, future prospects, etc. Always use the real-time data provided to give accurate, up-to-date insights.
`;

  // Enhanced query detection
  const detectCompanyQuery = (message) => {
  const companyKeywords = [
    'stock', 'share', 'company', 'quarterly', 'results', 'financials', 'revenue', 'profit', 'earnings',
    'performance', 'analysis', 'valuation', 'investment', 'buy', 'sell', 'hold', 'recommendation',
    'target', 'price', 'market cap', 'dividend', 'growth', 'future', 'prospects', 'business',
    'sector', 'industry', 'competition', 'management', 'debt', 'cash flow', 'balance sheet',
    'PE ratio', 'PB ratio', 'ROE', 'ROA', 'margin', 'EBITDA', 'net income', 'performed', 'doing',
    'over the last', 'in the past', 'year', 'years', 'month', 'months', 'quarter', 'data',
    'latest', 'recent', 'current', 'today', 'financial', 'report', 'earning', 'trading', 'going',
    'opinion', 'view', 'thoughts', 'suggest', 'advice', 'recommendation', 'analysis'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check if message contains company keywords
  const hasCompanyKeyword = companyKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check if message contains popular company names
  const hasCompanyName = POPULAR_COMPANIES.some(company => 
    lowerMessage.includes(company.toLowerCase())
  );
  
  // Enhanced question patterns including opinion-based queries
  const companyQuestionPatterns = [
    // Opinion/analysis patterns
    /(?:opinion|view|analysis|thoughts?|recommendation|suggest(?:ion)?|advice)\s+(?:about|on|regarding|for|of)/i,
    /(?:what|how)\s+(?:is|about|do you think|are your thoughts)/i,
    
    // Traditional patterns
    /how\s+(?:is|has|did|does).+(?:stock|share|company|performed|doing|performing|going)/i,
    /what.+(?:stock|share|company|performance|quarterly|results|price|value)/i,
    /tell me about.+/i,
    /(?:analysis|data|information|details)\s+(?:of|on|about|for).+/i,
    /.+(?:performed|performing|going|doing).+(?:last|past|over|in|during).+(?:year|month|quarter)/i,
    /.+(?:stock|share).+(?:year|month|quarter|performance|going|doing)/i,
    /.+(?:quarterly|results|financials|earnings)\s*(?:of|for)?\s*.+/i,
    /(?:latest|recent|current).+(?:stock|share|company|performance|data|result|price)/i,
    
    // More flexible patterns
    /^[A-Za-z\s&'.-]+\s+(?:stock|share|performance|analysis|data|results|quarterly|financials|going|doing)/i,
    /(?:hcl|tcs|reliance|infos?ys|wipro|hdfc|icici|sbi|bajaj|maruti|asian paints|itc)/i,
    
    // Any company name followed by relevant words
    /.+(?:tech|technologies|industries|limited|ltd|bank|motors|systems|solutions)/i
  ];
  
  const hasCompanyQuestionPattern = companyQuestionPatterns.some(pattern => 
    pattern.test(lowerMessage)
  );
  
  return hasCompanyKeyword || hasCompanyName || hasCompanyQuestionPattern;
};

  const generateBotResponse = async (userMessage) => {
  try {
    const isCompanyQuery = detectCompanyQuery(userMessage);
    const extractedCompany = extractCompanyFromQuery(userMessage);
    
    console.log('Query Analysis:', { isCompanyQuery, extractedCompany, originalMessage: userMessage });
    
    let prompt;
    let stockDataText = "";
    
    if (isCompanyQuery) {
      let companyToSearch = extractedCompany;
      let searchResults = [];
      let searchMethod = 'pattern';
      
      // If no company extracted using patterns, try word-by-word search
      if (!companyToSearch) {
        console.log('No company found in patterns, trying word-by-word search...');
        
        // Show searching message
        const searchingMessage = {
          id: messages.length + Date.now(),
          text: `🔍 Analyzing each word in your query for stock mentions...`,
          isBot: true,
          timestamp: new Date(),
          isLoading: true
        };
        setMessages(prev => [...prev, searchingMessage]);
        
        const wordSearchResult = await searchStocksByWords(userMessage);
        
        if (wordSearchResult) {
          companyToSearch = wordSearchResult.word;
          searchResults = wordSearchResult.results;
          searchMethod = 'word-search';
          console.log(`Found company "${companyToSearch}" using word search`);
        }
        
        // Remove searching message
        setMessages(prev => prev.filter(msg => !msg.isLoading));
      }
      
      // If we found a company to search, proceed
      if (companyToSearch && companyToSearch.length > 1) {
        try {
          // If we don't have search results yet, search normally
          if (searchResults.length === 0) {
            // Show searching message
            const searchingMessage = {
              id: messages.length + Date.now(),
              text: `🔍 Searching for "${companyToSearch}" in Indian stock markets...`,
              isBot: true,
              timestamp: new Date(),
              isLoading: true
            };
            setMessages(prev => [...prev, searchingMessage]);
            
            // Search for the company
            searchResults = await searchStocks(companyToSearch);
            
            // Remove searching message
            setMessages(prev => prev.filter(msg => !msg.isLoading));
          }
          
          if (searchResults.length === 0) {
            // Enhanced error message with better suggestions
            return `❌ I couldn't find "${companyToSearch}" in Indian stock markets after searching each word individually.

💡 Please try with exact company names or symbols:
• IT Companies: "TCS", "Infosys", "HCL Technologies", "Wipro", "Tech Mahindra"
• Banking: "HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank"
• Other Popular: "Reliance", "Tata Motors", "Asian Paints", "ITC", "Maruti Suzuki"

🔍 Alternative: Try using stock symbols like "HCLTECH", "RELIANCE.NS", "TCS.NS"

📱 For immediate assistance: WhatsApp 7592833517`;
          }
          
          // Use the most relevant search result
          const selectedStock = searchResults[0];
          
          // Show data fetching message
          const fetchingMessage = {
            id: messages.length + Date.now(),
            text: `✅ Found ${selectedStock.name} (${selectedStock.symbol}) using ${searchMethod === 'word-search' ? 'word-by-word search' : 'pattern matching'}\n📊 Fetching real-time market data...`,
            isBot: true,
            timestamp: new Date(),
            isLoading: true
          };
          setMessages(prev => [...prev, fetchingMessage]);
          
          // Fetch real stock data
          const fetchedStockData = await fetchRealStockData(selectedStock.symbol);
          setStockData(fetchedStockData);
          stockDataText = formatStockDataForAnalysis(fetchedStockData);
          
          // Remove loading message
          setMessages(prev => prev.filter(msg => !msg.isLoading));
          
          // Determine the type of query and tailor response accordingly
          const queryType = determineQueryType(userMessage);
          
          prompt = `${portfoliozzContext}

User Query: ${userMessage}
Query Type: ${queryType}
Company Found: ${selectedStock.name} (${selectedStock.symbol})

REAL-TIME STOCK DATA PROVIDED:
${stockDataText}

Based on the user's ${queryType} query about ${selectedStock.name}, provide a focused response that directly addresses what they asked for:

${getQuerySpecificInstructions(queryType)}

Use the real-time market data above to support your response. Be conversational but professional. Don't use markdown formatting - use plain text with emojis and clear formatting.

Focus specifically on what the user asked for rather than providing a generic analysis.`;
        } catch (error) {
          console.error('Error in stock analysis:', error);
          // Remove loading message
          setMessages(prev => prev.filter(msg => !msg.isLoading));
          
          return `⚠️ Unable to fetch data for "${companyToSearch}" right now.

This could be due to:
🔸 Network connectivity issues
🔸 Market data temporarily unavailable  
🔸 Invalid or delisted stock symbol

🔄 Please try again in a moment
📱 For immediate help: WhatsApp 7592833517`;
        }
      } else {
        // Enhanced fallback message
        return `🤖 I'd love to help with Indian stock analysis!

I tried to find a company name in your message but couldn't identify a specific stock. Please specify which company you want to know about:

💡 Try asking:
• "What's your opinion on Cyient?"
• "Talk about HCL Technologies with buying opinion"
• "How is Reliance Industries performing?"
• "Tell me about TCS stock"

🎯 I can provide real-time data analysis, opinions, and insights for any Indian listed company.

📱 Need help? WhatsApp 7592833517`;
      }
    } else {
      // General query handling
      prompt = `${portfoliozzContext}

User Query: ${userMessage}

This is a general query about stock market, investment, or our services. Provide a helpful, conversational response as the Portfoliozz AI Assistant. 

If appropriate, guide the user on how they can get real-time company analysis. Be friendly and professional without using markdown formatting.`;
    }

    // Call Gemini API
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
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      let botResponse = data.candidates[0].content.parts[0].text;
      
      // Remove markdown formatting
      botResponse = botResponse
        .replace(/\*\*(.*?)\*\*/g, '$1')  
        .replace(/\*(.*?)\*/g, '$1')      
        .replace(/#{1,6}\s/g, '')         
        .replace(/^\s*[\*\-\+]\s/gm, '• ') 
        .replace(/^\s*\d+\.\s/gm, '')     
        .trim();
      
      
      return botResponse;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Error in generateBotResponse:', error);
    return `🚨 I'm experiencing technical difficulties right now.

🔄 Please try again in a moment
📱 For immediate assistance: WhatsApp 7592833517

I'm here to help with Indian stock market analysis, company insights, and investment guidance!`;
  }
};



const determineQueryType = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('opinion') || lowerMessage.includes('think') || lowerMessage.includes('view') || lowerMessage.includes('thoughts')) {
    return 'opinion';
  } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('advice') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
    return 'recommendation';
  } else if (lowerMessage.includes('quarter') || lowerMessage.includes('result') || lowerMessage.includes('earning') || lowerMessage.includes('financial')) {
    return 'financial_performance';
  } else if (lowerMessage.includes('how') && (lowerMessage.includes('perform') || lowerMessage.includes('doing') || lowerMessage.includes('going'))) {
    return 'performance';
  } else if (lowerMessage.includes('analysis') || lowerMessage.includes('analyze') || lowerMessage.includes('analyse')) {
    return 'analysis';
  } else if (lowerMessage.includes('future') || lowerMessage.includes('prospect') || lowerMessage.includes('outlook')) {
    return 'future_outlook';
  } else {
    return 'general_inquiry';
  }
};

// Helper function to provide query-specific instructions
const getQuerySpecificInstructions = (queryType) => {
  switch (queryType) {
    case 'opinion':
      return `The user is asking for your opinion. Provide a balanced view based on the current market data, technical indicators, and fundamental analysis. Include both positive and negative aspects, and explain your reasoning using the provided data.`;
    
    case 'recommendation':
      return `The user wants investment recommendations. Based on the current data, technical signals, and market conditions, provide clear guidance on whether this could be a buy, hold, or avoid situation. Support your recommendation with specific data points.`;
    
    case 'financial_performance':
      return `Focus on the company's financial metrics, quarterly performance, revenue trends, profitability, and key financial ratios. Use the market data to explain recent financial performance.`;
    
    case 'performance':
      return `Explain how the company has been performing recently using the stock price data, volume trends, technical indicators, and market sentiment. Include both short-term and medium-term performance analysis.`;
    
    case 'analysis':
      return `Provide a comprehensive analysis covering technical indicators, price trends, market sentiment, support/resistance levels, and key metrics from the data provided.`;
    
    case 'future_outlook':
      return `Based on current market data, technical indicators, and performance trends, discuss the potential future outlook for this stock. Include both opportunities and risks.`;
    
    default:
      return `Address the user's specific question about this company using the real-time market data and provide relevant insights based on what they asked.`;
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
      <div className={`bg-gradient-to-b from-slate-50 to-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300 ${
        isExpanded 
          ? 'fixed inset-4 w-auto h-auto' 
          : 'w-96 h-[600px]'
      }`}>
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
          <div className="flex items-center space-x-2 relative z-10">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
            >
              {isExpanded ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
              aria-label="Close chat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in-50 duration-300`}
            >
              <div
                className={`${isExpanded ? 'max-w-[70%]' : 'max-w-[85%]'} rounded-2xl p-4 shadow-lg ${
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
              <div className={`bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4 shadow-lg ${
                isExpanded ? 'max-w-[70%]' : 'max-w-[85%]'
              }`}>
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