import { cn } from '~/utils/cn'

interface SearchTip {
  kind: string
  how: string
  /** Queries that each find something, filled in on click. */
  examples: string[]
}

/**
 * What the search matches, so it isn't left to guessing. Keep it in step
 * with what `searchIndex.ts` indexes and `getSearchBarAddressEntries.ts`
 * looks up.
 */
const SEARCH_TIPS: SearchTip[] = [
  {
    kind: 'Projects',
    how: 'L2s, bridges, zkVMs, privacy, DeFi: by name or team',
    examples: ['arb', 'Uniswap', 'Circle'],
  },
  {
    kind: 'Tokens',
    how: 'By symbol',
    examples: ['USDC', 'wstETH'],
  },
  {
    kind: 'Pages',
    how: 'By topic',
    examples: ['tvs', 'blobs', 'liveness'],
  },
  {
    kind: 'Addresses',
    how: 'Any 0x… contract, token or multisig, to see who uses it',
    examples: [],
  },
]

export function SearchBarTips({
  onExample,
}: {
  onExample: (query: string) => void
}) {
  return (
    <section className="px-4 py-3 text-sm">
      <h2 className="mb-2 font-medium text-secondary text-xs">
        What you can search
      </h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        {SEARCH_TIPS.map((tip) => (
          <div key={tip.kind} className="col-span-2 grid grid-cols-subgrid">
            <dt className="font-medium">{tip.kind}</dt>
            <dd className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-secondary">{tip.how}</span>
              {tip.examples.length > 0 && (
                <span className="flex flex-wrap gap-1">
                  {tip.examples.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => onExample(example)}
                      className="rounded border border-divider bg-surface-secondary px-1.5 font-mono text-xs leading-5 transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      {example}
                    </button>
                  ))}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      className={cn(
        'flex h-5 min-w-5 select-none items-center justify-center rounded bg-icon-secondary px-1 font-bold font-mono text-2xs text-primary-invert leading-none',
        className,
      )}
    >
      <span className="[text-box:trim-both_cap_alphabetic]">{children}</span>
    </kbd>
  )
}

/** Rendered only in the open dialog, never on the server. */
export function isApple() {
  return /Mac|iPhone|iPad/.test(navigator.userAgent)
}
