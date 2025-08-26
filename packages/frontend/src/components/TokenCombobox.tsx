import { useCommandState } from 'cmdk'
import React from 'react'
import { externalLinks } from '~/consts/externalLinks'
import { CheckIcon } from '~/icons/Check'
import { ChevronIcon } from '~/icons/Chevron'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import { cn } from '~/utils/cn'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandInputActionButton,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './core/Command'
import { Popover, PopoverContent, PopoverTrigger } from './core/Popover'
import { linkVariants } from './link/CustomLink'

const MAX_TOKENS = 25

interface Props {
  tokens: ProjectToken[]
  value: ProjectToken | undefined
  setValue: (token: ProjectToken | undefined) => void
  className?: string
}

export function TokenCombobox({ tokens, value, setValue, className }: Props) {
  const [open, setOpen] = React.useState(false)

  const onSelect = (currentValue: string) => {
    const token =
      currentValue === value?.id.toString()
        ? undefined
        : tokens.find((t) => t.id.toString() === currentValue)
    setValue(token)
    setOpen(false)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="group/popover-trigger h-8 justify-between">
          {value ? (
            <TokenItem token={value} />
          ) : (
            'Select token for chart preview'
          )}
          <ChevronIcon className="size-3 shrink-0 transition-transform group-data-[state=open]/popover-trigger:rotate-180" />
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Start typing to find more..."
              className="min-w-48"
            />
            <CommandList>
              <CommandEmpty>
                <p>Can&apos;t find a token you&apos;re looking for?</p>
                <a
                  className={linkVariants()}
                  href={externalLinks.tokenRequest}
                  target="_blank"
                  rel="noreferrer"
                >
                  Request it here
                </a>
              </CommandEmpty>
              <TokenGroup value={value} tokens={tokens} onSelect={onSelect} />
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <CommandInputActionButton onClick={() => setValue(undefined)}>
          Clear
        </CommandInputActionButton>
      )}
    </div>
  )
}

interface TokenGroupProps {
  value: ProjectToken | undefined
  tokens: ProjectToken[]
  onSelect: (value: string) => void
}

function TokenGroup({ tokens, value, onSelect }: TokenGroupProps) {
  const search = useCommandState((state) => state.search)
  const filteredTokens = tokens.filter((token) => tokenFilter(search, token))
  if (filteredTokens.length === 0) {
    return null
  }
  const moreCount = filteredTokens.length - MAX_TOKENS
  return (
    <>
      <CommandGroup>
        {filteredTokens.slice(0, MAX_TOKENS).map((token) => (
          <CommandItem
            key={token.id.toString()}
            value={token.id.toString()}
            onSelect={onSelect}
          >
            <CheckIcon
              className={cn(
                'mr-2 size-5 shrink-0',
                value?.id === token.id ? 'opacity-100' : 'opacity-0',
              )}
            />
            <TokenItem token={token} />
          </CommandItem>
        ))}
        {moreCount > 0 && (
          <p className="ml-7 px-2 py-1.5 font-medium text-xs">
            and {moreCount} more...
          </p>
        )}
      </CommandGroup>
      <CommandSeparator className="last-of-type:hidden" />
    </>
  )
}

interface TokenItemProps {
  token: ProjectToken
}

function TokenItem({ token }: TokenItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <img
        src={token.iconUrl}
        alt={token.name}
        width={18}
        height={18}
        className="rounded-full"
      />
      <span className="font-bold text-sm">{token.name}</span>
      <span className="max-xs:hidden">({token.symbol})</span>
    </div>
  )
}

function tokenFilter(search: string, token: ProjectToken) {
  const keywords = [token.name, token.symbol]
  if (
    keywords?.some((keyword) =>
      keyword.toLowerCase().includes(search.toLowerCase()),
    )
  ) {
    return true
  }
  return false
}
