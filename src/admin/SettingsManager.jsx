import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Save } from 'lucide-react';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    siteName: 'NWTN MUSICAL',
    siteDescription: 'Experience the rhythm of quality music',
    logo: null,
    favicon: null,
    primaryColor: '#d12200',
    secondaryColor: '#a51502',
    accentColor: '#f8c5c0',
    socialLinks: {
      facebook: '',
      instagram: '',
      youtube: '',
      twitter: ''
    },
    contactEmail: '',
    contactPhone: ''
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      setSettings(data);
      setLogoPreview(data.logo || '');
      setFaviconPreview(data.favicon || '');
    }
  };

  const handleFileUpload = async (file, type) => {
    const storageRef = ref(storage, `settings/${type}_${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let logoUrl = settings.logo;
      let faviconUrl = settings.favicon;

      if (settings.logoFile) {
        logoUrl = await handleFileUpload(settings.logoFile, 'logo');
      }

      if (settings.faviconFile) {
        faviconUrl = await handleFileUpload(settings.faviconFile, 'favicon');
      }

      const updatedSettings = {
        ...settings,
        logo: logoUrl,
        favicon: faviconUrl
      };

      await setDoc(doc(db, 'settings', 'general'), updatedSettings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#a51502] mb-6">Site Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              className="w-full p-2 border rounded-lg"
              rows="3"
            />
          </div>
        </div>

        {/* Logo & Favicon */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Logo & Favicon</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSettings({...settings, logoFile: file});
                  setLogoPreview(URL.createObjectURL(file));
                }}
                className="w-full p-2 border rounded-lg"
              />
              {logoPreview && (
                <img src={logoPreview} alt="Logo preview" className="mt-2 h-16 object-contain" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Favicon</label>
              <input
                type="file"
                accept="image/x-icon,image/png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSettings({...settings, faviconFile: file});
                  setFaviconPreview(URL.createObjectURL(file));
                }}
                className="w-full p-2 border rounded-lg"
              />
              {faviconPreview && (
                <img src={faviconPreview} alt="Favicon preview" className="mt-2 h-8" />
              )}
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Color Scheme</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                className="w-full h-10 p-1 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Color</label>
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                className="w-full h-10 p-1 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Accent Color</label>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                className="w-full h-10 p-1 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Social Media Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <input
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialLinks: {...settings.socialLinks, facebook: e.target.value}
                })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <input
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialLinks: {...settings.socialLinks, instagram: e.target.value}
                })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">YouTube</label>
              <input
                type="url"
                value={settings.socialLinks.youtube}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialLinks: {...settings.socialLinks, youtube: e.target.value}
                })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <input
                type="url"
                value={settings.socialLinks.twitter}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialLinks: {...settings.socialLinks, twitter: e.target.value}
                })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#d12200] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#a51502] disabled:opacity-50"
          >
            <Save size={20} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
