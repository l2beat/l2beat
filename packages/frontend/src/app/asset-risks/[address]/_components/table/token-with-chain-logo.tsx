import Image from 'next/image'

interface Props {
  token: {
    logoUrl: string
    symbol: string
  }
  chain: {
    logoUrl: string
    name: string
  }
}

export function TokenWithChainLogo({ token, chain }: Props) {
  return (
    <div className="relative">
      <Image
        src={token.logoUrl}
        alt={`${token.symbol} icon`}
        width={32}
        height={32}
        className="min-h-8 min-w-8"
      />
      <Image
        src={chain.logoUrl}
        alt={`${chain.name} icon`}
        width={18}
        height={18}
        className="absolute bottom-0 right-0 min-h-[18px] min-w-[18px] translate-x-1/2 translate-y-1/2"
      />
    </div>
  )
}
