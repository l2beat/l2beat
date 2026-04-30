// Shared verified/unverified status pill. Used by GalleryPage cards and the
// report HeroSection. Two visual variants — small card pill vs bold hero badge —
// share the same label/color semantics so the two display sites stay in sync.

interface StatusPillProps {
  verified: boolean
  variant: 'card' | 'hero'
}

export function StatusPill({ verified, variant }: StatusPillProps) {
  const label = verified ? 'VERIFIED' : 'UNVERIFIED'
  const title = verified
    ? 'Reviewed and verified by a DeFiScan researcher'
    : 'AI-generated draft, not yet reviewed by a researcher'

  if (variant === 'hero') {
    const cls = verified
      ? 'bg-[#059669] text-white'
      : 'bg-[#d97706] text-white'
    return (
      <span
        className={`${cls} font-bold text-[10px] uppercase tracking-[0.5px] px-[10px] py-[2px] rounded-[2px]`}
        title={title}
      >
        {label}
      </span>
    )
  }

  // 'card' variant — used in Gallery cards
  const cls = verified
    ? 'bg-status-green/10 text-status-green'
    : 'bg-status-amber/10 text-status-amber'
  return (
    <span
      className={`shrink-0 ml-2 px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-[0.5px] ${cls}`}
      title={title}
    >
      {label}
    </span>
  )
}

export type ReviewStatus = 'verified' | 'unverified'

export const STATUS_FILTER_LABELS: Record<ReviewStatus, string> = {
  verified: 'VERIFIED',
  unverified: 'UNVERIFIED',
}
