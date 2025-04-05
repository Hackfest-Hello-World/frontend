import React, { useEffect, useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { Header } from '../components'
import { FiExternalLink } from 'react-icons/fi'
import CircularProgressBar from '../components/CircleProgressBar'

const LiveForms = () => {
  const { currentMode, currentColor } = useStateContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRow, setExpandedRow] = useState(null)
  const [formsData, setFormsData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await fetch(
        'https://5qb2m665-5010.inc1.devtunnels.ms' + '/forms/getAll'
      )

      const data = await response.json()
      // print(data)
      setFormsData(data)
      setLoading(false)
      // return data
    }
    fetchData()
  }, [])

  const filteredForms = formsData.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // form.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.sentiment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '#4CAF50'
      case 'negative':
        return '#F44336'
      case 'neutral':
        return '#FFC107'
      default:
        return '#9E9E9E'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50'
      case 'closed':
        return '#F44336'
      case 'draft':
        return '#FFC107'
      default:
        return '#9E9E9E'
    }
  }

  return (
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg'>
      <Header title='Live Forms Analytics' />

      <div className='mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='relative w-full md:w-1/3'>
          <input
            type='text'
            placeholder='Search forms...'
            className={`w-full p-3 pl-10 rounded-lg ${
              currentMode === 'Dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className='absolute left-3 top-3.5 h-5 w-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full bg-green-500 mr-2'></div>
            <span className='text-sm'>Active</span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full bg-red-500 mr-2'></div>
            <span className='text-sm'>Closed</span>
          </div>
          <div className='flex items-center'>
            <div className='w-3 h-3 rounded-full bg-yellow-500 mr-2'></div>
            <span className='text-sm'>Draft</span>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead
            className={`${
              currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}
          >
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase'>
                Form Title
              </th>
              {/* <th className='px-6 py-3 text-left text-xs font-medium uppercase'>
                Status
              </th> */}
              <th className='px-6 py-3 text-left text-xs font-medium uppercase'>
                Responses
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase'>
                Sentiment
              </th>
              {/* <th className='px-6 py-3 text-left text-xs font-medium uppercase'>
                Confidence
              </th> */}
              <th className='px-6 py-3 text-left text-xs font-medium uppercase'>
                Last Updated
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-gray-200 dark:divide-gray-700 ${
              currentMode === 'Dark' ? 'bg-secondary-dark-bg' : 'bg-white'
            }`}
          >
            {filteredForms.map((form, index) => (
              <React.Fragment key={index}>
                <tr
                  className='hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                  onClick={() =>
                    setExpandedRow(
                      expandedRow === form.formId ? null : form.formId
                    )
                  }
                >
                  <td className='px-6 py-4'>{form.title}</td>
                  {/* <td className='px-6 py-4'>
                    <span
                      className='px-2 inline-flex text-xs font-semibold rounded-full'
                      style={{
                        backgroundColor: `${getStatusColor(form.status)}20`,
                        color: getStatusColor(form.status),
                      }}
                    >
                      {form.status.charAt(0).toUpperCase() +
                        form.status.slice(1)}
                    </span>
                  </td> */}
                  <td className='px-6 py-4'>{form.responses.length}</td>
                  <td className='px-6 py-4'>
                    <span
                      className='px-2 inline-flex text-xs font-semibold rounded-full'
                      style={{
                        backgroundColor: `${getSentimentColor(
                          form.sentiment
                        )}20`,
                        color: getSentimentColor(form.sentiment),
                      }}
                    >
                      {form.sentiment.charAt(0).toUpperCase() +
                        form.sentiment.slice(1)}
                    </span>
                  </td>
                  {/* <td className='px-6 py-4'>
                    <div className='flex items-center'>
                      <CircularProgressBar
                        percentage={form.confidence}
                        color={currentColor}
                        size={40}
                        strokeWidth={5}
                      />
                      <span className='ml-2 text-sm'>{form.confidence}%</span>
                    </div>
                  </td> */}
                  <td className='px-6 py-4'>
                    {form.lastUpdated
                      ? new Date(form.lastUpdated).toLocaleDateString()
                      : 'Not Available'}
                  </td>
                  <td className='px-6 py-4'>
                    <a
                      href={form.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center'
                      style={{ color: currentColor }}
                    >
                      <span className='mr-1'>Open</span>
                      <FiExternalLink />
                    </a>
                  </td>
                </tr>

                {expandedRow === form.formId && (
                  <tr>
                    <td colSpan='7'>
                      <div className='max-h-60 overflow-y-auto p-4 border rounded-lg mt-2 bg-gray-50 dark:bg-gray-900'>
                        {form.responses.length > 0 ? (
                          <table className='min-w-full text-sm text-left'>
                            <thead className='sticky top-0 bg-gray-500 dark:bg-gray-700'>
                              <tr>
                                <th className='px-4 py-2'>Response Summary</th>
                                <th className='px-4 py-2'>Sentiment</th>
                                <th className='px-4 py-2'>Email</th>
                              </tr>
                            </thead>
                            <tbody className=''>
                              {form.responses.map((res, idx) => (
                                <tr
                                  key={idx}
                                  className='border-t dark:border-gray-700'
                                >
                                  <td className='px-4 py-2 max-w-xs truncate group relative'>
                                    <div
                                      className='w-[450px] overflow-y-hidden p-2 overflow-x-auto'
                                      title={
                                        res.sentimentAnalysis[
                                          'response_summary'
                                        ]
                                      }
                                    >
                                      {
                                        res.sentimentAnalysis[
                                          'response_summary'
                                        ]
                                      }
                                      {/* {res.sentimentAnalysis['response_summary']
                                        .length > 50
                                        ? res.sentimentAnalysis[
                                            'response_summary'
                                          ].slice(0, 50) + '...'
                                        : res.sentimentAnalysis[
                                            'response_summary'
                                          ]} */}
                                    </div>
                                  </td>
                                  <td
                                    className='px-4 py-2'
                                    style={{
                                      color: getSentimentColor(
                                        res.sentimentAnalysis['sentiment']
                                      ),
                                    }}
                                  >
                                    {res.sentimentAnalysis['sentiment']
                                      .charAt(0)
                                      .toUpperCase() +
                                      res.sentimentAnalysis['sentiment'].slice(
                                        1
                                      )}
                                  </td>
                                  <td className='px-4 py-2'>{res.email}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className='text-center text-gray-500 dark:text-gray-400 py-6'>
                            No responses yet for this form.
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredForms.length === 0 && (
        <div className='text-center py-10'>
          <p className='text-gray-500 dark:text-gray-400'>
            {loading
              ? 'Loading...'
              : 'No forms found matching your search criteria.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default LiveForms
