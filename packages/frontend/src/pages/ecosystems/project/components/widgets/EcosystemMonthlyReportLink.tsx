import { cn } from '~/utils/cn'

export function EcosystemMonthlyReportLink({
  className,
  href,
}: {
  className?: string
  href: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'rounded-lg bg-gradient-to-tr from-[#8A73FF] via-surface-primary to-[#FE484C] p-2',
        className,
      )}
    >
      <div className="rounded-sm bg-surface-primary px-4 py-5">
        <p className="mb-1 text-subtitle-12 uppercase">Ecosystem Report</p>
        <p className="font-bold text-label-value-20">
          View our newest Ecosystem Report
        </p>
      </div>
    </a>
  )
}
