import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Doughnut, LineChart } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import { useLocation } from 'react-router-dom'

const sentimentLabels = {
  LABEL_0: 'Negative',
  LABEL_1: 'Positive',
  LABEL_2: 'Neutral',
}

const ForumAnalyticsPage = () => {
  const location = useLocation()
  const platform = location.state?.platform || 'forum'
  const { currentColor, currentMode } = useStateContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(
        //   `https://5qb2m665-5010.inc1.devtunnels.ms/${platform}`
        // )
        // const result = await response.json()
        const result = {
            "platform": "forum",
            "stats": {
              "posts": {
                "positive": {
                  "count": 42,
                  "percentage": 58.3
                },
                "negative": {
                  "count": 15,
                  "percentage": 20.8
                },
                "neutral": {
                  "count": 15,
                  "percentage": 20.9
                }
              },
              "replies": {
                "positive": {
                  "count": 128,
                  "percentage": 62.7
                },
                "negative": {
                  "count": 45,
                  "percentage": 22.1
                },
                "neutral": {
                  "count": 31,
                  "percentage": 15.2
                }
              }
            },
            "top_topics": [
              {
                "name": "Product Launch Feedback",
                "count": 28,
                "sentiment": "LABEL_1"
              },
              {
                "name": "Customer Support Issues",
                "count": 19,
                "sentiment": "LABEL_0"
              },
              {
                "name": "Feature Requests",
                "count": 15,
                "sentiment": "LABEL_1"
              },
              {
                "name": "Technical Problems",
                "count": 12,
                "sentiment": "LABEL_0"
              },
              {
                "name": "General Discussion",
                "count": 8,
                "sentiment": "LABEL_2"
              }
            ],
            "recent_posts": [
              {
                "title": "New update is causing performance issues",
                "content": "Since the latest update, my app has been freezing frequently. Anyone else experiencing this?",
                "author": "user123",
                "timestamp": "2023-06-15T14:32:00Z",
                "sentiment": "LABEL_0",
                "replies": [
                  {
                    "author": "support_team",
                    "content": "We're looking into this issue. Could you share your device specs?",
                    "timestamp": "2023-06-15T15:45:00Z",
                    "sentiment": "LABEL_2"
                  },
                  {
                    "author": "user456",
                    "content": "Same here! It's been terrible since the update.",
                    "timestamp": "2023-06-15T16:12:00Z",
                    "sentiment": "LABEL_0"
                  }
                ]
              },
              {
                "title": "Loving the new dark mode feature!",
                "content": "The new dark mode is exactly what I needed for night-time browsing. Great job team!",
                "author": "happy_user",
                "timestamp": "2023-06-15T12:18:00Z",
                "sentiment": "LABEL_1",
                "replies": [
                  {
                    "author": "design_team",
                    "content": "Thanks for the feedback! We spent a lot of time on this feature.",
                    "timestamp": "2023-06-15T13:05:00Z",
                    "sentiment": "LABEL_1"
                  },
                  {
                    "author": "user789",
                    "content": "Agreed, it's much easier on the eyes now.",
                    "timestamp": "2023-06-15T14:30:00Z",
                    "sentiment": "LABEL_1"
                  }
                ]
              },
              {
                "title": "Question about account settings",
                "content": "How do I change my notification preferences? I can't find the option anymore.",
                "author": "confused_user",
                "timestamp": "2023-06-15T10:45:00Z",
                "sentiment": "LABEL_2",
                "replies": [
                  {
                    "author": "helper_user",
                    "content": "It's under Settings > Account > Notifications now.",
                    "timestamp": "2023-06-15T11:20:00Z",
                    "sentiment": "LABEL_1"
                  }
                ]
              },
              {
                "title": "Bug report: Login failing on iOS",
                "content": "Getting error 500 when trying to login from my iPhone. Works fine on Android.",
                "author": "ios_user",
                "timestamp": "2023-06-15T09:15:00Z",
                "sentiment": "LABEL_0",
                "replies": []
              },
              {
                "title": "Feature suggestion: Dark mode scheduling",
                "content": "It would be great if the app could automatically switch to dark mode at sunset.",
                "author": "feature_requester",
                "timestamp": "2023-06-15T08:30:00Z",
                "sentiment": "LABEL_1",
                "replies": [
                  {
                    "author": "dev_team",
                    "content": "Interesting idea! We'll add it to our roadmap.",
                    "timestamp": "2023-06-15T09:45:00Z",
                    "sentiment": "LABEL_1"
                  },
                  {
                    "author": "user101",
                    "content": "I'd love this feature too!",
                    "timestamp": "2023-06-15T10:15:00Z",
                    "sentiment": "LABEL_1"
                  },
                  {
                    "author": "user202",
                    "content": "Or even better - sync with system dark mode settings.",
                    "timestamp": "2023-06-15T11:30:00Z",
                    "sentiment": "LABEL_1"
                  }
                ]
              }
            ]
          }
        setData(result)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching forum data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [platform])

  const getSentimentTrendData = () => {
    if (!data?.recent_posts) return []

    const now = new Date()
    const trendData = []

    // Create 5 time slots (last 5 hours)
    for (let i = 4; i >= 0; i--) {
      const hourStart = new Date(now)
      hourStart.setHours(now.getHours() - i - 1, 0, 0, 0)

      const hourEnd = new Date(now)
      hourEnd.setHours(now.getHours() - i, 0, 0, 0)

      const hourLabel = hourEnd.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })

      // Filter posts for this hour
      const hourPosts = data.recent_posts.filter((post) => {
        const postDate = new Date(post.timestamp)
        return postDate >= hourStart && postDate < hourEnd
      })

      // Count sentiments for this hour
      const positiveCount = hourPosts.filter(
        (p) => sentimentLabels[p.sentiment] === 'Positive'
      ).length
      const negativeCount = hourPosts.filter(
        (p) => sentimentLabels[p.sentiment] === 'Negative'
      ).length
      const neutralCount = hourPosts.filter(
        (p) => sentimentLabels[p.sentiment] === 'Neutral'
      ).length
      const totalCount = hourPosts.length

      trendData.push({
        x: hourLabel,
        positive:
          totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0,
        negative:
          totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0,
        neutral: totalCount > 0 ? Math.round((neutralCount / totalCount) * 100) : 0,
        totalPosts: totalCount,
      })
    }

    return trendData
  }

  const getTopTopics = () => {
    if (!data?.top_topics) return []
    return data.top_topics.map(topic => ({
      name: topic.name,
      count: topic.count,
      sentiment: sentimentLabels[topic.sentiment] || 'Neutral'
    }))
  }

  if (loading || !data) {
    return (
      <div className='mt-12 flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  const lineChartData = getSentimentTrendData()
  const topTopics = getTopTopics()

  return (
    <div className='mt-12'>
    <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>Recent Discussions</h2>
        <div className='space-y-4'>
          {data.recent_posts.map((post, index) => {
            const postTime = new Date(post.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            
            return (
              <div
                key={index}
                className='border-b border-gray-200 dark:border-gray-700 pb-4'
              >
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='font-medium'>{post.title}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      sentimentLabels[post.sentiment] === 'Positive'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : sentimentLabels[post.sentiment] === 'Negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {sentimentLabels[post.sentiment]}
                  </span>
                </div>
                <div className='block mb-2 text-sm'>{post.content}</div>
                <div className='flex justify-between text-xs'>
                  <span className='text-gray-500'>By: {post.author}</span>
                  <span className='text-gray-500'>{postTime}</span>
                </div>
                {post.replies && post.replies.length > 0 && (
                  <div className='mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600'>
                    <h4 className='text-sm font-medium mb-1'>Replies ({post.replies.length})</h4>
                    {post.replies.slice(0, 2).map((reply, idx) => (
                      <div key={idx} className='mb-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='font-medium'>{reply.author}</span>
                          <span
                            className={`px-1 rounded text-xs ${
                              sentimentLabels[reply.sentiment] === 'Positive'
                                ? 'text-green-600 dark:text-green-400'
                                : sentimentLabels[reply.sentiment] === 'Negative'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-500'
                            }`}
                          >
                            {sentimentLabels[reply.sentiment]}
                          </span>
                        </div>
                        <p className='text-gray-600 dark:text-gray-400'>{reply.content}</p>
                      </div>
                    ))}
                    {post.replies.length > 2 && (
                      <p className='text-xs text-gray-500'>+{post.replies.length - 2} more replies</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className='flex items-center m-6'>
        <Link to='/' className='flex items-center mr-4'>
          <BsArrowLeft className='text-2xl' />
        </Link>
        <h1 className='text-3xl font-bold capitalize'>
          {data.platform || 'Forum'} Analytics
        </h1>
      </div>

      <div className='grid md:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>
            Sentiment Distribution (Posts)
          </h2>
          <Doughnut
            id='posts-sentiment-chart'
            data={['positive', 'negative', 'neutral'].map((type) => ({
              x: type.charAt(0).toUpperCase() + type.slice(1),
              y: data.stats.posts[type].percentage,
              text: `${data.stats.posts[type].percentage.toFixed(1)}%`,
              fill:
                type === 'positive'
                  ? '#4CAF50'
                  : type === 'negative'
                  ? '#F44336'
                  : '#9E9E9E',
            }))}
            legendVisiblity={true}
            height='100%'
          />
        </div>

        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>
            Sentiment Trend (Last 5 Hours)
          </h2>
          <LineChart
            width='100%'
            height='100%'
            currentMode={currentMode}
            data={lineChartData}
            xAxisField='x'
            lineFields={[
              { name: 'positive', label: 'Positive', color: '#4CAF50' },
              { name: 'negative', label: 'Negative', color: '#F44336' },
              { name: 'neutral', label: 'Neutral', color: '#9E9E9E' },
            ]}
            xAxisLabel='Time'
            yAxisLabel='Sentiment Percentage (%)'
            yAxisMin={0}
            yAxisMax={100}
            tooltipTemplate={(data) =>
              `<div class="p-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <p class="font-semibold">${data.x}</p>
                <p>Positive: ${data.positive}%</p>
                <p>Negative: ${data.negative}%</p>
                <p>Neutral: ${data.neutral}%</p>
                <p class="text-sm text-gray-500">Total posts: ${data.totalPosts}</p>
              </div>`
            }
          />
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>
            Sentiment Distribution (Replies)
          </h2>
          <Doughnut
            id='replies-sentiment-chart'
            data={['positive', 'negative', 'neutral'].map((type) => ({
              x: type.charAt(0).toUpperCase() + type.slice(1),
              y: data.stats.replies[type].percentage,
              text: `${data.stats.replies[type].percentage.toFixed(1)}%`,
              fill:
                type === 'positive'
                  ? '#4CAF50'
                  : type === 'negative'
                  ? '#F44336'
                  : '#9E9E9E',
            }))}
            legendVisiblity={true}
            height='100%'
          />
        </div>

        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>Top Discussion Topics</h2>
          <div className='space-y-3'>
            {topTopics.map((topic, index) => (
              <div key={index} className='flex justify-between items-center'>
                <span className='font-medium'>{topic.name}</span>
                <div className='flex items-center'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs mr-2 ${
                      topic.sentiment === 'Positive'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : topic.sentiment === 'Negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {topic.sentiment}
                  </span>
                  <span className='text-gray-500 text-sm'>{topic.count} posts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default ForumAnalyticsPage