import React from 'react';
import { SocialPlatform } from '../types';
import { Globe, Link2 } from 'lucide-react';

/**
 * Automatically detects the platform based on URL hostname.
 */
export function detectPlatform(inputUrl: string): SocialPlatform {
  if (!inputUrl) return 'custom';
  
  try {
    let cleanUrl = inputUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname.toLowerCase().replace('www.', '');

    if (host === 't.me' || host === 'telegram.me' || host === 'telegram.dog' || host.includes('telegram')) {
      return 'telegram';
    }
    if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com' || host.includes('youtube')) {
      return 'youtube';
    }
    if (host === 'instagram.com' || host === 'instagr.am') {
      return 'instagram';
    }
    if (host === 'x.com' || host === 'twitter.com') {
      return 'x';
    }
    if (host === 'discord.gg' || host === 'discord.com') {
      return 'discord';
    }
    if (host === 'github.com') {
      return 'github';
    }
    if (host === 'facebook.com' || host === 'fb.com' || host === 'fb.me') {
      return 'facebook';
    }
    if (host === 'tiktok.com') {
      return 'tiktok';
    }
    if (host === 'linkedin.com') {
      return 'linkedin';
    }
    return 'custom';
  } catch {
    return 'custom';
  }
}

/**
 * Validates external social media URLs.
 * Requires http:// or https:// and prevents script injection or javascript: schemes.
 */
export function isValidSocialUrl(url: string): { valid: boolean; reason?: string } {
  if (!url || !url.trim()) {
    return { valid: false, reason: 'URL cannot be empty.' };
  }
  const trimmed = url.trim();
  
  // Prevent script / data URI injection
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return { valid: false, reason: 'Unsafe URL protocol detected.' };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { valid: false, reason: 'URL must start with https:// or http://' };
    }
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { valid: false, reason: 'Please enter a valid domain address.' };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Invalid URL format. Example: https://t.me/yourchannel' };
  }
}

export function formatPlatformName(platform: SocialPlatform): string {
  switch (platform) {
    case 'telegram':
      return 'Telegram';
    case 'youtube':
      return 'YouTube';
    case 'instagram':
      return 'Instagram';
    case 'x':
      return 'X (Twitter)';
    case 'discord':
      return 'Discord';
    case 'github':
      return 'GitHub';
    case 'facebook':
      return 'Facebook';
    case 'tiktok':
      return 'TikTok';
    case 'linkedin':
      return 'LinkedIn';
    case 'custom':
    default:
      return 'Custom Link';
  }
}

interface SocialIconProps {
  platform: SocialPlatform;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'w-5 h-5' }) => {
  switch (platform) {
    case 'telegram':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="m21.5 2.5-19 9.5 7.5 3 2.5 6.5 3.5-3.5 5.5 4z" />
          <path d="M10 15 21.5 2.5" />
        </svg>
      );

    case 'youtube':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'instagram':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );

    case 'x':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case 'discord':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <path d="M7.5 4.5c2-1 7-1 9 0 0 0 2.5 6 1.5 12-2 1.5-4 1.5-5 1.5l-1-1.5c-1 0-2 0-3 0l-1 1.5c-1 0-3 0-5-1.5-1-6 1.5-12 1.5-12z" />
        </svg>
      );

    case 'github':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );

    case 'facebook':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );

    case 'tiktok':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );

    case 'linkedin':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );

    default:
      return <Globe className={className} />;
  }
}
