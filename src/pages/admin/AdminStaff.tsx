import React, { useState } from 'react';
import { adminDataService, type StaffMember } from '../../services/adminDataService';

const AVAILABLE_PERMISSIONS: { id: string; label: string; group: string }[] = [
  { id: 'bookings_view', label: 'View Bookings', group: 'Bookings' },
  { id: 'bookings_edit', label: 'Edit & Assign Bookings', group: 'Bookings' },
  { id: 'customers_view', label: 'View Customer Data', group: 'Customers' },
  { id: 'customers_edit', label: 'Manage Customer Inquiries', group: 'Customers' },
  { id: 'vehicles_view', label: 'View Vehicles Fleet', group: 'Fleet' },
  { id: 'vehicles_edit', label: 'Edit & Maintain Vehicles', group: 'Fleet' },
  { id: 'drivers_view', label: 'View Drivers Team', group: 'Crew' },
  { id: 'drivers_edit', label: 'Assign & Manage Drivers', group: 'Crew' },
  { id: 'guides_view', label: 'View Tour Guides', group: 'Crew' },
  { id: 'guides_edit', label: 'Assign Tour Guides', group: 'Crew' },
  { id: 'packages_edit', label: 'Edit Tour Packages', group: 'Catalog' },
  { id: 'cms_edit', label: 'Edit Website CMS', group: 'System' },
  { id: 'payments_view', label: 'View Payments & Invoices', group: 'Finance' },
  { id: 'reports_view', label: 'View Analytics & Reports', group: 'Finance' },
];

export const AdminStaff: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(() => adminDataService.getStaff());
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setJobPosition('Tour Coordinator');
    setDepartment('Operations');
    setSelectedPermissions(['bookings_view', 'bookings_edit', 'customers_view', 'vehicles_view', 'drivers_view', 'guides_view']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFullName(staff.fullName);
    setEmail(staff.email);
    setPhone(staff.phone);
    setJobPosition(staff.jobPosition);
    setDepartment(staff.department);
    setSelectedPermissions(staff.permissions);
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const handleToggleStatus = (id: string) => {
    const target = staffList.find(s => s.id === id);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'suspended' : 'active';
    const updated = adminDataService.updateStaff(id, { status: newStatus });
    setStaffList(prev => prev.map(s => s.id === id ? updated : s));
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      const updated = adminDataService.updateStaff(editingStaff.id, {
        fullName,
        email,
        phone,
        jobPosition,
        department,
        permissions: selectedPermissions
      });
      setStaffList(prev => prev.map(s => s.id === editingStaff.id ? updated : s));
    } else {
      const created = adminDataService.addStaff({
        fullName,
        email,
        phone,
        jobPosition,
        department,
        status: 'active',
        permissions: selectedPermissions,
        joiningDate: new Date().toISOString().split('T')[0],
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + staffList.length}?auto=format&fit=crop&w=200&q=80`
      });
      setStaffList(prev => [created, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-safari-gold block mb-1">
            Access Control & Human Resources
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-forest">
            Staff Members & Role Permissions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure granular permissions for coordinators, dispatchers, and customer service staff.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-forest text-safari-gold text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-forest/90 transition-all shadow-xs self-start sm:self-auto"
        >
          <i className="fa-solid fa-user-plus"></i> Add Staff Member
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div key={staff.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={staff.avatarUrl}
                    alt={staff.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{staff.fullName}</h3>
                    <p className="text-xs font-bold text-forest">{staff.jobPosition}</p>
                    <span className="text-[10px] text-gray-400 block">{staff.department}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  staff.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {staff.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                <p className="flex items-center gap-2">
                  <i className="fa-regular fa-envelope text-gray-400 text-xs w-4"></i>
                  {staff.email}
                </p>
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-phone text-gray-400 text-xs w-4"></i>
                  {staff.phone}
                </p>
                <p className="flex items-center gap-2 text-[11px] text-gray-400">
                  <i className="fa-regular fa-calendar text-gray-400 text-xs w-4"></i>
                  Joined: {staff.joiningDate}
                </p>
              </div>

              {/* Granular Permissions Badges */}
              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Authorized Modules ({staff.permissions.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {staff.permissions.map(perm => {
                    const def = AVAILABLE_PERMISSIONS.find(p => p.id === perm);
                    return (
                      <span key={perm} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-medium">
                        {def ? def.label : perm}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleStatus(staff.id)}
                className={`font-bold text-[11px] hover:underline ${staff.status === 'active' ? 'text-red-600' : 'text-emerald-600'}`}
              >
                {staff.status === 'active' ? 'Suspend Account' : 'Activate Account'}
              </button>

              <button
                onClick={() => handleOpenEdit(staff)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-forest hover:text-white rounded-xl font-bold transition-all"
              >
                <i className="fa-solid fa-pen-to-square mr-1"></i> Edit Permissions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT STAFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveStaff} className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-forest">
                {editingStaff ? `Edit Permissions: ${editingStaff.fullName}` : 'Add New Staff Member'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="e.g. Anuki Jayawardena"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="name@jplankatours.com"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Job Position</label>
                <input
                  type="text"
                  required
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="Tour Coordinator, Dispatcher"
                />
              </div>
            </div>

            {/* Granular Permissions Checkboxes */}
            <div className="pt-2">
              <label className="block font-bold text-forest mb-2">
                Granular Module Permissions & Authorization
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                {AVAILABLE_PERMISSIONS.map(perm => (
                  <label key={perm.id} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-white rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={() => handleTogglePermission(perm.id)}
                      className="rounded text-forest focus:ring-forest"
                    />
                    <span className="text-[11px] text-gray-800 font-medium">
                      {perm.label}
                    </span>
                  </label>
                ))}
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
                Save Staff Record
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
