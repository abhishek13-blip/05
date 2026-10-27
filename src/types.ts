export type WebsiteCategory = 'Official' | 'Media' | 'Community' | 'Resources' | 'Tools';

export type SocialPlatform =
  | 'telegram'
  | 'youtube'
  | 'instagram'
  | 'x'
  | 'discord'
  | 'github'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'custom';

export interface WebsiteItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  category: WebsiteCategory;
  thumbnailUrl?: string;
  iconName?: string;
  isFeatured?: boolean;
  priceOrBadge?: string;
  dateAdded: string;
}

export interface WebsitePhoto {
  id: string;
  url: string;
  title: string;
  section: 'hero' | 'banner' | 'about' | 'logo' | 'products' | 'general';
  dateUploaded: string;
}

export interface SocialMediaLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface HubCustomizationSettings {
  brandName: string;
  logoUrl?: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge?: string;
  heroImage: string;
  heroBannerImage?: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage?: string;
  footerNotice: string;
}

export interface HubData {
  hubSettings: HubCustomizationSettings;
  websites: WebsiteItem[];
  socialLinks: SocialMediaLink[];
  photos?: WebsitePhoto[];
}

export interface OwnerSession {
  token: string | null;
  isAuthenticated: boolean;
  ownerEmail?: string;
  expiresAt?: number;
}
