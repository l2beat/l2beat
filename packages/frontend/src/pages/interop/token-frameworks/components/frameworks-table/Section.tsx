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
      <h3 className="font-semibold text-label-value-15">{title}</h3>
      {subtitle && (
        <span className="-mt-2 font-normal text-label-value-13 text-secondary leading-4">
          {subtitle}
        </span>
      )}
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
