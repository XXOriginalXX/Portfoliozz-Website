import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import Hero from '../components/Hero';

const News = () => {
  const [marketData, setMarketData] = useState({
    sensex: { value: 'Loading...', change: '', percent: '', isPositive: true },
    nifty: { value: 'Loading...', change: '', percent: '', isPositive: true },
    bankNifty: { value: 'Loading...', change: '', percent: '', isPositive: true }
  });
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch market data using multiple approaches
  const fetchMarketData = async () => {
    try {
      const symbols = [
        { symbol: '^BSESN', name: 'sensex' },
        { symbol: '^NSEI', name: 'nifty' }, 
        { symbol: '^NSEBANK', name: 'bankNifty' }
      ];

      const promises = symbols.map(async ({ symbol, name }) => {
        try {
          // Multiple API approaches with timeout
          const approaches = [
            // Approach 1: AllOrigins with timeout
            async () => {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);
              
              try {
                const proxyUrl = 'https://api.allorigins.win/get?url=';
                const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
                const response = await fetch(proxyUrl + encodeURIComponent(yahooUrl), {
                  signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                const proxyData = await response.json();
                const data = JSON.parse(proxyData.contents);
                
                if (data.chart?.result?.[0]) {
                  const result = data.chart.result[0];
                  const meta = result.meta;
                  const currentPrice = meta.regularMarketPrice || meta.previousClose;
                  const previousClose = meta.previousClose;
                  const change = currentPrice - previousClose;
                  const changePercent = (change / previousClose) * 100;
                  
                  return {
                    name,
                    value: currentPrice?.toFixed(2) || 'N/A',
                    change: change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2),
                    percent: `${change > 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
                    isPositive: change >= 0
                  };
                }
                throw new Error('No valid data found');
              } finally {
                clearTimeout(timeoutId);
              }
            },
            
            // Approach 2: ThingProxy
            async () => {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);
              
              try {
                const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
                const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
                const response = await fetch(proxyUrl + yahooUrl, {
                  signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                const data = await response.json();
                
                if (data.chart?.result?.[0]) {
                  const result = data.chart.result[0];
                  const meta = result.meta;
                  const currentPrice = meta.regularMarketPrice || meta.previousClose;
                  const previousClose = meta.previousClose;
                  const change = currentPrice - previousClose;
                  const changePercent = (change / previousClose) * 100;
                  
                  return {
                    name,
                    value: currentPrice?.toFixed(2) || 'N/A',
                    change: change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2),
                    percent: `${change > 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
                    isPositive: change >= 0
                  };
                }
                throw new Error('No valid data found');
              } finally {
                clearTimeout(timeoutId);
              }
            }
          ];

          // Try each approach
          for (const approach of approaches) {
            try {
              return await approach();
            } catch (err) {
              console.log(`Approach failed for ${name}:`, err.message);
              continue;
            }
          }
          
          throw new Error(`All approaches failed for ${name}`);
        } catch (err) {
          console.error(`Failed to fetch ${name}:`, err);
          return {
            name,
            value: 'Error',
            change: '',
            percent: '',
            isPositive: true
          };
        }
      });

      const results = await Promise.allSettled(promises);
      const newMarketData = {};
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          newMarketData[result.value.name] = result.value;
        }
      });

      if (Object.keys(newMarketData).length > 0) {
        setMarketData(newMarketData);
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setMarketData({
        sensex: { value: 'Error', change: '', percent: '', isPositive: true },
        nifty: { value: 'Error', change: '', percent: '', isPositive: true },
        bankNifty: { value: 'Error', change: '', percent: '', isPositive: true }
      });
    }
  };

  // Filter function to check if news is stock market related
  const isStockMarketRelated = (title, description) => {
    const stockMarketKeywords = [
      // Market terms
      'stock', 'share', 'equity', 'market', 'trading', 'trader', 'investor', 'investment',
      'sensex', 'nifty', 'bse', 'nse', 'index', 'indices',
      // Financial terms
      'bull', 'bear', 'rally', 'correction', 'volatility', 'volume', 'turnover',
      'ipo', 'listing', 'demat', 'broker', 'portfolio', 'dividend', 'bonus',
      // Company/sector terms
      'earnings', 'quarterly', 'results', 'profit', 'revenue', 'growth',
      'sector', 'stocks', 'shares', 'companies', 'corporate',
      // Trading terms
      'buy', 'sell', 'bid', 'ask', 'price', 'value', 'valuation',
      'analyst', 'recommendation', 'target', 'rating',
      // Market movements
      'rise', 'fall', 'gain', 'loss', 'up', 'down', 'surge', 'drop', 'climb'
    ];

    const content = (title + ' ' + description).toLowerCase();
    return stockMarketKeywords.some(keyword => content.includes(keyword));
  };

  // Fetch news using multiple RSS parsing services and methods
  const fetchNewsData = async () => {
    try {
      setError(null);
      
      // Multiple RSS feed sources with various parsing methods
      const newsSources = [
        // Method 1: Direct RSS feeds (some may work without CORS)
        {
          type: 'direct_rss',
          url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
          source: 'Economic Times Markets',
          category: 'Stock Market'
        },
        {
          type: 'direct_rss',
          url: 'https://www.moneycontrol.com/rss/marketsnews.xml',
          source: 'Moneycontrol Markets', 
          category: 'Stock Market'
        },
        
        // Method 2: RSS2JSON alternatives
        {
          type: 'rss_api',
          url: 'https://api.rss2json.com/v1/api.json?rss_url=https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms&count=15&api_key=YOUR_API_KEY',
          source: 'ET Markets (API)',
          category: 'Stock Market'
        },
        
        // Method 3: AllOrigins proxy for RSS
        {
          type: 'proxy_rss',
          rss_url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
          source: 'ET Markets (Proxy)',
          category: 'Stock Market'
        },
        {
          type: 'proxy_rss',
          rss_url: 'https://www.moneycontrol.com/rss/marketsnews.xml',
          source: 'Moneycontrol (Proxy)',
          category: 'Stock Market'
        },
        {
          type: 'proxy_rss',
          rss_url: 'https://www.business-standard.com/rss/markets-106.rss',
          source: 'Business Standard (Proxy)',
          category: 'Stock Market'
        },
        {
          type: 'proxy_rss',
          rss_url: 'https://www.livemint.com/rss/markets',
          source: 'Mint Markets (Proxy)',
          category: 'Stock Market'
        },
        
        // Method 4: Alternative RSS converters
        {
          type: 'alt_api',
          url: 'https://feed2json.org/convert?url=https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
          source: 'ET Markets (Alt)',
          category: 'Stock Market'
        }
      ];

      let allNews = [];
      let successfulFetches = 0;

      for (const source of newsSources) {
        try {
          console.log(`Fetching from ${source.source}...`);
          
          let data;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          try {
            if (source.type === 'direct_rss') {
              // Try direct RSS fetch (might work for some feeds)
              const response = await fetch(source.url, {
                signal: controller.signal,
                mode: 'cors'
              });
              
              if (response.ok) {
                const xmlText = await response.text();
                data = await parseRSSFromXML(xmlText);
              } else {
                throw new Error('Direct fetch failed');
              }
              
            } else if (source.type === 'rss_api') {
              // RSS2JSON API (without API key, limited requests)
              const url = source.url.replace('&api_key=YOUR_API_KEY', '');
              const response = await fetch(url, { signal: controller.signal });
              data = await response.json();
              
            } else if (source.type === 'proxy_rss') {
              // AllOrigins proxy approach
              const proxyUrl = 'https://api.allorigins.win/get?url=';
              const response = await fetch(proxyUrl + encodeURIComponent(source.rss_url), {
                signal: controller.signal
              });
              const proxyData = await response.json();
              
              if (proxyData.contents) {
                data = await parseRSSFromXML(proxyData.contents);
              }
              
            } else if (source.type === 'alt_api') {
              // Alternative RSS converter
              const response = await fetch(source.url, { signal: controller.signal });
              data = await response.json();
              
              // Convert feed2json format to rss2json format
              if (data.items) {
                data = {
                  status: 'ok',
                  items: data.items.map(item => ({
                    title: item.title,
                    description: item.content_html || item.content_text || item.summary,
                    pubDate: item.date_published,
                    link: item.url,
                    guid: item.id
                  }))
                };
              }
            }
            
            clearTimeout(timeoutId);
            
          } catch (fetchError) {
            clearTimeout(timeoutId);
            throw fetchError;
          }
          
          if (data && ((data.status === 'ok' && data.items) || (data.items && Array.isArray(data.items)))) {
            const sourceNews = data.items
              .filter(item => {
                if (!item.title || item.title.trim() === '') return false;
                
                const title = item.title.trim();
                const description = item.description ? cleanDescription(item.description, 300) : '';
                
                // Filter for stock market related content
                return isStockMarketRelated(title, description);
              })
              .slice(0, 10)
              .map(item => ({
                category: source.category,
                title: item.title.trim(),
                description: item.description 
                  ? cleanDescription(item.description, 200)
                  : item.title.trim(),
                time: formatTimeAgo(new Date(item.pubDate || item.date_published)),
                source: source.source,
                link: item.link || item.url || item.guid || '#',
                pubDate: new Date(item.pubDate || item.date_published || Date.now())
              }));
            
            if (sourceNews.length > 0) {
              allNews = [...allNews, ...sourceNews];
              successfulFetches++;
              console.log(`Successfully fetched ${sourceNews.length} articles from ${source.source}`);
            }
          } else {
            console.warn(`No valid data from ${source.source}:`, data);
          }
          
        } catch (sourceErr) {
          console.error(`Failed to fetch from ${source.source}:`, sourceErr.message);
        }
      }

      if (allNews.length > 0) {
        // Remove duplicates based on title similarity
        const uniqueNews = allNews.filter((item, index, self) => {
          return index === self.findIndex(t => 
            t.title.toLowerCase().trim() === item.title.toLowerCase().trim()
          );
        });

        // Sort by publication date (newest first)
        uniqueNews.sort((a, b) => b.pubDate - a.pubDate);
        
        // Take top 20 articles
        const finalNews = uniqueNews.slice(0, 20);
        
        setNewsItems(finalNews);
        console.log(`Total unique news items loaded: ${finalNews.length}`);
        
        if (successfulFetches === 0) {
          setError('Unable to fetch stock market news from any source. This may be due to network restrictions or API limitations.');
        }
      } else {
        setError('No stock market news articles could be loaded. This may be due to CORS restrictions or temporary API issues.');
      }
    } catch (err) {
      console.error('Error in fetchNewsData:', err);
      setError(`Failed to load news: ${err.message}`);
      setNewsItems([]);
    }
  };

  // Parse RSS XML to JSON format
  const parseRSSFromXML = async (xmlString) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      const items = xmlDoc.querySelectorAll('item');
      const parsedItems = [];
      
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent;
        const description = item.querySelector('description')?.textContent;
        const pubDate = item.querySelector('pubDate')?.textContent;
        const link = item.querySelector('link')?.textContent;
        const guid = item.querySelector('guid')?.textContent;
        
        if (title) {
          parsedItems.push({
            title,
            description: description || title,
            pubDate,
            link: link || guid,
            guid: guid || link
          });
        }
      });
      
      return {
        status: 'ok',
        items: parsedItems
      };
    } catch (err) {
      console.error('Error parsing RSS XML:', err);
      return { status: 'error', items: [] };
    }
  };

  // Helper function to clean HTML and truncate description
  const cleanDescription = (html, maxLength = 200) => {
    if (!html) return '';
    
    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, '');
    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    const decoded = textarea.value;
    // Truncate and add ellipsis
    return decoded.length > maxLength 
      ? decoded.substring(0, maxLength).trim() + '...' 
      : decoded.trim();
  };

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    if (!date || isNaN(date.getTime())) return 'Unknown time';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([fetchMarketData(), fetchNewsData()]);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error in fetchAllData:', err);
      setError('Failed to load data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchAllData();
  };

  // Initial data fetch and auto-refresh
  useEffect(() => {
    fetchAllData();
    
    // Refresh every 15 minutes (reduced frequency to avoid rate limits)
    const interval = setInterval(fetchAllData, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Hero
        title="Market News & Updates"
        subtitle="Stay informed with real-time market data and the latest financial news from trusted sources"
        image="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Last Updated Display with Refresh Button */}
          <div className="text-center mb-8" data-aos="fade-up">
            <div className="inline-flex items-center bg-gray-100 rounded-full px-6 py-3 text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span className="text-sm mr-4">
                {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
              </span>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8" data-aos="fade-up">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-red-800 font-semibold">Unable to Load News</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <p className="text-red-600 mt-2 text-sm">
                    This is likely due to CORS restrictions in the browser. Try refreshing the page or check back later.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="mt-3 text-red-600 hover:text-red-800 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Market Overview */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-serif font-bold mb-8 flex items-center">
              <TrendingUp className="h-8 w-8 mr-3 text-blue-600" />
              Live Market Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="100">
                <p className="text-sm text-gray-600 mb-2">SENSEX (^BSESN)</p>
                <p className={`text-3xl font-bold mb-2 ${
                  marketData.sensex?.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {marketData.sensex?.value}
                </p>
                {marketData.sensex?.change && !['Loading...', 'Error'].includes(marketData.sensex?.value) && (
                  <p className={`text-sm ${
                    marketData.sensex?.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketData.sensex.change} ({marketData.sensex.percent})
                  </p>
                )}
              </div>
              <div className="p-6 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="200">
                <p className="text-sm text-gray-600 mb-2">NIFTY 50 (^NSEI)</p>
                <p className={`text-3xl font-bold mb-2 ${
                  marketData.nifty?.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {marketData.nifty?.value}
                </p>
                {marketData.nifty?.change && !['Loading...', 'Error'].includes(marketData.nifty?.value) && (
                  <p className={`text-sm ${
                    marketData.nifty?.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketData.nifty.change} ({marketData.nifty.percent})
                  </p>
                )}
              </div>
              <div className="p-6 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="300">
                <p className="text-sm text-gray-600 mb-2">BANK NIFTY (^NSEBANK)</p>
                <p className={`text-3xl font-bold mb-2 ${
                  marketData.bankNifty?.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {marketData.bankNifty?.value}
                </p>
                {marketData.bankNifty?.change && !['Loading...', 'Error'].includes(marketData.bankNifty?.value) && (
                  <p className={`text-sm ${
                    marketData.bankNifty?.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketData.bankNifty.change} ({marketData.bankNifty.percent})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Latest News */}
          <div className="space-y-8" data-aos="fade-up">
            <h2 className="text-3xl font-serif font-bold text-center">Latest Stock Market News</h2>
            
            {loading && newsItems.length === 0 ? (
              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-8" data-aos="fade-up" data-aos-delay={i * 100}>
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : newsItems.length > 0 ? (
              newsItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay={index * 50}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                        {item.category}
                      </span>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">{item.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{item.time}</span>
                        <span className="mx-3">•</span>
                        <span>Source: {item.source}</span>
                      </div>
                    </div>
                    {item.link && item.link !== '#' && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 ml-6 px-4 py-2 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <span className="mr-2">Read more</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : !loading && !error ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center" data-aos="fade-up">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">
                  No stock market news articles are currently available.
                </p>
                <button
                  onClick={handleRefresh}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Try refreshing the page
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;