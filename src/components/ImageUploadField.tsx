import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Check, Loader2, X, ExternalLink } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  helpText?: string;
  placeholder?: string;
  buttonLabel?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  onUpload,
  helpText,
  placeholder = 'https://example.com/image.jpg or /uploads/...',
  buttonLabel = 'Upload Image',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit. Please choose a smaller image.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      const uploadedUrl = await onUpload(file);
      onChange(uploadedUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#3b0764] uppercase tracking-wider">
          {label}
        </label>
        {helpText && <span className="text-[11px] text-[#7c3aed]">{helpText}</span>}
      </div>

      {/* Hidden Native File Picker for Device Gallery Integration */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
        aria-label={`Upload image for ${label}`}
      />

      {/* Dual Input Controls: URL field + Upload Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#ede9fe] focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 rounded-xl text-xs sm:text-sm text-[#2e1065] placeholder-[#9ca3af] transition-all min-h-[42px]"
          />
          <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-[#7c3aed]" />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-2.5 text-[#9ca3af] hover:text-[#7c3aed] p-0.5 rounded transition-colors"
              title="Clear image URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleTriggerUpload}
          disabled={isUploading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer shrink-0 min-h-[42px]"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : uploadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Uploaded!</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>{buttonLabel}</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
          {uploadError}
        </p>
      )}

      {/* Image Preview Card */}
      {value ? (
        <div className="relative mt-2 p-2 rounded-xl bg-[#f8f6fe] border border-[#ede9fe] flex items-center gap-3">
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#ede9fe] shrink-0 border border-[#ddd6fe]">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#7c3aed] uppercase">
                Image Configured
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-xs text-[#6b7280] font-mono truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={handleTriggerUpload}
            className="text-xs font-semibold text-[#7c3aed] hover:text-[#6d28d9] underline p-1 shrink-0"
          >
            Change Photo
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#f8f6fe] border border-dashed border-[#ddd6fe] text-[11px] text-[#6b7280]">
          <span>No image configured. Enter a link or click &ldquo;{buttonLabel}&rdquo; to choose from your device gallery.</span>
        </div>
      )}
    </div>
  );
};
