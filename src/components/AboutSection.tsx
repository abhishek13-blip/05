import React from 'react';
import { ShieldCheck, Link2, Smartphone, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  title?: string;
  description?: string;
  aboutImage?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  description,
  aboutImage,
}) => {
  return (
    <section id="about-hub" className="py-16 md:py-24 border-t border-[#ede9fe] bg-[#fbfaff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className={aboutImage ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede9fe] border border-[#c4b5fd] text-xs font-semibold uppercase tracking-wider text-[#7c3aed] mb-3 shadow-xs">
              <span>About The Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#2e1065] mb-3">
              {title || 'The Purpose of MPZ OFFICIAL HUB'}
            </h2>
            <p className="text-sm sm:text-base text-[#5b21b6]/80 leading-relaxed">
              {description ||
                'MPZ OFFICIAL HUB serves as the verified central source of truth for all MPZ operations. Every destination linked within this platform is authorized directly, guaranteeing safe routing and direct access.'}
            </p>
          </div>

          {aboutImage && (
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-[#ede9fe] bg-white shadow-lg shadow-[#7c3aed]/5 aspect-video sm:aspect-[4/3]">
                <img
                  src={aboutImage}
                  alt="MPZ Platform Showcase"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 4 Light Violet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-white border border-[#ede9fe] hover:border-[#c4b5fd] shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] flex items-center justify-center text-[#7c3aed] mb-4">
              <ShieldCheck className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <h3 className="text-base font-bold text-[#2e1065] mb-1.5">Verified Routing</h3>
            <p className="text-xs sm:text-sm text-[#6b5b95] leading-relaxed">
              Every link is confirmed by MPZ administration, eliminating fraudulent replicas.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#ede9fe] hover:border-[#c4b5fd] shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] flex items-center justify-center text-[#7c3aed] mb-4">
              <Link2 className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <h3 className="text-base font-bold text-[#2e1065] mb-1.5">Direct Launchpad</h3>
            <p className="text-xs sm:text-sm text-[#6b5b95] leading-relaxed">
              Zero interstitial tracking or redirects. Clean, immediate navigation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#ede9fe] hover:border-[#c4b5fd] shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] flex items-center justify-center text-[#7c3aed] mb-4">
              <Smartphone className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <h3 className="text-base font-bold text-[#2e1065] mb-1.5">Mobile-First Design</h3>
            <p className="text-xs sm:text-sm text-[#6b5b95] leading-relaxed">
              Optimized for smooth touch ergonomics with zero layout shifting or horizontal scroll.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#ede9fe] hover:border-[#c4b5fd] shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#ede9fe] flex items-center justify-center text-[#7c3aed] mb-4">
              <Sparkles className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <h3 className="text-base font-bold text-[#2e1065] mb-1.5">Unified Ecosystem</h3>
            <p className="text-xs sm:text-sm text-[#6b5b95] leading-relaxed">
              Continuously updated with emerging official portals, tools, and media channels.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
