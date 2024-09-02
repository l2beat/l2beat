'use client'
import Image from 'next/image'
import React from 'react'
import { externalLinks } from '~/consts/external-links'
import CheckIcon from '~/icons/check.svg'
import ChevronIcon from '~/icons/chevron.svg'
import {
  type ProjectToken,
  type ProjectTokens,
} from '~/server/features/scaling/tvl/tokens/get-top-tokens-for-project'
import { cn } from '~/utils/cn'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../_components/command'
import { Popover, PopoverContent, PopoverTrigger } from '../_components/popover'
import { linkVariants } from './link/custom-link'

interface Props {
  tokens: ProjectTokens
  value: ProjectToken | undefined
  setValue: (token: ProjectToken | undefined) => void
}

export function TokenCombobox({ tokens, value, setValue }: Props) {
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
      <PopoverTrigger className="group/popover-trigger w-max justify-between">
        {value ? (
          <TokenItem
            token={allTokens.find((t) => t.assetId === value.assetId)!}
          />
        ) : (
          'Tokens'
        )}
        <ChevronIcon className="ml-2 size-4 shrink-0 opacity-50 transition-transform group-data-[state=open]/popover-trigger:rotate-180" />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandList>
            <CommandEmpty>
              Can&apos;t find a token you&apos;re looking for?{' '}
              <a
                className={linkVariants()}
                href={externalLinks.tokenRequest}
                target="_blank"
              >
                Request it here
              </a>
            </CommandEmpty>
            <TokenGroup
              heading="Canonical"
              value={value}
              tokens={tokens.canonical}
              onSelect={onSelect}
            />
            <CommandSeparator />
            <TokenGroup
              heading="External"
              value={value}
              tokens={tokens.external}
              onSelect={onSelect}
            />
            <CommandSeparator />
            <TokenGroup
              heading="Native"
              value={value}
              tokens={tokens.native}
              onSelect={onSelect}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function TokenGroup({
  heading,
  tokens,
  value,
  onSelect,
}: {
  heading: string
  value: ProjectToken | undefined
  tokens: ProjectToken[]
  onSelect: (value: string) => void
}) {
  return (
    <CommandGroup heading={heading}>
      {tokens.map((token) => (
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
    </CommandGroup>
  )
}

function TokenItem({ token }: { token: ProjectToken }) {
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
      <span>({token.symbol})</span>
    </div>
  )
}
