import React from 'react';
import { Compass, ArrowUp, Lock, Shield } from 'lucide-react';

interface FooterProps {
  brandName?: string;
  logoUrl?: string;
  footerNotice?: string;
  isOwnerAuthenticated: boolean;
  onOpenOwnerLogin: () => void;
  onOpenOwnerDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  brandName,
  logoUrl,
  footerNotice,
  isOwnerAuthenticated,
  onOpenOwnerLogin,
  onOpenOwnerDashboard,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#ede9fe] bg-[#f8f6fe] text-[#6b5b95] text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        
        {/* Main Footer Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#ede9fe]">
          
          {/* Brand Wordmark & Notice */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2.5 text-[#2e1065] font-bold tracking-tight text-base mb-1.5">
              {logoUrl ? (
                <div className="w-7 h-7 rounded-lg bg-white border border-[#ede9fe] flex items-center justify-center overflow-hidden p-0.5">
                  <img
                    src={logoUrl}
                    alt={`${brandName} Logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center text-white">
                  <Compass className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="uppercase tracking-wider font-extrabold text-sm sm:text-base">
                {brandName || 'MPZ OFFICIAL HUB'}
              </span>
            </div>
            <p className="text-[#6b5b95] text-xs max-w-sm">
              {footerNotice ||
                'The verified central digital gateway uniting all official MPZ web destinations and platforms.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#6b5b95] font-semibold">
            <a href="#websites-directory" className="hover:text-[#7c3aed] transition-colors">
              Directory
            </a>
            <a href="#about-hub" className="hover:text-[#7c3aed] transition-colors">
              About
            </a>
            <a href="#social-channels" className="hover:text-[#7c3aed] transition-colors">
              Social Channels
            </a>
            {isOwnerAuthenticated ? (
              <button
                type="button"
                onClick={onOpenOwnerDashboard}
                className="text-[#7c3aed] hover:text-[#5b21b6] font-bold transition-colors cursor-pointer"
              >
                Owner Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenOwnerLogin}
                className="hover:text-[#7c3aed] transition-colors cursor-pointer text-[#7c3aed] flex items-center gap-1 font-semibold"
                title="Internal Owner Access"
              >
                <Lock className="w-3 h-3" />
                <span>Owner Portal</span>
              </button>
            )}
          </div>

          {/* Back to Top Button */}
          <div>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#ede9fe] text-[#7c3aed] border border-[#ede9fe] transition-all cursor-pointer text-xs font-semibold shadow-xs active:scale-95"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9ca3af] text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span>&copy; {new Date().getFullYear()} {brandName || 'MPZ OFFICIAL HUB'}. All rights reserved.</span>
          </div>
          <div className="text-[#9ca3af]">
            Verified Digital Gateway & Ecosystem
          </div>
        </div>

      </div>
    </footer>
  );
};
