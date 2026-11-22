import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyCode = 'USD' | 'LKR' | 'EUR' | 'GBP' | 'CNY';

interface SettingsContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  LKR: 320,
  EUR: 0.92,
  GBP: 0.79,
  CNY: 7.23,
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  LKR: 'LKR ',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('yala_currency');
    return (saved as CurrencyCode) || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('yala_currency', currency);
  }, [currency]);

  const formatPrice = (amountInUSD: number) => {
    const converted = amountInUSD * EXCHANGE_RATES[currency];
    return `${CURRENCY_SYMBOLS[currency]}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
