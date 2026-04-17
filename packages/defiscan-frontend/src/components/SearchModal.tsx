import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useIndex, useAllReviews } from '../data/hooks'
import { truncateAddress, stripChainPrefix, etherscanUrl } from '../utils/format'
import { ProtocolLogo } from './ProtocolLogo'
import { SearchIcon, ContractIcon, ExternalLinkIcon } from './icons'
import { useFeedbackModal } from '../contexts/FeedbackModalContext'

interface SearchModalProps {
  initialQuery: string
  onClose: () => void
}

const MAX_PROTOCOLS = 5
const MAX_CONTRACTS = 5

export function SearchModal({ initialQuery, onClose }: SearchModalProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const { openFeedback } = useFeedbackModal()
  const { data: indexData } = useIndex()
  const { data: allReviews } = useAllReviews()

  // Body scroll lock + ESC handler
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  // Auto-focus
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const protocols = indexData?.protocols ?? []

  // Set of slugs that have a compiled review (= "verified")
  const reviewedSlugs = useMemo(() => {
    const set = new Set<string>()
    if (allReviews) {
      for (const r of allReviews) {
        set.add(r.metadata.protocolSlug)
      }
    }
    return set
  }, [allReviews])

  const trimmed = query.trim().toLowerCase()

  // Filter protocols
  const protocolResults = useMemo(() => {
    if (!trimmed) return []
    return protocols.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.chain.toLowerCase().includes(trimmed) ||
        p.slug.toLowerCase().includes(trimmed) ||
        p.projectType.toLowerCase().includes(trimmed),
    )
  }, [protocols, trimmed])

  // Filter contracts across all reviews
  const contractResults = useMemo(() => {
    if (!trimmed || !allReviews) return []
    const results: {
      address: string
      name: string
      protocolSlug: string
      protocolName: string
    }[] = []
    for (const review of allReviews) {
      for (const c of review.contracts) {
        if (
          c.name.toLowerCase().includes(trimmed) ||
          stripChainPrefix(c.address).toLowerCase().includes(trimmed)
        ) {
          results.push({
            address: c.address,
            name: c.name,
            protocolSlug: review.metadata.protocolSlug,
            protocolName: review.metadata.protocolName,
          })
        }
      }
    }
    return results
  }, [allReviews, trimmed])

  const hasResults = protocolResults.length > 0 || contractResults.length > 0
  const showResults = trimmed.length > 0

  function navigateTo(path: string) {
    navigate(path)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-bg-dark/30 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[768px] px-4">
        {/* Search input */}
        <div className="bg-white rounded-sm border-b-2 border-accent-dark flex items-center gap-4 px-1 pt-1 pb-1.5 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
          <div className="pl-3">
            <SearchIcon className="h-5 w-5 text-text-muted" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search protocol name or contract address..."
            className="flex-1 py-4 px-3 text-xl font-medium text-text-primary placeholder:text-text-muted/60 focus:outline-none bg-transparent"
          />
          <div className="pr-4">
            <kbd className="bg-accent-tint text-text-secondary text-xs font-mono px-2 py-1 rounded-sm">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="bg-white shadow-[0px_12px_32px_-4px_rgba(21,28,39,0.06)] overflow-hidden">
            {hasResults ? (
              <>
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto pt-6 pb-10 px-6">
                  <div className="flex flex-col gap-10">
                    {/* Protocols section */}
                    {protocolResults.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-end justify-between px-1">
                          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.55px]">
                            Protocols
                          </span>
                          <span className="text-[11px] font-medium text-text-muted">
                            {protocolResults.length} Result{protocolResults.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {protocolResults.slice(0, MAX_PROTOCOLS).map((p) => (
                            <div
                              key={p.slug}
                              className="bg-bg-primary flex items-center justify-between p-4 cursor-pointer hover:bg-accent-tint/40 transition-colors"
                              onClick={() => navigateTo(`/protocol/${p.slug}`)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="size-10 rounded-sm border border-border/20 bg-white flex items-center justify-center p-[5px]">
                                  <ProtocolLogo
                                    slug={p.slug}
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-base font-semibold text-text-primary">
                                    {p.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="bg-accent-tint rounded-full px-2 py-0.5 text-[10px] font-bold text-text-secondary uppercase">
                                      {p.chain}
                                    </span>
                                    {reviewedSlugs.has(p.slug) && (
                                      <span className="bg-status-green rounded-full px-2 py-0.5 text-[10px] font-bold text-[#bdffdc] uppercase">
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-accent-dark uppercase tracking-[0.6px]">
                                View Report
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contracts section */}
                    {contractResults.length > 0 && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-end justify-between px-1">
                          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.55px]">
                            Contracts
                          </span>
                          <span className="text-[11px] font-medium text-text-muted">
                            {contractResults.length} Result{contractResults.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {contractResults.slice(0, MAX_CONTRACTS).map((c) => (
                            <div
                              key={`${c.protocolSlug}-${c.address}`}
                              className="bg-bg-muted flex items-center justify-between p-4"
                            >
                              <div
                                className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                                onClick={() => navigateTo(`/protocol/${c.protocolSlug}`)}
                              >
                                <div className="size-8 rounded-xl bg-accent-tint flex items-center justify-center shrink-0">
                                  <ContractIcon className="h-3.5 w-3.5 text-text-secondary" />
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className="text-sm font-medium text-text-primary truncate">
                                    {c.protocolName}: {c.name}
                                  </span>
                                  <span className="text-xs font-mono text-text-muted">
                                    {truncateAddress(c.address)}
                                  </span>
                                </div>
                              </div>
                              <a
                                href={etherscanUrl(c.address)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-accent transition-colors shrink-0 ml-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLinkIcon className="size-[18px]" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </>
            ) : (
              /* No results state */
              <div className="flex flex-col items-center justify-center p-16">
                <div className="size-16 rounded-xl bg-accent-tint-light flex items-center justify-center mb-6">
                  <SearchIcon className="size-6 text-accent-dark" />
                </div>
                <h3 className="text-lg font-bold text-text-primary tracking-[-0.45px]">
                  No results found
                </h3>
                <p className="mt-2 text-sm text-text-secondary text-center max-w-[320px]">
                  We couldn&apos;t find any protocols, contracts, or addresses
                  matching this query. Check for typos or try a different
                  network.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-8 bg-accent-dark text-white text-xs font-bold uppercase tracking-[1.2px] px-6 py-2.5 rounded-sm hover:bg-blue-800 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="bg-bg-muted flex items-center gap-4 px-6 py-3">
              <span className="text-xs italic text-text-muted">
                Don&apos;t see what you&apos;re looking for?
              </span>
              <button
                onClick={() => { onClose(); openFeedback() }}
                className="text-xs font-bold text-accent-dark uppercase tracking-[0.6px] hover:text-accent transition-colors"
              >
                Request Protocol Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
