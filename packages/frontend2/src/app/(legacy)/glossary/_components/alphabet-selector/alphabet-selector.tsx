'use client'

import React from 'react'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'

import { useCurrentSection } from '~/hooks/use-current-section'
import { startsWithNumber } from '~/utils/startsWithLetterOrNumber'
import { AlphabetSelectorChar } from './alphabet-selector-char'

const OPTIONS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface Props<T> {
  entries: T[]
}

export function AlphabetSelector<T extends { id: string }>(props: Props<T>) {
  const currentSection = useCurrentSection({
    desktop: '164px',
    mobile: '132px',
  })
  const optionsWithEntry = getOptionsWithEntry(props.entries)

  return (
    <div data-role="alphabet-selector">
      <OverflowWrapper>
        <ul className="flex gap-2">
          {optionsWithEntry.map(({ char, entry }) => (
            <AlphabetSelectorChar
              key={`alphabet-selector-${char}`}
              char={char}
              href={entry ? `#${entry.id}` : undefined}
              selected={
                currentSection ? isSelected(currentSection?.id, char) : false
              }
            />
          ))}
        </ul>
      </OverflowWrapper>
    </div>
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

function isSelected(hash: string, char: string) {
  if (char === '#') {
    return startsWithNumber(hash)
  }
  return hash.startsWith(char.toLowerCase())
}
