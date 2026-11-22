import { useState } from 'react';
import VehicleCard from '../../components/common/VehicleCard';


const MOCK_VEHICLES = [
  { id: 'v1', name: 'Toyota KDH Super Roof', type: 'Van', image: 'https://images.unsplash.com/photo-1542318721-a53d6ebef427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', capacity: 9, luggage: 5, ac: true, driverIncluded: true, pricePerKm: 0.85, rating: 4.8, reviews: 124 },
  { id: 'v2', name: 'Toyota Axio', type: 'Car', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', capacity: 3, luggage: 2, ac: true, driverIncluded: true, pricePerKm: 0.65, rating: 4.9, reviews: 89 },
  { id: 'v3', name: 'Toyota Land Cruiser', type: 'Luxury SUV', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', capacity: 5, luggage: 4, ac: true, driverIncluded: true, pricePerKm: 1.20, rating: 5.0, reviews: 42 },
  { id: 'v4', name: 'Mitsubishi Rosa', type: 'Bus', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', capacity: 26, luggage: 15, ac: true, driverIncluded: true, pricePerKm: 1.50, rating: 4.7, reviews: 33 },
  { id: 'v5', name: 'Safari Jeep Defender', type: 'Safari Jeep', image: 'https://images.unsplash.com/photo-1534948216015-843149f72be3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', capacity: 6, luggage: 0, ac: false, driverIncluded: true, pricePerKm: 1.00, rating: 4.9, reviews: 215 },
  { id: 'v6', name: 'Toyota Prius', type: 'Car', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', capacity: 3, luggage: 2, ac: true, driverIncluded: true, pricePerKm: 0.60, rating: 4.6, reviews: 67 },
];

const Vehicles = () => {
  const [filter, setFilter] = useState('All');
  
  const types = ['All', 'Car', 'Van', 'Luxury SUV', 'Bus', 'Safari Jeep'];
  
  const filteredVehicles = filter === 'All' 
    ? MOCK_VEHICLES 
    : MOCK_VEHICLES.filter(v => v.type === filter);

  return (
    <div className="pt-28 pb-20 bg-off-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-forest mb-4">Our Fleet</h1>
            <p className="text-lg text-charcoal/70 max-w-2xl">
              From comfortable sedans to rugged safari jeeps, we have the perfect vehicle for every leg of your journey.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 overflow-x-auto whitespace-nowrap">
            <i className="fas fa-filter text-gray-400 mr-2" style={{fontSize: '18px'}}></i>
            {types.map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-colors ${filter === t ? 'bg-forest text-white' : 'text-charcoal hover:bg-gray-100'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map(vehicle => (
            <VehicleCard 
              key={vehicle.id}
              vehicle={vehicle}
              onBook={() => {}}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Vehicles;
