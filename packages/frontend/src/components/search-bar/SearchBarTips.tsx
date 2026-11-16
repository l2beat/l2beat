import { cn } from '~/utils/cn'

interface SearchTip {
  kind: string
  how: string
  /** Queries that each find something, filled in on click. */
  examples: { label: string; query: string }[]
}

/**
 * What the search matches, so it isn't left to guessing. Keep it in step
 * with what `searchIndex.ts` indexes and `getSearchBarAddressEntries.ts`
 * looks up.
 */
const SEARCH_TIPS: SearchTip[] = [
  {
    kind: 'Projects',
    how: 'By name or team: L2s, bridges, zkVMs, privacy and DeFi',
    examples: examples('arb', 'Uniswap', 'Circle'),
  },
  {
    kind: 'Tokens',
    how: 'By symbol',
    examples: examples('USDC', 'wstETH'),
  },
  {
    kind: 'Pages',
    how: 'By topic',
    examples: examples('tvs', 'activity', 'liveness'),
  },
  {
    kind: 'Addresses',
    how: 'Any contract or multisig: finds its project or token',
    examples: [
      // USDC on Ethereum
      {
        label: '0xA0b8…eB48',
        query: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      },
      // Arbitrum One's bridge
      {
        label: '0x8315…ed3a',
        query: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
      },
    ],
  },
]

export const SEARCH_TIPS_ID = 'search-tips'

export function SearchBarTips({
  onExample,
}: {
  onExample: (query: string) => void
}) {
  return (
    <section
      id={SEARCH_TIPS_ID}
      aria-labelledby={`${SEARCH_TIPS_ID}-heading`}
      className="px-4 pt-2.5 pb-3 text-sm"
    >
      <h2
        id={`${SEARCH_TIPS_ID}-heading`}
        className="mb-2 font-medium text-secondary text-xs"
      >
        What you can search
      </h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        {SEARCH_TIPS.map((tip) => (
          <div key={tip.kind} className="col-span-2 grid grid-cols-subgrid">
            <dt className="font-medium">{tip.kind}</dt>
            <dd className="flex flex-col items-start gap-1">
              <span className="text-secondary">{tip.how}</span>
              <span className="flex flex-wrap gap-1 pointer-coarse:gap-1.5">
                {tip.examples.map(({ label, query }) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => onExample(query)}
                    onKeyDown={keepEnterOnButton}
                    // Taller for a finger, where the panel has room to spare.
                    className="rounded border border-divider bg-surface-secondary pointer-coarse:px-2 px-1.5 font-mono text-xs leading-5 pointer-coarse:leading-7 transition-colors hover:border-brand hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {label}
                  </button>
                ))}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function examples(...queries: string[]) {
  return queries.map((query) => ({ label: query, query }))
}

/**
 * Enter on a focused button inside the dialog would otherwise reach cmdk,
 * which cancels it to open the highlighted result instead.
 */
export function keepEnterOnButton(e: React.KeyboardEvent) {
  if (e.key === 'Enter') e.stopPropagation()
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
        'flex h-[18px] min-w-[18px] select-none items-center justify-center rounded bg-surface-secondary px-1 font-medium text-2xs text-secondary leading-none [font-family:inherit]',
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
