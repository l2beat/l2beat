import type { PrivacyExposure, PrivacyField } from '@l2beat/config'
import { cn } from '~/utils/cn'

/**
 * The shape is what the protocol protects (or a field), the colour is how
 * well. Below it, a plus badge when the adversary learns more than a public
 * observer (identity included), coloured by the worst such leak. The row is
 * always reserved so glyphs align across cells; `badges={false}` drops it for
 * inline use, e.g. in chips.
 */
export function PrivacySubjectGlyph({
  field,
  exposure,
  more,
  size = 'md',
  badges = true,
  reserveBadgeRow = true,
  className,
}: {
  field: PrivacyField
  exposure: PrivacyExposure
  /** Worst leak beyond the public observer, identity included. */
  more?: PrivacyExposure
  size?: 'sm' | 'md' | 'lg'
  badges?: boolean
  /** Keep the badge row's height even when empty, so glyphs align in a grid. */
  reserveBadgeRow?: boolean
  className?: string
}) {
  const showMore = more !== undefined && more !== 'private'
  const glyph = (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        SIZE_CLASS[size],
        EXPOSURE_TEXT_CLASS[exposure],
        !badges && className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {SUBJECT_PATHS[field]}
    </svg>
  )
  if (!badges) return glyph
  if (!reserveBadgeRow && !showMore) return glyph
  return (
    <span
      className={cn(
        'inline-flex shrink-0 flex-col items-center gap-0.5',
        className,
      )}
    >
      {glyph}
      <span className={cn('flex items-center', BADGE_SIZE_CLASS[size])}>
        {showMore && (
          <Badge
            exposure={more}
            size={size}
            title="Learns more than a public observer"
          >
            <path d="M12 5v14M5 12h14" />
          </Badge>
        )}
      </span>
    </span>
  )
}

function Badge({
  exposure,
  size,
  title,
  children,
}: {
  exposure: PrivacyExposure
  size: 'sm' | 'md' | 'lg'
  title: string
  children: React.ReactNode
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(BADGE_ICON_CLASS[size], EXPOSURE_TEXT_CLASS[exposure])}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {children}
    </svg>
  )
}

const BADGE_SIZE_CLASS = { sm: 'h-2.5', md: 'h-3', lg: 'h-4' } as const
const BADGE_ICON_CLASS = { sm: 'size-2.5', md: 'size-3', lg: 'size-4' } as const

const SIZE_CLASS = { sm: 'size-5', md: 'size-6', lg: 'size-8' } as const

export const EXPOSURE_TEXT_CLASS: Record<PrivacyExposure, string> = {
  private: 'text-[#2C8A57] dark:text-[#4FC98B]',
  atRisk: 'text-[#C9900E] dark:text-[#E7A63A]',
  exposed: 'text-[#C2413E] dark:text-[#F07670]',
  unverifiable: 'text-[#6A5DB5] dark:text-[#AA9DEA]',
}

/** 24-unit grid, stroke-based, geometry never changes with state. */
const SUBJECT_PATHS: Record<PrivacyField, React.ReactNode> = {
  linkage: (
    <path d="M9 7H7a5 5 0 0 0 0 10h2m6-10h2a5 5 0 0 1 0 10h-2M7 12h10" />
  ),
  recipient: (
    <>
      <circle cx="17" cy="6" r="3" />
      <path d="M12 21v-3a5 5 0 0 1 10 0v3M2 12h8m-3-3 3 3-3 3" />
    </>
  ),
  amount: (
    <>
      <path d="M7.5 7.1A7 7 0 1 1 16.9 16.5" />
      <circle cx="9" cy="14" r="7" />
      <path d="m7 12 2-2v8m-2 0h4" />
    </>
  ),
  identity: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <circle cx="8" cy="10" r="2" />
      <path d="M5 16a3 3 0 0 1 6 0m4-7h4m-4 4h4m-4 4h2" />
    </>
  ),
  sender: (
    <>
      <circle cx="7" cy="6" r="3" />
      <path d="M2 21v-3a5 5 0 0 1 10 0v3m2-9h8m-3-3 3 3-3 3" />
    </>
  ),
  asset: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m12 7 5 5-5 5-5-5Z" />
    </>
  ),
}

export function sentimentToExposure(
  sentiment: 'good' | 'warning' | 'bad',
): PrivacyExposure {
  return sentiment === 'good'
    ? 'private'
    : sentiment === 'warning'
      ? 'atRisk'
      : 'exposed'
}
