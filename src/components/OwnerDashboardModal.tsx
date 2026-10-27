import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  AlertCircle,
  Eye,
  Settings,
  Share2,
  Globe,
  Sliders,
  LogOut,
  ShieldCheck,
  Layout,
  Info,
  Loader2,
  Images,
  ShoppingBag,
  Upload,
  Edit2,
  Sparkles
} from 'lucide-react';
import {
  SocialMediaLink,
  WebsiteItem,
  SocialPlatform,
  HubCustomizationSettings,
  WebsiteCategory,
  WebsitePhoto
} from '../types';
import { detectPlatform, formatPlatformName, isValidSocialUrl, SocialIcon } from '../utils/socialDetector';
import { ImageUploadField } from './ImageUploadField';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  socialLinks: SocialMediaLink[];
  onSaveSocialLinks: (links: SocialMediaLink[]) => Promise<void>;
  websites: WebsiteItem[];
  onSaveWebsite: (data: Partial<WebsiteItem>) => Promise<void>;
  onDeleteWebsite: (id: string) => Promise<void>;
  hubSettings: HubCustomizationSettings;
  onSaveHubSettings: (settings: HubCustomizationSettings) => Promise<void>;
  photos: WebsitePhoto[];
  onSavePhotos: (photos: WebsitePhoto[]) => Promise<void>;
  onUploadImage: (file: File, options?: { section?: string; title?: string }) => Promise<string>;
  onLogout: () => void;
}

type TabKey = 'branding' | 'photos' | 'products' | 'hero' | 'about' | 'social' | 'security';

const ALL_PLATFORMS: SocialPlatform[] = [
  'telegram',
  'youtube',
  'instagram',
  'x',
  'discord',
  'github',
  'facebook',
  'tiktok',
  'linkedin',
  'custom',
];

