import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { useIndex, useAllReviews } from '../../data/hooks'
import { formatUsdValue } from '../../utils/format'
import {
  KeyIcon,
  LinkIcon,
  ShieldIcon,
  CodeIcon,
  GlobeIcon,
  ShieldCheckIcon,
} from '../../components/icons'
import { ProtocolLogo } from '../../components/ProtocolLogo'
import { useSearchModal } from '../../contexts/SearchModalContext'

const trustPostureData = [
  { axis: 'ADMIN CONTROL', value: 85 },
  { axis: 'DEPENDENCIES', value: 70 },
  { axis: 'GOVERNANCE', value: 65 },
  { axis: 'VERIFIABILITY', value: 70 },
  { axis: 'ACCESS', value: 75 },
]

const methodologyItems = [
  {
    icon: KeyIcon,
    title: 'Admin Control',
    desc: 'Exhaustive mapping of upgradeability, administrative privileges, protections, and privilege ownership.',
  },
  {
    icon: LinkIcon,
    title: 'Dependencies',
    desc: 'Analysis of underlying protocols, oracles, and infrastructure dependencies.',
  },
  {
    icon: ShieldIcon,
    title: 'Governance',
    desc: 'Assessment of the governance process, delays, and potential fund impact governance contracts can exert.',
  },
  {
    icon: CodeIcon,
    title: 'Code Verifiability',
    desc: 'Analysis of source code accessibility, documentation, and verifiability.',
  },
  {
    icon: GlobeIcon,
    title: 'Frontends',
    desc: 'Verification of accessibility of the protocol in terms of diverse frontends.',
  },
]

