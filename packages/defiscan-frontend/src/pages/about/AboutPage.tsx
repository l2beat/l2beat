import { CodeIcon, ShieldCheckIcon } from '../../components/icons'

const REPO_URL = 'https://github.com/deficollective/defiscan-v2'
const LENS_URL = 'https://lens.defiscan.info'
const COLLECTIVE_URL = 'https://deficollective.org'

export function AboutPage() {
  return (
    <div className="w-full bg-white">
      {/* Hero + Mission + Approach share the same 1536px container and white bg */}
      <div className="mx-auto w-full max-w-[1536px] space-y-24 px-6 py-16 sm:px-12 sm:py-24 lg:space-y-32">
        {/* ---------- Hero ---------- */}
        <section className="grid grid-cols-1 items-center gap-7 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            <h1 className="font-extrabold font-sans text-5xl text-text-primary leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-[72px] lg:leading-[72px]">
              The Transparency
              <br />
              Layer for DeFi.
            </h1>
            <p className="max-w-2xl pt-4 text-lg text-text-secondary leading-[1.625] sm:text-xl">
              DEFISCAN is an open-source platform that continuously monitors
              DeFi protocols — their smart contracts, admin keys, governance
              mechanisms, and external dependencies — to make counterparty
              risk visible and verifiable.
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
            <p className="font-bold text-[11px] text-accent-dark uppercase tracking-[0.55px]">
              Our Mission
            </p>
            <h2 className="font-black font-sans text-3xl text-text-primary leading-[1] tracking-[-0.75px] sm:text-4xl">
              Making Counterparty Risk Verifiable
            </h2>
            <div className="space-y-6 text-base text-text-secondary leading-[26px]">
              <p>
                Every DeFi protocol operates with a set of trust assumptions —
                who can upgrade contracts, which external systems it depends
                on, and what governance safeguards are in place. These
                assumptions define the real risk profile for anyone interacting
                with the protocol.
              </p>
              <p>
                DEFISCAN maps, monitors, and surfaces these trust assumptions
                in a structured, evidence-based format — enabling informed
                decision-making grounded in on-chain facts.
              </p>
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
              icon={<ClockIcon className="h-6 w-6 text-accent-dark" />}
              title="Continuous Monitoring"
              body="Protocols change. Admin keys rotate, governance proposals pass, dependencies update. DEFISCAN continuously verifies the current state of each protocol's trust surface — not a point-in-time snapshot, but a living assessment."
              linkLabel="Live Ledger"
              linkHref={LENS_URL}
              bgClass="bg-accent-tint-light"
            />
            <ApproachCard
              icon={<DatabaseIcon className="h-6 w-6 text-accent-dark" />}
              title="On-Chain Evidence"
              body="Every claim links back to a specific contract, transaction, or governance action. No black boxes, no proprietary scores — traceable on-chain facts that anyone can independently verify."
              linkLabel="Explore Lens"
              linkHref={LENS_URL}
              bgClass="bg-accent-tint-light"
            />
            <ApproachCard
              icon={<CodeIcon className="h-6 w-6 text-accent-dark" />}
              title="Open Source & Auditable"
              body="The entire scanning engine is public. Every methodology, every rule, every output can be independently reviewed. The auditor can be audited."
              linkLabel="View Repository"
              linkHref={REPO_URL}
              bgClass="bg-accent-tint-light"
            />
          </div>
        </section>

        {/* ---------- Who We Are (contained dark card) ---------- */}
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
                Team
              </span>
              <div className="h-px w-12 bg-white/30" />
            </div>
            <h2 className="font-black font-sans text-4xl text-bg-primary leading-[1] tracking-[-3px] sm:text-5xl lg:text-6xl lg:leading-[60px]">
              Who We Are
            </h2>
            <p className="max-w-2xl text-lg text-white/80 leading-[29px]">
              DEFISCAN is built by the{' '}
              <strong className="text-bg-primary">DeFi Collective</strong> — a
              team with deep roots in protocol engineering, smart contract
              security, and financial regulation. With over 30 years of
              combined experience across these disciplines, we operate as an
              independent verification layer, aligned with the ecosystem&apos;s
              long-term need for transparency and accountability.
            </p>

            <a
              href={COLLECTIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center justify-center bg-accent-dark px-8 py-4 font-bold text-white text-xs uppercase tracking-[1.2px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
            >
              Learn more about DeFi Collective
            </a>
          </div>
        </section>

        {/* ---------- Partners / Built With ---------- */}
        <section className="flex flex-col gap-8">
          <div>
            <p className="font-bold text-[11px] text-accent-dark uppercase tracking-[0.55px] mb-3">
              Partners
            </p>
            <h2 className="font-black font-sans text-3xl text-text-primary leading-[1.1] tracking-[-0.75px] sm:text-4xl">
              Built With
            </h2>
            <p className="mt-4 max-w-[600px] text-base text-text-secondary leading-[1.75]">
              DEFISCAN is supported by leading ecosystem partners who share our
              commitment to transparency and verifiable security in DeFi.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            <PartnerLogo
              name="Ethereum Foundation"
              src="/partners/ethereum-foundation.svg"
              href="https://ethereum.foundation"
            />
            <PartnerLogo
              name="Liquity"
              src="/partners/liquity.png"
              href="https://www.liquity.org"
            />
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

function PartnerLogo({
  name,
  src,
  href,
}: {
  name: string
  src: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-[120px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-white p-5 transition-colors hover:border-accent/40"
    >
      <img
        src={src}
        alt={`${name} logo`}
        className="h-10 w-auto max-w-full object-contain opacity-80 transition-opacity group-hover:opacity-100"
        loading="lazy"
      />
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-[0.5px]">
        {name}
      </span>
    </a>
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

function ClockIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
