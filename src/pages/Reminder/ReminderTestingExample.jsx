/**
 * Example Component: ReminderTestingExample.jsx
 * 
 * Shows how to use dummy data for testing the reminder feature
 * This component demonstrates various testing scenarios
 */

import { useEffect, useState } from 'react';
import { dummyReminders, dummyTenants } from '../utils/dummyData';
import { mockReminderService, mockTenantService } from '../utils/mockService';

// FLAG: Set ke true untuk menggunakan mock data
const USE_MOCK_DATA = true;

export function ReminderTestingExample() {
  const [reminders, setReminders] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all', // all, Aktif, Selesai
    category: 'all', // all, Pembayaran, Kontrak, Pemeliharaan
    tenantId: 'all',
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        // Using mock service
        const remindersRes = await mockReminderService.getAll();
        const tenantsRes = await mockTenantService.getAll();
        setReminders(remindersRes.data || dummyReminders);
        setTenants(tenantsRes.data || dummyTenants);
      } else {
        // Using actual data
        setReminders(dummyReminders);
        setTenants(dummyTenants);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setReminders(dummyReminders);
      setTenants(dummyTenants);
    } finally {
      setLoading(false);
    }
  };

  // Filter reminders based on selected filters
  const getFilteredReminders = () => {
    let filtered = [...reminders];

    if (filter.status !== 'all') {
      filtered = filtered.filter(r => r.status === filter.status);
    }

    if (filter.category !== 'all') {
      filtered = filtered.filter(r => r.kategori === filter.category);
    }

    if (filter.tenantId !== 'all') {
      filtered = filtered.filter(r => r.penghuni_id === parseInt(filter.tenantId));
    }

    return filtered;
  };

  // Get tenant name by ID
  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant?.nama_lengkap || 'Unknown';
  };

  // Create new reminder (for testing)
  const createTestReminder = async () => {
    try {
      const newReminder = {
        penghuni_id: 1,
        judul: `Test Reminder - ${new Date().toLocaleTimeString()}`,
        deskripsi: 'This is a test reminder created for testing purposes',
        tanggal_pengingat: new Date().toISOString(),
        kategori: 'Pembayaran',
        status: 'Aktif',
      };

      if (USE_MOCK_DATA) {
        await mockReminderService.create(newReminder);
      }

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  // Delete reminder (for testing)
  const deleteReminder = async (reminderId) => {
    try {
      if (USE_MOCK_DATA) {
        await mockReminderService.delete(reminderId);
      }
      await loadData();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  // Mark reminder as done (for testing)
  const markAsDone = async (reminderId) => {
    try {
      if (USE_MOCK_DATA) {
        await mockReminderService.update(reminderId, {
          status: 'Selesai',
          sudah_ditampilkan: true,
        });
      }
      await loadData();
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const filteredReminders = getFilteredReminders();

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Reminder Testing Example</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total Reminders</div>
          <div className="text-2xl font-bold">{reminders.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold">{reminders.filter(r => r.status === 'Aktif').length}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold">{reminders.filter(r => r.status === 'Selesai').length}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Payment Reminders</div>
          <div className="text-2xl font-bold">{reminders.filter(r => r.kategori === 'Pembayaran').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Status</option>
              <option value="Aktif">Aktif (Active)</option>
              <option value="Selesai">Selesai (Done)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Categories</option>
              <option value="Pembayaran">Pembayaran (Payment)</option>
              <option value="Kontrak">Kontrak (Contract)</option>
              <option value="Pemeliharaan">Pemeliharaan (Maintenance)</option>
            </select>
          </div>

          {/* Tenant Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Tenant</label>
            <select
              value={filter.tenantId}
              onChange={(e) => setFilter({ ...filter, tenantId: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Tenants</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.nama_lengkap}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Test Actions */}
      <div className="bg-yellow-50 p-4 rounded-lg shadow mb-6 border-l-4 border-yellow-400">
        <h2 className="text-lg font-semibold mb-3">🧪 Test Actions</h2>
        <button
          onClick={createTestReminder}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ➕ Create Test Reminder
        </button>
      </div>

      {/* Reminders List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Reminders ({filteredReminders.length})
        </h2>

        {filteredReminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reminders found matching your filters
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders.map(reminder => (
              <div
                key={reminder.id}
                className={`p-4 border rounded-lg ${
                  reminder.status === 'Selesai'
                    ? 'bg-gray-50 opacity-75'
                    : 'bg-white hover:shadow-md transition'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          reminder.status === 'Aktif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {reminder.status}
                      </span>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                        {reminder.kategori}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{reminder.judul}</h3>
                    <p className="text-gray-600">{reminder.deskripsi}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Tenant: </span>
                    <span className="font-medium">{getTenantName(reminder.penghuni_id)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reminder Date: </span>
                    <span className="font-medium">
                      {new Date(reminder.tanggal_pengingat).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created: </span>
                    <span className="font-medium">
                      {new Date(reminder.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {reminder.status === 'Aktif' && (
                    <button
                      onClick={() => markAsDone(reminder.id)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      ✓ Mark Done
                    </button>
                  )}
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                  <span className="text-xs text-gray-500 ml-auto self-center">ID: {reminder.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Debug Info</h3>
        <div className="text-xs text-gray-600 font-mono">
          <div>Total Reminders: {reminders.length}</div>
          <div>Filtered Results: {filteredReminders.length}</div>
          <div>Using Mock Data: {USE_MOCK_DATA ? '✅ Yes' : '❌ No'}</div>
          <div>Active Filter: Status={filter.status}, Category={filter.category}, Tenant={filter.tenantId}</div>
        </div>
      </div>
    </div>
  );
}

export default ReminderTestingExample;
