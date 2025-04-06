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

const InstaPage = () => {
  const location = useLocation()
  const platform = location.state?.platform
  const { currentColor, currentMode } = useStateContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://5qb2m665-5010.inc1.devtunnels.ms/${platform}`
        )
        const result = await response.json()
        setData(result)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching social media data:', error)
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
      // const neutralCount = hourPosts.filter(p => sentimentLabels[p.sentiment] === 'Neutral').length;
      const totalCount = hourPosts.length

      trendData.push({
        x: hourLabel,
        positive:
          totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0,
        negative:
          totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0,
        // neutral: totalCount > 0 ? Math.round((neutralCount / totalCount) * 100) : 0,
        totalPosts: totalCount,
      })
    }

    return trendData
  }

  if (loading || !data) {
    return (
      <div className='mt-12 flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  const lineChartData = getSentimentTrendData()

  return (
    <div className='mt-12'>
      <div className='flex items-center m-6'>
        <Link to='/' className='flex items-center mr-4'>
          <BsArrowLeft className='text-2xl' />
        </Link>
        <h1 className='text-3xl font-bold capitalize'>
          {data.platform} Analytics
        </h1>
      </div>
      <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>Recent Posts</h2>
        <div className='space-y-4'>
          {data.recent_posts.map((post, index) => {
            const postTime = new Date(post.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            console.log(post.sentiment)
            // post.sentiment = post.sentiment || 'LABEL_2' // Default to neutral if not set
            let positive_count = 0
            let negative_count = 0
            let neutral_count = 0
            post.comments?.map((comment) => {
              if (comment.sentiment === 'LABEL_0') {
                negative_count += 1
              } else if (comment.sentiment === 'LABEL_1') {
                positive_count += 1
              } else if (comment.sentiment === 'LABEL_2') {
                neutral_count += 1
              }
            })
            post.sentiment =
              positive_count > negative_count
                ? 'LABEL_1'
                : negative_count > positive_count
                ? 'LABEL_0'
                : 'LABEL_2'
            return (
              <div
                key={index}
                className='border-b border-gray-200 dark:border-gray-700 pb-4'
              >
                <div className='block mb-2 overflow-hidden'>
                  {(() => {
                    // Limit caption to 3 lines programmatically
                    const lines = post.caption.split('\n')
                    let truncatedCaption = lines.slice(0, 3).join('\n')

                    if (lines.length > 3 || post.caption.length > 500) {
                      truncatedCaption =
                        lines.length > 3
                          ? lines.slice(0, 3).join('\n') + '...'
                          : post.caption.substring(0, 300) + '...'
                    }

                    return truncatedCaption
                  })()}
                </div>
                <div className='flex justify-between text-sm'>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      sentimentLabels[post.sentiment] === 'Positive'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : sentimentLabels[post.sentiment] === 'Negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {sentimentLabels[post.sentiment]}
                  </span>
                  <div>
                    <a
                      href={post.url}
                      target='_blank'
                      className='rounded-xl p-1 px-3 bg-blue-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    >
                      Post Link
                    </a>
                  </div>
                  <span className='text-gray-500'>{postTime}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>
            Sentiment Distribution (Posts)
          </h2>
          <Doughnut
            id='posts-sentiment-chart'
            // data={['positive', 'negative', 'neutral'].map((type) => ({
            data={['positive', 'negative'].map((type) => ({
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
              // { name: 'neutral', label: 'Neutral', color: '#9E9E9E' },
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
                
                <p class="text-sm text-gray-500">Total posts: ${data.totalPosts}</p>
              </div>`
            }
          />
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>
            Sentiment Distribution (Comments)
          </h2>
          <Doughnut
            id='comments-sentiment-chart'
            // data={['positive', 'negative', 'neutral'].map((type) => ({
            data={['positive', 'negative'].map((type) => ({
              x: type.charAt(0).toUpperCase() + type.slice(1),
              y: data.stats.comments[type].percentage,
              text: `${data.stats.comments[type].percentage.toFixed(1)}%`,
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
      </div>
    </div>
  )
}

export default InstaPage
