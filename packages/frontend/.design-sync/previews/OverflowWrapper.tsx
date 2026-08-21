import { OverflowWrapper } from '@l2beat/frontend'

const CHAINS = [
  'Arbitrum One',
  'OP Mainnet',
  'Base',
  'zkSync Era',
  'Starknet',
  'Linea',
  'Scroll',
  'Polygon zkEVM',
  'Blast',
  'Mode',
]

export function ScrollableRow() {
  return (
    <div className="w-full max-w-lg text-primary">
      <OverflowWrapper>
        <div className="flex gap-2 py-2">
          {CHAINS.map((c) => (
            <div
              key={c}
              className="shrink-0 rounded-lg bg-surface-primary px-3 py-2 font-medium text-sm"
            >
              {c}
            </div>
          ))}
        </div>
      </OverflowWrapper>
    </div>
  )
}

export function FitsWithoutScrolling() {
  return (
    <div className="w-full max-w-lg text-primary">
      <OverflowWrapper>
        <div className="flex gap-2 py-2">
          {CHAINS.slice(0, 3).map((c) => (
            <div
              key={c}
              className="shrink-0 rounded-lg bg-surface-primary px-3 py-2 font-medium text-sm"
            >
              {c}
            </div>
          ))}
        </div>
      </OverflowWrapper>
    </div>
  )
}
