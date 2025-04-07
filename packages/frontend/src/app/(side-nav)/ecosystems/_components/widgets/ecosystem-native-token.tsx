import Image from 'next/image'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { formatNumber } from '~/utils/number-format/format-number'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export interface EcosystemNativeToken {
  logo: string
  name: string
  symbol: string
  description: string
  data: {
    price: number
    marketCap: number
    amount: number
  }
}

interface Props {
  nativeToken: EcosystemNativeToken
}

export function EcosystemNativeToken({ nativeToken }: Props) {
  return (
    <EcosystemWidget>
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
      <div className="mt-4 grid grid-cols-3 gap-2">
        <DataTile
          label="Price"
          value={formatCurrency(nativeToken.data.price, 'usd')}
        />
        <DataTile
          label="Market Cap"
          value={formatCurrency(nativeToken.data.marketCap, 'usd')}
        />
        <DataTile
          label="Amount"
          value={`${formatNumber(nativeToken.data.amount)} ${nativeToken.symbol}`}
        />
      </div>
    </EcosystemWidget>
  )
}

function DataTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded border border-divider p-3">
      <p className="text-2xs font-medium leading-none text-secondary">
        {label}
      </p>
      <p className="text-xs font-bold">{value}</p>
    </div>
  )
}
