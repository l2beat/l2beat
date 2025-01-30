'use client'
import { useCommandState } from 'cmdk'
import Image from 'next/image'
import React from 'react'
import { externalLinks } from '~/consts/external-links'
import { CheckIcon } from '~/icons/check'
import { ChevronIcon } from '~/icons/chevron'
import type {
  ProjectToken,
  ProjectTokens,
} from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
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
} from './core/command'
import { Popover, PopoverContent, PopoverTrigger } from './core/popover'
import { linkVariants } from './link/custom-link'

const MAX_PER_SOURCE = 10

interface Props {
  tokens: ProjectTokens
  value: ProjectToken | undefined
  setValue: (token: ProjectToken | undefined) => void
  className?: string
  isBridge: boolean
}

export function TokenCombobox({
  tokens,
  value,
  setValue,
  className,
  isBridge,
}: Props) {
  const [open, setOpen] = React.useState(false)

  const allTokens = [...tokens.canonical, ...tokens.external, ...tokens.native]

  const onSelect = (currentValue: string) => {
    const token =
      currentValue === value?.assetId.toString()
        ? undefined
        : allTokens.find((t) => t.assetId.toString() === currentValue)
    setValue(token)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn('group/popover-trigger h-8 justify-between', className)}
      >
        {value ? <TokenItem token={value} /> : 'Tokens'}
        <ChevronIcon className="size-3 shrink-0 transition-transform group-data-[state=open]/popover-trigger:rotate-180" />
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false}>
          <Input value={value} setValue={setValue} />
          <CommandList>
            <CommandEmpty>
              <p>Can&apos;t find a token you&apos;re looking for?</p>
              <a
                className={linkVariants()}
                href={externalLinks.tokenRequest}
                target="_blank"
              >
                Request it here
              </a>
            </CommandEmpty>
            <TokenGroup
              heading="Natively Minted Tokens"
              value={value}
              tokens={tokens.native}
              onSelect={onSelect}
            />
            <TokenGroup
              heading="Externally Bridged Tokens"
              value={value}
              tokens={tokens.external}
              onSelect={onSelect}
            />
            <TokenGroup
              heading={
                isBridge ? 'Bridged Tokens' : 'Canonically Bridged Tokens'
              }
              value={value}
              tokens={tokens.canonical}
              onSelect={onSelect}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function Input({ value, setValue }: Pick<Props, 'value' | 'setValue'>) {
  return (
    <CommandInput
      placeholder="Start typing to find more..."
      className="min-w-48"
    >
      <CommandInputActionButton
        onClick={value !== undefined ? () => setValue(undefined) : undefined}
      >
        {value !== undefined ? 'Clear' : undefined}
      </CommandInputActionButton>
    </CommandInput>
  )
}

interface TokenGroupProps {
  heading: string
  value: ProjectToken | undefined
  tokens: ProjectToken[]
  onSelect: (value: string) => void
}

function TokenGroup({ heading, tokens, value, onSelect }: TokenGroupProps) {
  const search = useCommandState((state) => state.search)
  const filteredTokens = tokens.filter((token) => tokenFilter(search, token))
  if (filteredTokens.length === 0) {
    return null
  }
  const moreCount = filteredTokens.length - MAX_PER_SOURCE
  return (
    <>
      <CommandGroup heading={heading}>
        {filteredTokens.slice(0, MAX_PER_SOURCE).map((token) => (
          <CommandItem
            key={token.assetId.toString()}
            value={token.assetId.toString()}
            onSelect={onSelect}
          >
            <CheckIcon
              className={cn(
                'mr-2 size-5 shrink-0',
                value?.assetId === token.assetId ? 'opacity-100' : 'opacity-0',
              )}
            />
            <TokenItem token={token} />
          </CommandItem>
        ))}
        {moreCount > 0 && (
          <p className="ml-7 px-2 py-1.5 text-xs font-medium">
            and {moreCount} more...
          </p>
        )}
      </CommandGroup>
      <CommandSeparator className="[&:last-of-type]:hidden" />
    </>
  )
}

interface TokenItemProps {
  token: ProjectToken
}

function TokenItem({ token }: TokenItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Image
        src={token.iconUrl}
        alt={token.name}
        width={18}
        height={18}
        className="rounded-full"
      />
      <span className="text-sm font-bold">{token.name}</span>
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
