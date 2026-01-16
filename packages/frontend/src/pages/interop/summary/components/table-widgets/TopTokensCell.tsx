import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { TokenData } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function TopTokensCell({ tokens }: { tokens: TokenData[] }) {
  const topTokens = tokens.slice(0, 5)
  const restTokens = tokens.slice(5)

  return (
    <div className="flex gap-1.5">
      <div className="-space-x-1.5 flex items-center">
        {topTokens.map((token, i) => (
          <TokenIconWithTooltip key={token.id} token={token} index={i} />
        ))}
      </div>
      {restTokens.length > 0 && (
        <RestTokensDialog restTokens={restTokens} allTokens={tokens} />
      )}
    </div>
  )
}

function TokenIconWithTooltip({
  token,
  index,
}: {
  token: TokenData
  index: number
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <img
          key={token.id}
          src={token.iconUrl ?? ''}
          alt={token.symbol}
          className="relative size-5 min-w-5 rounded-full bg-white shadow"
          style={{ zIndex: 5 - index }}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-bold text-label-value-15">{token.symbol}</p>
        <p className="text-label-value-13 text-secondary">
          {formatCurrency(token.volume, 'usd')}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

function RestTokensDialog({
  restTokens,
  allTokens,
}: {
  restTokens: TokenData[]
  allTokens: TokenData[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className="font-medium text-label-value-12 hover:underline"
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        +{restTokens.length} more
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Top tokens by volume"
        description="Search for tokens"
      >
        <Command className="rounded-none">
          <CommandInput placeholder="Start typing to find token..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {allTokens.map((token) => (
                <CommandItem
                  key={token.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={token.iconUrl ?? ''}
                      alt={token.symbol}
                      className="size-5"
                    />
                    <span className="font-bold text-label-value-15">
                      {token.symbol}
                    </span>
                  </div>
                  <span className="font-medium text-label-value-14 text-secondary">
                    {formatCurrency(token.volume, 'usd')}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
