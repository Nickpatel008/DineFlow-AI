import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserCircle, Mail, Phone, 
  Twitter, Instagram, Linkedin
} from 'lucide-react';

const PublicProfileViewPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '',
    countryCode: '+1',
    role: 'Administrator',
    bio: 'Hey, I\'m an administrator specialized in managing restaurant operations and user management with extensive experience in food service technology.',
    interests: ['Restaurant Management', 'Food Service', 'Technology', 'Analytics', 'Customer Service'],
    socialMedia: {
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    profileImage: null as string | null,
    bannerImage: null as string | null,
    selectedBannerIndex: 0,
  });

  // Predefined banner options (same as ProfilePage)
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

  const currentBanner = profileData.bannerImage || bannerOptions[profileData.selectedBannerIndex].svg;

  useEffect(() => {
    // TODO: Fetch profile data based on userId
    // For now, using mock data
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
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
            
            {/* Profile Picture Overlay */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {profileData.fullName?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photo Section Content */}
          <div className="pt-14 pb-4 px-6">
            <h3 className="text-xs font-semibold text-gray-900 mb-0.5">Profile Photo</h3>
            <p className="text-[10px] text-gray-600">This is displayed on your public profile.</p>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-200"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h2>
          
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 mb-0.5">Full Name</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profileData.fullName || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 mb-0.5">Email address</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profileData.email}</p>
              </div>
            </div>

            {profileData.mobile && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-500 mb-0.5">Mobile number</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {profileData.countryCode} {profileData.mobile}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 mb-0.5">Role</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{profileData.role}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-200"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Bio</h2>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700 leading-relaxed">{profileData.bio || 'No bio added yet'}</p>
          </div>
        </motion.div>

        {/* Industry/Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-gray-200"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Industry/Interests</h2>
          {profileData.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profileData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No interests added yet</p>
          )}
        </motion.div>

        {/* Social Media Accounts */}
        {(profileData.socialMedia.twitter || profileData.socialMedia.instagram || profileData.socialMedia.linkedin) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Social Media accounts</h2>
            
            <div className="space-y-2">
              {profileData.socialMedia.twitter && (
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Twitter className="w-4 h-4 text-blue-500" />
                  </div>
                  <a
                    href={profileData.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary-dark font-medium truncate"
                  >
                    {profileData.socialMedia.twitter}
                  </a>
                </div>
              )}
              {profileData.socialMedia.instagram && (
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-4 h-4 text-pink-500" />
                  </div>
                  <a
                    href={profileData.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary-dark font-medium truncate"
                  >
                    {profileData.socialMedia.instagram}
                  </a>
                </div>
              )}
              {profileData.socialMedia.linkedin && (
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                  </div>
                  <a
                    href={profileData.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary-dark font-medium truncate"
                  >
                    {profileData.socialMedia.linkedin}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicProfileViewPage;

