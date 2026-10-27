import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, Compass, Lock, Sliders } from 'lucide-react';

interface HeaderProps {
  brandName: string;
  logoUrl?: string;
  onAddWebsite: () => void;
  onOpenOwnerDashboard: () => void;
  onOpenOwnerLogin: () => void;
  isOwnerAuthenticated: boolean;
  totalWebsitesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  brandName,
  logoUrl,
  onAddWebsite,
  onOpenOwnerDashboard,
  onOpenOwnerLogin,
  isOwnerAuthenticated,
  totalWebsitesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#ede9fe] shadow-sm'
          : 'bg-[#f8f6fe]/90 backdrop-blur-md border-b border-[#ede9fe]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 gap-6">
          
          {/* Brand Wordmark & Logo */}
          <a
            href="#"
            className="flex items-center gap-3 text-[#2e1065] font-bold tracking-tight whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c3aed] rounded-xl p-1"
            aria-label={`${brandName} Home`}
          >
            {logoUrl ? (
              <div className="w-8 h-8 rounded-xl bg-white border border-[#ede9fe] flex items-center justify-center overflow-hidden p-0.5 shadow-xs">
                <img
                  src={logoUrl}
                  alt={`${brandName} Logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#7c3aed] flex items-center justify-center text-white shadow-sm group-hover:bg-[#6d28d9] transition-colors">
                <Compass className="w-4.5 h-4.5 text-white" />
              </div>
            )}
            <span className="tracking-wide uppercase font-extrabold text-sm sm:text-base text-[#2e1065]">
              {brandName || 'MPZ OFFICIAL HUB'}
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#6b5b95]">
            <a
              href="#websites-directory"
              className="hover:text-[#7c3aed] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Destinations
            </a>
            <a
              href="#about-hub"
              className="hover:text-[#7c3aed] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              About
            </a>
            <a
              href="#social-channels"
              className="hover:text-[#7c3aed] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Official Channels
            </a>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isOwnerAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onAddWebsite}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full bg-[#ede9fe] hover:bg-[#ddd6fe] text-[#7c3aed] transition-all min-h-[40px] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenOwnerDashboard}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white transition-all shadow-sm active:scale-95 cursor-pointer min-h-[40px]"
                  title="Open Owner Dashboard"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Owner Dashboard</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenOwnerLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white hover:bg-[#ede9fe] text-[#7c3aed] border border-[#ede9fe] transition-all min-h-[38px] cursor-pointer shadow-xs"
                title="Owner Administrative Access"
              >
                <Lock className="w-3.5 h-3.5 text-[#7c3aed]" />
                <span className="hidden sm:inline">Owner Portal</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#7c3aed] bg-white border border-[#ede9fe] active:scale-95 transition-all shadow-xs"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#ede9fe] bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1 text-sm font-semibold text-[#2e1065]">
            <a
              href="#websites-directory"
              onClick={closeMenu}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-[#f8f6fe] hover:text-[#7c3aed] transition-colors min-h-[44px]"
            >
              <span>Destinations Directory</span>
              <span className="text-xs text-[#7c3aed] font-mono font-medium">{totalWebsitesCount} links</span>
            </a>
            <a
              href="#about-hub"
              onClick={closeMenu}
              className="px-3.5 py-3 rounded-xl hover:bg-[#f8f6fe] hover:text-[#7c3aed] transition-colors min-h-[44px] flex items-center"
            >
              About MPZ Hub
            </a>
            <a
              href="#social-channels"
              onClick={closeMenu}
              className="px-3.5 py-3 rounded-xl hover:bg-[#f8f6fe] hover:text-[#7c3aed] transition-colors min-h-[44px] flex items-center"
            >
              Official Social Channels
            </a>

            <div className="pt-3 mt-2 border-t border-[#ede9fe]">
              {isOwnerAuthenticated ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      closeMenu();
                      onOpenOwnerDashboard();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold rounded-xl bg-[#7c3aed] text-white active:scale-98 transition-all min-h-[44px]"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Open Owner Dashboard</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    closeMenu();
                    onOpenOwnerLogin();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium rounded-xl bg-[#f8f6fe] text-[#7c3aed] border border-[#ede9fe] active:scale-98 transition-all min-h-[44px]"
                >
                  <Lock className="w-4 h-4 text-[#7c3aed]" />
                  <span>Owner Authentication Portal</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
