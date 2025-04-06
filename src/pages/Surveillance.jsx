import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
// Import the local video
import localVideo from '../data/local-video.mp4';

const Surveillance = () => {
  const { currentColor, currentMode } = useStateContext();
  const [isStreaming, setIsStreaming] = useState(false);
  const [crowdData, setCrowdData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  // Basic button component instead of using the imported one
  const CustomButton = ({ text, onClick, bgColor }) => (
    <button
      type="button"
      onClick={onClick}
      className="text-white px-4 py-2 rounded-lg"
      style={{ backgroundColor: bgColor }}
      disabled={isLoading}
    >
      {text}
    </button>
  );

  const startSurveillance = () => {
    console.log("Starting surveillance...");
    setIsLoading(true);
    
    // Play video
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.error("Video play error:", e);
      });
    }
    
    // Fetch data from API
    fetch('http://localhost:5000/start-surveillance')
      .then(response => {
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data received:", data);
        setCrowdData(data);
        setIsStreaming(true);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const stopSurveillance = () => {
    console.log("Stopping surveillance...");
    
    // Pause video
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Reset state
    setIsStreaming(false);
    
    // Optional: Call stop endpoint
    fetch('http://localhost:5000/stop-surveillance', { method: 'POST' })
      .catch(e => console.log('Stop endpoint error (ignorable):', e));
  };

  // Get the latest count from the data
  const getLatestCount = () => {
    if (!crowdData || crowdData.length === 0) return 'N/A';
    return crowdData[0].count;
  };

  // Check if overcrowded based on count
  const isOvercrowded = () => {
    if (!crowdData || crowdData.length === 0) return false;
    return crowdData[0].message === "overcrowding";
  };

  useEffect(() => {
    console.log("isStreaming state changed:", isStreaming);
    
    // Clean up when component unmounts
    return () => {
      if (isStreaming && videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isStreaming]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-semibold">Live Surveillance</p>
            <div>
              {/* Using custom button instead of imported component */}
              <CustomButton
                text={isLoading ? "Loading..." : isStreaming ? "Stop" : "Start"}
                onClick={isStreaming ? stopSurveillance : startSurveillance}
                bgColor={currentColor}
              />
            </div>
          </div>
          
          <div className="w-full relative" style={{ aspectRatio: '16/9' }}>
            <video 
              ref={videoRef}
              className="w-full h-full rounded-lg bg-gray-800 object-cover"
              controls={!isStreaming}
              autoPlay={false}
              muted
              src={localVideo}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          
          {crowdData.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Surveillance Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium">{isStreaming ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <p className="text-sm text-gray-500 dark:text-gray-400">People Count</p>
                  <p className="font-medium">{getLatestCount()}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Started At</p>
                  <p className="font-medium">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl shadow-md">
          <div className="mb-4">
            <p className="text-xl font-semibold mb-4">Detection Alerts</p>
            {isLoading ? (
              <p className="text-gray-500">Loading alerts...</p>
            ) : !crowdData || crowdData.length === 0 ? (
              <p className="text-gray-500">No alerts yet. Start surveillance to monitor activity.</p>
            ) : (
              <div className="space-y-3">
                {/* Overcrowding alert based on message */}
                {isOvercrowded() ? (
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-md">
                    <p className="font-medium">Overcrowding Detected!</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current occupancy: {getLatestCount()} people
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status: {crowdData[0].message}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
                    <p className="font-medium">Normal Occupancy</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current count: {getLatestCount()} people
                    </p>
                  </div>
                )}
                
                {/* Historical data */}
                {crowdData.length > 1 && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Recent Observations</p>
                    {crowdData.slice(1).map((item, index) => (
                      <div key={index} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md mb-2">
                        <p className="font-medium">Count: {item.count}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Status: {item.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surveillance;
