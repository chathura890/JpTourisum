import React, { useState } from 'react';
import { adminDataService, type DriverMember } from '../../services/adminDataService';

export const AdminDrivers: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverMember[]>(() => adminDataService.getDrivers());
  const vehicles = adminDataService.getVehicles();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverMember | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [languagesStr, setLanguagesStr] = useState('English, Sinhala');
  const [assignedVehicleId, setAssignedVehicleId] = useState('');

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setLicenseNumber('B-984210');
    setExperienceYears(6);
    setLanguagesStr('English, Sinhala');
    setAssignedVehicleId('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: DriverMember) => {
    setEditingDriver(d);
    setFullName(d.fullName);
    setEmail(d.email);
    setPhone(d.phone);
    setLicenseNumber(d.licenseNumber);
    setExperienceYears(d.experienceYears);
    setLanguagesStr(d.languages.join(', '));
    setAssignedVehicleId(d.assignedVehicleId || '');
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string, status: DriverMember['status']) => {
    const updated = adminDataService.updateDriver(id, { status });
    setDrivers(prev => prev.map(d => d.id === id ? updated : d));
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const languages = languagesStr.split(',').map(s => s.trim()).filter(Boolean);
    const vehicleObj = vehicles.find(v => v.id === assignedVehicleId);

    if (editingDriver) {
      const updated = adminDataService.updateDriver(editingDriver.id, {
        fullName,
        email,
        phone,
        licenseNumber,
        experienceYears,
        languages,
        assignedVehicleId: assignedVehicleId || undefined,
        assignedVehicleName: vehicleObj ? vehicleObj.name : undefined
      });
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? updated : d));
    } else {
      const created = adminDataService.addDriver({
        fullName,
        email,
        phone,
        licenseNumber,
        experienceYears,
        languages,
        assignedVehicleId: assignedVehicleId || undefined,
        assignedVehicleName: vehicleObj ? vehicleObj.name : undefined,
        rating: 4.9,
        totalTrips: 0,
        status: 'available',
        avatarUrl: `https://images.unsplash.com/photo-${1507003211169 + drivers.length}?auto=format&fit=crop&w=200&q=80`
      });
      setDrivers(prev => [created, ...prev]);
    }
    setIsModalOpen(false);
  };

  const filteredDrivers = filterStatus === 'all'
    ? drivers
    : drivers.filter(d => d.status === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
            Chauffeur & Fleet Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-forest">
            Professional Drivers Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage tourist chauffeurs, assigned vans/SUVs, and live trip progress tracking.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-forest text-safari-gold text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-forest/90 transition-all shadow-xs self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus"></i> Register New Driver
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-xs text-xs font-bold overflow-x-auto">
        {['all', 'available', 'on_trip', 'off_duty'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl capitalize transition-all whitespace-nowrap ${
              filterStatus === status ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            {status.replace('_', ' ')} ({status === 'all' ? drivers.length : drivers.filter(d => d.status === status).length})
          </button>
        ))}
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map(d => (
          <div key={d.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={d.avatarUrl}
                    alt={d.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{d.fullName}</h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black mt-0.5">
                      <i className="fa-solid fa-star text-[11px]"></i>
                      <span>{d.rating}</span>
                      <span className="text-gray-400 font-normal">({d.totalTrips} tours)</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Lic: {d.licenseNumber}</span>
                  </div>
                </div>

                <select
                  value={d.status}
                  onChange={(e) => handleToggleStatus(d.id, e.target.value as DriverMember['status'])}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                    d.status === 'available' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    d.status === 'on_trip' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  <option value="available">Available</option>
                  <option value="on_trip">On Trip</option>
                  <option value="off_duty">Off Duty</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-phone text-forest text-xs w-4"></i>
                  {d.phone}
                </p>
                <p className="flex items-center gap-2">
                  <i className="fa-regular fa-envelope text-forest text-xs w-4"></i>
                  {d.email}
                </p>
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-van-shuttle text-safari-gold text-xs w-4"></i>
                  <span className="font-bold text-gray-800">
                    {d.assignedVehicleName || 'No Vehicle Assigned'}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-language text-gray-400 text-xs w-4"></i>
                  <span className="text-gray-500">{d.languages.join(', ')}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-forest bg-forest/5 px-2.5 py-1 rounded-lg">
                {d.experienceYears} Years Exp.
              </span>

              <button
                onClick={() => handleOpenEdit(d)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-forest hover:text-white rounded-xl font-bold transition-all"
              >
                <i className="fa-solid fa-pen-to-square mr-1"></i> Edit Driver
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT DRIVER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveDriver} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-forest">
              {editingDriver ? `Edit Driver: ${editingDriver.fullName}` : 'Register New Tour Chauffeur'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="e.g. Sunil Perera"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Driving License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Spoken Languages (comma separated)</label>
                <input
                  type="text"
                  required
                  value={languagesStr}
                  onChange={(e) => setLanguagesStr(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="English, Sinhala, German"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Default Assigned Vehicle</label>
                <select
                  value={assignedVehicleId}
                  onChange={(e) => setAssignedVehicleId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  <option value="">-- No Vehicle Assigned --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.type})
                    </option>
                  ))}
                </select>
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
                Save Driver Record
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
