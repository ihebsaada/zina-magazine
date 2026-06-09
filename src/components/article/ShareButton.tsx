"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareButtonProps = {
  locale: "en" | "ar";
  title: string;
  slug: string;
};

export function ShareButton({ locale, title, slug }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const t = {
    share: isRTL ? "مشاركة" : "Share",
    copyLink: isRTL ? "نسخ الرابط" : "Copy link",
    copied: isRTL ? "تم النسخ" : "Copied",
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/${locale}/articles/${slug}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
      } catch {
        // Fallback to dropdown on cancel or failure
        setIsOpen(true);
      }
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/${locale}/articles/${slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${locale}/articles/${slug}`
    : `/${locale}/articles/${slug}`;

  const shares = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
        </svg>
      ),
    },
    {
      name: "X / Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + shareUrl)}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleShare}
        className={cn(
          "flex items-center gap-3 text-[var(--color-ink-600)] hover:text-[var(--color-ink-950)] transition-colors group focus:outline-none",
          isOpen && "text-[var(--color-ink-950)]"
        )}
        aria-label={t.share}
        aria-expanded={isOpen}
      >
        <Share2
          className="h-5 w-5 transition-transform group-active:scale-90"
          strokeWidth={1.5}
        />
        <span className="sr-only sm:not-sr-only text-sm font-medium">
          {t.share}
        </span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-3 z-55 w-48 bg-[var(--color-paper)] border border-[var(--color-ink-200)] shadow-lg py-1.5 focus:outline-none",
            isRTL ? "left-0 origin-top-left" : "right-0 origin-top-right"
          )}
        >
          {/* Copy link button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-2 text-xs font-medium transition-colors",
              isRTL ? "text-right flex-row-reverse" : "text-left",
              copied
                ? "text-[var(--color-oree-dark)]"
                : "text-[var(--color-ink-700)] hover:bg-[var(--color-ink-050)] hover:text-[var(--color-ink-950)]"
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            ) : (
              <Copy className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            )}
            <span>{copied ? t.copied : t.copyLink}</span>
          </button>

          {/* Separator */}
          <div className="h-px bg-[var(--color-ink-200)]/60 my-1" />

          {/* Social shares */}
          {shares.map((share) => (
            <a
              key={share.name}
              href={share.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2 text-xs font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-ink-050)] hover:text-[var(--color-ink-950)] transition-colors",
                isRTL ? "text-right flex-row-reverse" : "text-left"
              )}
            >
              <span className="text-[var(--color-ink-500)] shrink-0">{share.icon}</span>
              <span>{share.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
