import React, { useState } from 'react';
import { adminDataService, type WebsiteCMSData } from '../../services/adminDataService';
import { type Destination, type Attraction } from '../../data/tourData';

export const AdminCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'contact' | 'destinations' | 'attractions'>('hero');
  const [cms, setCms] = useState<WebsiteCMSData>(() => adminDataService.getCMS());
  const [destinations, setDestinations] = useState<Destination[]>(() => adminDataService.getDestinations());
  const [attractions, setAttractions] = useState<Attraction[]>(() => adminDataService.getAttractions());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Attraction filter by destination
  const [selectedDestFilter, setSelectedDestFilter] = useState<string>('all');

  // Destination modal
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);

  // Attraction modal
  const [editingAttr, setEditingAttr] = useState<Attraction | null>(null);
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);

  // Save CMS changes
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    adminDataService.saveCMS(cms);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Toggle Popular Tag Destination
  const handleToggleDestPopular = (id: string) => {
    const updated = destinations.map(d => d.id === id ? { ...d, popularTag: d.popularTag ? undefined : 'Popular' } : d);
    setDestinations(updated);
    adminDataService.saveDestinations(updated);
  };

  // Delete Destination
  const handleDeleteDest = (id: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      const updated = destinations.filter(d => d.id !== id);
      setDestinations(updated);
      adminDataService.saveDestinations(updated);
    }
  };

  // Save / Update Destination Form
  const handleSaveDestModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    let updated: Destination[];
    if (destinations.some(d => d.id === editingDest.id)) {
      updated = destinations.map(d => d.id === editingDest.id ? editingDest : d);
    } else {
      updated = [...destinations, editingDest];
    }
    setDestinations(updated);
    adminDataService.saveDestinations(updated);
    setIsDestModalOpen(false);
    setEditingDest(null);
  };

  // Toggle Must-See Attraction
  const handleToggleAttrMustSee = (id: string) => {
    const updated = attractions.map(a => a.id === id ? { ...a, mustSee: !a.mustSee } : a);
    setAttractions(updated);
    adminDataService.saveAttractions(updated);
  };

  // Delete Attraction
  const handleDeleteAttr = (id: string) => {
    if (confirm('Are you sure you want to delete this attraction?')) {
      const updated = attractions.filter(a => a.id !== id);
      setAttractions(updated);
      adminDataService.saveAttractions(updated);
    }
  };

  // Save / Update Attraction Form
  const handleSaveAttrModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttr) return;
    let updated: Attraction[];
    if (attractions.some(a => a.id === editingAttr.id)) {
      updated = attractions.map(a => a.id === editingAttr.id ? editingAttr : a);
    } else {
      updated = [...attractions, editingAttr];
    }
    setAttractions(updated);
    adminDataService.saveAttractions(updated);
    setIsAttrModalOpen(false);
    setEditingAttr(null);
  };

  const filteredAttractions = selectedDestFilter === 'all'
    ? attractions
    : attractions.filter(a => a.destinationId === selectedDestFilter);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
            Content Management System (CMS)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-forest">
            Website Content & Catalog Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify homepage banners, video background, contact details, destinations and tourist attractions in real time.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold animate-in fade-in">
            <i className="fa-solid fa-circle-check"></i>
            Changes saved successfully!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-xs text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === 'hero' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'}`}
        >
          <i className="fa-solid fa-film mr-2"></i> Homepage Hero & Video
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === 'contact' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'}`}
        >
          <i className="fa-solid fa-address-book mr-2"></i> Contact & Hotlines
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === 'destinations' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'}`}
        >
          <i className="fa-solid fa-map-location-dot mr-2"></i> Destinations ({destinations.length})
        </button>
        <button
          onClick={() => setActiveTab('attractions')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeTab === 'attractions' ? 'bg-forest text-safari-gold shadow-xs' : 'text-gray-600 hover:text-black'}`}
        >
          <i className="fa-solid fa-monument mr-2"></i> Attractions ({attractions.length})
        </button>
      </div>

      {/* TAB 1: HERO & VIDEO */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveCMS} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-black text-forest">Homepage Hero Banner & Media</h3>
            <p className="text-xs text-gray-500">Configure the main headline, call-to-actions, and background video.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Hero Headline (Title)</label>
                <input
                  type="text"
                  value={cms.hero.title}
                  onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, title: e.target.value } })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest text-sm"
                  placeholder="e.g. Discover Sri Lanka's Wild Heart"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Hero Subtitle & Tagline</label>
                <textarea
                  rows={3}
                  value={cms.hero.subtitle}
                  onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, subtitle: e.target.value } })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest leading-relaxed"
                  placeholder="Describe your tour offerings in 2-3 inspiring sentences..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Primary Button Text (CTA 1)</label>
              <input
                type="text"
                value={cms.hero.ctaPrimary}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, ctaPrimary: e.target.value } })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Secondary Button Text (CTA 2)</label>
              <input
                type="text"
                value={cms.hero.ctaSecondary}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, ctaSecondary: e.target.value } })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-1.5">
                Hero Video Path / URL
                <span className="text-gray-400 font-normal ml-2">(Default: 12.mp4 located in public folder)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cms.hero.videoUrl}
                  onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, videoUrl: e.target.value } })}
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-forest text-safari-gold font-bold text-xs rounded-xl shadow-xs hover:bg-forest/90 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              Save Hero Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: CONTACT & HOTLINES */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveCMS} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-black text-forest">Official Business Contact & Emergency Hotlines</h3>
            <p className="text-xs text-gray-500">Displayed in footer, contact page, and client booking receipts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Main Office Telephone</label>
              <input
                type="text"
                value={cms.contact.phone}
                onChange={(e) => setCms({ ...cms, contact: { ...cms.contact, phone: e.target.value } })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Official WhatsApp Number</label>
              <input
                type="text"
                value={cms.contact.whatsapp}
                onChange={(e) => setCms({ ...cms, contact: { ...cms.contact, whatsapp: e.target.value } })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Support & Booking Email</label>
              <input
                type="email"
                value={cms.contact.email}
                onChange={(e) => setCms({ ...cms, contact: { ...cms.contact, email: e.target.value } })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Headquarters Address</label>
              <input
                type="text"
                value={cms.contact.address}
                onChange={(e) => setCms({ ...cms, contact: { ...cms.contact, address: e.target.value } })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Tourist Police Hotline (Sri Lanka)</label>
              <input
                type="text"
                value={cms.contact.touristHotline}
                onChange={(e) => setCms({ ...cms, contact: { ...cms.contact, touristHotline: e.target.value } })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1.5">Emergency Ambulance Hotline</label>
              <input
                type="text"
                value={cms.contact.ambulanceHotline}
                onChange={(e) => setCms({ ...cms, contact: { ...cms.contact, ambulanceHotline: e.target.value } })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-forest text-safari-gold font-bold text-xs rounded-xl shadow-xs hover:bg-forest/90 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              Save Contact Details
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: DESTINATIONS */}
      {activeTab === 'destinations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Manage Sri Lankan tourist regions available in the custom tour builder.
            </p>
            <button
              onClick={() => {
                setEditingDest({
                  id: `dest-${Date.now()}`,
                  name: '',
                  region: 'Southern',
                  image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
                  description: '',
                  popularTag: 'Popular',
                  recommendedDays: 2
                });
                setIsDestModalOpen(true);
              }}
              className="px-4 py-2 bg-forest text-safari-gold text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-forest/90 transition-all"
            >
              <i className="fa-solid fa-plus"></i> Add Destination
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map(d => (
              <div key={d.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs flex flex-col group">
                <div className="relative h-40 overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 bg-forest/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                    {d.region}
                  </div>
                  <button
                    onClick={() => handleToggleDestPopular(d.id)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      d.popularTag ? 'bg-safari-gold text-forest shadow-md' : 'bg-black/40 text-white/70 hover:text-white'
                    }`}
                    title={d.popularTag ? 'Popular Destination' : 'Standard'}
                  >
                    <i className="fa-solid fa-star text-xs"></i>
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">{d.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{d.description}</p>
                    <span className="inline-block mt-2 text-[10px] text-gray-400 font-bold">
                      {d.recommendedDays} Days Recommended
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs">
                    <span className="text-[11px] text-gray-400 font-mono">ID: {d.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingDest(d);
                          setIsDestModalOpen(true);
                        }}
                        className="p-1.5 bg-gray-100 hover:bg-forest hover:text-white rounded-lg text-gray-600 transition-all"
                        title="Edit Destination"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteDest(d.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-red-600 transition-all"
                        title="Delete Destination"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ATTRACTIONS */}
      {activeTab === 'attractions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-gray-600">Filter by Destination:</span>
              <select
                value={selectedDestFilter}
                onChange={(e) => setSelectedDestFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 font-bold text-forest text-xs focus:outline-none"
              >
                <option value="all">All Destinations ({attractions.length})</option>
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingAttr({
                  id: `attr-${Date.now()}`,
                  destinationId: destinations[0]?.id || 'galle',
                  name: '',
                  category: 'Heritage',
                  image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
                  description: '',
                  durationHours: 2,
                  entranceFeeUSD: 0,
                  mustSee: true
                });
                setIsAttrModalOpen(true);
              }}
              className="px-4 py-2 bg-forest text-safari-gold text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-forest/90 transition-all self-end sm:self-auto"
            >
              <i className="fa-solid fa-plus"></i> Add Attraction
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAttractions.map(a => {
              const destObj = destinations.find(d => d.id === a.destinationId);
              return (
                <div key={a.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs flex flex-col group">
                  <div className="relative h-36 overflow-hidden">
                    <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">
                      {destObj ? destObj.name : a.destinationId}
                    </div>
                    <button
                      onClick={() => handleToggleAttrMustSee(a.id)}
                      className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        a.mustSee ? 'bg-safari-gold text-forest shadow-md' : 'bg-black/40 text-white/70 hover:text-white'
                      }`}
                    >
                      <i className="fa-solid fa-star text-[10px]"></i>
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">{a.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-forest bg-forest/5 px-2 py-0.5 rounded">
                          <i className="fa-regular fa-clock mr-1"></i> {a.durationHours} Hours
                        </span>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {a.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs">
                      <span className="text-[10px] text-gray-400 font-mono">{a.id}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingAttr(a);
                            setIsAttrModalOpen(true);
                          }}
                          className="p-1.5 bg-gray-100 hover:bg-forest hover:text-white rounded-lg text-gray-600 transition-all"
                        >
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteAttr(a.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-red-600 transition-all"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DESTINATION EDIT MODAL */}
      {isDestModalOpen && editingDest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveDestModal} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-forest">
              {destinations.some(d => d.id === editingDest.id) ? 'Edit Destination' : 'Add New Destination'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  value={editingDest.name}
                  onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="e.g. Galle, Ella, Kandy, Sigiriya"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Region / Province</label>
                <input
                  type="text"
                  required
                  value={editingDest.region}
                  onChange={(e) => setEditingDest({ ...editingDest, region: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="e.g. Southern, Central, Uva"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingDest.image}
                  onChange={(e) => setEditingDest({ ...editingDest, image: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Recommended Stay (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  required
                  value={editingDest.recommendedDays}
                  onChange={(e) => setEditingDest({ ...editingDest, recommendedDays: Number(e.target.value) })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingDest.description}
                  onChange={(e) => setEditingDest({ ...editingDest, description: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsDestModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-forest text-safari-gold rounded-xl font-bold"
              >
                Save Destination
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ATTRACTION EDIT MODAL */}
      {isAttrModalOpen && editingAttr && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveAttrModal} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-xs">
            <h3 className="text-base font-black text-forest">
              {attractions.some(a => a.id === editingAttr.id) ? 'Edit Attraction' : 'Add New Attraction'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Belongs to Destination</label>
                <select
                  value={editingAttr.destinationId}
                  onChange={(e) => setEditingAttr({ ...editingAttr, destinationId: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Attraction Name</label>
                <input
                  type="text"
                  required
                  value={editingAttr.name}
                  onChange={(e) => setEditingAttr({ ...editingAttr, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="e.g. Galle Fort Lighthouse, Nine Arch Bridge"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Visiting Duration (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    required
                    value={editingAttr.durationHours}
                    onChange={(e) => setEditingAttr({ ...editingAttr, durationHours: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Entrance Fee (USD)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingAttr.entranceFeeUSD}
                    onChange={(e) => setEditingAttr({ ...editingAttr, entranceFeeUSD: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingAttr.image}
                  onChange={(e) => setEditingAttr({ ...editingAttr, image: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingAttr.description}
                  onChange={(e) => setEditingAttr({ ...editingAttr, description: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAttrModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-forest text-safari-gold rounded-xl font-bold"
              >
                Save Attraction
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
