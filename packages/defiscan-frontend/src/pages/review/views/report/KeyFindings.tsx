import { clsx } from 'clsx'
import type { CompiledReview } from '../../../../types'
import { getKeyFindings, type KeyFinding } from '../../../../utils/keyFindings'

interface KeyFindingsProps {
  review: CompiledReview
}

export function KeyFindings({ review }: KeyFindingsProps) {
  const findings = getKeyFindings(review)

  if (findings.length === 0) {
    return null
  }

  return (
    <div>
      <p className="mb-6 max-w-3xl text-lg text-text-secondary leading-relaxed">
        Here are the most important things to know about{' '}
        <span className="font-semibold text-text-primary">
          {review.metadata.protocolName}
        </span>
        's security and centralization posture.
      </p>

      <div className="space-y-4">
        {findings.map((finding, i) => (
          <FindingCallout key={i} finding={finding} />
        ))}
      </div>
    </div>
  )
}

/** Map the KeyFinding types to visual styles */
const findingStyles: Record<
  KeyFinding['type'],
  { border: string; bg: string; icon: string; titleColor: string }
> = {
  positive: {
    border: 'border-status-green/40',
    bg: 'bg-status-green/5',
    icon: 'text-status-green',
    titleColor: 'text-status-green',
  },
  warning: {
    border: 'border-status-amber/40',
    bg: 'bg-status-amber/5',
    icon: 'text-status-amber',
    titleColor: 'text-status-amber',
  },
  critical: {
    border: 'border-status-red/40',
    bg: 'bg-status-red/5',
    icon: 'text-status-red',
    titleColor: 'text-status-red',
  },
  info: {
    border: 'border-status-blue/40',
    bg: 'bg-status-blue/5',
    icon: 'text-status-blue',
    titleColor: 'text-status-blue',
  },
}

function FindingCallout({ finding }: { finding: KeyFinding }) {
  const s = findingStyles[finding.type]

  return (
    <div className={clsx('rounded-xl border-l-4 px-6 py-4', s.border, s.bg)}>
      <div className="flex items-start gap-3">
        <span className={clsx('mt-0.5 shrink-0', s.icon)}>
          <FindingIcon type={finding.type} />
        </span>
        <div>
          <h3 className={clsx('font-semibold text-base', s.titleColor)}>
            {finding.title}
          </h3>
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">
            {finding.detail}
          </p>
        </div>
      </div>
    </div>
  )
}

function FindingIcon({ type }: { type: KeyFinding['type'] }) {
  if (type === 'positive') {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  }
  if (type === 'critical') {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    )
  }
  if (type === 'info') {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  }
  // warning
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}
