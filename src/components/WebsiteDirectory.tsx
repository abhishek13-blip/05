import React, { useState } from 'react';
import { WebsiteItem } from '../types';
import { WebsiteCard } from './WebsiteCard';
import { Plus, Search, RotateCcw, CheckCircle2 } from 'lucide-react';

interface WebsiteDirectoryProps {
  items: WebsiteItem[];
  searchQuery: string;
  isOwnerAuthenticated: boolean;
  onSearchChange: (q: string) => void;
  onOpenWebsite: (url: string) => void;
  onConfigureUrl: (item: WebsiteItem) => void;
  onEdit: (item: WebsiteItem) => void;
  onDelete: (id: string) => void;
  onShare: (item: WebsiteItem) => void;
  onAddNew: () => void;
}

export const WebsiteDirectory: React.FC<WebsiteDirectoryProps> = ({
  items,
  searchQuery,
  isOwnerAuthenticated,
  onSearchChange,
  onOpenWebsite,
  onConfigureUrl,
  onEdit,
  onDelete,
  onShare,
  onAddNew,
}) => {
  const [showConfiguredOnly, setShowConfiguredOnly] = useState(false);

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.url && item.url.toLowerCase().includes(query));

    const configuredMatch = !showConfiguredOnly || Boolean(item.url && item.url.trim().length > 0);

    return searchMatch && configuredMatch;
  });

  const configuredCount = items.filter((i) => Boolean(i.url && i.url.trim().length > 0)).length;

  return (
    <section id="websites-directory" className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header with "MPZ Tools" Heading (Replacing category bar) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#ede9fe]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede9fe] border border-[#c4b5fd] text-xs font-semibold uppercase tracking-wider text-[#7c3aed] mb-2 shadow-xs">
            <span>Verified Portals</span>
            <span aria-hidden="true">·</span>
            <span>MPZ Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#2e1065]">
            MPZ Tools
          </h2>
          <p className="text-sm sm:text-base text-[#6b5b95] mt-1 max-w-2xl font-medium">
            Authenticated gateways to MPZ web applications, tools, digital platforms, and verified resources.
          </p>
        </div>

        {/* Action Controls for Filter & Add */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Configured Toggle button */}
          <button
            type="button"
            onClick={() => setShowConfiguredOnly(!showConfiguredOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all min-h-[44px] border ${
              showConfiguredOnly
                ? 'bg-[#ede9fe] text-[#7c3aed] border-[#c4b5fd] shadow-sm'
                : 'bg-white text-[#6b5b95] border-[#ede9fe] hover:text-[#2e1065] hover:bg-[#f8f6fe]'
            }`}
            aria-pressed={showConfiguredOnly}
          >
            <CheckCircle2 className={`w-4 h-4 ${showConfiguredOnly ? 'text-[#7c3aed]' : 'text-[#c4b5fd]'}`} />
            <span>Configured Links ({configuredCount})</span>
          </button>

          {/* Add Website Button (ONLY for Owner) */}
          {isOwnerAuthenticated && (
            <button
              type="button"
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#7c3aed] hover:bg-[#6d28d9] text-white active:scale-95 transition-all min-h-[44px] cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Search / Filter Feedback */}
      {(searchQuery || showConfiguredOnly) && (
        <div className="flex items-center justify-between text-xs text-[#6b5b95] mb-6 bg-white border border-[#ede9fe] rounded-2xl px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2 truncate">
            <span>Showing {filteredItems.length} of {items.length} destinations</span>
            {searchQuery && (
              <span className="text-[#2e1065] font-semibold truncate">
                matching &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              setShowConfiguredOnly(false);
            }}
            className="flex items-center gap-1 text-[#7c3aed] hover:text-[#5b21b6] font-semibold underline cursor-pointer shrink-0 ml-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Cards Grid: Mobile-first 1-column, tablet 2-column, desktop 3-column */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <WebsiteCard
              key={item.id}
              item={item}
              isOwnerAuthenticated={isOwnerAuthenticated}
              onOpenWebsite={onOpenWebsite}
              onConfigureUrl={onConfigureUrl}
              onEdit={onEdit}
              onShare={onShare}
            />
          ))}

          {/* Add Card Affordance if owner is authenticated */}
          {isOwnerAuthenticated && (
            <div
              onClick={onAddNew}
              className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-[#c4b5fd] hover:border-[#7c3aed] bg-white hover:bg-[#ede9fe]/40 text-center transition-all cursor-pointer group min-h-[300px]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAddNew();
                }
              }}
              aria-label="Add new website to MPZ OFFICIAL HUB"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ede9fe] group-hover:scale-105 transition-all flex items-center justify-center text-[#7c3aed] mb-3 shadow-xs">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2e1065] mb-1">
                Add Website Destination
              </h3>
              <p className="text-xs text-[#6b5b95] max-w-xs leading-relaxed mb-4">
                Register a new official link, tool, or portal.
              </p>
              <span className="text-xs font-semibold text-[#7c3aed] group-hover:underline">
                Tap to Configure &rarr;
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white border border-[#ede9fe] my-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#ede9fe] flex items-center justify-center text-[#7c3aed] mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#2e1065] mb-2">No destinations found</h3>
          <p className="text-sm text-[#6b5b95] max-w-md mb-6 leading-relaxed">
            No websites match your current search criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              setShowConfiguredOnly(false);
            }}
            className="px-5 py-2.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold transition-all min-h-[44px]"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
