import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Doughnut, LineChart } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { useLocation } from 'react-router-dom';
const sentimentLabels = {
  LABEL_0: 'Negative',
  LABEL_1: 'Positive',
  LABEL_2: 'Neutral'
};

const SocialMediaPage = () => {
  const location = useLocation();
  const platform = location.state?.platform;
  const { currentColor, currentMode } = useStateContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://5qb2m665-5010.inc1.devtunnels.ms/${platform}`);
        const result = await response.json();
        // const result = {
        //   "platform": "Twitter",
        //   "recent_tweets": [
        //     {
        //       "sentiment": "LABEL_0",
        //       "text": "@Shebas_10dulkar Also most man of match Top 3 ipl teams csk,mi,kkr ?\nKl rahul Right??",
        //       "timestamp": "Sat, 05 Apr 2025 14:24:26 GMT",
        //       "uri": "https://x.com/supr20456/status/1908526124264501460"
        //     },
        //     {
        //       "sentiment": "LABEL_0",
        //       "text": "Match 18. 5.2: Glenn Maxwell to Sanju Samson 4 runs, Rajasthan Royals 51/0 https://t.co/kjdEJyebLM #PBKSvRR #TATAIPL #IPL2025",
        //       "timestamp": "Sat, 05 Apr 2025 14:24:26 GMT",
        //       "uri": "https://x.com/IPL/status/1908526114286559736"
        //     },
        //     {
        //       "sentiment": "LABEL_1",
        //       "text": "@_FaridKhan its 3-0.....Pakistan Vs New Zealand... Think about that.. .\n\nDon't need porkistani in IPL",
        //       "timestamp": "Sat, 05 Apr 2025 14:24:25 GMT",
        //       "uri": "https://x.com/Chiragsoni8943/status/1908526108883993033"
        //     },
        //     {
        //       "sentiment": "LABEL_0",
        //       "text": "CSK batting order changes: Good move? \ud83d\udc4d or \ud83e\udd14? #CSK #IPL #CSKvDC",
        //       "timestamp": "Sat, 05 Apr 2025 14:24:25 GMT",
        //       "uri": "https://x.com/ArvindKuma24798/status/1908526085647610121"
        //     },
        //     {
        //       "sentiment": "LABEL_0",
        //       "text": "@Being_Dhruv_ I think franchise doesn't want to let him go either. It works both ways. Individual worshipping is not new in IPL .... like RCB/Kohli.. CSK/Dhoni.. Rohit/MI... as long as the team is winning. But if team suffers.. retrospect and take action too.",
        //       "timestamp": "Sat, 05 Apr 2025 14:24:25 GMT",
        //       "uri": "https://x.com/Sophrosyne4U/status/1908526068006367245"
        //     }
        //   ],
        //   "stats": {
        //     "comments": {
        //       "negative": {
        //         "count": 23,
        //         "percentage": 100.0
        //       },
        //       "neutral": {
        //         "count": 0,
        //         "percentage": 0.0
        //       },
        //       "positive": {
        //         "count": 0,
        //         "percentage": 0.0
        //       },
        //       "total": 23
        //     },
        //     "tweets": {
        //       "negative": {
        //         "count": 63,
        //         "percentage": 38.41
        //       },
        //       "neutral": {
        //         "count": 0,
        //         "percentage": 0.0
        //       },
        //       "positive": {
        //         "count": 101,
        //         "percentage": 61.59
        //       },
        //       "total": 164
        //     }
        //   }
        // };
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching social media data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [platform]);

  const getSentimentTrendData = () => {
    if (!data?.recent_tweets) return [];
    
    const now = new Date();
    const trendData = [];
    
    // Create 5 time slots (last 5 hours)
    for (let i = 4; i >= 0; i--) {
      const hourStart = new Date(now);
      hourStart.setHours(now.getHours() - i - 1, 0, 0, 0);
      
      const hourEnd = new Date(now);
      hourEnd.setHours(now.getHours() - i, 0, 0, 0);
      
      const hourLabel = hourEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Filter tweets for this hour
      const hourTweets = data.recent_tweets.filter(tweet => {
        const tweetDate = new Date(tweet.timestamp);
        return tweetDate >= hourStart && tweetDate < hourEnd;
      });
      
      // Count sentiments for this hour
      const positiveCount = hourTweets.filter(t => sentimentLabels[t.sentiment] === 'Positive').length;
      const negativeCount = hourTweets.filter(t => sentimentLabels[t.sentiment] === 'Negative').length;
      const neutralCount = hourTweets.filter(t => sentimentLabels[t.sentiment] === 'Neutral').length;
      const totalCount = hourTweets.length;
      
      trendData.push({
        x: hourLabel,
        positive: totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0,
        negative: totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0,
        neutral: totalCount > 0 ? Math.round((neutralCount / totalCount) * 100) : 0,
        totalPosts: totalCount
      });
    }
    
    return trendData;
  };

  if (loading || !data) {
    return (
      <div className="mt-12 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const lineChartData = getSentimentTrendData();

  return (
    <div className="mt-12">
      <div className="flex items-center m-6">
        <Link to="/" className="flex items-center mr-4">
          <BsArrowLeft className="text-2xl" />
        </Link>
        <h1 className="text-3xl font-bold capitalize">{data.platform} Analytics</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
          <Doughnut
            id="sentiment-chart"
            data={['positive', 'negative', 'neutral'].map(type => ({
              x: type.charAt(0).toUpperCase() + type.slice(1),
              y: data.stats.tweets[type].percentage,
              text: `${data.stats.tweets[type].percentage.toFixed(1)}%`,
              fill: type === 'positive' ? '#4CAF50' : 
                    type === 'negative' ? '#F44336' : '#9E9E9E'
            }))}
            legendVisiblity={true}
            height="100%"
          />
        </div>

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sentiment Trend (Last 5 Hours)</h2>
          <LineChart
            width="100%"
            height="100%"
            currentMode={currentMode}
            data={lineChartData}
            xAxisField="x"
            lineFields={[
              { name: 'positive', label: 'Positive', color: '#4CAF50' },
              { name: 'negative', label: 'Negative', color: '#F44336' },
              { name: 'neutral', label: 'Neutral', color: '#9E9E9E' }
            ]}
            xAxisLabel="Time"
            yAxisLabel="Sentiment Percentage (%)"
            yAxisMin={0}
            yAxisMax={100}
            tooltipTemplate={(data) => (
              `<div class="p-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <p class="font-semibold">${data.x}</p>
                <p>Positive: ${data.positive}%</p>
                <p>Negative: ${data.negative}%</p>
                <p>Neutral: ${data.neutral}%</p>
                <p class="text-sm text-gray-500">Total posts: ${data.totalPosts}</p>
              </div>`
            )}
          />
        </div>
      </div>

      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {data.recent_tweets.map((tweet, index) => {
            const postTime = new Date(tweet.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            return (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <a 
                  href={tweet.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block mb-2 hover:underline"
                >
                  {tweet.text}
                </a>
                <div className="flex justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    sentimentLabels[tweet.sentiment] === 'Positive' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : sentimentLabels[tweet.sentiment] === 'Negative' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {sentimentLabels[tweet.sentiment]}
                  </span>
                  <span className="text-gray-500">{postTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPage;