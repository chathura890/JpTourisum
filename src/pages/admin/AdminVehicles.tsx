import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { adminDataService } from '../../services/adminDataService';
import { type TourVehicle } from '../../data/tourData';

export const AdminVehicles: React.FC = () => {
  const { formatPrice } = useSettings();
  const [vehicles, setVehicles] = useState<TourVehicle[]>(() => adminDataService.getVehicles());
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<TourVehicle | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('van');
  const [passengers, setPassengers] = useState(6);
  const [luggage, setLuggage] = useState(4);
  const [pricePerDayUSD, setPricePerDayUSD] = useState(65);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [featuresStr, setFeaturesStr] = useState('Dual AC, Reclining Seats, WiFi, Cool Box');

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setName('');
    setType('van');
    setPassengers(7);
    setLuggage(5);
    setPricePerDayUSD(70);
    setImage('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80');
    setDescription('Spacious tourist van with high-roof comfort, dual air conditioning and ample luggage space.');
    setFeaturesStr('Dual AC, Reclining Seats, Tinted Windows, USB Charging, Free WiFi');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: TourVehicle) => {
    setEditingVehicle(v);
    setName(v.name);
    setType(v.type);
    setPassengers(v.maxPassengers);
    setLuggage(v.maxLuggage);
    setPricePerDayUSD(v.pricePerDayUSD);
    setImage(v.image);
    setDescription(v.description);
    setFeaturesStr(v.features.join(', '));
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to remove this vehicle from the fleet?')) {
      const updated = vehicles.filter(v => v.id !== id);
      setVehicles(updated);
      adminDataService.saveVehicles(updated);
    }
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresStr.split(',').map(s => s.trim()).filter(Boolean);

    let updated: TourVehicle[];
    if (editingVehicle) {
      const updatedObj: TourVehicle = {
        ...editingVehicle,
        name,
        type: type as TourVehicle['type'],
        maxPassengers: passengers,
        maxLuggage: luggage,
        pricePerDayUSD,
        fuelIncluded: true,
        image,
        description,
        features
      };
      updated = vehicles.map(v => v.id === editingVehicle.id ? updatedObj : v);
    } else {
      const newObj: TourVehicle = {
        id: `veh-${Date.now()}`,
        name,
        type: type as TourVehicle['type'],
        maxPassengers: passengers,
        maxLuggage: luggage,
        pricePerDayUSD,
        fuelIncluded: true,
        image,
        description,
        features
      };
      updated = [newObj, ...vehicles];
    }

    setVehicles(updated);
    adminDataService.saveVehicles(updated);
    setIsModalOpen(false);
  };

  const filteredVehicles = filterType === 'all'
    ? vehicles
    : vehicles.filter(v => v.type === filterType);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
            Transport & Fleet Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-forest">
            Vehicles & Fleet Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage company tourist vans, 4x4 safari jeeps, luxury sedans, and coaches.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-forest text-safari-gold text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-forest/90 transition-all shadow-xs self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus"></i> Add New Vehicle
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-xs text-xs font-bold overflow-x-auto">
        {['all', 'car', 'van', 'suv', 'bus'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-4 py-2 rounded-xl uppercase transition-all whitespace-nowrap ${
              filterType === cat ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            {cat === 'all' ? `All Vehicles (${vehicles.length})` : cat}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(v => (
          <div key={v.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs flex flex-col justify-between group">
            <div>
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-forest/80 backdrop-blur-xs text-safari-gold px-2.5 py-1 rounded-xl text-[10px] font-black uppercase">
                  {v.type}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-xs font-black">
                  {formatPrice(v.pricePerDayUSD)} <span className="text-[10px] text-gray-300 font-normal">/day</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-black text-gray-900 text-base">{v.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{v.description}</p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 mt-4 bg-gray-50 p-2.5 rounded-xl text-xs font-bold text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-users text-forest text-xs"></i>
                    <span>Max {v.maxPassengers} Passengers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-suitcase-rolling text-forest text-xs"></i>
                    <span>Max {v.maxLuggage} Bags</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {v.features.map(f => (
                    <span key={f} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between mt-4">
              <span className="text-[10px] font-mono text-gray-400">ID: {v.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(v)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-forest hover:text-white rounded-xl text-xs font-bold text-gray-700 transition-all"
                >
                  <i className="fa-solid fa-pen-to-square mr-1"></i> Edit
                </button>
                <button
                  onClick={() => handleDeleteVehicle(v.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl text-xs text-red-600 transition-all"
                  title="Remove Vehicle"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT VEHICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveVehicle} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-forest">
              {editingVehicle ? `Edit Vehicle: ${editingVehicle.name}` : 'Add New Vehicle to Fleet'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Vehicle Model / Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="e.g. Toyota KDH Super GL Luxury Van"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Vehicle Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  >
                    <option value="car">Car / Sedan</option>
                    <option value="van">Van (High-Roof)</option>
                    <option value="suv">SUV / 4x4 Jeep</option>
                    <option value="bus">Luxury Mini-Coach / Bus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Rental Rate (USD / Day)</label>
                  <input
                    type="number"
                    min={20}
                    required
                    value={pricePerDayUSD}
                    onChange={(e) => setPricePerDayUSD(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Passenger Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Luggage Bags</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={luggage}
                    onChange={(e) => setLuggage(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Vehicle Photo URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  required
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="Dual AC, Reclining Seats, WiFi, Cool Box"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-forest text-safari-gold rounded-xl font-bold shadow-xs hover:bg-forest/90"
              >
                Save Vehicle Record
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
