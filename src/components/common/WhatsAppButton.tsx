
import { useTranslation } from 'react-i18next';

const WhatsAppButton = () => {
  const { t } = useTranslation();
  
  const handleWhatsAppClick = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
    if (phoneNumber) {
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    } else {
      console.warn('WhatsApp number is not configured in .env');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-charcoal px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap text-sm font-medium">
        {t('whatsapp')}
        {/* Triangle pointer */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white transform rotate-45"></div>
      </div>
      
      {/* Button */}
      <button
        onClick={handleWhatsAppClick}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 relative"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75"></div>
        <i className="fab fa-whatsapp" style={{fontSize: '32px'}}></i>
      </button>
    </div>
  );
};

export default WhatsAppButton;
