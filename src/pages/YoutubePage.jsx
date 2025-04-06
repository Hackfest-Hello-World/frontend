import React, { useState, useEffect } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Doughnut } from '../components'

const YouTubeSentimentPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        // const result = [
        //   {
        //     video_url: 'https://www.youtube.com/watch?v=evu2AqtTBo8',
        //     video_id: '',
        //     sentiment_distribution: { positive: 65, negative: 20, neutral: 15 },
        //     views: 120000,
        //     likes: 4500,
        //     comments_count: 600,
        //     top_positive_comments: [
        //       'Amazing visuals and sound!',
        //       'Loved the storyline and acting.',
        //       'Very informative and engaging.',
        //       'High production value!',
        //       'Will definitely watch again.',
        //     ],
        //     top_negative_comments: [
        //       'Audio quality was poor.',
        //       'Too many ads in the middle.',
        //       'Not what I expected.',
        //       'Pacing felt a bit slow.',
        //       'Could use better editing.',
        //     ],
        //   },
        //   {
        //     video_url: 'hhttps://www.youtube.com/watch?v=X1M6ak4-alM',
        //     video_id: '',
        //     sentiment_distribution: { positive: 40, negative: 40, neutral: 20 },
        //     views: 89000,
        //     likes: 3200,
        //     comments_count: 480,
        //     top_positive_comments: [
        //       'Great explanation, helped me a lot!',
        //       'The host is very knowledgeable.',
        //       'Clean and simple presentation.',
        //       'Good use of examples.',
        //       'I learned something new!',
        //     ],
        //     top_negative_comments: [
        //       'Sound was too low.',
        //       'Didn’t go into enough detail.',
        //       'A bit repetitive.',
        //       'Graphics were distracting.',
        //       'Not suitable for beginners.',
        //     ],
        //   },
        // ]
        const response = await fetch(
          'https://5qb2m665-5010.inc1.devtunnels.ms/youtube/videos'
        )
        const result = await response.json()
        console.log('YouTube sentiment data:', result)
        setData(result)
      } catch (error) {
        console.error('Error fetching YouTube sentiment data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchYouTubeData()
  }, [])

  if (loading) {
    return (
      <div className='mt-12 flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='mt-12'>
      <div className='flex items-center m-6'>
        <Link to='/' className='flex items-center mr-4'>
          <BsArrowLeft className='text-2xl' />
        </Link>
        <h1 className='text-3xl font-bold'>YouTube Sentiment Analytics</h1>
      </div>

      {data.map((video, idx) => (
        <div
          key={idx}
          // Add min width
          className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg min-h-[400px]'
        >
          <div className='flex flex-col md:flex-row gap-6 mb-6'>
            {/* Left: Video Player */}
            <div className='md:w-1/2 w-full aspect-w-1 aspect-h-1 min-h-[400px]'>
              <iframe
                className='w-full h-full rounded-xl'
                src={`https://www.youtube.com/embed/${video.id}`}
                title={`YouTube video player ${idx}`}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>

            {/* Right: Doughnut Chart + Stats */}
            <div className='md:w-1/2 w-full flex flex-col justify-center'>
              {video.comments.length > 0 && (
                <Doughnut
                  id={`video-${idx}`}
                  data={['positive', 'negative', 'neutral'].map((type) => ({
                    x: type.charAt(0).toUpperCase() + type.slice(1),
                    y: video.sentiment_distribution[type],
                    text: `${video.sentiment_distribution[type]}`,
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
              )}

              {/* <div className='mt-4 text-sm'>
                <p>
                  <strong>Views:</strong> {video.views.toLocaleString()}
                </p>
                <p>
                  <strong>Likes:</strong> {video.likes.toLocaleString()}
                </p>
                <p>
                  <strong>Comments:</strong> {video.comments.length}
                </p>
              </div> */}
            </div>
          </div>

          {/* Bottom: Sentiment Summaries */}
          <div className='flex flex-col md:flex-row gap-4'>
            {video.comments.length > 0 ? (
              <>
                <div className='w-full md:w-1/2 max-h-52 overflow-y-auto pr-2'>
                  <h3 className='text-md font-semibold mb-2 text-green-600'>
                    Top Positive
                  </h3>
                  <ul className='list-disc pl-4 text-sm'>
                    {video.top_positive_comments.map((comment, i) => (
                      <li key={i} className='mb-1'>
                        "{comment.text}"
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='w-full md:w-1/2 max-h-52 overflow-y-auto pr-2'>
                  <h3 className='text-md font-semibold mb-2 text-red-600'>
                    Top Negative
                  </h3>
                  <ul className='list-disc pl-4 text-sm'>
                    {video.top_negative_comments.map((comment, i) => (
                      <li key={i} className='mb-1'>
                        "{comment.text}"
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className='m-auto'>
                No comments on this video, No data to analyze
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default YouTubeSentimentPage
