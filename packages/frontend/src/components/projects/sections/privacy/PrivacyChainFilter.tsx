import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { cn } from '~/utils/cn'
import { ChainIcon, type SectionChain } from '../SectionChainBadge'

const ALL_CHAINS = 'all'

// The small size, which the chain links share so the summary's two switches
// look the same.
const SMALL_GROUP = 'h-7 p-0.5'
const SMALL_ITEM = 'md:text-xs'

export interface PrivacyChainFilterOption extends SectionChain {
  /** Why the chain can't be picked, e.g. its value is not tracked. */
  disabledReason?: string
}

/**
 * Narrows the metrics of a project deployed on several chains to one chain.
 * Undefined is all chains, which the metrics add up.
 */
export function PrivacyChainFilter({
  name,
  chains,
  value,
  onChange,
  size,
  className,
}: {
  name: string
  /** Small sits in a line of text, like the summary's caption. */
  size?: 'small'
  chains: PrivacyChainFilterOption[]
  value: string | undefined
  onChange: (chain: string | undefined) => void
  className?: string
}) {
  return (
    <RadioGroup
      name={name}
      aria-label="Chain"
      value={value ?? ALL_CHAINS}
      onValueChange={(picked) =>
        onChange(picked === ALL_CHAINS ? undefined : picked)
      }
      className={cn(
        'max-w-full overflow-x-auto',
        size === 'small' && SMALL_GROUP,
        className,
      )}
    >
      <RadioGroupItem
        value={ALL_CHAINS}
        className={cn('whitespace-nowrap', size === 'small' && SMALL_ITEM)}
      >
        All chains
      </RadioGroupItem>
      {chains.map((chain) => (
        <RadioGroupItem
          key={chain.id}
          value={chain.id}
          disabled={chain.disabledReason !== undefined}
          title={chain.disabledReason}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap',
            size === 'small' && SMALL_ITEM,
          )}
        >
          <ChainIcon chain={chain} className="size-3.5 ring-surface-primary" />
          {chain.name}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  )
}

/**
 * Links between the pages of a project's researched deployments, which look
 * like the small chain switch beside them but load another page.
 */
export function PrivacyChainLinks({
  label,
  chains,
  current,
}: {
  label: string
  chains: (SectionChain & { href: string })[]
  current: string
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'inline-flex w-max max-w-full items-center gap-1 overflow-x-auto rounded-lg font-medium',
        'bg-surface-primary primary-card:bg-surface-secondary',
        SMALL_GROUP,
      )}
    >
      {chains.map((chain) => {
        const isCurrent = chain.id === current
        return (
          <a
            key={chain.id}
            href={chain.href}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'flex h-full items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-xs md:text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
              SMALL_ITEM,
              isCurrent
                ? 'bg-surface-tertiary primary-card:bg-pure-white dark:primary-card:bg-black'
                : 'hover:text-secondary',
            )}
          >
            <ChainIcon
              chain={chain}
              className="size-3.5 ring-surface-primary"
            />
            {chain.name}
          </a>
        )
      })}
    </nav>
  )
}
