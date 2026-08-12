import type { TokenTilesFacets } from '~/server/features/tokens/getTokenGraphTilesPage'
import { cn } from '~/utils/cn'

export interface TokenGraphFilterState {
  chain: string | undefined
  plugin: string | undefined
  mechanism: 'lockAndMint' | 'burnAndMint' | undefined
  includeWithoutRelations: boolean
}

export function TokenGraphFilters({
  facets,
  value,
  onChange,
  resultCount,
}: {
  facets: TokenTilesFacets | undefined
  value: TokenGraphFilterState
  onChange: (next: TokenGraphFilterState) => void
  resultCount: number
}) {
  // Only values that actually exist are offered, so no filter on its own can
  // produce an empty grid.
  const chains = facets?.chains ?? []
  const plugins = facets?.plugins ?? []

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Select
        label="Chain"
        value={value.chain}
        options={chains}
        onChange={(chain) => onChange({ ...value, chain })}
      />
      <Select
        label="Bridge"
        value={value.plugin}
        options={plugins}
        onChange={(plugin) => onChange({ ...value, plugin })}
      />
      <div className="flex overflow-hidden rounded-md border border-divider">
        <Toggle
          isActive={value.mechanism === undefined}
          onClick={() => onChange({ ...value, mechanism: undefined })}
        >
          Any relation
        </Toggle>
        <Toggle
          isActive={value.mechanism === 'lockAndMint'}
          onClick={() => onChange({ ...value, mechanism: 'lockAndMint' })}
        >
          Backed
        </Toggle>
        <Toggle
          isActive={value.mechanism === 'burnAndMint'}
          onClick={() => onChange({ ...value, mechanism: 'burnAndMint' })}
        >
          Burn-mint
        </Toggle>
      </div>

      <label className="flex items-center gap-2 text-label-value-13 text-secondary">
        <input
          type="checkbox"
          checked={value.includeWithoutRelations}
          onChange={(event) =>
            onChange({
              ...value,
              includeWithoutRelations: event.target.checked,
            })
          }
        />
        Include tokens with no relations
      </label>

      <span className="ml-auto text-label-value-13 text-secondary">
        {resultCount} {resultCount === 1 ? 'token' : 'tokens'}
      </span>
    </div>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | undefined
  options: [string, number][]
  onChange: (next: string | undefined) => void
}) {
  return (
    <label className="flex items-center gap-2 text-label-value-13 text-secondary">
      {label}
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || undefined)}
        className="rounded-md border border-divider bg-surface-primary px-2 py-1 font-medium text-label-value-13 text-primary"
      >
        <option value="">All</option>
        {options.map(([option, count]) => (
          <option key={option} value={option}>
            {option} ({count})
          </option>
        ))}
      </select>
    </label>
  )
}

function Toggle({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1 font-medium text-label-value-13',
        isActive
          ? 'bg-brand text-white'
          : 'bg-surface-primary text-secondary hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}
