import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface TopItem {
  title: string
  iconUrl: string
  volume: number
  href?: string
}

export function TopItemsList({
  label,
  items,
}: {
  label: string
  items: TopItem[]
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <div className="mb-1.5 font-bold text-label-value-12 uppercase">
        {label}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <TopItemRow key={item.title} item={item} />
        ))}
      </div>
    </div>
  )
}

function TopItemRow({ item }: { item: TopItem }) {
  const className = 'flex items-center justify-between gap-2 text-[13px]'

  if (item.href) {
    return (
      <a href={item.href} className={`${className} group`}>
        <span className="flex min-w-0 items-center gap-1 font-medium text-secondary leading-none">
          <img
            src={item.iconUrl}
            alt={item.title}
            className="size-4 shrink-0"
          />
          <span className="truncate group-hover:underline">{item.title}</span>
        </span>
        <span className="shrink-0 font-semibold leading-[1.15]">
          {formatCurrency(item.volume, 'usd')}
        </span>
      </a>
    )
  }

  return (
    <div className={className}>
      <span className="flex min-w-0 items-center gap-1 font-medium text-secondary leading-none">
        <img src={item.iconUrl} alt={item.title} className="size-4 shrink-0" />
        <span className="truncate">{item.title}</span>
      </span>
      <span className="shrink-0 font-semibold leading-[1.15]">
        {formatCurrency(item.volume, 'usd')}
      </span>
    </div>
  )
}
