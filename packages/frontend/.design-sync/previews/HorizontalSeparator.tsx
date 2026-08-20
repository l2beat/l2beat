import { HorizontalSeparator } from '@l2beat/frontend'

export function Default() {
  return (
    <div className="w-full max-w-lg">
      <div className="pb-3 font-bold text-primary">Value secured</div>
      <HorizontalSeparator />
      <div className="pt-3 text-secondary text-sm">
        Total value locked across all tracked bridges.
      </div>
    </div>
  )
}

export function BetweenRows() {
  return (
    <div className="w-full max-w-lg">
      {['Arbitrum One', 'OP Mainnet', 'Base'].map((name, i) => (
        <div key={name}>
          {i > 0 && <HorizontalSeparator />}
          <div className="flex justify-between py-2 text-primary">
            <span className="font-medium">{name}</span>
            <span className="text-secondary">Rollup</span>
          </div>
        </div>
      ))}
    </div>
  )
}
