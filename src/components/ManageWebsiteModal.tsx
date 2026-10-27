import React, { useState, useEffect } from 'react';
import { X, Globe, AlertTriangle, Trash2, Check } from 'lucide-react';
import { WebsiteItem, WebsiteCategory } from '../types';
import { ImageUploadField } from './ImageUploadField';

interface ManageWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: Partial<WebsiteItem>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  initialItem?: WebsiteItem | null;
}

const CATEGORIES: WebsiteCategory[] = ['Official', 'Media', 'Community', 'Resources', 'Tools'];

export const ManageWebsiteModal: React.FC<ManageWebsiteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onUploadImage,
  initialItem,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<WebsiteCategory>('Official');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || '');
      setDescription(initialItem.description || '');
      setUrl(initialItem.url || '');
      setCategory(initialItem.category || 'Official');
      setThumbnailUrl(initialItem.thumbnailUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setUrl('');
      setCategory('Official');
      setThumbnailUrl('');
    }
    setError(null);
  }, [initialItem, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError('Website title is required.');
      return;
    }

    if (!trimmedDesc) {
      setError('Website description is required.');
      return;
    }

    if (trimmedUrl) {
      const isValid =
        trimmedUrl.startsWith('http://') ||
        trimmedUrl.startsWith('https://') ||
        trimmedUrl.startsWith('mailto:');
      if (!isValid) {
        setError('Destination URL must start with https://, http://, or mailto:');
        return;
      }
    }

    try {
      setIsSaving(true);
      await onSave({
        id: initialItem?.id,
        title: trimmedTitle,
        description: trimmedDesc,
        url: trimmedUrl,
        category,
        thumbnailUrl: thumbnailUrl.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save website details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialItem?.id || !onDelete) return;
    try {
      setIsSaving(true);
      await onDelete(initialItem.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete website.');
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2e1065]/40 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white border border-[#ede9fe] rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ede9fe] bg-[#f8f6fe]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7c3aed] flex items-center justify-center text-white">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2e1065]">
                {initialItem ? 'Configure Destination Card' : 'Add New Destination'}
              </h3>
              <p className="text-xs text-[#6b7280]">
                {initialItem ? 'Edit destination URL, metadata & photo' : 'Add an official portal to MPZ Hub'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1.5">
              Website Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MPZ Main Portal"
              className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065] placeholder-[#9ca3af] min-h-[42px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#3b0764] uppercase tracking-wider">
                Destination URL
              </label>
              <span className="text-[11px] text-[#7c3aed]">Optional if pending</span>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-domain.com or mailto:..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065] font-mono placeholder-[#9ca3af] min-h-[42px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2 py-2 text-xs font-medium rounded-xl border text-center transition-all min-h-[38px] cursor-pointer ${
                    category === cat
                      ? 'bg-[#7c3aed] text-white font-semibold border-[#7c3aed] shadow-sm'
                      : 'bg-[#f8f6fe] text-[#6b7280] border-[#ede9fe] hover:text-[#2e1065]'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider mb-1.5">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this website provides..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] rounded-xl text-sm text-[#2e1065] placeholder-[#9ca3af]"
            />
          </div>

          {/* DEDICATED IMAGE UPLOAD COMPONENT (REQUIREMENT 2 & 7) */}
          <div className="p-3.5 rounded-2xl bg-[#f8f6fe] border border-[#ede9fe]">
            <ImageUploadField
              label="Thumbnail / Logo Photo"
              value={thumbnailUrl}
              onChange={setThumbnailUrl}
              onUpload={onUploadImage}
              buttonLabel="Upload Photo"
              helpText="Upload from phone gallery or enter URL"
              placeholder="https://... or upload photo from device"
            />
          </div>

          <div className="pt-4 border-t border-[#ede9fe] flex items-center justify-between gap-3">
            {initialItem && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors min-h-[42px]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#6b7280] hover:text-[#2e1065] bg-[#f8f6fe] hover:bg-[#ede9fe] transition-colors min-h-[42px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-all min-h-[42px] shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                <span>{initialItem ? 'Save Card' : 'Create Card'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
