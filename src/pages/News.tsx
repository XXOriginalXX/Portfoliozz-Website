import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, Clock, ArrowUpRight, AlertCircle } from 'lucide-react';

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

  // Multiple CORS proxy options
  const PROXY_URLS = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ];

  // Try multiple proxy URLs to find one that works
  const tryProxyFetch = async (url) => {
    for (const proxy of PROXY_URLS) {
      try {
        const proxyUrl = proxy + encodeURIComponent(url);
        const response = await fetch(proxyUrl);
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.log(`Proxy ${proxy} failed for ${url}`);
        continue;
      }
    }
    throw new Error('All proxies failed');
  };

  // Fetch market data using Yahoo Finance API
  const fetchMarketData = async () => {
    try {
      const symbols = [
        { symbol: '^BSESN', name: 'sensex' },
        { symbol: '^NSEI', name: 'nifty' },
        { symbol: '^NSEBANK', name: 'bankNifty' }
      ];

      const promises = symbols.map(async ({ symbol, name }) => {
        try {
          // Try Yahoo Finance chart API first
          const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
          let data = await tryProxyFetch(yahooUrl);
          
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
          
          // If chart API fails, try quote API
          const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
          data = await tryProxyFetch(quoteUrl);
          
          const quote = data.quoteResponse?.result?.[0];
          if (quote) {
            const currentPrice = quote.regularMarketPrice;
            const previousClose = quote.regularMarketPreviousClose;
            const change = quote.regularMarketChange;
            const changePercent = quote.regularMarketChangePercent;
            
            return {
              name,
              value: currentPrice?.toFixed(2) || 'N/A',
              change: change > 0 ? `+${change.toFixed(2)}` : change?.toFixed(2) || '0.00',
              percent: `${changePercent > 0 ? '+' : ''}${changePercent?.toFixed(2) || '0.00'}%`,
              isPositive: change >= 0
            };
          }
          
          throw new Error('No valid data found');
        } catch (err) {
          console.error(`Error fetching ${name}:`, err);
          
          // Try alternative data source (using a free API)
          try {
            const freeApiUrl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=demo`;
            const altData = await tryProxyFetch(freeApiUrl);
            
            if (altData && altData.price) {
              return {
                name,
                value: parseFloat(altData.price).toFixed(2),
                change: altData.change ? `${altData.change > 0 ? '+' : ''}${parseFloat(altData.change).toFixed(2)}` : '',
                percent: altData.percent_change ? `${altData.percent_change > 0 ? '+' : ''}${parseFloat(altData.percent_change).toFixed(2)}%` : '',
                isPositive: altData.change >= 0
              };
            }
          } catch (altErr) {
            console.error(`Alternative API failed for ${name}:`, altErr);
          }
          
          throw err;
        }
      });

      const results = await Promise.allSettled(promises);
      
      const newMarketData = {};
      let successCount = 0;
      
      results.forEach((result, index) => {
        const symbolInfo = symbols[index];
        if (result.status === 'fulfilled' && result.value) {
          newMarketData[result.value.name] = result.value;
          successCount++;
        } else {
          newMarketData[symbolInfo.name] = {
            value: 'Updating...',
            change: '',
            percent: '',
            isPositive: true
          };
        }
      });

      setMarketData(newMarketData);
      
      if (successCount === 0) {
        throw new Error('All market data requests failed');
      } else if (successCount < symbols.length) {
        setError('Some market data temporarily unavailable. Retrying...');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Market data services are temporarily unavailable. Using cached data...');
      
      // Try one more alternative approach
      try {
        await fetchMarketDataAlternative();
      } catch (altErr) {
        setMarketData({
          sensex: { value: 'Service Unavailable', change: '', percent: '', isPositive: true },
          nifty: { value: 'Service Unavailable', change: '', percent: '', isPositive: true },
          bankNifty: { value: 'Service Unavailable', change: '', percent: '', isPositive: true }
        });
      }
    }
  };

  // Alternative market data fetching method
  const fetchMarketDataAlternative = async () => {
    try {
      // Try using a different financial data API
      const alphaVantageKey = 'demo'; // Replace with actual key for production
      const symbols = ['BSE', 'NSE'];
      
      for (const symbol of symbols) {
        try {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaVantageKey}`;
          const response = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Alpha Vantage data:', data);
            // Process the data if successful
          }
        } catch (err) {
          console.log('Alpha Vantage failed for', symbol);
        }
      }
    } catch (err) {
      console.error('Alternative market data fetch failed:', err);
      throw err;
    }
  };

  // Fetch news data from RSS feeds
  const fetchNewsData = async () => {
    try {
      let newsData = [];

      // RSS to JSON converter services (multiple options)
      const rssFeeds = [
        {
          url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
          source: 'Economic Times'
        },
        {
          url: 'https://www.moneycontrol.com/rss/marketsnews.xml',
          source: 'Moneycontrol'
        },
        {
          url: 'https://www.business-standard.com/rss/markets-106.rss',
          source: 'Business Standard'
        },
        {
          url: 'https://feeds.feedburner.com/NDTV-LatestNews',
          source: 'NDTV Business'
        },
        {
          url: 'https://www.livemint.com/rss/markets',
          source: 'LiveMint'
        }
      ];

      for (const feed of rssFeeds) {
        try {
          // Try multiple RSS to JSON services
          const rssServices = [
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=8`,
            `https://rss2json.com/api.json?rss_url=${encodeURIComponent(feed.url)}&count=8`,
            `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed.url) + '&count=8')}`
          ];
          
          for (const serviceUrl of rssServices) {
            try {
              const data = await tryProxyFetch(serviceUrl);
              
              // Handle different response formats
              let parsedData = data;
              if (data.contents) {
                parsedData = JSON.parse(data.contents);
              }
              
              if (parsedData.status === 'ok' && parsedData.items && parsedData.items.length > 0) {
                const feedNews = parsedData.items.slice(0, 6).map(item => ({
                  category: 'Market News',
                  title: item.title || 'No title available',
                  description: item.description 
                    ? item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                    : item.title || 'No description available',
                  time: formatTimeAgo(new Date(item.pubDate)),
                  source: feed.source,
                  link: item.link || '#'
                }));
                
                newsData = [...newsData, ...feedNews];
                break; // Break inner loop on success
              }
            } catch (serviceErr) {
              console.log(`RSS service failed for ${feed.source}:`, serviceErr);
              continue;
            }
          }
          
          if (newsData.length >= 20) break; // Stop once we have enough news
        } catch (feedErr) {
          console.log(`RSS feed ${feed.source} failed:`, feedErr);
          continue;
        }
      }

      // If RSS feeds fail, try generating sample financial news structure
      if (newsData.length === 0) {
        try {
          // Try a simple financial news API
          const newsApiOptions = [
            `https://finnhub.io/api/v1/news?category=general&token=demo`,
            `https://newsapi.org/v2/everything?q=stock+market+india&language=en&sortBy=publishedAt&pageSize=15&apiKey=demo`
          ];
          
          for (const apiUrl of newsApiOptions) {
            try {
              const data = await tryProxyFetch(apiUrl);
              
              if (data.articles && data.articles.length > 0) {
                newsData = data.articles.slice(0, 15).map(article => ({
                  category: 'Financial News',
                  title: article.title,
                  description: (article.description || article.title || '').substring(0, 150) + '...',
                  time: formatTimeAgo(new Date(article.publishedAt || article.datetime)),
                  source: article.source?.name || 'Financial News',
                  link: article.url || article.link || '#'
                }));
                break;
              } else if (data.length > 0) { // Finnhub format
                newsData = data.slice(0, 15).map(article => ({
                  category: 'Market Update',
                  title: article.headline,
                  description: (article.summary || article.headline || '').substring(0, 150) + '...',
                  time: formatTimeAgo(new Date(article.datetime * 1000)),
                  source: article.source || 'Financial News',
                  link: article.url || '#'
                }));
                break;
              }
            } catch (apiErr) {
              console.log('News API failed:', apiErr);
              continue;
            }
          }
        } catch (newsErr) {
          console.log('All news APIs failed:', newsErr);
        }
      }

      if (newsData.length === 0) {
        throw new Error('No news sources available');
      }

      // Remove duplicates and limit to 15 items
      const uniqueNews = newsData.filter((item, index, self) => 
        index === self.findIndex(t => t.title === item.title)
      ).slice(0, 15);

      setNewsItems(uniqueNews);
      return uniqueNews;
    } catch (err) {
      console.error('Error fetching news:', err);
      
      // Set some placeholder message instead of empty array
      setNewsItems([]);
      throw err;
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Fetch all data with better error handling
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch market data and news concurrently, but don't fail if one fails
      const marketPromise = fetchMarketData().catch(err => {
        console.error('Market data failed:', err);
        return null;
      });
      
      const newsPromise = fetchNewsData().catch(err => {
        console.error('News data failed:', err);
        return null;
      });

      const [marketResult, newsResult] = await Promise.allSettled([marketPromise, newsPromise]);

      // Set error only if both failed
      if (marketResult.status === 'rejected' && newsResult.status === 'rejected') {
        setError('Failed to fetch data from all sources. Please check your internet connection and try again.');
      } else if (marketResult.status === 'rejected') {
        setError('Market data temporarily unavailable. News data loaded successfully.');
      } else if (newsResult.status === 'rejected') {
        setError('News data temporarily unavailable. Market data loaded successfully.');
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error in fetchAllData:', err);
      setError('An unexpected error occurred. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and auto-refresh every 4 seconds
  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 4 seconds
    const interval = setInterval(fetchAllData, 4 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Newspaper className="h-8 w-8 mr-3 text-blue-600" />
            Live Indian Stock Market News
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time data and live news from trusted financial sources.
          </p>
          
          {/* Last Updated */}
          {lastUpdated && (
            <div className="flex items-center justify-center mt-4">
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700">{error}</span>
          </div>
        )}

        {/* Market Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
            Live Market Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">SENSEX (^BSESN)</p>
              <p className={`text-2xl font-bold ${
                marketData.sensex?.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.sensex?.value}
              </p>
              {marketData.sensex?.change && !['Error', 'Unavailable', 'Loading...', 'Updating...'].includes(marketData.sensex?.value) && (
                <p className={`text-sm ${
                  marketData.sensex?.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {marketData.sensex.change} ({marketData.sensex.percent})
                </p>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">NIFTY 50 (^NSEI)</p>
              <p className={`text-2xl font-bold ${
                marketData.nifty?.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.nifty?.value}
              </p>
              {marketData.nifty?.change && !['Error', 'Unavailable', 'Loading...', 'Updating...'].includes(marketData.nifty?.value) && (
                <p className={`text-sm ${
                  marketData.nifty?.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {marketData.nifty.change} ({marketData.nifty.percent})
                </p>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">BANK NIFTY (^NSEBANK)</p>
              <p className={`text-2xl font-bold ${
                marketData.bankNifty?.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.bankNifty?.value}
              </p>
              {marketData.bankNifty?.change && !['Error', 'Unavailable', 'Loading...', 'Updating...'].includes(marketData.bankNifty?.value) && (
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
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Latest Financial News</h2>
          
          {loading && newsItems.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6">
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
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{item.time}</span>
                      <span className="mx-2">•</span>
                      <span>Source: {item.source}</span>
                    </div>
                  </div>
                  {item.link && item.link !== '#' && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 ml-4"
                    >
                      <span className="mr-1">Read more</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-500">
                Financial data services are currently experiencing connectivity issues. This is common with free APIs and proxy services.
                <br />
                <strong>Alternative options:</strong>
                <br />
                • Visit directly: <a href="https://finance.yahoo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Yahoo Finance</a> | <a href="https://www.moneycontrol.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Moneycontrol</a> | <a href="https://economictimes.indiatimes.com/markets" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Economic Times Markets</a>
              </p>
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default News;