const CATEGORIES: WebsiteCategory[] = ['Official', 'Media', 'Community', 'Resources', 'Tools'];

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
  socialLinks,
  onSaveSocialLinks,
  websites,
  onSaveWebsite,
  onDeleteWebsite,
  hubSettings,
  onSaveHubSettings,
  photos,
  onSavePhotos,
  onUploadImage,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('branding');
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // --- 1. WEBSITE BRANDING STATE ---
  const [brandName, setBrandName] = useState(hubSettings.brandName || 'MPZ OFFICIAL HUB');
  const [logoUrl, setLogoUrl] = useState(hubSettings.logoUrl || '');

  // --- 2. WEBSITE PHOTOS STATE ---
  const [localPhotos, setLocalPhotos] = useState<WebsitePhoto[]>(photos || []);
  const [editingPhoto, setEditingPhoto] = useState<WebsitePhoto | null>(null);

  // --- 3. PRODUCTS & WEBSITES STATE ---
  const [localWebsites, setLocalWebsites] = useState<WebsiteItem[]>(websites || []);
  const [editingProduct, setEditingProduct] = useState<WebsiteItem | null>(null);

  // --- 4. HERO & ABOUT STATE ---
  const [heroHeadline, setHeroHeadline] = useState(hubSettings.heroHeadline || 'MPZ OFFICIAL HUB');
  const [heroSubheadline, setHeroSubheadline] = useState(hubSettings.heroSubheadline || '');
  const [heroBadge, setHeroBadge] = useState(hubSettings.heroBadge || 'Verified Gateway · MPZ Ecosystem');
  const [heroImage, setHeroImage] = useState(hubSettings.heroImage || '');
  const [heroBannerImage, setHeroBannerImage] = useState(hubSettings.heroBannerImage || '');
  const [aboutTitle, setAboutTitle] = useState(hubSettings.aboutTitle || 'The Purpose of MPZ OFFICIAL HUB');
  const [aboutDescription, setAboutDescription] = useState(hubSettings.aboutDescription || '');
  const [aboutImage, setAboutImage] = useState(hubSettings.aboutImage || '');
  const [footerNotice, setFooterNotice] = useState(hubSettings.footerNotice || '');

  // --- 5. SOCIAL MEDIA STATE ---
  const [localSocialLinks, setLocalSocialLinks] = useState<SocialMediaLink[]>(socialLinks);
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [manualPlatform, setManualPlatform] = useState<SocialPlatform | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);

  // Sync state when opened or props update
  React.useEffect(() => {
    setBrandName(hubSettings.brandName || 'MPZ OFFICIAL HUB');
    setLogoUrl(hubSettings.logoUrl || '');
    setHeroHeadline(hubSettings.heroHeadline || 'MPZ OFFICIAL HUB');
    setHeroSubheadline(hubSettings.heroSubheadline || '');
    setHeroBadge(hubSettings.heroBadge || 'Verified Gateway · MPZ Ecosystem');
    setHeroImage(hubSettings.heroImage || '');
    setHeroBannerImage(hubSettings.heroBannerImage || '');
    setAboutTitle(hubSettings.aboutTitle || 'The Purpose of MPZ OFFICIAL HUB');
    setAboutDescription(hubSettings.aboutDescription || '');
    setAboutImage(hubSettings.aboutImage || '');
    setFooterNotice(hubSettings.footerNotice || '');
    setLocalSocialLinks(socialLinks);
    setLocalPhotos(photos || []);
    setLocalWebsites(websites || []);
  }, [isOpen, hubSettings, socialLinks, photos, websites]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveFeedback(msg);
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  // 1. Save Website Branding (Logo & Brand Name)
  const handleSaveBranding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveHubSettings({
        ...hubSettings,
        brandName: brandName.trim(),
        logoUrl: logoUrl.trim(),
      });
      showNotification('Website Branding (Logo & Brand Name) saved permanently!');
    } catch (err: any) {
      alert(err.message || 'Failed to save branding.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = async (newUrl: string) => {
    setLogoUrl(newUrl);
    try {
      await onSaveHubSettings({
        ...hubSettings,
        brandName: brandName.trim(),
        logoUrl: newUrl.trim(),
      });
      showNotification('Logo updated and applied across website header & footer!');
    } catch (err: any) {
      console.error('Failed to auto-save logo:', err);
    }
  };

  // 2. Photo Manager Actions
  const handleAddOrUploadPhoto = async (file: File) => {
    try {
      const url = await onUploadImage(file, { section: 'general', title: file.name });
      const newPhoto: WebsitePhoto = {
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        url,
        title: file.name.replace(/\.[^/.]+$/, ''),
        section: 'general',
        dateUploaded: new Date().toISOString().split('T')[0],
      };
      const updated = [newPhoto, ...localPhotos];
      setLocalPhotos(updated);
      await onSavePhotos(updated);
      showNotification('New website photo uploaded and saved.');
      return url;
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo.');
      throw err;
    }
  };

  const handleDeletePhoto = async (id: string) => {
    const updated = localPhotos.filter((p) => p.id !== id);
    setLocalPhotos(updated);
    await onSavePhotos(updated);
    showNotification('Photo deleted successfully.');
  };

  const handleUpdatePhotoDetails = async (id: string, updates: Partial<WebsitePhoto>) => {
    const updated = localPhotos.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setLocalPhotos(updated);
    await onSavePhotos(updated);
    showNotification('Photo details updated.');
    setEditingPhoto(null);
  };

  // 3. Product / Website Link Actions
  const handleDeleteProduct = async (id: string) => {
    const updated = localWebsites.filter((p) => p.id !== id);
    setLocalWebsites(updated);
    await onDeleteWebsite(id);
    showNotification('Destination link deleted successfully.');
  };

  const handleUpdateProduct = async (data: Partial<WebsiteItem>) => {
    if (!data.id) return;
    const updated = localWebsites.map((item) =>
      item.id === data.id ? { ...item, ...data } : item
    );
    setLocalWebsites(updated);
    await onSaveWebsite(data);
  };

  const handleAddNewProduct = async () => {
    const newProduct: WebsiteItem = {
      id: `mpz-prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: 'New Official Tool / Portal',
      description: 'Official digital release and service.',
      category: 'Official',
      url: '',
      thumbnailUrl: '',
      priceOrBadge: 'Official',
      dateAdded: new Date().toISOString().split('T')[0],
    };
    const updated = [newProduct, ...localWebsites];
    setLocalWebsites(updated);
    await onSaveWebsite(newProduct);
    showNotification('New destination link added. Customize it below.');
  };

  // 4. Hero & About Actions
  const handleHeroImageChange = async (newUrl: string) => {
    setHeroImage(newUrl);
    try {
      await onSaveHubSettings({
        ...hubSettings,
        heroHeadline: heroHeadline.trim(),
        heroSubheadline: heroSubheadline.trim(),
        heroBadge: heroBadge.trim(),
        heroImage: newUrl.trim(),
        heroBannerImage: heroBannerImage.trim(),
      });
      showNotification('Hero image updated and applied to live website!');
    } catch (err: any) {
      console.error('Failed to auto-save hero image:', err);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveHubSettings({
        ...hubSettings,
        heroHeadline: heroHeadline.trim(),
        heroSubheadline: heroSubheadline.trim(),
        heroBadge: heroBadge.trim(),
        heroImage: heroImage.trim(),
        heroBannerImage: heroBannerImage.trim(),
      });
      showNotification('Hero section saved permanently!');
    } catch (err: any) {
      alert(err.message || 'Failed to save hero section.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveHubSettings({
        ...hubSettings,
        aboutTitle: aboutTitle.trim(),
        aboutDescription: aboutDescription.trim(),
        aboutImage: aboutImage.trim(),
        footerNotice: footerNotice.trim(),
      });
      showNotification('About section & footer saved permanently!');
    } catch (err: any) {
      alert(err.message || 'Failed to save about section.');
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Social Links Actions
  const detectedPlatform = manualPlatform || detectPlatform(newSocialUrl);

  const handleAddSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSocialError(null);

    const validation = isValidSocialUrl(newSocialUrl);
    if (!validation.valid) {
      setSocialError(validation.reason || 'Invalid URL address.');
      return;
    }

    const platform = manualPlatform || detectPlatform(newSocialUrl);
    const newLink: SocialMediaLink = {
      id: `soc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      platform,
      url: newSocialUrl.trim(),
      label: newSocialLabel.trim() || `Official ${formatPlatformName(platform)}`,
      enabled: true,
      order: localSocialLinks.length + 1,
    };

    const updated = [...localSocialLinks, newLink];
    setLocalSocialLinks(updated);
    await onSaveSocialLinks(updated);
    setNewSocialUrl('');
    setNewSocialLabel('');
    setManualPlatform(null);
    showNotification(`Added ${formatPlatformName(platform)} channel.`);
  };

  const handleToggleSocialEnable = async (id: string) => {
    const updated = localSocialLinks.map((l) =>
      l.id === id ? { ...l, enabled: !l.enabled } : l
    );
    setLocalSocialLinks(updated);
    await onSaveSocialLinks(updated);
  };

  const handleUpdateSocialField = async (id: string, field: 'url' | 'label', value: string) => {
    const updated = localSocialLinks.map((l) => {
      if (l.id === id) {
        const item = { ...l, [field]: value };
        if (field === 'url') item.platform = detectPlatform(value);
        return item;
      }
      return l;
    });
    setLocalSocialLinks(updated);
    await onSaveSocialLinks(updated);
  };

  const handleMoveSocialLink = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localSocialLinks.length) return;

    const copy = [...localSocialLinks];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reordered = copy.map((l, i) => ({ ...l, order: i + 1 }));
    setLocalSocialLinks(reordered);
    await onSaveSocialLinks(reordered);
  };

  const handleDeleteSocialLink = async (id: string) => {
    const updated = localSocialLinks.filter((l) => l.id !== id);
    setLocalSocialLinks(updated);
    await onSaveSocialLinks(updated);
    showNotification('Social media link removed.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2e1065]/40 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#ffffff] border border-[#ede9fe] rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ede9fe] bg-[#f8f6fe]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7c3aed] flex items-center justify-center text-white shadow-sm">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#2e1065] tracking-tight">
                  MPZ Owner Dashboard
                </h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#7c3aed] border border-[#c4b5fd]">
                  Authorized Owner Session
                </span>
              </div>
              <p className="text-xs text-[#6b7280]">
                A-to-Z Centralized Customization Engine for MPZ OFFICIAL HUB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f8f6fe] hover:bg-[#ede9fe] text-[#7c3aed] hover:text-[#5b21b6] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Banner */}
        {saveFeedback && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#ede9fe] bg-[#fbfaff] px-6 gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'branding'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-[#6b7280] hover:text-[#2e1065]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>WEBSITE BRANDING</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-[#6b7280] hover:text-[#2e1065]'
            }`}
          >
            <Images className="w-4 h-4" />
            <span>WEBSITE PHOTO MANAGER ({localPhotos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-[#6b7280] hover:text-[#2e1065]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>PRODUCTS & DESTINATIONS ({websites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'hero'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-[#6b7280] hover:text-[#2e1065]'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>HERO & BANNERS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-[#6b7280] hover:text-[#2e1065]'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>ABOUT & FOOTER</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'social'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-[#6b7280] hover:text-[#2e1065]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>SOCIAL MEDIA LINKS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-[#6b7280] hover:text-[#2e1065]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SECURITY</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: WEBSITE BRANDING (REQUIREMENT 2) */}
          {/* ======================================================== */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-[#2e1065] mb-1">
                  Website Branding & Identity
                </h3>
                <p className="text-xs text-[#6b7280]">
                  Upload a new official logo image, replace the existing logo, preview the logo, and update the website brand name.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1.5">
                  Website Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. MPZ OFFICIAL HUB"
                  className="w-full px-4 py-3 bg-white border border-[#ede9fe] focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 rounded-xl text-sm font-bold text-[#2e1065] min-h-[44px]"
                />
                <p className="text-[11px] text-[#6b7280] mt-1">
                  Updates the brand name in the header, hero, footer, and page title.
                </p>
              </div>

              {/* LOGO UPLOAD & REPLACEMENT CONTROL WITH PREVIEW */}
              <div className="p-5 rounded-2xl bg-[#f8f6fe] border border-[#ede9fe] space-y-4">
                <ImageUploadField
                  label="Official Website Logo"
                  value={logoUrl}
                  onChange={handleLogoChange}
                  onUpload={async (file) => onUploadImage(file, { section: 'logo', title: 'Official Logo' })}
                  buttonLabel="Upload Logo"
                  helpText="Upload from phone gallery or enter URL"
                  placeholder="https://... or upload logo from device"
                />

                {/* Logo Live Preview */}
                {logoUrl && (
                  <div className="pt-3 border-t border-[#ede9fe]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#7c3aed] mb-2">
                      <Eye className="w-4 h-4" />
                      <span>Logo Live Header Preview</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-[#ede9fe] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f8f6fe] border border-[#ede9fe] flex items-center justify-center overflow-hidden p-1">
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm uppercase text-[#2e1065]">
                          {brandName || 'MPZ OFFICIAL HUB'}
                        </span>
                        <p className="text-[10px] text-emerald-700 font-medium">Ready to display across header & footer</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save Branding Changes</span>
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: WEBSITE PHOTO MANAGER (REQUIREMENT 3) */}
          {/* ======================================================== */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#2e1065] mb-1">
                    Website Photo Manager
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    View all photos currently used on the website, upload new photos directly from your device gallery, replace, edit, or delete them.
                  </p>
                </div>

                {/* Direct Upload New Photo to Gallery */}
                <div className="relative">
                  <input
                    type="file"
                    id="photo-manager-file-input"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await handleAddOrUploadPhoto(file);
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-manager-file-input"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload New Photo</span>
                  </label>
                </div>
              </div>

              {/* Photo Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group rounded-2xl bg-white border border-[#ede9fe] overflow-hidden shadow-xs hover:border-[#c4b5fd] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-[#f8f6fe] overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold text-[#7c3aed] uppercase border border-[#ede9fe]">
                        {photo.section}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#2e1065] truncate">{photo.title}</h4>
                        <span className="text-[10px] text-[#9ca3af] font-mono">{photo.dateUploaded}</span>
                      </div>

                      <p className="text-[11px] text-[#6b7280] font-mono truncate">{photo.url}</p>

                      <div className="pt-2 border-t border-[#ede9fe] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingPhoto(photo)}
                          className="inline-flex items-center gap-1 text-xs text-[#7c3aed] hover:text-[#5b21b6] font-semibold cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Photo Edit Submodal */}
              {editingPhoto && (
                <div className="p-5 rounded-2xl bg-[#f8f6fe] border border-[#c4b5fd] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#2e1065] uppercase">Edit Photo Details</h4>
                    <button
                      type="button"
                      onClick={() => setEditingPhoto(null)}
                      className="text-xs text-[#6b7280] hover:text-[#2e1065]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3b0764] mb-1">Title</label>
                      <input
                        type="text"
                        value={editingPhoto.title}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#ede9fe] rounded-xl text-xs text-[#2e1065]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#3b0764] mb-1">Section Assignment</label>
                      <select
                        value={editingPhoto.section}
                        onChange={(e) =>
                          setEditingPhoto({
                            ...editingPhoto,
                            section: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#ede9fe] rounded-xl text-xs text-[#2e1065]"
                      >
                        <option value="hero">Hero Showcase</option>
                        <option value="banner">Hero Banner</option>
                        <option value="about">About Showcase</option>
                        <option value="logo">Brand Logo</option>
                        <option value="products">Product / Destination</option>
                        <option value="general">General Asset</option>
                      </select>
                    </div>
                  </div>

                  {/* Replace Photo Control */}
                  <ImageUploadField
                    label="Replace Image File"
                    value={editingPhoto.url}
                    onChange={(newUrl) => setEditingPhoto({ ...editingPhoto, url: newUrl })}
                    onUpload={async (file) => onUploadImage(file, { section: editingPhoto.section, title: editingPhoto.title })}
                    buttonLabel="Upload Replacement"
                    helpText="Pick replacement from gallery"
                  />

                  <button
                    type="button"
                    onClick={() => handleUpdatePhotoDetails(editingPhoto.id, editingPhoto)}
                    className="px-4 py-2 rounded-xl bg-[#7c3aed] text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Save Photo Details
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PRODUCT MANAGEMENT (REQUIREMENT 4) */}
          {/* ======================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#2e1065] mb-1">
                    Product & Destination Management
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    Add, edit product names, upload product photos, update pricing badges, and manage destinations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewProduct}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="space-y-4">
                {localWebsites.map((product, index) => (
                  <div
                    key={product.id}
                    className="p-5 rounded-2xl bg-white border border-[#ede9fe] shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ede9fe]">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#ede9fe] text-[#7c3aed] text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={product.title}
                          onChange={(e) => handleUpdateProduct({ id: product.id, title: e.target.value })}
                          className="text-sm font-bold text-[#2e1065] bg-transparent border-b border-transparent hover:border-[#c4b5fd] focus:border-[#7c3aed] focus:outline-none w-64"
                          placeholder="Product Name"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={product.category}
                          onChange={(e) => handleUpdateProduct({ id: product.id, category: e.target.value as WebsiteCategory })}
                          className="text-xs font-semibold px-2.5 py-1.5 bg-[#f8f6fe] border border-[#ede9fe] rounded-lg text-[#7c3aed] focus:outline-none"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#3b0764] uppercase mb-1">
                          Destination / Buy Link URL
                        </label>
                        <input
                          type="text"
                          value={product.url || ''}
                          onChange={(e) => handleUpdateProduct({ id: product.id, url: e.target.value })}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 bg-[#f8f6fe] border border-[#ede9fe] rounded-xl text-xs text-[#2e1065] font-mono focus:outline-none focus:border-[#7c3aed]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3b0764] uppercase mb-1">
                          Product Tag / Price Badge
                        </label>
                        <input
                          type="text"
                          value={product.priceOrBadge || ''}
                          onChange={(e) => handleUpdateProduct({ id: product.id, priceOrBadge: e.target.value })}
                          placeholder="e.g. Free Access / Official Portal"
                          className="w-full px-3 py-2 bg-[#f8f6fe] border border-[#ede9fe] rounded-xl text-xs text-[#2e1065] focus:outline-none focus:border-[#7c3aed]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#3b0764] uppercase mb-1">
                          Product Description
                        </label>
                        <input
                          type="text"
                          value={product.description}
                          onChange={(e) => handleUpdateProduct({ id: product.id, description: e.target.value })}
                          placeholder="Brief product explanation"
                          className="w-full px-3 py-2 bg-[#f8f6fe] border border-[#ede9fe] rounded-xl text-xs text-[#2e1065] focus:outline-none focus:border-[#7c3aed]"
                        />
                      </div>
                    </div>

                    {/* PRODUCT IMAGE WITH DEDICATED UPLOAD BUTTON */}
                    <div className="pt-2">
                      <ImageUploadField
                        label="Product Image / Photo"
                        value={product.thumbnailUrl || ''}
                        onChange={(newUrl) => handleUpdateProduct({ id: product.id, thumbnailUrl: newUrl })}
                        onUpload={async (file) => onUploadImage(file, { section: 'products', title: product.title })}
                        buttonLabel="Upload Photo"
                        helpText="Select from gallery or enter URL"
                        placeholder="https://... or upload photo from device"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: HERO & BANNERS */}
          {/* ======================================================== */}
          {activeTab === 'hero' && (
            <form onSubmit={handleSaveHero} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#2e1065] mb-1">
                  Hero Section & Visual Customization
                </h3>
                <p className="text-xs text-[#6b7280]">
                  Configure hero headlines, badge text, and background banners.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1">
                    Dominant Hero Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm font-bold text-[#2e1065] min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1">
                    Hero Badge / Kicker Text
                  </label>
                  <input
                    type="text"
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065] min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1">
                  Hero Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={heroSubheadline}
                  onChange={(e) => setHeroSubheadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f6fe] border border-[#ede9fe]">
                <ImageUploadField
                  label="Hero Showcase Visual Image"
                  value={heroImage}
                  onChange={handleHeroImageChange}
                  onUpload={async (file) => onUploadImage(file, { section: 'hero', title: 'Hero Showcase' })}
                  buttonLabel="Upload Image"
                  helpText="Supported formats: JPG, PNG, WebP"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f6fe] border border-[#ede9fe]">
                <ImageUploadField
                  label="Hero Background Banner Image"
                  value={heroBannerImage}
                  onChange={(newUrl) => {
                    setHeroBannerImage(newUrl);
                    onSaveHubSettings({ ...hubSettings, heroBannerImage: newUrl.trim() });
                  }}
                  onUpload={async (file) => onUploadImage(file, { section: 'banner', title: 'Hero Banner' })}
                  buttonLabel="Upload Banner"
                  helpText="Displays as an ambient background pattern"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save Hero Changes</span>
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 5: ABOUT SECTION & FOOTER */}
          {/* ======================================================== */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveAbout} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#2e1065] mb-1">
                  About Section & Footer Settings
                </h3>
                <p className="text-xs text-[#6b7280]">
                  Customize introductory prose, showcase photography, and footer notices.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1">
                  About Section Title
                </label>
                <input
                  type="text"
                  required
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm font-bold text-[#2e1065] min-h-[42px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1">
                  About Section Description
                </label>
                <textarea
                  rows={4}
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#f8f6fe] border border-[#ede9fe]">
                <ImageUploadField
                  label="About Section Showcase Image"
                  value={aboutImage}
                  onChange={setAboutImage}
                  onUpload={async (file) => onUploadImage(file, { section: 'about', title: 'About Showcase' })}
                  buttonLabel="Upload Image"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1">
                  Footer Notice / Description
                </label>
                <input
                  type="text"
                  value={footerNotice}
                  onChange={(e) => setFooterNotice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065] min-h-[42px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save About Changes</span>
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 6: SOCIAL MEDIA LINKS */}
          {/* ======================================================== */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#2e1065] mb-1">
                  Social Media Links Configuration
                </h3>
                <p className="text-xs text-[#6b7280]">
                  Add your Telegram channel, YouTube channel, and other media links.
                </p>
              </div>

              {socialError && (
                <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{socialError}</span>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-[#f8f6fe] border border-[#ede9fe] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#3b0764] uppercase tracking-wider">
                    Add Channel or Profile Link
                  </h4>
                  {newSocialUrl && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#c4b5fd] text-xs text-[#7c3aed]">
                      <span>Recognized:</span>
                      <div className="flex items-center gap-1 font-semibold text-[#2e1065]">
                        <SocialIcon platform={detectedPlatform} className="w-3.5 h-3.5 text-[#7c3aed]" />
                        <span>{formatPlatformName(detectedPlatform)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddSocialLink} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[#3b0764] uppercase font-semibold mb-1">
                      Channel or Profile URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        required
                        value={newSocialUrl}
                        onChange={(e) => {
                          setNewSocialUrl(e.target.value);
                          setSocialError(null);
                        }}
                        placeholder="e.g. https://t.me/mpzofficial or https://youtube.com/@mpzhub"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065] placeholder-[#9ca3af] min-h-[42px]"
                      />
                      <div className="absolute left-3 top-3 text-[#7c3aed]">
                        <SocialIcon platform={detectedPlatform} className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#3b0764] uppercase font-semibold mb-1">
                        Display Label
                      </label>
                      <input
                        type="text"
                        value={newSocialLabel}
                        onChange={(e) => setNewSocialLabel(e.target.value)}
                        placeholder={`e.g. Official ${formatPlatformName(detectedPlatform)}`}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065] placeholder-[#9ca3af] min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#3b0764] uppercase font-semibold mb-1">
                        Manual Platform Override
                      </label>
                      <select
                        value={manualPlatform || ''}
                        onChange={(e) => setManualPlatform(e.target.value ? (e.target.value as SocialPlatform) : null)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065] min-h-[42px]"
                      >
                        <option value="">Auto-Detect from URL</option>
                        {ALL_PLATFORMS.map((p) => (
                          <option key={p} value={p}>
                            {formatPlatformName(p)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs uppercase tracking-wider transition-all min-h-[42px] cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save & Add Social Channel</span>
                  </button>
                </form>
              </div>

              {/* Configured List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#3b0764] uppercase tracking-wider flex items-center justify-between">
                  <span>Configured Channels ({localSocialLinks.length})</span>
                </h4>

                {localSocialLinks.length > 0 ? (
                  <div className="space-y-2.5">
                    {localSocialLinks.map((link, idx) => (
                      <div
                        key={link.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          link.enabled
                            ? 'bg-white border-[#ede9fe] shadow-sm'
                            : 'bg-[#fbfaff] border-dashed border-[#ddd6fe] opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#ede9fe] flex items-center justify-center text-[#7c3aed] shrink-0">
                            <SocialIcon platform={link.platform} className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => handleUpdateSocialField(link.id, 'label', e.target.value)}
                                className="text-sm font-semibold text-[#2e1065] bg-transparent border-b border-transparent hover:border-[#c4b5fd] focus:border-[#7c3aed] focus:outline-none max-w-xs truncate"
                              />
                              <span className="text-[10px] text-[#7c3aed] font-mono">
                                ({formatPlatformName(link.platform)})
                              </span>
                            </div>

                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => handleUpdateSocialField(link.id, 'url', e.target.value)}
                              placeholder="Destination URL"
                              className="w-full text-xs text-[#6b7280] bg-transparent border-b border-transparent hover:border-[#c4b5fd] focus:border-[#7c3aed] focus:outline-none font-mono truncate"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleSocialEnable(link.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                              link.enabled
                                ? 'bg-[#ede9fe] text-[#7c3aed] hover:bg-[#ddd6fe]'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {link.enabled ? 'Active' : 'Disabled'}
                          </button>

                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSocialLink(idx, 'up')}
                            className="w-8 h-8 rounded-lg bg-[#f8f6fe] hover:bg-[#ede9fe] disabled:opacity-30 disabled:pointer-events-none text-[#7c3aed] flex items-center justify-center transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            disabled={idx === localSocialLinks.length - 1}
                            onClick={() => handleMoveSocialLink(idx, 'down')}
                            className="w-8 h-8 rounded-lg bg-[#f8f6fe] hover:bg-[#ede9fe] disabled:opacity-30 disabled:pointer-events-none text-[#7c3aed] flex items-center justify-center transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSocialLink(link.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#6b7280] p-4 rounded-xl bg-[#f8f6fe] border border-[#ede9fe] text-center">
                    No social media links added yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: OWNER SECURITY */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-5 max-w-lg">
              <div>
                <h3 className="text-base font-bold text-[#2e1065] mb-1">
                  Owner Security & Session Management
                </h3>
                <p className="text-xs text-[#6b7280]">
                  Google Account authentication verified. All operations protected with server-side authorization.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f8f6fe] border border-[#ede9fe] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6b7280] font-medium">Session Status:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Authenticated & Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6b7280] font-medium">Privacy Protection:</span>
                  <span className="text-[#7c3aed]">Confidential credentials hidden from public interface</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider transition-all min-h-[42px] cursor-pointer shadow-sm active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Lock & Sign Out of Owner Dashboard</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