export function LandingPage() {
  const { openSearchModal } = useSearchModal()
  const [search, setSearch] = useState('')
  const { data: indexData, isLoading: indexLoading } = useIndex()
  const { data: allReviews, isLoading: reviewsLoading } = useAllReviews()

  const isLoading = indexLoading || reviewsLoading

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    openSearchModal(search.trim())
    setSearch('')
  }

  const protocols = indexData?.protocols ?? []

  // Rank by lastModified (researcher edit time) rather than compiledAt
  // (on-chain data freshness) — "recently updated" on the landing page
  // should mean "review content changed", not "monitor ran a cycle".
  const reviewMap = useMemo(() => {
    const map = new Map<string, string>()
    if (allReviews) {
      for (const r of allReviews) {
        map.set(r.metadata.protocolSlug, r.lastModified)
      }
    }
    return map
  }, [allReviews])

  const sortedProtocols = useMemo(() => {
    return [...protocols].sort((a, b) => {
      const aDate = reviewMap.get(a.slug) ?? ''
      const bDate = reviewMap.get(b.slug) ?? ''
      return bDate.localeCompare(aDate)
    })
  }, [protocols, reviewMap])

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [perView, setPerView] = useState(3)
  const trackRef = useRef<HTMLDivElement>(null)

  // Responsive cards-per-view: 1 on mobile, 3 on md+
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setPerView(mq.matches ? 3 : 1)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const maxIndex = Math.max(0, sortedProtocols.length - perView)

  // Reset index when perView changes to avoid overscroll
  useEffect(() => {
    setCarouselIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const advance = useCallback(
    (dir: 1 | -1) => {
      setCarouselIndex((i) => {
        const next = i + dir
        if (next < 0) return maxIndex
        if (next > maxIndex) return 0
        return next
      })
    },
    [maxIndex],
  )

  // Auto-advance every 3s, pause on hover
  useEffect(() => {
    if (isPaused || sortedProtocols.length <= perView) return
    const id = setInterval(() => advance(1), 3000)
    return () => clearInterval(id)
  }, [isPaused, advance, sortedProtocols.length, perView])

  // Touch swipe support
  const touchStart = useRef(0)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
    setIsPaused(true)
  }, [])
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStart.current - e.changedTouches[0].clientX
      if (Math.abs(delta) > 50) advance(delta > 0 ? 1 : -1)
      setIsPaused(false)
    },
    [advance],
  )

  return (
    <div className="bg-bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/[0.03] to-transparent">
        {/* Background blur orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 size-[384px] rounded-xl bg-accent opacity-10 blur-[60px] hidden md:block" />
          <div className="absolute bottom-1/4 right-1/4 size-[384px] rounded-xl bg-purple-500 opacity-10 blur-[60px] hidden md:block" />
        </div>

        <div className="relative mx-auto max-w-[896px] px-4 md:px-8 py-16 md:py-28 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-xl bg-accent-tint px-3.5 py-1.5 mb-6 md:mb-8">
            <ShieldCheckIcon className="size-3.5 text-accent shrink-0" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-[1.5px]">
              Continuous Monitoring Active
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-black text-4xl md:text-7xl lg:text-[96px] leading-tight lg:leading-[96px] tracking-tight lg:tracking-[-4.8px] text-bg-dark">
            Know what
            <br />
            <span className="text-accent-dark">you&apos;re trusting.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 md:mt-6 text-lg md:text-xl font-normal text-text-secondary leading-normal max-w-[612px]">
            Continuous risk assessment for institutional liquidity. Verify the
            exposure to trusted code, admin keys and dependencies of any DeFi
            protocol with on-chain evidence.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-10 md:mt-12 w-full max-w-[672px] bg-white p-2 rounded flex items-center shadow-[0px_20px_25px_-5px_rgba(226,232,240,0.5),0px_8px_10px_-6px_rgba(226,232,240,0.5)]"
          >
            <input
              type="text"
              placeholder="Search protocol name or contract address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 md:px-4 py-2.5 text-sm font-normal text-text-primary placeholder:text-text-muted/60 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-4 md:px-8 py-3 rounded-md bg-accent-dark text-white text-sm font-bold tracking-[1px] hover:bg-blue-800 transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Bar */}
      {indexData && (
        <section className="bg-[#f8f9fb] border-t border-b border-border/60">
          <div className="mx-auto max-w-7xl px-6 md:px-16 lg:px-24 py-10 md:py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xs text-text-muted uppercase tracking-tight">
                  Contracts Tracked
                </span>
                <span className="font-mono font-bold text-3xl md:text-4xl text-text-primary tracking-[-1.8px]">
                  {indexData.globalTotals.totalContractCount.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xs text-text-muted uppercase tracking-tight">
                  Admins Tracked
                </span>
                <span className="font-mono font-bold text-3xl md:text-4xl text-text-primary tracking-[-1.8px]">
                  {indexData.globalTotals.totalAdminCount.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xs text-text-muted uppercase tracking-tight">
                  TVS Covered
                </span>
                <span className="font-mono font-bold text-3xl md:text-4xl text-text-primary tracking-[-1.8px]">
                  {formatUsdValue(
                    indexData.globalTotals.totalCapitalAtRisk +
                      indexData.globalTotals.totalTokenValue,
                  )}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-xs text-text-muted uppercase tracking-tight">
                  Updates Identified
                </span>
                <span className="font-mono font-bold text-3xl md:text-4xl text-accent-dark tracking-[-1.8px]">
                  {indexData.globalTotals.totalUpdateCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The Trust Posture / Methodology Section */}
      <section className="bg-bg-muted">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[1.5px] mb-4">
            The Methodology
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-heading-2">
                The Trust Posture
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Protocol due diligence should not be static. Our dynamic Trust
                Posture maps multidimensional risk across five critical trust
                vectors in real-time without abstracting data into arbitrary
                scores.
              </p>

              <div className="mt-8 space-y-5">
                {methodologyItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="size-10 rounded bg-accent-tint-light flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-accent-dark" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md aspect-square">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={trustPostureData}
                    cx="50%"
                    cy="50%"
                    outerRadius="60%"
                  >
                    <PolarGrid gridType="circle" stroke="rgba(37,99,235,0.1)" />
                    <PolarAngleAxis
                      dataKey="axis"
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600, letterSpacing: '1px' }}
                    />
                    <Radar
                      dataKey="value"
                      stroke="#2563eb"
                      strokeOpacity={0.8}
                      fill="#2563eb"
                      fillOpacity={0.1}
                      strokeWidth={3}
                      dot={{ fill: '#2563eb', stroke: 'none', r: 5, fillOpacity: 1 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reports Carousel */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-bold text-accent uppercase tracking-[1.5px] mb-2">
              Institutional Intelligence
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-heading-2">
              Recent Reports
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {sortedProtocols.length > perView && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => advance(-1)}
                  aria-label="Previous reports"
                  className="size-9 rounded-full border border-border bg-white flex items-center justify-center text-text-secondary hover:border-accent/30 hover:text-accent transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3L4.5 7L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  onClick={() => advance(1)}
                  aria-label="Next reports"
                  className="size-9 rounded-full border border-border bg-white flex items-center justify-center text-text-secondary hover:border-accent/30 hover:text-accent transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3L9.5 7L5.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            )}
            <Link
              to="/gallery"
              className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
            >
              Browse Gallery &rarr;
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-white p-8 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded bg-gray-200" />
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
                <div className="h-3 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : !indexData ? (
          <p className="text-status-red">Failed to load protocol data.</p>
        ) : (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Recent protocol reports"
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                gap: '32px',
                transform: `translateX(calc(-${carouselIndex} * (${100 / perView}% + ${32 / perView}px)))`,
              }}
            >
              {sortedProtocols.map((p) => {
                const tvl = p.totals.totalCapitalAtRisk
                const token =
                  p.totals.totalTokenValue ?? p.totals.totalTokenValueAtRisk
                const tvs = tvl + token

                return (
                  <Link
                    key={p.slug}
                    to={`/protocol/${p.slug}`}
                    style={{ minWidth: `calc(${100 / perView}% - ${(32 * (perView - 1)) / perView}px)` }}
                    className="group shrink-0 rounded-lg border border-border bg-white p-8 hover:border-accent/30 hover:shadow-md transition-[border-color,box-shadow]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded bg-accent-tint-light flex items-center justify-center overflow-hidden">
                          <ProtocolLogo
                            slug={p.slug}
                            className="h-6 w-6 object-contain"
                          />
                        </div>
                        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {p.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {p.chain} &middot; {p.projectType}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>
                        TVS{' '}
                        <span className="font-semibold text-text-primary">
                          {formatUsdValue(tvs)}
                        </span>
                      </span>
                      <span>
                        Admins{' '}
                        <span className="font-semibold text-text-primary">
                          {p.totals.adminCount}
                        </span>
                      </span>
                      <span>
                        Deps{' '}
                        <span className="font-semibold text-text-primary">
                          {p.totals.dependencyCount}
                        </span>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Onchain Evidence Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Terminal */}
          <div className="rounded-lg bg-bg-dark p-6 md:p-8 font-mono text-[11px] leading-[16.5px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-2 rounded-full bg-status-green" />
              <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/40">
                Live On-Chain Trace
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-white/60">
                <span className="text-terminal-blue">verify_proxy_implementation</span>(
                <span className="text-terminal-blue">0x7a250...</span>)
              </div>
              <div className="text-white/60">
                &nbsp;&nbsp;{'>'} implementation_addr = 0xd99d1...{' '}
                <span className="text-terminal-green">[MATCH]</span>
              </div>
              <div className="text-white/60">
                &nbsp;&nbsp;{'>'} storage_slot_integrity:{' '}
                <span className="text-terminal-green">[MATCH]</span>
              </div>
              <div className="text-white/60">
                <span className="text-terminal-blue">check_timelock_status</span>(
                <span className="text-terminal-blue">0x1a9C8...</span>)
              </div>
              <div className="text-white/60">
                &nbsp;&nbsp;{'>'} delay:{' '}
                <span className="text-white">48_HOURS</span>
              </div>
              <div className="text-white/60">
                &nbsp;&nbsp;{'>'} admin: 0x5e4e65926BA27467555...
              </div>
              <div className="text-terminal-green pt-2">
                {'>'} STATUS:{' '}
                <span className="font-bold">CONFIG_VALIDATED</span>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-heading-2">
              Untampered, Real-Time Onchain Evidence
            </h2>
            <p className="mt-4 text-text-secondary leading-relaxed">
              We don&apos;t trust company statements. We trace the byte-code.
              Our monitoring agents crawl the chain 24/7 to ensure the
              &quot;Trust Posture&quot; hasn&apos;t shifted via a silent proxy
              upgrade.
            </p>

            <div className="mt-8 flex gap-6 md:gap-12">
              <div>
                <div className="text-2xl font-bold text-accent-dark font-mono">
                  Continuous
                </div>
                <div className="text-[10px] text-text-muted uppercase tracking-[2px] mt-1">
                  Onchain Monitoring
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent-dark font-mono">
                  100%
                </div>
                <div className="text-[10px] text-text-muted uppercase tracking-[2px] mt-1">
                  On-Chain Verifiable
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
