import React from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Doughnut, LineChart, SparkLine, Stacked, Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import product9 from '../data/product9.jpg';
import {
  earningData,
  medicalproBranding,
  trending,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  ecomPieChartData
} from '../data/dummy';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id='time'
      fields={{ text: 'Time', value: 'Id' }}
      style={{ border: 'none', color: currentMode === 'Dark' && 'white' }}
      value='1'
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth='120px'
    />
  </div>
);

const Home = () => {
  const { currentColor, currentMode } = useStateContext();

  return (
    <div className="mt-12 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-wrap lg:flex-nowrap justify-between gap-4">
        {/* Main Card */}
        <div className="bg-white dark:text-gray-500 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-6 pt-8 bg-hero-pattern bg-no-repeat bg-cover bg-center shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center h-full">
            <div>
              <p className="font-bold text-gray-400 text-sm">Overall Sentiment</p>
              <p className="text-2xl font-bold mt-1">Positive</p>
              <div className="mt-4">
                <Button
                  color='white'
                  bgColor={currentColor}
                  text='View Detailed Analysis'
                  borderRadius="10px"
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[2px] bg-gray-300 h-auto"></div>
        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {earningData.map((item) => (
            <div
              key={item.title}
              className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 md:w-56 p-4 rounded-xl shadow-md hover:shadow-lg transition-all'
            >
              <button
                type='button'
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className='text-2xl opacity-0.9 rounded-full p-3 hover:drop-shadow-xl transition-all'
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Analysis Section */}
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <p className="font-semibold text-xl">Sentiment Analysis</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-blue-400 hover:drop-shadow-xl">
                <span><GoPrimitiveDot /></span>
                <span>Positive</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span><GoPrimitiveDot /></span>
                <span>Negative</span>
              </p>
              <p className="flex items-center gap-2 text-gray-400 hover:drop-shadow-xl">
                <span><GoPrimitiveDot /></span>
                <span>Neutral</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="border-r-0 md:border-r-1 border-color pr-0 md:pr-6">
              <div className="mb-6">
                <p className="flex items-center">
                  <span className="text-3xl font-semibold">93,438</span>
                  <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    23%
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Positive</p>
              </div>
              <div className="mb-6">
                <p className='text-3xl font-semibold'>48,487</p>
                <p className="text-gray-500 mt-1">Negative</p>
              </div>
              <div>
                <p className='text-3xl font-semibold'>48,487</p>
                <p className="text-gray-500 mt-1">Neutral</p>
              </div>
            </div>
            <div className="flex-1">
              <Stacked currentMode={currentMode} width='100%' height='300px' />
            </div>
          </div>
        </div>

        {/* Social Media Cards */}
        <div className="space-y-4">
          <Link to="/twitter-analytics">
            <div
              className='rounded-2xl p-6 cursor-pointer mb-6 hover:scale-[1.02] transition-transform shadow-md'
              style={{ backgroundColor: currentColor }}
            >
              <div className="flex justify-between items-center h-full">
                <div>
                  <p className="text-2xl text-white font-semibold">Twitter</p>
                  <p className="text-gray-200 mt-2">Detailed Sentiment Analysis</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/instagram-analytics">
            <div className='bg-white dark:text-gray-200 mb-6 dark:bg-secondary-dark-bg rounded-2xl p-6 flex justify-between items-center cursor-pointer hover:scale-[1.02] transition-transform shadow-md'>
              <div>
                <p className="text-2xl font-semibold">Instagram</p>
                <p className="text-gray-400 mt-2">Detailed Sentiment Analysis</p>
              </div>
            </div>
          </Link>

          <Link to="/youtube-analytics">
            <div
              className='rounded-2xl p-6 cursor-pointer mb-6 hover:scale-[1.02] transition-transform shadow-md'
              style={{ backgroundColor: currentColor }}
            >
              <div className="flex justify-between items-center h-full">
                <div>
                  <p className="text-2xl text-white font-semibold">Youtube</p>
                  <p className="text-gray-200 mt-2">Detailed Sentiment Analysis</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Now */}
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-semibold">Trending Now</p>
            <DropDown currentMode={currentMode} />
          </div>
          <div className="space-y-4">
            {trending.map((item) => (
              <div key={item.title} className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <button
                    type='button'
                    style={{
                      color: item.iconColor,
                      backgroundColor: item.iconBg
                    }}
                    className='text-xl rounded-lg p-3 hover:drop-shadow-xl'
                  >
                    {item.icon}
                  </button>
                  <div>
                    <p className='text-md font-semibold'>{item.title}</p>
                    <p className='text-sm text-gray-400'>{item.desc}</p>
                  </div>
                </div>
                <p className={`text-${item.pcColor}`}>{item.amount}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t-1 border-color mt-6 pt-4">
            <p className='text-gray-400 text-sm'>Top 5 Trending hashtags</p>
          </div>
        </div>

        {/* Sentiments Overview */}
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl shadow-md lg:col-span-2'>
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-semibold">Sentiments Overview</p>
            <DropDown currentMode={currentMode} />
          </div>
          <div className="w-full h-full">
            <LineChart width="100%" height="100%" currentMode={currentMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;