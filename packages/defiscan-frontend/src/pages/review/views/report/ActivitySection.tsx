import type { CompiledReview } from '../../../../types'
import { truncateAddress, etherscanUrl, stripChainPrefix } from '../../../../utils/format'
import { SectionHeader, ShowMoreButton } from './_shared'

interface ActivitySectionProps {
  review: CompiledReview
  onShowMore: () => void
}

export function ActivitySection({ review, onShowMore }: ActivitySectionProps) {
  const { activity } = review
  if (!activity || activity.length === 0) return null

  const sorted = [...activity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
  const recent = sorted.slice(0, 5)

  function formatDate(iso: string) {
    const d = new Date(iso)
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${y}.${mo}.${day} ${h}:${min}`
  }

  return (
    <div className="bg-bg-card border border-border rounded-lg p-[33px] flex flex-col gap-8">
      <SectionHeader
        icon={
          <svg className="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
        label="Protocol Activity"
        action={<ShowMoreButton onClick={onShowMore} />}
      />

      {/* Timeline */}
      <div className="flex flex-col">
        {recent.map((event, i) => {
          const rawTx = stripChainPrefix(event.txHash)
          const rawContract = stripChainPrefix(event.contractAddress)
          const isLast = i === recent.length - 1
          return (
            <div
              key={i}
              className={`flex items-center gap-[32px] pb-[25px] ${!isLast ? 'border-b border-border/60 mb-[25px]' : ''}`}
            >
              {/* Date */}
              <div className="w-[120px] shrink-0">
                <p className="font-mono font-normal text-[12px] text-text-muted">{formatDate(event.timestamp)}</p>
              </div>

              {/* Badge */}
              <span className="inline-flex items-center px-[8px] py-[2px] rounded-sm text-[9px] font-bold uppercase tracking-[0.225px] bg-purple-100 text-purple-700 shrink-0">
                Upgrade
              </span>

              {/* Contract name */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] text-text-primary truncate">
                  {event.contractName}
                </p>
                <p className="font-mono text-[11px] text-text-muted truncate">
                  {truncateAddress(rawContract)}
                </p>
              </div>

              {/* Tx link */}
              <a
                href={etherscanUrl(event.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-text-muted hover:text-accent transition-colors shrink-0 flex items-center gap-1"
                title={rawTx}
              >
                {truncateAddress(rawTx)}
                <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
