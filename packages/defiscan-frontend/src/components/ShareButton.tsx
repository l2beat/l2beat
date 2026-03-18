import { useEffect, useRef, useState } from 'react'
import type { CompiledReview } from '../types'
import { reviewToMarkdown } from '../utils/exportMarkdown'

interface ShareButtonProps {
  review: CompiledReview
  onExportPdf: () => void
}

export function ShareButton({ review, onExportPdf }: ShareButtonProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedAI, setCopiedAI] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  function getShareUrl() {
    return window.location.href
  }

  function getShareText() {
    return `Check out the DeFiScan Decentralization Review for ${review.metadata.protocolName}`
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShareTwitter() {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(getShareUrl())}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setShowShareMenu(false)
  }

  function handleShareFarcaster() {
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(getShareText() + '\n' + getShareUrl())}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setShowShareMenu(false)
  }

  async function handleExportForAI() {
    const md = reviewToMarkdown(review)
    await navigator.clipboard.writeText(md)
    setCopiedAI(true)
    setTimeout(() => setCopiedAI(false), 2000)
  }

  // Close share menu on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(e.target as Node)
      ) {
        setShowShareMenu(false)
      }
    }
    if (showShareMenu) {
      document.addEventListener('mousedown', onClickOutside)
      return () => document.removeEventListener('mousedown', onClickOutside)
    }
  }, [showShareMenu])

  return (
    <div className="relative" ref={shareMenuRef}>
      <button
        type="button"
        onClick={() => setShowShareMenu((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all text-text-secondary hover:text-purple-600"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>

      {showShareMenu && (
        <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-border bg-white shadow-lg">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 rounded-t-lg px-3 py-2 text-sm text-text-primary transition-colors hover:bg-purple-50"
          >
            {copied ? (
              <svg
                className="h-4 w-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            )}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={handleShareTwitter}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary transition-colors hover:bg-purple-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </button>
          <button
            type="button"
            onClick={handleShareFarcaster}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary transition-colors hover:bg-purple-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.322 2h13.356v2.96H23v2.96h-1.61l.001 11.12c.445 0 .805.36.805.8v1.2H17.61v-1.2c0-.44.36-.8.805-.8V7.92H5.585v11.12c.445 0 .806.36.806.8v1.2H1.805v-1.2c0-.44.36-.8.805-.8l.001-11.12H1V4.96h4.322V2zm4.03 9.28c0-.44.36-.8.806-.8h3.684c.445 0 .805.36.805.8v4.44c0 .44-.36.8-.805.8h-3.684a.803.803 0 01-.806-.8v-4.44z" />
            </svg>
            Share on Farcaster
          </button>
          <div className="my-1 border-border border-t" />
          <button
            type="button"
            onClick={handleExportForAI}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary transition-colors hover:bg-purple-50"
          >
            {copiedAI ? (
              <svg
                className="h-4 w-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
            {copiedAI ? 'Copied!' : 'Copy for AI (.md)'}
          </button>
          <button
            type="button"
            onClick={() => {
              onExportPdf()
              setShowShareMenu(false)
            }}
            className="flex w-full items-center gap-2 rounded-b-lg px-3 py-2 text-sm text-text-primary transition-colors hover:bg-purple-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export PDF
          </button>
        </div>
      )}
    </div>
  )
}
