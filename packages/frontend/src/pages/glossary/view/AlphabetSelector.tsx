import React from 'react'

import { OverflowWrapper } from '../../../components/OverflowWrapper'
import { cn } from '../../../utils/cn'
import { startsWithNumber } from '../../../utils/startsWithLetterOrNumber'

const OPTIONS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface Props<T> {
  entries: T[]
}

export function AlphabetSelector<T extends { id: string }>(props: Props<T>) {
  const optionsWithEntry = getOptionsWithEntry(props.entries)
  return (
    <div data-role="alphabet-selector">
      <OverflowWrapper within="full-page-header">
        <ul className="flex gap-2">
          {optionsWithEntry.map(({ char, entry }) => (
            <li key={`alphabet-selector-${char}`}>
              <Char char={char} href={entry ? `#${entry.id}` : undefined} />
            </li>
          ))}
        </ul>
      </OverflowWrapper>
    </div>
  )
}

interface CharProps {
  char: string
  href?: string
}
function Char({ char, href }: CharProps) {
  return (
    <a
      href={href}
      data-role="alphabet-selector-item"
      data-char={char.toLowerCase()}
      aria-disabled={!href}
      className={cn(
        'flex size-[34px] items-center justify-center rounded border transition ease-out',
        'border-gray-300 bg-pure-white dark:border-zinc-700 dark:bg-zinc-900',
        'data-[selected]:border-pink-900 data-[selected]:bg-purple-300 data-[selected]:dark:border-pink-200 data-[selected]:dark:bg-neutral-700',
        href && 'hover:bg-gray-100 dark:hover:bg-zinc-800',
        !href &&
          'cursor-not-allowed border-gray-300 text-gray-400 dark:border-zinc-800 dark:text-zinc-500',
      )}
    >
      {char}
    </a>
  )
}

interface OptionWithEntry<T> {
  char: string
  entry: T | undefined
}

function getOptionsWithEntry<T extends { id: string }>(
  entries: T[],
): OptionWithEntry<T>[] {
  return OPTIONS.map((char) => {
    if (char === '#') {
      return {
        char,
        entry: entries.find((entry) => startsWithNumber(entry.id)),
      }
    }

    return {
      char,
      entry: entries.find((entry) =>
        entry.id.toLowerCase().startsWith(char.toLowerCase()),
      ),
    }
  })
}
