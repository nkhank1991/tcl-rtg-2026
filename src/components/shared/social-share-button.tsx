"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Share2, Copy, Check, X } from "lucide-react";

interface SocialShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.01a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.15 12.01C2.15 6.558 6.58 2.13 12.04 2.13c2.655 0 5.148 1.035 7.026 2.913a9.865 9.865 0 012.908 7.024c-.003 5.453-4.433 9.884-9.886 9.884zM20.52 3.449C18.247 1.226 15.237 0 12.05 0 5.463 0 .104 5.334.101 11.893a11.865 11.865 0 001.587 5.946L0 24l6.304-1.654a11.88 11.88 0 005.683 1.448h.005C18.497 23.794 23.857 18.46 23.86 11.9a11.83 11.83 0 00-3.34-8.451z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function SocialShareButton({ title, text, url }: SocialShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const supportsNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, text, url: shareUrl });
    } catch {
      // User cancelled or not supported
    }
    setIsOpen(false);
  }, [title, text, shareUrl]);

  const handleWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(`${text} ${shareUrl}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener");
    setIsOpen(false);
  }, [text, shareUrl]);

  const handleTwitter = useCallback(() => {
    const tweetText = encodeURIComponent(text);
    const tweetUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`,
      "_blank",
      "noopener"
    );
    setIsOpen(false);
  }, [text, shareUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }, [shareUrl]);

  const handleButtonClick = () => {
    // On mobile, prefer native share
    if (supportsNativeShare && window.innerWidth < 768) {
      handleNativeShare();
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleButtonClick}
        className="flex h-8 w-8 items-center justify-center rounded-full glass border border-border-default/50 text-text-muted hover:text-text-primary hover:border-border-strong transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Share"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 glass-strong rounded-xl shadow-2xl border border-border-default/50 p-2 min-w-[180px] animate-scale-in">
          {/* Close button */}
          <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-border-default/30">
            <span className="text-xs font-medium text-text-secondary">Share</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] group-hover:bg-[#25D366]/25 transition-colors">
              <WhatsAppIcon />
            </div>
            <span className="text-sm text-text-primary font-medium">WhatsApp</span>
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitter}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-colors">
              <TwitterIcon />
            </div>
            <span className="text-sm text-text-primary font-medium">X (Twitter)</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-text-secondary group-hover:bg-white/10 transition-colors">
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </div>
            <span className="text-sm text-text-primary font-medium">
              {copied ? "Copied!" : "Copy Link"}
            </span>
          </button>

          {/* Native Share (if available) */}
          {supportsNativeShare && (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tcl-red/15 text-tcl-red group-hover:bg-tcl-red/25 transition-colors">
                <Share2 className="h-4 w-4" />
              </div>
              <span className="text-sm text-text-primary font-medium">More Options</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
