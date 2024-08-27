import Image from 'next/image'

interface Props {
  iconUrl: string
  symbol: string
}

export function TokenNameCell({ iconUrl, symbol }: Props) {
  return (
    <div className="flex items-center justify-start gap-2 pr-4 md:pr-2">
      <Image
        width={16}
        height={16}
        src={iconUrl}
        className="size-5 rounded-full"
        alt={`Icon of ${symbol}`}
      />
      <span className="text-xs font-medium">{symbol}</span>
    </div>
  )
}
