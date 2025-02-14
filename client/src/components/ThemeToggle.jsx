import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleHandler = () => {
    const toggledIsDarkMode = !isDarkMode;
    setIsDarkMode(toggledIsDarkMode);
    if (toggledIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="w-44 justify-start fixed bottom-3 left-3 z-50">
      <Switch 
          checked={isDarkMode}
          onChange={toggleHandler}
          className='group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center bg-gray-200 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
          <span className="sr-only">Enable dark mode</span>
          <span
            className={`${
              isDarkMode ? 'translate-x-4 bg-blue-300' : 'translate-x-0 bg-white'
            } pointer-events-none inline-block h-4 w-4 rounded-full  shadow transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
        <label className="label cursor-pointer ml-3 -mt-1">
          <span className="text-gray-400">Dark Mode</span>
        </label>
    </div>
  );
};

export default ThemeToggle;