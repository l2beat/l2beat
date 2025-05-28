import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { PercentChange } from '~/components/percent-change'
import type { EcosystemToken } from '~/server/features/ecosystems/get-ecosystem-token'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { formatNumber } from '~/utils/number-format/format-number'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

interface Props {
  token: EcosystemToken
  className?: string
}

export function EcosystemToken({ token, className }: Props) {
  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>Ecosystem Token</EcosystemWidgetTitle>
      <div className="grid md:grid-cols-3 lg:grid-cols-1">
        <div className="flex items-center gap-2 text-xl font-medium">
          <img
            src={token.logo}
            alt={token.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <p>{token.name}</p>
          <p className="text-secondary">{token.symbol}</p>
        </div>
        <p className="mt-2 text-2xs font-medium text-secondary md:max-lg:col-span-2">
          {token.description}
        </p>
      </div>
      <HorizontalSeparator className="my-4 sm:hidden" />
      <div className="mt-4 grid sm:grid-cols-3 sm:gap-2">
        <DataTile label="Price">
          <span>{formatCurrency(token.data.price.value, 'usd')}</span>
          <PercentChange className="ml-0.5" value={token.data.price.change} />
        </DataTile>
        <DataTile label="Market Cap">
          <span>{formatCurrency(token.data.marketCap.value, 'usd')}</span>
          <PercentChange
            className="ml-0.5"
            value={token.data.marketCap.change}
          />
        </DataTile>
        <DataTile label="Circulating Supply">
          <span>{`${formatNumber(token.data.amount.value)}`}</span>
          <PercentChange className="ml-0.5" value={token.data.amount.change} />
        </DataTile>
      </div>
    </EcosystemWidget>
  )
}

function DataTile({
  label,
  children,
  className,
}: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-baseline gap-1 rounded border-divider max-sm:justify-between sm:flex-col sm:items-center sm:border sm:py-3',
        className,
      )}
    >
      <p className="text-xs font-medium leading-none text-secondary sm:text-2xs">
        {label}
      </p>
      <p className="text-sm font-bold">{children}</p>
    </div>
  )
}
