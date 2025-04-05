import React from 'react';
import { useParams } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Doughnut, LineChart, SparkLine } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const SocialMediaPage = () => {
  const { platform } = useParams();
  const { currentColor, currentMode } = useStateContext();

  // Sample data - in a real app, this would come from an API
  const sampleData = {
    text: "ISM is turning into IIT #hackfest",
    sentiment: "LABEL_0",
    confidence: 0.5631017088890076,
    emotions: [
      {
        label: "anger",
        score: 0.9815769791603088,
        urgent: false,
        timestamp: "2025-04-04T21:44:48.527+00:00",
        tweet_id: "1908222857559126239"
      }
    ],
    stats: {
      positive: 65,
      negative: 20,
      neutral: 15,
      total: 100
    },
    recentPosts: [
      {
        id: 1,
        text: "Excited for the new semester! #college",
        sentiment: "Positive",
        confidence: 0.85
      },
      {
        id: 2,
        text: "Not happy with the new rules #frustrated",
        sentiment: "Negative",
        confidence: 0.78
      },
      {
        id: 3,
        text: "Just posted a new photo",
        sentiment: "Neutral",
        confidence: 0.65
      }
    ]
  };

  const sentimentLabels = {
    "LABEL_0": "Negative",
    "LABEL_1": "Positive",
    "LABEL_2": "Neutral"
  };

  const emotionColors = {
    anger: "#FF5733",
    joy: "#FFC300",
    sadness: "#3498DB",
    fear: "#9B59B6",
    surprise: "#1ABC9C",
    love: "#E74C3C"
  };

  return (
    <div className="mt-12">
      <div className="flex items-center m-6">
        <Link to="/" className="flex items-center mr-4">
          <BsArrowLeft className="text-2xl" />
        </Link>
        <h1 className="text-3xl font-bold capitalize">{platform} Analytics</h1>
      </div>

      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl p-6 m-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Post Analysis</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Post Content:</p>
            <p className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">{sampleData.text}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">Sentiment:</p>
                <p className="font-semibold capitalize">
                  {sentimentLabels[sampleData.sentiment] || sampleData.sentiment}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">Confidence:</p>
                <p className="font-semibold">
                  {(sampleData.confidence * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <div className='h-full'>
            <h3 className="text-lg font-semibold mb-3">Emotion Analysis</h3>
            <div className="h-full">
              <Doughnut 
                id="emotion-chart"
                data={sampleData.emotions.map(emotion => ({
                  x: emotion.label,
                  y: emotion.score * 100,
                  text: `${emotion.label} (${(emotion.score * 100).toFixed(1)}%)`,
                  fill: emotionColors[emotion.label] || currentColor
                }))}
                legendVisiblity={true}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
          <div className="h-full">
            <Doughnut 
              id="sentiment-chart"
              data={[
                { x: 'Positive', y: sampleData.stats.positive, text: `${sampleData.stats.positive}%`, fill: '#4CAF50' },
                { x: 'Negative', y: sampleData.stats.negative, text: `${sampleData.stats.negative}%`, fill: '#F44336' },
                { x: 'Neutral', y: sampleData.stats.neutral, text: `${sampleData.stats.neutral}%`, fill: '#9E9E9E' }
              ]}
              legendVisiblity={true}
              height="100%"
            />
          </div>
        </div>

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sentiment Trend</h2>
          <div className="h-full">
            <LineChart 
              width="100%"
              height="100%"
              currentMode={currentMode}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-6 p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {sampleData.recentPosts.map(post => (
            <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <p className="mb-2">{post.text}</p>
              <div className="flex justify-between text-sm">
                <span className={`px-2 py-1 rounded-full ${
                  post.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                  post.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {post.sentiment}
                </span>
                <span>Confidence: {(post.confidence * 100).toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPage;