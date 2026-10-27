/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WebsiteItem, SocialMediaLink, HubCustomizationSettings, HubData, WebsitePhoto } from './types';
import { INITIAL_WEBSITES, INITIAL_SOCIAL_LINKS } from './data/defaultWebsites';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WebsiteDirectory } from './components/WebsiteDirectory';
import { AboutSection } from './components/AboutSection';
import { SocialLinksFooter } from './components/SocialLinksFooter';
import { Footer } from './components/Footer';
import { ManageWebsiteModal } from './components/ManageWebsiteModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { Toast, ToastMessage } from './components/Toast';

const TOKEN_STORAGE_KEY = 'mpz_owner_session_token_v4';

const DEFAULT_SETTINGS: HubCustomizationSettings = {
  brandName: 'MPZ OFFICIAL HUB',
  logoUrl: '',
  heroHeadline: 'MPZ OFFICIAL HUB',
  heroSubheadline:
    'The verified digital gateway uniting all official MPZ portals, web applications, media channels, and public resources.',
  heroBadge: 'Verified Gateway · MPZ Ecosystem',
  heroImage: '/src/assets/images/hero_mpz_hub_1793040007636.jpg',
  heroBannerImage: '',
  aboutTitle: 'The Purpose of MPZ OFFICIAL HUB',
  aboutDescription:
    'MPZ OFFICIAL HUB serves as the verified central source of truth for all MPZ operations. Every destination linked within this platform is authorized directly, guaranteeing safe routing and direct access.',
  aboutImage: '/src/assets/images/mpz_portal_showcase_1793040007842.jpg',
  footerNotice: 'The verified central digital gateway uniting all official MPZ web destinations and platforms.'
};

export default function App() {
  const [websites, setWebsites] = useState<WebsiteItem[]>(INITIAL_WEBSITES);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(INITIAL_SOCIAL_LINKS);
  const [hubSettings, setHubSettings] = useState<HubCustomizationSettings>(DEFAULT_SETTINGS);
  const [photos, setPhotos] = useState<WebsitePhoto[]>([]);

  // Owner Authentication State
  const [ownerToken, setOwnerToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCardItem, setEditingCardItem] = useState<WebsiteItem | null>(null);
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: Math.random().toString(36).substring(2, 9),
      type,
      text,
    });
  }, []);

  // Fetch hub data from server on load
  const loadHubData = useCallback(async () => {
    try {
      const res = await fetch('/api/hub/data');
      if (res.ok) {
        const data: HubData = await res.json();
        if (data.websites) setWebsites(data.websites);
        if (data.socialLinks) setSocialLinks(data.socialLinks);
        if (data.hubSettings) setHubSettings({ ...DEFAULT_SETTINGS, ...data.hubSettings });
        if (data.photos) setPhotos(data.photos);
      }
    } catch {
      // Fallback in-memory
    }
  }, []);

  // Verify owner session token with server
  const verifyOwnerSession = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsOwnerAuthenticated(true);
      } else {
        setIsOwnerAuthenticated(false);
        setOwnerToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch {
      setIsOwnerAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    loadHubData();
    if (ownerToken) {
      verifyOwnerSession(ownerToken);
    }
  }, [loadHubData, ownerToken, verifyOwnerSession]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Save entire hub state to server (requires owner token)
  const saveToServer = useCallback(
    async (updatedPartial: {
      websites?: WebsiteItem[];
      socialLinks?: SocialMediaLink[];
      hubSettings?: HubCustomizationSettings;
      photos?: WebsitePhoto[];
    }) => {
      if (!ownerToken) {
        showToast('Unauthorized: Owner authentication required to save changes.', 'error');
        throw new Error('Unauthorized');
      }

      const payload = {
        websites: updatedPartial.websites !== undefined ? updatedPartial.websites : websites,
        socialLinks: updatedPartial.socialLinks !== undefined ? updatedPartial.socialLinks : socialLinks,
        hubSettings: updatedPartial.hubSettings !== undefined ? updatedPartial.hubSettings : hubSettings,
        photos: updatedPartial.photos !== undefined ? updatedPartial.photos : photos,
      };

      const res = await fetch('/api/hub/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save to server');
      }

      const resData = await res.json();
      if (resData.data) {
        if (resData.data.websites) setWebsites(resData.data.websites);
        if (resData.data.socialLinks) setSocialLinks(resData.data.socialLinks);
        if (resData.data.hubSettings) setHubSettings(resData.data.hubSettings);
        if (resData.data.photos) setPhotos(resData.data.photos);
      }
    },
    [ownerToken, websites, socialLinks, hubSettings, photos, showToast]
  );

  // Upload image to server disk (/uploads/...) with gallery file input
  const handleUploadImage = useCallback(
    async (file: File, options?: { section?: string; title?: string }): Promise<string> => {
      if (!ownerToken) {
        showToast('Unauthorized: Please authenticate as owner to upload images.', 'error');
        throw new Error('Unauthorized');
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Data = reader.result as string;
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ownerToken}`,
              },
              body: JSON.stringify({
                fileBase64: base64Data,
                fileName: file.name,
                mimeType: file.type,
                section: options?.section || 'general',
                title: options?.title || file.name,
              }),
            });

            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || 'Upload failed');
            }

            const data = await res.json();
            if (data.photoItem) {
              setPhotos((prev) => [data.photoItem, ...prev]);
            }
            showToast('Image uploaded and stored persistently.');
            resolve(data.url);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file from gallery'));
        reader.readAsDataURL(file);
      });
    },
    [ownerToken, showToast]
  );

  // Handle Opening destination URL
  const handleOpenWebsite = useCallback((url: string) => {
    if (!url || url.trim().length === 0) {
      showToast('Destination URL is not configured yet.', 'error');
      return;
    }

    try {
      if (url.startsWith('mailto:')) {
        window.location.href = url;
        return;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      showToast('Could not open destination link.', 'error');
    }
  }, [showToast]);

  // Card Management Actions
  const handleConfigureUrl = useCallback(
    (item: WebsiteItem) => {
      if (!isOwnerAuthenticated) {
        setIsOwnerAuthModalOpen(true);
        showToast('Please authenticate as owner to configure destination links.', 'info');
        return;
      }
      setEditingCardItem(item);
      setIsCardModalOpen(true);
    },
    [isOwnerAuthenticated, showToast]
  );

  const handleEditCardItem = useCallback(
    (item: WebsiteItem) => {
      if (!isOwnerAuthenticated) {
        setIsOwnerAuthModalOpen(true);
        return;
      }
      setEditingCardItem(item);
      setIsCardModalOpen(true);
    },
    [isOwnerAuthenticated]
  );

  const handleAddNewCard = useCallback(() => {
    if (!isOwnerAuthenticated) {
      setIsOwnerAuthModalOpen(true);
      return;
    }
    setEditingCardItem(null);
    setIsCardModalOpen(true);
  }, [isOwnerAuthenticated]);

  const handleSaveWebsite = useCallback(
    async (data: Partial<WebsiteItem>) => {
      let updatedWebsites: WebsiteItem[];
      if (data.id) {
        updatedWebsites = websites.map((item) =>
          item.id === data.id
            ? {
                ...item,
                title: data.title || item.title,
                description: data.description || item.description,
                url: data.url !== undefined ? data.url : item.url,
                category: data.category || item.category,
                thumbnailUrl: data.thumbnailUrl !== undefined ? data.thumbnailUrl : item.thumbnailUrl,
                priceOrBadge: data.priceOrBadge !== undefined ? data.priceOrBadge : item.priceOrBadge,
              }
            : item
        );
      } else {
        const newItem: WebsiteItem = {
          id: `mpz-link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: data.title || 'Untitled Product',
          description: data.description || '',
          url: data.url || '',
          category: data.category || 'Official',
          thumbnailUrl: data.thumbnailUrl || '',
          priceOrBadge: data.priceOrBadge || 'Official',
          dateAdded: new Date().toISOString().split('T')[0],
        };
        updatedWebsites = [newItem, ...websites];
      }

      setWebsites(updatedWebsites);
      await saveToServer({ websites: updatedWebsites });
      showToast('Product / Destination saved successfully.');
    },
    [websites, saveToServer, showToast]
  );

  const handleDeleteWebsite = useCallback(
    async (id: string) => {
      const updated = websites.filter((item) => item.id !== id);
      setWebsites(updated);
      await saveToServer({ websites: updated });
      showToast('Destination removed from hub.', 'info');
    },
    [websites, saveToServer, showToast]
  );

  // Social Links Saving
  const handleSaveSocialLinks = useCallback(
    async (newLinks: SocialMediaLink[]) => {
      setSocialLinks(newLinks);
      await saveToServer({ socialLinks: newLinks });
      showToast('Social media links saved.');
    },
    [saveToServer, showToast]
  );

  // Hub Settings Saving (Branding, Logo, Hero, About)
  const handleSaveHubSettings = useCallback(
    async (newSettings: HubCustomizationSettings) => {
      setHubSettings(newSettings);
      await saveToServer({ hubSettings: newSettings });
      showToast('Branding & settings saved permanently.');
    },
    [saveToServer, showToast]
  );

  // Photos Saving
  const handleSavePhotos = useCallback(
    async (newPhotos: WebsitePhoto[]) => {
      setPhotos(newPhotos);
      await saveToServer({ photos: newPhotos });
      showToast('Photo gallery updated.');
    },
    [saveToServer, showToast]
  );

  // Share destination
  const handleShareWebsite = useCallback(
    async (item: WebsiteItem) => {
      const targetUrl = item.url && item.url.trim().length > 0 ? item.url : window.location.href;
      if (navigator.share && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: item.title,
            text: `Check out ${item.title} on MPZ OFFICIAL HUB`,
            url: targetUrl,
          });
          showToast('Shared successfully.');
          return;
        } catch {
          // Fallback
        }
      }

      try {
        await navigator.clipboard.writeText(targetUrl);
        showToast(`Copied ${item.title} link to clipboard.`);
      } catch {
        showToast('Could not copy link.', 'error');
      }
    },
    [showToast]
  );

  // Owner Auth Handlers
  const handleOwnerLoginSuccess = (token: string) => {
    setOwnerToken(token);
    setIsOwnerAuthenticated(true);
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    showToast('Owner authorization verified successfully.');
    setIsOwnerDashboardOpen(true);
  };

  const handleOwnerLogout = async () => {
    if (ownerToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${ownerToken}` },
        });
      } catch {
        // Ignore
      }
    }
    setOwnerToken(null);
    setIsOwnerAuthenticated(false);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    showToast('Owner session closed.', 'info');
  };

  const configuredCount = websites.filter((i) => Boolean(i.url && i.url.trim().length > 0)).length;

  return (
    <div className="min-h-screen bg-[#f8f6fe] text-[#2e1065] flex flex-col font-sans selection:bg-[#ddd6fe] selection:text-[#3b0764]">
      {/* 1. Header (Three-Color Light Violet Theme with Custom Logo support) */}
      <Header
        brandName={hubSettings.brandName}
        logoUrl={hubSettings.logoUrl}
        onAddWebsite={handleAddNewCard}
        onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
        onOpenOwnerLogin={() => setIsOwnerAuthModalOpen(true)}
        isOwnerAuthenticated={isOwnerAuthenticated}
        totalWebsitesCount={websites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          headline={hubSettings.heroHeadline}
          subheadline={hubSettings.heroSubheadline}
          badge={hubSettings.heroBadge}
          heroImage={hubSettings.heroImage}
          heroBannerImage={hubSettings.heroBannerImage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={websites.length}
          configuredCount={configuredCount}
        />

        {/* 3. Reusable Website & Product Directory */}
        <WebsiteDirectory
          items={websites}
          searchQuery={searchQuery}
          isOwnerAuthenticated={isOwnerAuthenticated}
          onSearchChange={setSearchQuery}
          onOpenWebsite={handleOpenWebsite}
          onConfigureUrl={handleConfigureUrl}
          onEdit={handleEditCardItem}
          onDelete={handleDeleteWebsite}
          onShare={handleShareWebsite}
          onAddNew={handleAddNewCard}
        />

        {/* 4. About Section */}
        <AboutSection
          title={hubSettings.aboutTitle}
          description={hubSettings.aboutDescription}
          aboutImage={hubSettings.aboutImage}
        />

        {/* 5. Official Social Media Channels (Before Footer) */}
        <div id="social-channels">
          <SocialLinksFooter
            links={socialLinks}
            isOwnerAuthenticated={isOwnerAuthenticated}
            onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
          />
        </div>
      </main>

      {/* 6. Clean Three-Color Violet Footer with Custom Logo support */}
      <Footer
        brandName={hubSettings.brandName}
        logoUrl={hubSettings.logoUrl}
        footerNotice={hubSettings.footerNotice}
        isOwnerAuthenticated={isOwnerAuthenticated}
        onOpenOwnerLogin={() => setIsOwnerAuthModalOpen(true)}
        onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
      />

      {/* Owner Authentication Modal (Single Owner Gmail ID Input + Google Sign-In) */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        onSuccess={handleOwnerLoginSuccess}
      />

      {/* Complete Owner Dashboard Modal with Branding, Photo Manager, Product Manager, Hero, About, Social */}
      <OwnerDashboardModal
        isOpen={isOwnerDashboardOpen}
        onClose={() => setIsOwnerDashboardOpen(false)}
        socialLinks={socialLinks}
        onSaveSocialLinks={handleSaveSocialLinks}
        websites={websites}
        onSaveWebsite={handleSaveWebsite}
        onDeleteWebsite={handleDeleteWebsite}
        hubSettings={hubSettings}
        onSaveHubSettings={handleSaveHubSettings}
        photos={photos}
        onSavePhotos={handleSavePhotos}
        onUploadImage={handleUploadImage}
        onLogout={handleOwnerLogout}
      />

      {/* Destination / Product Card Edit Modal with Upload Photo Button */}
      <ManageWebsiteModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setEditingCardItem(null);
        }}
        onSave={handleSaveWebsite}
        onDelete={handleDeleteWebsite}
        onUploadImage={handleUploadImage}
        initialItem={editingCardItem}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
