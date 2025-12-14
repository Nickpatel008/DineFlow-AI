import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Building2, Mail, Phone, MapPin, Upload, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import { toast } from '../../utils/toast';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    logo: '',
  });

  useEffect(() => {
    if (user?.restaurantId) {
      fetchRestaurant();
    }
  }, [user]);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${user?.restaurantId}`);
      setRestaurant(response.data);
      setFormData({
        name: response.data.name || '',
        address: response.data.address || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
        description: response.data.description || '',
        logo: response.data.logo || '',
      });
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
      toast.error('Failed to load restaurant profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.restaurantId) return;

    setSaving(true);
    try {
      await api.put(`/restaurants/${user.restaurantId}`, formData);
      toast.success('Restaurant profile updated successfully!');
      fetchRestaurant();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-secondary mb-2">
          Restaurant Profile
        </h1>
        <p className="text-gray-600">Manage your restaurant information and settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Restaurant Logo */}
        <div className="card p-6">
          <Label className="mb-4 block">Restaurant Logo</Label>
          <div className="flex items-center gap-6">
            {formData.logo ? (
              <div className="relative">
                <img
                  src={formData.logo}
                  alt="Restaurant logo"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo: '' })}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">Enter a URL to your restaurant logo image</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-secondary mb-4">Basic Information</h2>
          
          <div>
            <Label htmlFor="name">Restaurant Name *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="pl-10"
                placeholder="Your Restaurant Name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Describe your restaurant, cuisine type, specialties..."
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold text-secondary mb-4">Contact Information</h2>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                placeholder="restaurant@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="pl-10"
                placeholder="123 Main Street, City, State, ZIP"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;

