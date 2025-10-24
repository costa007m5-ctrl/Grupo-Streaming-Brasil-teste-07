import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface SoundSettings {
  playIntroSound: boolean;
  playTrailerSound: boolean;
}

interface SoundContextType extends SoundSettings {
  setPlayIntroSound: (value: boolean) => void;
  setPlayTrailerSound: (value: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const getInitialState = (): SoundSettings => {
  try {
    const item = window.localStorage.getItem('soundSettings');
    return item ? JSON.parse(item) : { playIntroSound: true, playTrailerSound: true };
  } catch (error) {
    console.warn('Error reading localStorage soundSettings', error);
    return { playIntroSound: true, playTrailerSound: true };
  }
};

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SoundSettings>(getInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem('soundSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Error setting localStorage soundSettings', error);
    }
  }, [settings]);

  const setPlayIntroSound = (value: boolean) => {
    setSettings(s => ({ ...s, playIntroSound: value }));
  };

  const setPlayTrailerSound = (value: boolean) => {
    setSettings(s => ({ ...s, playTrailerSound: value }));
  };

  return (
    <SoundContext.Provider value={{ ...settings, setPlayIntroSound, setPlayTrailerSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundSettings = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundSettings must be used within a SoundProvider');
  }
  return context;
};