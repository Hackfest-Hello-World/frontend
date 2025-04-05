import React, { useEffect, useState } from 'react';
import { Footer, Navbar, Sidebar, ThemeSettings } from './components';
import { Banner } from './utils/Banner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from './contexts/ContextProvider';
import SocialMediaPage from './pages/SocialMediaPage';
import { Home } from './pages';
import { FaExclamationTriangle } from 'react-icons/fa';

export const App = () => {
  const { currentColor, setCurrentColor, currentMode, setCurrentMode, activeMenu, themeSettings, setThemeSettings } = useStateContext();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor, currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const handleTestBanner = () => {
    setShowBanner(true);
  };

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {/* Banner Component */}
          <Banner
            show={showBanner}
            onClose={() => setShowBanner(false)}
            icon={<FaExclamationTriangle />}
            title="Important Notification"
            description="This is a temporary banner that will disappear in 3 seconds."
          />

          {/* Test Button */}
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

          {/* Rest of your existing code... */}
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
            <div>
              {themeSettings && <ThemeSettings />}

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/twitter-analytics" element={<SocialMediaPage platform="twitter" />} />
                <Route path="/instagram-analytics" element={<SocialMediaPage platform="instagram" />} />
                <Route path="/youtube-analytics" element={<SocialMediaPage platform="youtube" />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};