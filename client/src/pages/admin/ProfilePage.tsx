import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, Mail, Phone, Edit2, Pencil, ExternalLink, 
  Twitter, Instagram, Linkedin, X, Plus, Save, Upload, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    mobile: '',
    countryCode: '+1',
    role: user?.role === 'admin' ? 'Administrator' : 'Restaurant Owner',
    bio: 'Hey, I\'m an administrator specialized in managing restaurant operations and user management with extensive experience in food service technology.',
    interests: ['Restaurant Management', 'Food Service', 'Technology', 'Analytics', 'Customer Service'],
    socialMedia: {
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [showBannerSelector, setShowBannerSelector] = useState(false);
  const [selectedBannerIndex, setSelectedBannerIndex] = useState(() => {
    const saved = localStorage.getItem('selectedBannerIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Predefined banner options (5-6 SVG banners)
  const bannerOptions = [
    {
      id: 1,
      name: 'Gradient Pink Orange',
      svg: "data:image/svg+xml,%3Csvg width='800' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff6b9d;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23c44569;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f8b500;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='200' fill='url(%23grad1)'/%3E%3Ccircle cx='150' cy='100' r='40' fill='%23ffd93d' opacity='0.6'/%3E%3Ccircle cx='300' cy='80' r='30' fill='%236c5ce7' opacity='0.6'/%3E%3Ccircle cx='500' cy='120' r='35' fill='%2300d2d3' opacity='0.6'/%3E%3Ccircle cx='650' cy='70' r='25' fill='%23ff6b9d' opacity='0.6'/%3E%3C/svg%3E"
    },
    {
      id: 2,
      name: 'Purple Teal',
      svg: "data:image/svg+xml,%3Csvg width='800' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236c5ce7;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%238b5cf6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2300d2d3;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='200' fill='url(%23grad2)'/%3E%3Ccircle cx='100' cy='50' r='35' fill='%23ffffff' opacity='0.3'/%3E%3Ccircle cx='250' cy='120' r='40' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='450' cy='60' r='30' fill='%23ffffff' opacity='0.3'/%3E%3Ccircle cx='600' cy='140' r='35' fill='%23ffffff' opacity='0.25'/%3E%3Ccircle cx='700' cy='80' r='25' fill='%23ffffff' opacity='0.3'/%3E%3C/svg%3E"
    },
    {
      id: 3,
      name: 'Blue Ocean',
      svg: "data:image/svg+xml,%3Csvg width='800' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2306b6d4;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%233b82f6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231e40af;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='200' fill='url(%23grad3)'/%3E%3Ccircle cx='120' cy='100' r='45' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='320' cy='70' r='35' fill='%23ffffff' opacity='0.25'/%3E%3Ccircle cx='520' cy='130' r='40' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='680' cy='90' r='30' fill='%23ffffff' opacity='0.3'/%3E%3C/svg%3E"
    },
    {
      id: 4,
      name: 'Sunset Orange',
      svg: "data:image/svg+xml,%3Csvg width='800' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad4' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f97316;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23ea580c;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23dc2626;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='200' fill='url(%23grad4)'/%3E%3Ccircle cx='180' cy='80' r='50' fill='%23fbbf24' opacity='0.4'/%3E%3Ccircle cx='400' cy='120' r='45' fill='%23f59e0b' opacity='0.35'/%3E%3Ccircle cx='620' cy='60' r='40' fill='%23fbbf24' opacity='0.4'/%3E%3C/svg%3E"
    },
    {
      id: 5,
      name: 'Green Nature',
      svg: "data:image/svg+xml,%3Csvg width='800' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad5' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23059669;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23064730;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='200' fill='url(%23grad5)'/%3E%3Ccircle cx='150' cy='100' r='40' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='350' cy='70' r='35' fill='%23ffffff' opacity='0.25'/%3E%3Ccircle cx='550' cy='130' r='38' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='700' cy='90' r='32' fill='%23ffffff' opacity='0.3'/%3E%3C/svg%3E"
    },
    {
      id: 6,
      name: 'Rose Gold',
      svg: "data:image/svg+xml,%3Csvg width='800' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad6' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ec4899;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23f43f5e;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f97316;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='200' fill='url(%23grad6)'/%3E%3Ccircle cx='200' cy='60' r='42' fill='%23ffffff' opacity='0.25'/%3E%3Ccircle cx='380' cy='140' r='38' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='580' cy='80' r='35' fill='%23ffffff' opacity='0.3'/%3E%3Ccircle cx='720' cy='120' r='30' fill='%23ffffff' opacity='0.25'/%3E%3C/svg%3E"
    },
  ];

  const currentBanner = bannerImage || bannerOptions[selectedBannerIndex].svg;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  const handleAddInterest = () => {
    const newInterest = prompt('Enter new interest:');
    if (newInterest && newInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
    }
  };

  const handleImageUpload = (type: 'profile' | 'banner') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (type === 'profile') {
            setProfileImage(reader.result as string);
          } else {
            setBannerImage(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="py-6 pr-6 relative">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">User Profile</h1>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Edit your profile information and preferences' : 'View your profile information'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <Link 
            to={`/public/profile/${user?.id || 'me'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview
          </Link>
          <button
            onClick={() => {
              if (isEditing) {
                // Save logic here
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5"
          >
            {isEditing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile Photo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Banner Image */}
          <div className="relative h-48 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
            <img
              src={currentBanner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => setShowBannerSelector(!showBannerSelector)}
                  className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm"
                  title="Select Banner"
                >
                  <Pencil className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleImageUpload('banner')}
                  className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm"
                  title="Upload Custom Banner"
                >
                  <Upload className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            )}
            
            {/* Profile Picture Overlay */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <button
                    onClick={() => handleImageUpload('profile')}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Photo Section Content */}
          <div className="pt-14 pb-4 px-6 relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {formData.fullName || user?.name || 'User'}
                </h2>
                <p className="text-sm text-gray-600 mb-1">{formData.email || user?.email || ''}</p>
                <p className="text-xs text-gray-500">{formData.role || (user?.role === 'admin' ? 'Administrator' : 'Restaurant Owner')}</p>
              </div>
              {isEditing && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleImageUpload('profile')}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Banner Selector Swiper */}
          <AnimatePresence>
            {showBannerSelector && isEditing && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="px-6 pb-6 border-t border-gray-200 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3 mt-4">
                  <h3 className="text-xs font-semibold text-gray-900">Select Banner</h3>
                  <button
                    onClick={() => setShowBannerSelector(false)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {bannerOptions.map((banner, index) => (
                      <button
                        key={banner.id}
                        onClick={() => {
                          setSelectedBannerIndex(index);
                          setBannerImage(banner.svg);
                          localStorage.setItem('selectedBannerIndex', index.toString());
                          // Trigger custom event to update navbar
                          window.dispatchEvent(new CustomEvent('bannerChanged', { detail: { index } }));
                        }}
                        className={`flex-shrink-0 relative group ${
                          selectedBannerIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''
                        } rounded-lg overflow-hidden`}
                      >
                        <img
                          src={banner.svg}
                          alt={banner.name}
                          className="w-32 h-20 object-cover"
                        />
                        {selectedBannerIndex === index && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Save className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                          {banner.name}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const next = (selectedBannerIndex + 1) % bannerOptions.length;
                      setSelectedBannerIndex(next);
                      setBannerImage(bannerOptions[next].svg);
                      localStorage.setItem('selectedBannerIndex', next.toString());
                      window.dispatchEvent(new CustomEvent('bannerChanged', { detail: { index: next } }));
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 bg-white shadow-md rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => {
                      const prev = selectedBannerIndex === 0 ? bannerOptions.length - 1 : selectedBannerIndex - 1;
                      setSelectedBannerIndex(prev);
                      setBannerImage(bannerOptions[prev].svg);
                      localStorage.setItem('selectedBannerIndex', prev.toString());
                      window.dispatchEvent(new CustomEvent('bannerChanged', { detail: { index: prev } }));
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 bg-white shadow-md rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bio, Interests, and Social Media - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Bio</h2>
              {!isEditing ? (
                <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">{formData.bio || 'No bio added yet'}</p>
                </div>
              ) : (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tell us about yourself..."
                />
              )}
            </div>
          </motion.div>

          {/* Industry/Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Industry/Interests</h2>
              {formData.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.interests.map((interest, index) => {
                    const colors = [
                      'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
                      'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
                      'bg-gradient-to-r from-orange-500 to-red-500 text-white',
                      'bg-gradient-to-r from-green-500 to-teal-500 text-white',
                      'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
                    ];
                    const colorClass = colors[index % colors.length];
                    return (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 ${colorClass} rounded-full text-xs font-semibold shadow-sm`}
                      >
                        {interest}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveInterest(index)}
                            className="hover:opacity-80 transition-opacity ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mb-3">No interests added yet</p>
              )}
              {isEditing && (
                <button
                  onClick={handleAddInterest}
                  className="px-2.5 py-1 text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add more
                </button>
              )}
            </div>
          </motion.div>

          {/* Social Media Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 border border-gray-200 lg:col-span-2"
          >
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Social Media accounts</h2>
              
              {!isEditing ? (
                // Display View
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {formData.socialMedia.twitter && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Twitter className="w-4 h-4 text-white" />
                      </div>
                      <a
                        href={formData.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium truncate"
                      >
                        {formData.socialMedia.twitter.replace('https://', '').replace('http://', '')}
                      </a>
                    </div>
                  )}
                  {formData.socialMedia.instagram && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-100 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                      <a
                        href={formData.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-pink-600 hover:text-pink-700 font-medium truncate"
                      >
                        {formData.socialMedia.instagram.replace('https://', '').replace('http://', '')}
                      </a>
                    </div>
                  )}
                  {formData.socialMedia.linkedin && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Linkedin className="w-4 h-4 text-white" />
                      </div>
                      <a
                        href={formData.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium truncate"
                      >
                        {formData.socialMedia.linkedin.replace('https://', '').replace('http://', '')}
                      </a>
                    </div>
                  )}
                  {!formData.socialMedia.twitter && !formData.socialMedia.instagram && !formData.socialMedia.linkedin && (
                    <p className="text-xs text-gray-500 col-span-3">No social media accounts added yet</p>
                  )}
                </div>
              ) : (
                // Edit View
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                    <input
                      type="url"
                      name="social_twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/username"
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                    <input
                      type="url"
                      name="social_instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/username"
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <input
                      type="url"
                      name="social_linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button className="mt-1 px-2.5 py-1 text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add more
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
