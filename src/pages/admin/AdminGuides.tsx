import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { adminDataService, type GuideMember } from '../../services/adminDataService';

export const AdminGuides: React.FC = () => {
  const { formatPrice } = useSettings();
  const [guides, setGuides] = useState<GuideMember[]>(() => adminDataService.getGuides());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideMember | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState(7);
  const [languagesStr, setLanguagesStr] = useState('English, German');
  const [specializationsStr, setSpecializationsStr] = useState('Cultural Heritage, Wildlife & Safari');
  const [dailyRateUSD, setDailyRateUSD] = useState(50);

  const handleOpenAdd = () => {
    setEditingGuide(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setLicenseNumber('SLTDA-GUIDE-889');
    setExperienceYears(8);
    setLanguagesStr('English, German, French');
    setSpecializationsStr('Cultural Heritage, Botanical & Tea, Wildlife');
    setDailyRateUSD(50);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: GuideMember) => {
    setEditingGuide(g);
    setFullName(g.fullName);
    setEmail(g.email);
    setPhone(g.phone);
    setLicenseNumber(g.licenseNumber);
    setExperienceYears(g.experienceYears);
    setLanguagesStr(g.languages.join(', '));
    setSpecializationsStr(g.specializations.join(', '));
    setDailyRateUSD(g.dailyRateUSD);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string, status: GuideMember['status']) => {
    const updated = adminDataService.updateGuide(id, { status });
    setGuides(prev => prev.map(g => g.id === id ? updated : g));
  };

  const handleSaveGuide = (e: React.FormEvent) => {
    e.preventDefault();
    const languages = languagesStr.split(',').map(s => s.trim()).filter(Boolean);
    const specializations = specializationsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingGuide) {
      const updated = adminDataService.updateGuide(editingGuide.id, {
        fullName,
        email,
        phone,
        licenseNumber,
        experienceYears,
        languages,
        specializations,
        dailyRateUSD
      });
      setGuides(prev => prev.map(g => g.id === editingGuide.id ? updated : g));
    } else {
      const created = adminDataService.addGuide({
        fullName,
        email,
        phone,
        licenseNumber,
        experienceYears,
        languages,
        specializations,
        dailyRateUSD,
        rating: 4.95,
        totalTours: 0,
        status: 'available',
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + guides.length}?auto=format&fit=crop&w=200&q=80`
      });
      setGuides(prev => [created, ...prev]);
    }
    setIsModalOpen(false);
  };

  const filteredGuides = filterStatus === 'all'
    ? guides
    : guides.filter(g => g.status === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
            Certified Experts & Naturalists
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-forest">
            National Tour Guides
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            SLTDA licensed national tour guides, wildlife trackers, and multilingual cultural specialists.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-forest text-safari-gold text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-forest/90 transition-all shadow-xs self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus"></i> Register New Tour Guide
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-xs text-xs font-bold overflow-x-auto">
        {['all', 'available', 'on_tour', 'off_duty'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl capitalize transition-all whitespace-nowrap ${
              filterStatus === status ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            {status.replace('_', ' ')} ({status === 'all' ? guides.length : guides.filter(g => g.status === status).length})
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map(g => (
          <div key={g.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={g.avatarUrl}
                    alt={g.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{g.fullName}</h3>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-black mt-0.5">
                      <i className="fa-solid fa-star text-[11px]"></i>
                      <span>{g.rating}</span>
                      <span className="text-gray-400 font-normal">({g.totalTours} tours)</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Lic: {g.licenseNumber}</span>
                  </div>
                </div>

                <select
                  value={g.status}
                  onChange={(e) => handleToggleStatus(g.id, e.target.value as GuideMember['status'])}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                    g.status === 'available' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    g.status === 'on_tour' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  <option value="available">Available</option>
                  <option value="on_tour">On Tour</option>
                  <option value="off_duty">Off Duty</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Specializations Badges */}
              <div className="mt-4 flex flex-wrap gap-1">
                {g.specializations.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-phone text-forest text-xs w-4"></i>
                  {g.phone}
                </p>
                <p className="flex items-center gap-2">
                  <i className="fa-regular fa-envelope text-forest text-xs w-4"></i>
                  {g.email}
                </p>
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-language text-gray-400 text-xs w-4"></i>
                  <span className="text-gray-700 font-medium">{g.languages.join(', ')}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-xs font-black text-forest">
                {formatPrice(g.dailyRateUSD)} <span className="text-[10px] font-normal text-gray-500">/day</span>
              </span>

              <button
                onClick={() => handleOpenEdit(g)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-forest hover:text-white rounded-xl font-bold transition-all"
              >
                <i className="fa-solid fa-pen-to-square mr-1"></i> Edit Guide
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT GUIDE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveGuide} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-forest">
              {editingGuide ? `Edit Guide: ${editingGuide.fullName}` : 'Register New Tour Guide'}
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
                  placeholder="e.g. Rohana Wijesinghe"
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
                  <label className="block font-bold text-gray-700 mb-1">License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Daily Rate (USD)</label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={dailyRateUSD}
                    onChange={(e) => setDailyRateUSD(Number(e.target.value))}
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
                  placeholder="English, French, German"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Specializations (comma separated)</label>
                <input
                  type="text"
                  required
                  value={specializationsStr}
                  onChange={(e) => setSpecializationsStr(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="Wildlife Safari, Heritage, Hiking"
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
                Save Guide Record
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
