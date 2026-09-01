import { ScrollWithGradient } from '~/components/ScrollWithGradient'

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-heading-18">{title}</h3>
      <div className="flex flex-col gap-1">
        <span className="font-medium text-secondary text-xs leading-none">
          Last 24 hours
        </span>
        {subtitle && (
          <span className="font-medium text-secondary text-xs leading-none">
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export function ScrollList({ children }: { children: React.ReactNode }) {
  const visibleRows = 7
  const rowHeight = 28
  const maxHeight = visibleRows * rowHeight + (visibleRows - 1)
  return (
    <ScrollWithGradient className="flex flex-col pr-1" style={{ maxHeight }}>
      {children}
    </ScrollWithGradient>
  )
}
