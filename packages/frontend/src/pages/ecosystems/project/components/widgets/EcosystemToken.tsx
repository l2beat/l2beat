import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PercentChange } from '~/components/PercentChange'
import type { EcosystemToken } from '~/server/features/ecosystems/getEcosystemToken'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumber } from '~/utils/number-format/formatNumber'
import { EcosystemWidget, EcosystemWidgetTitle } from './EcosystemWidget'

interface Props {
  token: EcosystemToken
  className?: string
}

export function EcosystemToken({ token, className }: Props) {
  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>Ecosystem Token</EcosystemWidgetTitle>
      <div className="grid md:grid-cols-3 lg:grid-cols-1">
        <div className="flex items-center gap-2 font-medium text-xl">
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
        <p className="mt-2 font-medium text-2xs text-secondary md:max-lg:col-span-2">
          {token.description}
        </p>
      </div>
      <HorizontalSeparator className="my-3 sm:hidden" />
      <div className="grid sm:mt-4 sm:grid-cols-3 sm:gap-2">
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
          <span>{`${formatNumber(token.data.circulatingSupply.value)} ${token.symbol}`}</span>
          <PercentChange
            className="ml-0.5"
            value={token.data.circulatingSupply.change}
          />
        </DataTile>
      </div>
    </EcosystemWidget>
  )
}

function DataTile({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-baseline gap-1 rounded border-divider max-sm:justify-between sm:flex-col sm:items-center sm:border sm:py-3',
        className,
      )}
    >
      <p className="font-medium text-secondary text-xs leading-none sm:text-2xs">
        {label}
      </p>
      <p className="font-bold text-sm">{children}</p>
    </div>
  )
}
