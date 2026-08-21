import { VerticalSeparator } from '@l2beat/frontend'

export function Default() {
  return (
    <div className="flex h-12 items-center gap-4 text-primary">
      <div className="font-bold">$42.1B</div>
      <VerticalSeparator />
      <div className="text-secondary text-sm">Total value secured</div>
    </div>
  )
}

export function StatRow() {
  return (
    <div className="flex h-16 items-center gap-6">
      {[
        ['Projects', '142'],
        ['Rollups', '68'],
        ['Validiums', '31'],
      ].map(([label, value], i) => (
        <div key={label} className="flex h-full items-center gap-6">
          {i > 0 && <VerticalSeparator />}
          <div>
            <div className="font-bold text-primary text-xl">{value}</div>
            <div className="text-secondary text-xs">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
