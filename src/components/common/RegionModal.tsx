import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States', lang: 'en', currency: 'USD', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', lang: 'en', currency: 'GBP', flag: '🇬🇧' },
  { code: 'LK', name: 'Sri Lanka', lang: 'en', currency: 'LKR', flag: '🇱🇰' },
  { code: 'IN', name: 'India', lang: 'en', currency: 'INR', flag: '🇮🇳' },
  { code: 'AE', name: 'United Arab Emirates', lang: 'en', currency: 'AED', flag: '🇦🇪' },
  { code: 'AU', name: 'Australia', lang: 'en', currency: 'AUD', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', lang: 'en', currency: 'CAD', flag: '🇨🇦' },
  { code: 'CN', name: 'China', lang: 'en', currency: 'CNY', flag: '🇨🇳' },
  { code: 'FR', name: 'France', lang: 'en', currency: 'EUR', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', lang: 'en', currency: 'EUR', flag: '🇩🇪' },
  { code: 'JP', name: 'Japan', lang: 'en', currency: 'JPY', flag: '🇯🇵' },
  { code: 'RU', name: 'Russia', lang: 'en', currency: 'RUB', flag: '🇷🇺' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'si', name: 'සිංහල (Sinhala)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ru', name: 'Русский (Russian)' },
];

// Custom Searchable Dropdown Component
const SearchableDropdown = ({ 
  label, 
  items, 
  value, 
  onChange, 
  renderItem, 
  placeholder 
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter((item: any) => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = items.find((item: any) => item.code === value);

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      {label && <label className="block text-lg font-bold text-charcoal mb-3">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-left focus:outline-none hover:border-forest transition-colors"
      >
        <span className="flex items-center gap-3 text-charcoal text-[15px]">
          {selectedItem ? renderItem(selectedItem) : 'Select...'}
        </span>
        <i className={ "fas fa-chevron-down text-gray-400 transition-transform " + (isOpen ? "rotate-180" : "") } style={{fontSize: "20px"}}></i>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <i className="fas fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{fontSize: '16px'}}></i>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-forest"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item: any) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onChange(item.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                      value === item.code ? 'bg-forest/5 text-forest font-semibold' : 'text-charcoal'
                    }`}
                  >
                    {renderItem(item)}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">No results found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RegionModal: React.FC<RegionModalProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const { currency, setCurrency } = useSettings();
  
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = COUNTRIES.find(c => c.code === countryCode);
    // If the country has a specific default language we support, we can switch it.
    // For now, let's just keep English default and let them change if they want, 
    // or switch if it's LK -> si. But the user asked to leave English by default.
  };

  const handleSave = () => {
    i18n.changeLanguage(selectedLang);
    
    // Auto-update currency based on country
    const country = COUNTRIES.find(c => c.code === selectedCountry);
    if (country) {
      setCurrency(country.currency as any);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-visible z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-charcoal">Regional Settings</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-full transition-colors">
              <i className="fas fa-times" style={{fontSize: '20px'}}></i>
            </button>
          </div>

          <div className="p-6">
            <SearchableDropdown
              label="Ship to"
              items={COUNTRIES}
              value={selectedCountry}
              onChange={handleCountryChange}
              placeholder="Search country..."
              renderItem={(item: any) => (
                <>
                  <span className="text-xl leading-none">{item.flag}</span>
                  <span>{item.name}</span>
                </>
              )}
            />

            <SearchableDropdown
              label="Language"
              items={LANGUAGES}
              value={selectedLang}
              onChange={setSelectedLang}
              placeholder="Search language..."
              renderItem={(item: any) => <span>{item.name}</span>}
            />
            
            <button 
              onClick={handleSave}
              className="w-full mt-2 py-3.5 rounded-xl font-bold text-white bg-forest hover:bg-jungle transition-colors shadow-md text-[15px]"
            >
              Save
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegionModal;
