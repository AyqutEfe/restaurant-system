import { createContext, useContext, useState, useEffect } from 'react';

const AmbientContext = createContext();

export const AMBIENT_THEMES = {
  SUNRISE: 'sunrise',
  NOON: 'noon',
  SUNSET: 'sunset',
  NIGHT: 'night',
};

const getThemeByTime = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) {
    return AMBIENT_THEMES.SUNRISE;
  } else if (hour >= 10 && hour < 17) {
    return AMBIENT_THEMES.NOON;
  } else if (hour >= 17 && hour < 21) {
    return AMBIENT_THEMES.SUNSET;
  } else {
    return AMBIENT_THEMES.NIGHT;
  }
};

export function AmbientProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return getThemeByTime();
  });

  // 1. Theme Change Logic (Saate göre otomatik)
  useEffect(() => {
    const body = document.body;
    Object.values(AMBIENT_THEMES).forEach((t) => {
      body.classList.remove(`ambient-${t}`);
    });
    body.classList.add(`ambient-${theme}`);
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeTheme = getThemeByTime();
      if (timeTheme !== theme) {
        setThemeState(timeTheme);
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [theme]);

  return (
    <AmbientContext.Provider value={{ theme }}>
      {children}
    </AmbientContext.Provider>
  );
}

export const useAmbient = () => {
  const context = useContext(AmbientContext);
  if (!context) {
    throw new Error('useAmbient must be used within an AmbientProvider');
  }
  return context;
};
