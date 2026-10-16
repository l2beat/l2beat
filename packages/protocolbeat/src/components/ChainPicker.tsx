import clsx from 'clsx'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import {
  AVAILABLE_CHAINS,
  type Chain,
  getChain,
  getChainIconUrl,
} from '../config/chains'
import { IconChecked } from '../icons/IconChcked'
import { IconChevronDown } from '../icons/IconChevronDown'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

const CHAINS_BY_DISPLAY_NAME = AVAILABLE_CHAINS.toSorted((a, b) =>
  a.displayName.localeCompare(b.displayName),
)

export function ChainPicker(props: {
  label: string
  value: string
  onChange: (shortName: string) => void
  onPicked: () => void
}) {
  const [open, setOpen] = useState(false)
  const picked = useRef(false)
  const chain = getChain(props.value)

  function pick(shortName: string) {
    picked.current = true
    props.onChange(shortName)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={`${props.label} chain`}
        title={chain.displayName}
        className="flex items-center gap-2 border-coffee-600 border-r px-3 transition-colors hover:bg-coffee-800 data-[state=open]:bg-coffee-800 sm:w-44"
      >
        <ChainIcon key={chain.shortName} chain={chain} />
        <span className="hidden truncate text-sm sm:inline">
          {chain.displayName}
        </span>
        <IconChevronDown className="ml-auto shrink-0 text-coffee-400" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-72 rounded-none border-coffee-600 p-0"
        onCloseAutoFocus={(e) => {
          if (picked.current) {
            picked.current = false
            e.preventDefault()
            props.onPicked()
          }
        }}
      >
        <ChainList selected={props.value} onPick={pick} />
      </PopoverContent>
    </Popover>
  )
}

function ChainList(props: {
  selected: string
  onPick: (shortName: string) => void
}) {
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(() =>
    CHAINS_BY_DISPLAY_NAME.findIndex((c) => c.shortName === props.selected),
  )
  const listRef = useRef<HTMLUListElement>(null)
  const chains = filterChains(query)

  useEffect(() => {
    listRef.current?.children[highlighted]?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(Math.max(0, Math.min(highlighted + 1, chains.length - 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(Math.max(highlighted - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const chain = chains[highlighted]
      if (chain !== undefined) {
        props.onPick(chain.shortName)
      }
    }
  }

  return (
    <div className="flex flex-col">
      <input
        autoFocus
        aria-label="Search chains"
        placeholder="Search chains"
        spellCheck={false}
        autoComplete="off"
        value={query}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          setQuery(e.target.value)
          setHighlighted(0)
        }}
        className="border-coffee-600 border-b bg-transparent px-3 py-2 text-sm placeholder:text-coffee-400/60 focus:outline-hidden"
      />
      <ul
        ref={listRef}
        role="listbox"
        className="max-h-72 overflow-y-auto py-1"
      >
        {chains.map((chain, i) => (
          <li
            key={chain.shortName}
            role="option"
            aria-selected={chain.shortName === props.selected}
            onMouseMove={() => setHighlighted(i)}
            onClick={() => props.onPick(chain.shortName)}
            className={clsx(
              'flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm',
              i === highlighted && 'bg-coffee-700',
            )}
          >
            <ChainIcon chain={chain} />
            <span className="flex-1 truncate">{chain.displayName}</span>
            <span className="font-mono text-coffee-400 text-xs">
              {chain.shortName}:
            </span>
            <IconChecked
              className={clsx(
                'shrink-0 text-autumn-300',
                chain.shortName !== props.selected && 'invisible',
              )}
            />
          </li>
        ))}
        {chains.length === 0 && (
          <li className="px-3 py-2 text-coffee-400 text-sm">
            No matching chains
          </li>
        )}
      </ul>
    </div>
  )
}

function ChainIcon(props: { chain: Chain }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <span className="size-4 shrink-0 rounded-full bg-coffee-600" />
  }
  return (
    <img
      src={getChainIconUrl(props.chain)}
      alt=""
      width={16}
      height={16}
      onError={() => setFailed(true)}
      className="size-4 shrink-0 rounded-full"
    />
  )
}

function filterChains(query: string): Chain[] {
  const needle = query.trim().toLowerCase()
  if (needle === '') {
    return CHAINS_BY_DISPLAY_NAME
  }
  const matches = CHAINS_BY_DISPLAY_NAME.filter(
    (c) =>
      c.displayName.toLowerCase().includes(needle) ||
      c.shortName.includes(needle) ||
      c.name.includes(needle) ||
      c.chainId.toString() === needle,
  )
  return matches.toSorted((a, b) => rankMatch(a, needle) - rankMatch(b, needle))
}

function rankMatch(chain: Chain, needle: string): number {
  if (chain.displayName.toLowerCase().startsWith(needle)) {
    return 0
  }
  if (chain.shortName.startsWith(needle)) {
    return 1
  }
  return 2
}
