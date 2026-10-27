import React from 'react';
import { SocialMediaLink } from '../types';
import { SocialIcon, formatPlatformName } from '../utils/socialDetector';
import { ExternalLink, Lock } from 'lucide-react';

interface SocialLinksFooterProps {
  links: SocialMediaLink[];
  isOwnerAuthenticated: boolean;
  onOpenOwnerDashboard: () => void;
}

export const SocialLinksFooter: React.FC<SocialLinksFooterProps> = ({
  links,
  isOwnerAuthenticated,
  onOpenOwnerDashboard,
}) => {
  const activeLinks = links
    .filter((link) => link.enabled && link.url && link.url.trim().length > 0)
    .sort((a, b) => a.order - b.order);

  if (activeLinks.length === 0 && !isOwnerAuthenticated) {
    return null;
  }

  return (
    <section className="w-full py-10 md:py-14 border-t border-[#ede9fe] bg-[#fbfaff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede9fe] border border-[#c4b5fd] text-xs font-semibold uppercase tracking-wider text-[#7c3aed] mb-3 shadow-xs">
          <span>Official Channels & Media</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#2e1065] tracking-tight mb-2">
          Connect With MPZ
        </h3>
        <p className="text-xs sm:text-sm text-[#6b5b95] max-w-md mx-auto mb-8 font-medium">
          Follow verified announcements, broadcasts, and community updates across our official networks.
        </p>

        {activeLinks.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-3xl mx-auto">
            {activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-white hover:bg-[#ede9fe] border border-[#ede9fe] hover:border-[#c4b5fd] transition-all duration-200 text-[#2e1065] min-h-[46px] active:scale-95 shadow-xs"
                aria-label={link.label || formatPlatformName(link.platform)}
              >
                <div className="w-7 h-7 rounded-full bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center group-hover:bg-[#7c3aed] group-hover:text-white transition-all">
                  <SocialIcon platform={link.platform} className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#2e1065]">
                  {link.label || formatPlatformName(link.platform)}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#7c3aed] opacity-60 group-hover:opacity-100 transition-opacity ml-0.5" />
              </a>
            ))}
          </div>
        ) : (
          isOwnerAuthenticated && (
            <div className="p-6 rounded-3xl bg-white border border-dashed border-[#c4b5fd] max-w-md mx-auto text-center shadow-xs">
              <p className="text-xs text-[#6b5b95] mb-3">
                No public social channels are currently configured.
              </p>
              <button
                type="button"
                onClick={onOpenOwnerDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Configure Social Media in Dashboard</span>
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
};
