import Image from 'next/image'
import { PercentChange } from '~/components/percent-change'
import type { EcosystemNativeToken } from '~/server/features/ecosystems/get-native-token'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { formatNumber } from '~/utils/number-format/format-number'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

interface Props {
  nativeToken: EcosystemNativeToken
  className?: string
}

export function EcosystemNativeToken({ nativeToken, className }: Props) {
  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>Native Token</EcosystemWidgetTitle>
      <div className="flex items-center gap-2 text-xl font-medium">
        <Image
          src={nativeToken.logo}
          alt={nativeToken.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <p>{nativeToken.name}</p>
        <p className="text-secondary">{nativeToken.symbol}</p>
      </div>
      <p className="mt-1.5 text-2xs font-medium text-secondary">
        {nativeToken.description}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <DataTile label="Price">
          <span>{formatCurrency(nativeToken.data.price.value, 'usd')}</span>
          <PercentChange
            className="ml-0.5"
            value={nativeToken.data.price.change}
          />
        </DataTile>
        <DataTile label="Market Cap">
          <span>{formatCurrency(nativeToken.data.marketCap.value, 'usd')}</span>
          <PercentChange
            className="ml-0.5"
            value={nativeToken.data.marketCap.change}
          />
        </DataTile>
        <DataTile label="Amount">
          <span>{`${formatNumber(nativeToken.data.amount.value)} ${nativeToken.symbol}`}</span>
          <PercentChange
            className="ml-0.5"
            value={nativeToken.data.amount.change}
          />
        </DataTile>
      </div>
    </EcosystemWidget>
  )
}

function DataTile({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded border border-divider p-3">
      <p className="text-2xs font-medium leading-none text-secondary">
        {label}
      </p>
      <p className="text-sm font-bold">{children}</p>
    </div>
  )
}
