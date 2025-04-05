import React, { useEffect, useState } from 'react';
import { Footer, Navbar, Sidebar, ThemeSettings } from './components';
import { Banner } from './utils/Banner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from './contexts/ContextProvider';
import SocialMediaPage from './pages/SocialMediaPage';
import LiveForms from './pages/LiveForms';
import { Home } from './pages';
import { FaExclamationTriangle } from 'react-icons/fa';
import InstaPage from './pages/InstaPage';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import YoutubePage from './pages/YoutubePage';

export const App = () => {
  const { 
    currentColor, 
    currentMode, 
    activeMenu, 
    themeSettings, 
    setThemeSettings,
    addNotification,
    setCurrentColor,
    setCurrentMode
  } = useStateContext();
  
  const [showBanner, setShowBanner] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [lastChecked, setLastChecked] = useState(new Date());
  
  // Initialize theme settings
  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  // Poll for new notifications
  useEffect(() => {
    const checkForNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/notifications', {
          params: {
            since: lastChecked.toISOString()
          }
        });
        
        if (response.data && response.data.length > 0) {
          // Process new notifications
          response.data.forEach(notification => {
            const newNotification = {
              id: notification._id,
              title: notification.category || 'New Alert',
              message: notification.reasoning || 'New notification received',
              type: notification.classification || 'info',
              severity: notification.severity || 'medium',
              createdAt: new Date(notification.createdAt || new Date()).toISOString()
            };
            
            // addNotification(newNotification);
            showNewNotification(newNotification);
          });
          
          // Update last checked time
          setLastChecked(new Date());
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Check every 30 seconds (adjust as needed)
    const interval = setInterval(checkForNotifications, 10000);
    
    // Initial check
    // checkForNotifications();
    
    return () => clearInterval(interval);
  }, [lastChecked]);

  const showNewNotification = (notification) => {
    setCurrentNotification({
      title: notification.title,
      message: notification.message,
      severity: notification.severity
    });
    setShowBanner(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowBanner(false);
    }, 5000);
  };

  const handleTestBanner = () => {
    const testNotification = {
      id: 'test-' + Date.now(),
      title: "Test Notification",
      message: "This is a test notification banner.",
      type: "info",
      severity: "medium",
      createdAt: new Date().toISOString()
    };
    // addNotification(testNotification);
    showNewNotification(testNotification);
  };

  return (
    <>
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {/* Test Button (can be removed in production) */}
          <div className="fixed left-4 bottom-4 z-1000">
            <button
              type="button"
              onClick={handleTestBanner}
              style={{ backgroundColor: currentColor }}
              className="text-white p-3 rounded-lg shadow-lg hover:opacity-90 transition-opacity"
            >
              Test Banner
            </button>
          </div>

          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ backgroundColor: currentColor, borderRadius: '50%' }}
                className="text-3xl z-1000 text-white p-3 drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>

          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-10">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}

          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
                : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
            
            {/* Notification Banner */}
            <div className="mt-16">
              <Banner
                show={showBanner}
                onClose={() => setShowBanner(false)}
                icon={<FaExclamationTriangle />}
                title={currentNotification?.title || "Notification"}
                description={currentNotification?.message || ""}
                severity={currentNotification?.severity || "medium"}
              />
            </div>

            <div>
              {themeSettings && <ThemeSettings />}

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/liveforms" element={<LiveForms />} />
                <Route path="/twitter-analytics" element={<SocialMediaPage />} />
                <Route path="/instagram-analytics" element={<InstaPage />} />
                <Route path="/youtube-analytics" element={<YoutubePage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
      
    </div>
    </>
  );
};