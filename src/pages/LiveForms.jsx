import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { Header } from '../components';
import { FiExternalLink } from 'react-icons/fi';
import CircularProgressBar from '../components/CircleProgressBar';

const LiveForms = () => {
  const { currentMode, currentColor } = useStateContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in a real app, this would come from an API
  const formsData = [
    {
      id: 1,
      title: 'Customer Satisfaction Survey',
      url: 'https://forms.gle/example1',
      responses: 142,
      sentiment: 'positive',
      confidence: 82,
      lastUpdated: '2023-05-15',
      status: 'active'
    },
    {
      id: 2,
      title: 'Product Feedback Form',
      url: 'https://forms.gle/example2',
      responses: 89,
      sentiment: 'neutral',
      confidence: 76,
      lastUpdated: '2023-05-10',
      status: 'active'
    },
    {
      id: 3,
      title: 'Employee Engagement Survey',
      url: 'https://forms.gle/example3',
      responses: 210,
      sentiment: 'negative',
      confidence: 68,
      lastUpdated: '2023-05-05',
      status: 'closed'
    },
    {
      id: 4,
      title: 'Event Registration Form',
      url: 'https://forms.gle/example4',
      responses: 320,
      sentiment: 'positive',
      confidence: 91,
      lastUpdated: '2023-05-18',
      status: 'active'
    },
    {
      id: 5,
      title: 'Website Feedback Form',
      url: 'https://forms.gle/example5',
      responses: 45,
      sentiment: 'neutral',
      confidence: 72,
      lastUpdated: '2023-05-12',
      status: 'active'
    },
  ];

  const filteredForms = formsData.filter(form => 
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.sentiment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#F44336';
      case 'neutral': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#4CAF50';
      case 'closed': return '#F44336';
      case 'draft': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg">
      <Header title="Live Forms Analytics" />
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search forms..."
            className={`w-full p-3 pl-10 rounded-lg ${currentMode === 'Dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Closed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm">Draft</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Form Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Responses
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Sentiment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Confidence
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white'}`}>
            {filteredForms.map((form) => (
              <tr key={form.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium">
                      {form.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    style={{ 
                      backgroundColor: `${getStatusColor(form.status)}20`,
                      color: getStatusColor(form.status)
                    }}
                  >
                    {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{form.responses}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    style={{ 
                      backgroundColor: `${getSentimentColor(form.sentiment)}20`,
                      color: getSentimentColor(form.sentiment)
                    }}
                  >
                    {form.sentiment.charAt(0).toUpperCase() + form.sentiment.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CircularProgressBar 
                      percentage={form.confidence} 
                      color={currentColor} 
                      size={40} 
                      strokeWidth={5} 
                    />
                    <span className="ml-2 text-sm">{form.confidence}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(form.lastUpdated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a 
                    href={form.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                    style={{ color: currentColor }}
                  >
                    <span className="mr-1">Open</span>
                    <FiExternalLink />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No forms found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LiveForms;