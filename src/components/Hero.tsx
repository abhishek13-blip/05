import React from 'react';
import { ArrowDown, Search, ShieldCheck, Globe, Zap } from 'lucide-react';

interface HeroProps {
  headline: string;
  subheadline: string;
  badge?: string;
  heroImage?: string;
  heroBannerImage?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  configuredCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  headline,
  subheadline,
  badge,
  heroImage,
  heroBannerImage,
  searchQuery,
  onSearchChange,
  totalCount,
  configuredCount,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 md:pt-16 md:pb-20 border-b border-[#ede9fe] bg-[#f8f6fe]">
      {/* Optional ambient background banner image */}
      {heroBannerImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${heroBannerImage})` }}
        />
      )}

      {/* Gentle ambient light violet blur */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-[#c4b5fd]/25 blur-[120px] rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Search & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Soft Violet Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ede9fe] border border-[#c4b5fd] text-xs font-semibold uppercase tracking-wider text-[#7c3aed] mb-4 w-fit shadow-xs">
              <span>{badge || 'Verified Gateway · MPZ Ecosystem'}</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2e1065] leading-[1.08] mb-4 text-balance">
              {headline || 'MPZ OFFICIAL HUB'}
            </h1>

            {/* Subheadline Prose */}
            <p className="text-base sm:text-lg text-[#5b21b6]/85 leading-relaxed max-w-2xl mb-8">
              {subheadline ||
                'The verified central digital gateway connecting you directly to official MPZ web applications, digital portals, and verified media channels.'}
            </p>

            {/* Light Violet Search Bar */}
            <div className="max-w-xl mb-6">
              <label htmlFor="hub-search-input" className="sr-only">
                Search website destinations
              </label>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-[#7c3aed] pointer-events-none" />
                <input
                  id="hub-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search portals, destinations, topics..."
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 rounded-2xl text-sm sm:text-base text-[#2e1065] placeholder-[#9ca3af] transition-all shadow-sm min-h-[50px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 px-2.5 py-1 text-xs text-[#7c3aed] hover:text-[#5b21b6] bg-[#ede9fe] rounded-lg transition-colors font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#websites-directory"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white font-semibold text-sm transition-all min-h-[46px] shadow-sm active:scale-95"
              >
                <span>Explore Directory</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#social-channels"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#ede9fe] text-[#7c3aed] border border-[#ede9fe] transition-all text-sm font-semibold min-h-[46px] active:scale-95 shadow-xs"
              >
                <span>Official Channels</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#6b5b95] pt-8 border-t border-[#ede9fe] mt-8 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7c3aed]" />
                <span>Verified Destinations</span>
              </div>
              <span aria-hidden="true" className="text-[#c4b5fd] hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#7c3aed]" />
                <span>{configuredCount} Configured / {totalCount} Total Links</span>
              </div>
              <span aria-hidden="true" className="text-[#c4b5fd] hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#7c3aed]" />
                <span>Instant Redirection</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-[#ede9fe] bg-white shadow-xl shadow-[#7c3aed]/5 group">
              <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] relative w-full overflow-hidden bg-[#ede9fe]">
                <img
                  key={heroImage || 'default'}
                  src={heroImage || '/src/assets/images/hero_mpz_hub_1793040007636.jpg'}
                  alt="MPZ OFFICIAL HUB Architectural Nexus Visualization"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-500"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/src/assets/images/hero_mpz_hub_1793040007636.jpg') {
                      target.src = '/src/assets/images/hero_mpz_hub_1793040007636.jpg';
                    }
                  }}
                />
                
                {/* Soft gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/70 via-transparent to-transparent pointer-events-none" />

                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2 bg-[#2e1065]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-semibold text-white tracking-wide uppercase text-[10px]">Official MPZ Gateway</span>
                  </div>
                  <span className="text-white/90 text-[11px] font-medium drop-shadow-sm">Primary Directory</span>
                </div>
              </div>

              {/* Bottom Card Strip */}
              <div className="p-4 sm:p-5 bg-white border-t border-[#ede9fe] flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[#2e1065]">Direct & Authenticated</div>
                  <div className="text-xs text-[#6b5b95]">Zero counterfeit links or unverified routing</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#7c3aed]">{configuredCount} LIVE</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
