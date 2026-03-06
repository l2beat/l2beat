import type {
  CompiledReview,
  CompiledResourceEntry,
  CompiledFrontendSubtype,
} from '../../../../types'

const LENS_BASE_URL =
  'https://defiscan-v2-backend-prod-pzz23.ondigitalocean.app/ui/p'

interface CodeSectionProps {
  review: CompiledReview
}

const SUBTYPE_STYLES: Record<CompiledFrontendSubtype, string> = {
  official: 'border-green-200 bg-green-50 text-green-700',
  'third-party': 'border-yellow-200 bg-yellow-50 text-yellow-700',
  'self-hosted': 'border-orange-200 bg-orange-50 text-orange-700',
}

const SUBTYPE_DOT: Record<CompiledFrontendSubtype, string> = {
  official: 'bg-green-400',
  'third-party': 'bg-yellow-400',
  'self-hosted': 'bg-orange-400',
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DocsIcon({ className }: { className?: string }) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function CodeIcon({ className }: { className?: string }) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
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
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function LinkIcon({ className }: { className?: string }) {
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function ExternalLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

function timeAgo(isoString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 1000,
  )
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

/** Extract a short display domain from a URL */
function displayDomain(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function CodeSection({ review }: CodeSectionProps) {
  const lensUrl = `${LENS_BASE_URL}/${review.metadata.protocolSlug}`
  const resources = review.resources ?? []

  const frontends = resources.filter((r) => r.type === 'frontend')
  const github = resources.filter((r) => r.type === 'github')
  const x = resources.filter((r) => r.type === 'x')
  const docs = resources.filter((r) => r.type === 'docs')
  const sourceCode = resources.filter((r) => r.type === 'source-code')
  const other = resources.filter((r) => r.type === 'other')

  const hasQuickLinks =
    github.length > 0 ||
    x.length > 0 ||
    docs.length > 0 ||
    sourceCode.length > 0

  return (
    <div className="space-y-6">
      {/* Quick links row — icon pills for socials, docs, source */}
      {hasQuickLinks && (
        <div className="flex flex-wrap gap-2">
          {github.map((r, i) => (
            <QuickLinkPill
              key={`gh-${i}`}
              href={r.url}
              icon={<GitHubIcon className="w-4 h-4" />}
              label={r.label || 'GitHub'}
            />
          ))}
          {x.map((r, i) => (
            <QuickLinkPill
              key={`x-${i}`}
              href={r.url}
              icon={<XIcon className="w-4 h-4" />}
              label={r.label || 'X'}
            />
          ))}
          {docs.map((r, i) => (
            <QuickLinkPill
              key={`docs-${i}`}
              href={r.url}
              icon={<DocsIcon className="w-4 h-4" />}
              label={r.label || 'Docs'}
            />
          ))}
          {sourceCode.map((r, i) => (
            <QuickLinkPill
              key={`src-${i}`}
              href={r.url}
              icon={<CodeIcon className="w-4 h-4" />}
              label={r.label || 'Source Code'}
            />
          ))}
        </div>
      )}

      {/* Frontends — card grid */}
      {frontends.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Frontends
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {frontends.map((r, i) => (
              <FrontendCard key={i} resource={r} />
            ))}
          </div>
        </div>
      )}

      {/* Other resources */}
      {other.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Other Resources
          </h3>
          <div className="flex flex-wrap gap-2">
            {other.map((r, i) => (
              <QuickLinkPill
                key={`other-${i}`}
                href={r.url}
                icon={<LinkIcon className="w-4 h-4" />}
                label={r.label || displayDomain(r.url)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lens + timestamp footer */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <ExternalLink
          href={lensUrl}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
        >
          <GlobeIcon className="w-4 h-4" />
          View on Lens
        </ExternalLink>
        <span className="text-sm text-text-muted">
          · Updated {timeAgo(review.compiledAt)}
        </span>
      </div>
    </div>
  )
}

function QuickLinkPill({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <ExternalLink
      href={href}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-medium text-text-secondary shadow-sm hover:bg-bg-muted/40 hover:text-text-primary transition-colors"
    >
      {icon}
      {label}
    </ExternalLink>
  )
}

function FrontendCard({ resource }: { resource: CompiledResourceEntry }) {
  const subtype = resource.frontendSubtype ?? 'third-party'
  const domain = displayDomain(resource.url)

  return (
    <ExternalLink
      href={resource.url}
      className={`group flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:shadow-sm ${SUBTYPE_STYLES[subtype]}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${SUBTYPE_DOT[subtype]}`}
      />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">
          {resource.label || domain}
        </div>
        {resource.label && (
          <div className="text-xs opacity-70 truncate">{domain}</div>
        )}
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-60">
        {subtype}
      </span>
    </ExternalLink>
  )
}
