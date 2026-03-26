"use client";

import { useState, useCallback } from "react";

const SHARE_TEXT =
  "Join the Road to Greatness! TCL × Arsenal 5-a-side tournament \uD83C\uDFC6\u26BD";

const platforms = [
  {
    name: "WhatsApp",
    color: "#25D366",
    getUrl: (url: string) =>
      `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.01a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.15 12.01C2.15 6.558 6.58 2.13 12.04 2.13c2.655 0 5.148 1.035 7.026 2.913a9.865 9.865 0 012.908 7.024c-.003 5.453-4.433 9.884-9.886 9.884zM20.52 3.449C18.247 1.226 15.237 0 12.05 0 5.463 0 .104 5.334.101 11.893a11.865 11.865 0 001.587 5.946L0 24l6.304-1.654a11.88 11.88 0 005.683 1.448h.005C18.497 23.794 23.857 18.46 23.86 11.9a11.83 11.83 0 00-3.34-8.451z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    color: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    getUrl: () =>
      `https://www.instagram.com/`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "X",
    color: "#ffffff",
    textColor: "#000000",
    getUrl: (url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    color: "#000000",
    border: "1px solid #25F4EE",
    getUrl: () => `https://www.tiktok.com/`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.08a8.2 8.2 0 005.58 2.18V11.3a4.85 4.85 0 01-2.58-.73v5.01" />
      </svg>
    ),
  },
];

export function SocialShare() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleShare = useCallback(
    (getUrl: (url: string) => string) => {
      if (typeof window === "undefined") return;
      window.open(getUrl(window.location.href), "_blank", "noopener");
    },
    []
  );

  return (
    <div className="flex items-center gap-2">
      {platforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => handleShare(platform.getUrl)}
          className="social-btn flex h-11 w-11 items-center justify-center rounded-full text-white transition-all"
          style={{
            background: platform.color,
            border: (platform as { border?: string }).border || "none",
            color: (platform as { textColor?: string }).textColor || "#ffffff",
          }}
          aria-label={`Share on ${platform.name}`}
        >
          {platform.icon}
        </button>
      ))}

      {/* Copy link */}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="social-btn flex h-11 w-11 items-center justify-center rounded-full glass border border-border-default text-text-secondary transition-all hover:text-text-primary"
          aria-label="Copy link"
        >
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-green-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </button>
        {copied && (
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md glass px-2.5 py-1 text-xs font-medium text-green-400 whitespace-nowrap">
            Copied!
          </span>
        )}
      </div>
    </div>
  );
}
