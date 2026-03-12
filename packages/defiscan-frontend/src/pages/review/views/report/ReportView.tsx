import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { clsx } from 'clsx'
import type { CompiledReview } from '../../../../types'
import { KeyFindings } from './KeyFindings'
import { AdminCards } from './AdminCards'
import { FundCards } from './FundCards'
import { DependencyCards } from './DependencyCards'
import { CodeSection } from './CodeSection'
import { reviewToMarkdown } from '../../../../utils/exportMarkdown'

interface ReportViewProps {
  review: CompiledReview
}

interface SectionDef {
  id: string
  title: string
}

const SECTIONS: SectionDef[] = [
  { id: 'summary', title: 'Summary' },
  { id: 'key-findings', title: 'Key Findings' },
  { id: 'funds', title: 'What Is at Stake?' },
  { id: 'admins', title: 'Who Is in Control?' },
  { id: 'dependencies', title: 'What Does It Depend On?' },
  { id: 'code', title: 'More Information' },
]

export function ReportView({ review }: ReportViewProps) {
  const [activeSection, setActiveSection] = useState<string>(
    SECTIONS[0]?.id ?? 'key-findings',
  )
  const [forceExpanded, setForceExpanded] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  function handleExportPdf() {
    flushSync(() => setForceExpanded(true))
    window.print()
  }

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

  const [copiedAI, setCopiedAI] = useState(false)

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

  // Reset forceExpanded after print dialog closes
  useEffect(() => {
    function onAfterPrint() {
      setForceExpanded(false)
    }
    window.addEventListener('afterprint', onAfterPrint)
    return () => window.removeEventListener('afterprint', onAfterPrint)
  }, [])

  // Create the IntersectionObserver once on mount
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0 && visible[0]) {
          const id = visible[0].target.getAttribute('data-section-id')
          if (id) {
            setActiveSection(id)
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    )

    return () => observerRef.current?.disconnect()
  }, [])

  // Register elements with the observer as they mount via ref callbacks
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  function registerRef(id: string, el: HTMLElement | null) {
    const observer = observerRef.current
    if (el) {
      sectionRefs.current.set(id, el)
      observer?.observe(el)
    } else {
      const prev = sectionRefs.current.get(id)
      if (prev) observer?.unobserve(prev)
      sectionRefs.current.delete(id)
    }
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Print-only branded header */}
      <div className="hidden print:block mb-8 pb-4 border-b-2 border-purple-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-600 tracking-wide uppercase mb-1">
              DeFiScan Decentralization Review
            </p>
            <h1 className="text-3xl font-bold text-text-primary">
              {review.metadata.protocolName}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {review.metadata.chain}
              {review.metadata.tokenName &&
                ` \u00B7 ${review.metadata.tokenName}`}
            </p>
          </div>
          <div className="text-right text-xs text-text-muted">
            <p>
              Generated{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Share button with dropdown — right-aligned above the nav */}
      <div className="mt-10 flex justify-end print:hidden">
        <div className="relative" ref={shareMenuRef}>
          <button
            type="button"
            onClick={() => setShowShareMenu((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 px-3 py-1.5 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50"
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
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
              <button
                type="button"
                onClick={handleShareFarcaster}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary transition-colors hover:bg-purple-50"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5.322 2h13.356v2.96H23v2.96h-1.61l.001 11.12c.445 0 .805.36.805.8v1.2H17.61v-1.2c0-.44.36-.8.805-.8V7.92H5.585v11.12c.445 0 .806.36.806.8v1.2H1.805v-1.2c0-.44.36-.8.805-.8l.001-11.12H1V4.96h4.322V2zm4.03 9.28c0-.44.36-.8.806-.8h3.684c.445 0 .805.36.805.8v4.44c0 .44-.36.8-.805.8h-3.684a.803.803 0 01-.806-.8v-4.44z" />
                </svg>
                Share on Farcaster
              </button>
              <div className="my-1 border-t border-border" />
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
                onClick={handleExportPdf}
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
      </div>

      {/* Sticky section navigation bar */}
      <nav className="mt-3 sticky top-0 z-40 -mx-4 px-4 py-3 bg-white/90 backdrop-blur-sm border-b border-border print:hidden">
        <div className="flex gap-1 overflow-x-auto">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                activeSection === section.id
                  ? 'text-purple-700 bg-purple-50'
                  : 'text-text-secondary hover:text-purple-600 hover:bg-purple-50',
              )}
              onClick={(e) => {
                e.preventDefault()
                const el = sectionRefs.current.get(section.id)
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Story sections -- generous spacing for readability */}
      <div className="mt-10 space-y-16">
        <section
          id="summary"
          data-section-id="summary"
          className="scroll-mt-20"
          ref={(el) => registerRef('summary', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">Summary</h2>
          {review.metadata.description && (
            <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
              {review.metadata.description}
            </p>
          )}
        </section>

        <section
          id="key-findings"
          data-section-id="key-findings"
          className="scroll-mt-20"
          ref={(el) => registerRef('key-findings', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Key Findings
          </h2>
          <KeyFindings review={review} />
        </section>

        <section
          id="funds"
          data-section-id="funds"
          className="scroll-mt-20"
          ref={(el) => registerRef('funds', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            What Is at Stake?
          </h2>
          <FundCards review={review} forceExpanded={forceExpanded} />
        </section>

        <section
          id="admins"
          data-section-id="admins"
          className="scroll-mt-20"
          ref={(el) => registerRef('admins', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Who Is in Control?
          </h2>
          <AdminCards review={review} forceExpanded={forceExpanded} />
        </section>

        <section
          id="dependencies"
          data-section-id="dependencies"
          className="scroll-mt-20"
          ref={(el) => registerRef('dependencies', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            What Does It Depend On?
          </h2>
          <DependencyCards review={review} forceExpanded={forceExpanded} />
        </section>

        <section
          id="code"
          data-section-id="code"
          className="scroll-mt-20"
          ref={(el) => registerRef('code', el)}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            More Information
          </h2>
          <CodeSection review={review} />
        </section>
      </div>
    </article>
  )
}
