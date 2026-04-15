import {
  CodeIcon,
  GlobeIcon,
  KeyIcon,
  ShieldCheckIcon,
  ShieldIcon,
} from '../../components/icons'
import { useIndex } from '../../data/hooks'
import { formatUsdValue } from '../../utils/format'

const REPO_URL = 'https://github.com/deficollective/defiscan-v2'
const DOCS_URL = 'https://docs.defiscan.info'
const LENS_URL = 'https://lens.defiscan.info'
const COLLECTIVE_URL = 'https://deficollective.org/about/'

export function AboutPage() {
  const { data: indexData } = useIndex()

  const protocolCount = indexData?.protocols.length
  // Total Value Secured across all reviewed protocols = capital at risk (contract
  // balances) + token value (protocol token market value). Matches the per-protocol
  // TVS shown on the Landing page. `totalDefiTvl` is the hardcoded industry-wide
  // TVL used only as a "% of DeFi reviewed" denominator and should NOT be shown here.
  const totalValueVerified =
    indexData &&
    indexData.globalTotals.totalCapitalAtRisk +
      indexData.globalTotals.totalTokenValue

  return (
    <div className="w-full bg-white">
      {/* Hero + Mission + Approach share the same 1536px container and white bg */}
      <div className="mx-auto w-full max-w-[1536px] space-y-24 px-6 py-16 sm:px-12 sm:py-24 lg:space-y-32">
        {/* ---------- Hero ---------- */}
        <section className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            <p className="font-bold text-[11px] text-accent-dark uppercase tracking-[0.55px]">
              Institutional Intelligence
            </p>
            <h1 className="font-extrabold font-sans text-5xl text-text-primary leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-[72px] lg:leading-[72px]">
              The Transparency
              <br />
              Layer for DeFi.
            </h1>
            <p className="max-w-2xl pt-4 text-lg text-text-secondary leading-[1.625] sm:text-xl">
              DEFISCAN is the definitive open-source infrastructure for on-chain
              verification, analysis, and protocol risk assessment.
            </p>
          </div>
          <div className="relative aspect-square w-full max-w-[220px] self-center overflow-hidden rounded-lg border border-accent-dark/10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1)_0%,rgba(37,99,235,0)_70%)] lg:col-span-4 lg:ml-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheckIcon className="h-20 w-20 text-accent-dark opacity-20" />
            </div>
          </div>
        </section>

        {/* ---------- Our Mission ---------- */}
        <section className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12">
          {/* Left decorative panel — col 1-5 (col 6 left empty as gutter, matches Figma) */}
          <div className="relative min-h-[320px] overflow-hidden rounded-lg bg-bg-muted lg:col-span-5 lg:aspect-[584/477] lg:min-h-0">
            <img
              src="/about-live-ledger.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full opacity-80 mix-blend-multiply"
            />
            <div className="absolute bottom-[30px] left-[32px]">
              <span className="bg-accent-dark px-3 py-[2.5px] font-bold text-[10px] text-white uppercase leading-[15px] tracking-[1px]">
                Live Ledger
              </span>
            </div>
          </div>

          {/* Right copy + stats — col 7-12 */}
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            <h2 className="font-black font-sans text-3xl text-text-primary leading-[1] tracking-[-0.75px] sm:text-4xl">
              Our Mission
            </h2>
            <div className="space-y-6 text-base text-text-secondary leading-[26px]">
              <p>
                In a financial ecosystem governed by code, transparency is not
                an option—it is the bedrock. Our mission is to provide the
                "Digital Curator" that the DeFi space deserves, translating
                complex smart contract interactions into verifiable
                human-readable intelligence.
              </p>
              <p>
                We operate as an independent verification layer, ensuring that
                protocol claims align with on-chain realities. By continuously
                monitoring protocols' trust posture, we empower institutions and
                individuals to move to real-time due diligence and base
                investment decisions on evidence instead of trust.
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <div className="flex-1 bg-bg-muted p-6">
                <p className="font-bold text-[11px] text-accent-dark uppercase leading-[16.5px] tracking-[1.1px]">
                  Protocols Tracked
                </p>
                <p className="mt-2 font-bold font-mono text-3xl text-text-primary leading-9">
                  {protocolCount !== undefined ? `${protocolCount}+` : '—'}
                </p>
              </div>
              <div className="flex-1 bg-bg-muted p-6">
                <p className="font-bold text-[11px] text-accent-dark uppercase leading-[16.5px] tracking-[1.1px]">
                  Total Value Verified
                </p>
                <p className="mt-2 font-bold font-mono text-3xl text-text-primary leading-9">
                  {totalValueVerified !== undefined
                    ? formatUsdValue(totalValueVerified)
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Our Approach ---------- */}
        <section className="flex flex-col gap-12">
          <div className="flex items-end gap-6">
            <h2 className="font-black font-sans text-3xl text-text-primary uppercase leading-10 tracking-[-1.8px] sm:text-4xl">
              Our Approach
            </h2>
            <div className="mb-4 hidden h-px flex-1 bg-[rgba(195,198,215,0.4)] sm:block" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ApproachCard
              icon={<CodeIcon className="h-6 w-6 text-accent-dark" />}
              title="Open Source Logic"
              body="Our entire scanning engine is public. Anyone can audit the auditor, ensuring complete neutrality in every report we generate."
              linkLabel="View Repository"
              linkHref={REPO_URL}
              bgClass="bg-accent-tint-light"
            />
            <ApproachCard
              icon={<DatabaseIcon className="h-6 w-6 text-accent-dark" />}
              title="Verifiable Data"
              body="Every data point displayed on DEFISCAN includes a verifiable source. We don't ask for trust; we provide the evidence."
              linkLabel="Explore Lens"
              linkHref={LENS_URL}
              bgClass="bg-accent-tint-light"
            />
            <ApproachCard
              icon={<NetworkIcon className="h-6 w-6 text-accent-dark" />}
              title="Protocol Mapping"
              body="We map complex smart contract hierarchies to visualize ownership, administrative permissions, and exit flows."
              linkLabel="Explore Docs"
              linkHref={DOCS_URL}
              bgClass="bg-accent-tint-light"
            />
          </div>
        </section>

        {/* ---------- Built by DeFi Veterans (contained dark card) ---------- */}
        <section className="relative overflow-hidden bg-bg-dark p-10 sm:p-16 lg:p-24">
          <svg
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-[70%] opacity-10"
            viewBox="0 0 800 800"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <path
              d="M -200 400 C 100 100, 400 700, 900 300"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M -200 500 C 100 200, 400 800, 900 400"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M -200 600 C 100 300, 400 900, 900 500"
              stroke="white"
              strokeWidth="2"
            />
          </svg>

          <div className="relative flex max-w-[896px] flex-col gap-8">
            <div className="flex items-center gap-4">
              <span className="inline-flex border border-white/30 px-[9px] py-[3px] font-bold text-[10px] text-bg-primary uppercase leading-[15px] tracking-[-0.5px]">
                Proven Expertise
              </span>
              <div className="h-px w-12 bg-white/30" />
            </div>
            <h2 className="font-black font-sans text-4xl text-bg-primary leading-[1] tracking-[-3px] sm:text-5xl lg:text-6xl lg:leading-[60px]">
              Built and Backed by DeFi
              <br />
              Veterans
            </h2>
            <p className="max-w-2xl text-lg text-white/80 leading-[29px]">
              Our team brings over 30+ years of combined DeFi experience,
              combining deep expertise across protocol design, cyber security,
              and regulation. We are supported by DeFi pioneers including the
              Ethereum Foundation and Liquity.
            </p>

            <div className="grid grid-cols-1 gap-12 pt-8 pb-12 sm:grid-cols-3">
              <Credential
                icon={<KeyIcon className="h-5 w-5 text-bg-primary" />}
                label={
                  <>
                    30+ Years
                    <br />
                    Experience
                  </>
                }
              />
              <Credential
                icon={<GlobeIcon className="h-5 w-5 text-bg-primary" />}
                label="Supported by the best"
              />
              <Credential
                icon={<ShieldIcon className="h-5 w-5 text-bg-primary" />}
                label="Multi-disciplinary team"
              />
            </div>

            <a
              href={COLLECTIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center justify-center bg-accent-dark px-8 py-4 font-bold text-white text-xs uppercase tracking-[1.2px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
            >
              Learn More About Our Team
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

function ApproachCard({
  icon,
  title,
  body,
  linkLabel,
  linkHref,
  bgClass,
}: {
  icon: React.ReactNode
  title: string
  body: string
  linkLabel: string
  linkHref: string
  bgClass: string
}) {
  return (
    <div
      className={`relative flex min-h-[316px] flex-col p-8 transition-colors duration-200 hover:bg-accent-tint ${bgClass}`}
    >
      <div>{icon}</div>
      <h3 className="mt-16 font-bold text-text-primary text-xl leading-7">
        {title}
      </h3>
      <p className="mt-3 text-sm text-text-secondary leading-[22.75px]">
        {body}
      </p>
      <div className="mt-auto pt-6">
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold text-[11px] text-accent-dark uppercase tracking-[1.1px] hover:underline"
        >
          {linkLabel}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  )
}

function Credential({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">{icon}</div>
      <p className="font-bold text-bg-primary text-xl uppercase leading-7 tracking-[-0.5px]">
        {label}
      </p>
    </div>
  )
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
    </svg>
  )
}

function NetworkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="5" rx="1" />
      <rect x="2" y="17" width="6" height="5" rx="1" />
      <rect x="16" y="17" width="6" height="5" rx="1" />
      <path d="M12 7v4" />
      <path d="M5 17v-2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
