import { WebsiteItem, SocialMediaLink } from '../types';

export const INITIAL_WEBSITES: WebsiteItem[] = [
  {
    id: 'mpz-main-portal',
    title: 'MPZ Main Web Portal',
    description: 'The primary digital gateway for MPZ announcements, releases, and platform updates.',
    url: '', // Owner can configure destination URL
    category: 'Official',
    thumbnailUrl: '/src/assets/images/hero_mpz_hub_1793040007636.jpg',
    iconName: 'Globe',
    isFeatured: true,
    dateAdded: '2026-10-26'
  },
  {
    id: 'mpz-media-network',
    title: 'MPZ Media & Broadcast Network',
    description: 'Curated official broadcasts, digital media productions, and visual content streams.',
    url: '', // Owner can configure destination URL
    category: 'Media',
    thumbnailUrl: '/src/assets/images/mpz_portal_showcase_1793040007842.jpg',
    iconName: 'Play',
    isFeatured: false,
    dateAdded: '2026-10-26'
  },
  {
    id: 'mpz-community-channel',
    title: 'MPZ Community & Discussion Hub',
    description: 'Verified public community channels, user discussion boards, and verified group spaces.',
    url: '', // Owner can configure destination URL
    category: 'Community',
    thumbnailUrl: '',
    iconName: 'Users',
    isFeatured: false,
    dateAdded: '2026-10-26'
  },
  {
    id: 'mpz-digital-resources',
    title: 'MPZ Documentation & Resource Hub',
    description: 'Official repository of guidelines, brand assets, verified references, and downloadable utilities.',
    url: '', // Owner can configure destination URL
    category: 'Resources',
    thumbnailUrl: '',
    iconName: 'FileText',
    isFeatured: false,
    dateAdded: '2026-10-26'
  }
];

export const INITIAL_SOCIAL_LINKS: SocialMediaLink[] = [
  {
    id: 'soc-telegram',
    platform: 'telegram',
    url: '', // Ready for owner to configure in Owner Dashboard
    label: 'Official Telegram Channel',
    enabled: true,
    order: 1
  },
  {
    id: 'soc-youtube',
    platform: 'youtube',
    url: '', // Ready for owner to configure in Owner Dashboard
    label: 'Official YouTube Channel',
    enabled: true,
    order: 2
  }
];
