
import { motion } from 'framer-motion';

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  image: string;
  capacity: number;
  luggage: number;
  ac: boolean;
  driverIncluded: boolean;
  pricePerKm: number;
  rating: number;
  reviews: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onBook: (id: string) => void;
}

const VehicleCard = ({ vehicle, onBook }: VehicleCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group"
    >
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-forest shadow-md flex items-center gap-1">
          <i className="fas fa-star fill-safari-gold text-safari-gold" style={{fontSize: '14px'}}></i>
          {vehicle.rating} ({vehicle.reviews})
        </div>
        <div className="absolute top-4 left-4 bg-forest text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
          {vehicle.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-forest mb-4">{vehicle.name}</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-charcoal/80 text-sm">
          <div className="flex items-center gap-2">
            <i className="fas fa-users text-safari-gold" style={{fontSize: '18px'}}></i>
            <span>Max {vehicle.capacity} Pax</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-briefcase text-safari-gold" style={{fontSize: '18px'}}></i>
            <span>{vehicle.luggage} Bags</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-wind text-safari-gold" style={{fontSize: '18px'}}></i>
            <span>{vehicle.ac ? 'A/C Included' : 'Non A/C'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[18px] h-[18px] rounded-full border-2 border-safari-gold flex items-center justify-center">
              <div className="w-2 h-2 bg-safari-gold rounded-full"></div>
            </div>
            <span>{vehicle.driverIncluded ? 'With Driver' : 'Self Drive'}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-charcoal/60">Starting from</p>
            <p className="text-2xl font-bold text-forest">${vehicle.pricePerKm} <span className="text-sm font-normal text-charcoal/60">/ km</span></p>
          </div>
          <button 
            onClick={() => onBook(vehicle.id)}
            className="bg-forest hover:bg-safari-gold text-white hover:text-forest font-bold py-3 px-6 rounded-xl transition-colors shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
