import { NoDataIcon } from '~/components/NoDataIcon'

interface Props {
  iconUrl: string
  symbol: string
  isGasToken?: boolean
  syncStatus?: string
}

export function TokenNameCell({
  iconUrl,
  symbol,
  isGasToken,
  syncStatus,
}: Props) {
  return (
    <div className="flex items-center justify-start gap-2 pr-4 md:pr-2">
      <img
        width={16}
        height={16}
        src={iconUrl}
        className="size-5 rounded-full"
        alt={`Icon of ${symbol}`}
      />
      <span className="font-medium text-xs">
        {symbol} {isGasToken && '(gas)'}
      </span>
      {syncStatus && <NoDataIcon content={syncStatus} />}
    </div>
  )
}
