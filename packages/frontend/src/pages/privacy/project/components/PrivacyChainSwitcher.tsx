import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '~/components/core/Popover'
import { ChevronIcon } from '~/icons/Chevron'
import type { PrivacyChainLink } from '~/server/features/privacy/utils/getPrivacyTrackedChains'
import { cn } from '~/utils/cn'

interface Props {
  chains: PrivacyChainLink[]
  /** Id of the chain the page shows. */
  current: string
  className?: string
}

/**
 * Picks the deployment the page describes. Items are links, so hovering one
 * prefetches that chain's page like any other internal link.
 */
export function PrivacyChainSwitcher({ chains, current, className }: Props) {
  const selected = chains.find((chain) => chain.id === current) ?? chains[0]
  const primary = chains[0]
  if (!selected || !primary) return null
  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Deployment on ${selected.name}, switch chain`}
        className={cn(
          'group h-8 gap-2 rounded border border-divider bg-surface-primary px-2 font-bold text-label-value-14 hover:bg-surface-secondary md:text-label-value-14',
          className,
        )}
      >
        <img
          src={selected.iconUrl}
          alt=""
          width={20}
          height={20}
          className="size-5 rounded-full"
        />
        <span className="truncate">{selected.name}</span>
        <ChevronIcon className="ml-auto size-2.5 shrink-0 fill-current transition-transform group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          aria-label="Deployments"
          align="end"
          className="flex min-w-52 flex-col gap-1 p-1"
        >
          {chains.map((chain) => (
            <a
              key={chain.id}
              href={chain.href}
              aria-current={chain.id === selected.id ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 rounded px-2 py-1.5 text-label-value-14 hover:bg-surface-secondary',
                chain.id === selected.id && 'bg-surface-secondary font-bold',
              )}
            >
              <img
                src={chain.iconUrl}
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-full"
              />
              {chain.name}
            </a>
          ))}
          <p className="border-divider border-t px-2 pt-2 pb-1 text-paragraph-12 text-secondary">
            Statistics and contracts follow the chain. The risk assessment
            describes the deployment on {primary.name}.
          </p>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
}
