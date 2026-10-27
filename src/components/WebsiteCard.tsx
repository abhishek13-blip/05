import React, { useState } from 'react';
import {
  ExternalLink,
  Globe,
  Settings,
  Share2,
  Shield,
  Play,
  Users,
  FileText,
  Wrench,
  Check,
  AlertCircle
} from 'lucide-react';
import { WebsiteItem } from '../types';

interface WebsiteCardProps {
  item: WebsiteItem;
  isOwnerAuthenticated: boolean;
  onOpenWebsite: (url: string) => void;
  onConfigureUrl: (item: WebsiteItem) => void;
  onEdit: (item: WebsiteItem) => void;
  onShare: (item: WebsiteItem) => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({
  item,
  isOwnerAuthenticated,
  onOpenWebsite,
  onConfigureUrl,
  onEdit,
  onShare,
}) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const isConfigured = Boolean(item.url && item.url.trim().length > 0);

  const getDomainLabel = (url?: string): string => {
    if (!url) return 'URL Pending Configuration';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getCategoryIcon = () => {
    switch (item.category) {
      case 'Official':
        return <Shield className="w-3.5 h-3.5 text-[#7c3aed]" />;
      case 'Media':
        return <Play className="w-3.5 h-3.5 text-[#7c3aed]" />;
      case 'Community':
        return <Users className="w-3.5 h-3.5 text-[#7c3aed]" />;
      case 'Resources':
        return <FileText className="w-3.5 h-3.5 text-[#7c3aed]" />;
      case 'Tools':
        return <Wrench className="w-3.5 h-3.5 text-[#7c3aed]" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-[#7c3aed]" />;
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className="group relative flex flex-col justify-between rounded-3xl bg-white border border-[#ede9fe] hover:border-[#c4b5fd] shadow-md shadow-[#7c3aed]/5 hover:shadow-xl hover:shadow-[#7c3aed]/10 transition-all duration-300 overflow-hidden"
      aria-label={item.title}
    >
      {/* Visual Header / Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#ede9fe] border-b border-[#ede9fe]">
        {item.thumbnailUrl && !imageError ? (
          <img
            src={item.thumbnailUrl}
            alt={`${item.title} preview`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#f8f6fe] to-[#ede9fe] text-center">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#c4b5fd] flex items-center justify-center text-[#7c3aed] mb-2 shadow-sm">
              {getCategoryIcon()}
            </div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#7c3aed]">
              {item.category} Destination
            </span>
          </div>
        )}

        {/* Soft scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Category & Badge Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#ede9fe] text-[11px] font-semibold text-[#7c3aed] shadow-xs">
            {getCategoryIcon()}
            <span>{item.category}</span>
          </div>
          {item.priceOrBadge && (
            <div className="px-2.5 py-1 rounded-full bg-[#7c3aed]/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
              {item.priceOrBadge}
            </div>
          )}
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleShareClick}
            type="button"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#ede9fe] hover:border-[#7c3aed] flex items-center justify-center text-[#7c3aed] transition-colors shadow-xs"
            title="Share destination"
            aria-label={`Share ${item.title}`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          
          {/* Owner-Only Editing Affordance */}
          {isOwnerAuthenticated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              type="button"
              className="w-8 h-8 rounded-full bg-[#7c3aed] text-white hover:bg-[#6d28d9] flex items-center justify-center transition-colors shadow-xs"
              title="Edit card details"
              aria-label={`Configure ${item.title}`}
            >
              <Settings className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Domain or Status Line */}
          <div className="flex items-center gap-2 text-xs text-[#6b5b95] mb-2 truncate">
            {isConfigured ? (
              <span className="truncate font-mono font-medium text-[#7c3aed]">
                {getDomainLabel(item.url)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#9ca3af]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>URL Pending Setup</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#2e1065] tracking-tight leading-snug mb-2 group-hover:text-[#7c3aed] transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#4c1d95]/75 leading-relaxed line-clamp-3 mb-4">
            {item.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[#ede9fe] mt-2">
          {isConfigured ? (
            <button
              onClick={() => onOpenWebsite(item.url!)}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 min-h-[46px] cursor-pointer"
              aria-label={`Open website: ${item.title}`}
            >
              <span>Open Website</span>
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          ) : isOwnerAuthenticated ? (
            <button
              onClick={() => onConfigureUrl(item)}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#ede9fe] hover:bg-[#ddd6fe] text-[#7c3aed] font-semibold text-xs sm:text-sm transition-all min-h-[46px] cursor-pointer active:scale-95"
              aria-label={`Configure destination URL for ${item.title}`}
            >
              <Settings className="w-4 h-4 text-[#7c3aed]" />
              <span>Configure Destination URL</span>
            </button>
          ) : (
            <div className="w-full py-3 px-4 rounded-full bg-[#f8f6fe] text-center text-xs text-[#9ca3af] font-medium min-h-[46px] flex items-center justify-center">
              Destination URL Pending Setup
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
