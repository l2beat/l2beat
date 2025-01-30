import type { Token } from '@l2beat/shared-pure'

interface Props {
  supply: Token['supply']
}

export function TokenTypeCell({ supply }: Props) {
  const tokenType =
    supply === 'totalSupply'
      ? 'Multi-chain'
      : supply === 'circulatingSupply'
        ? 'Single-chain'
        : ''

  return (
    <div className="flex items-center justify-start gap-2">
      <span className="text-xs font-medium">{tokenType}</span>
    </div>
  )
}
