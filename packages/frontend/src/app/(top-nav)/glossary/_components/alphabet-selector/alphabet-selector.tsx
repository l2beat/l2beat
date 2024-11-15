'use client'

import { useCallback, useEffect, useRef } from 'react'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'

import { glossarySectionTreshold } from '~/components/nav/consts'
import { useCurrentSection } from '~/hooks/use-current-section'
import { scrollHorizontallyToItem } from '~/utils/scroll-to-item'
import { startsWithNumber } from '~/utils/starts-with-letter-or-number'
import { AlphabetSelectorChar } from './alphabet-selector-char'

const OPTIONS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface Props<T> {
  entries: T[]
}

export function AlphabetSelector<T extends { id: string }>(props: Props<T>) {
  const selectedItem = useRef<HTMLLIElement>(null)
  const overflowContainer = useRef<HTMLDivElement>(null)
  const currentSection = useCurrentSection(glossarySectionTreshold)

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollHorizontallyToItem({ item, overflowingContainer }),
    [],
  )

  useEffect(() => {
    if (!selectedItem.current || !overflowContainer.current) return
    scrollToItem(selectedItem.current, overflowContainer.current)
  }, [currentSection, scrollToItem])

  const optionsWithEntry = getOptionsWithEntry(props.entries)

  return (
    <div data-role="alphabet-selector">
      <OverflowWrapper ref={overflowContainer}>
        <ul className="flex gap-2">
          {optionsWithEntry.map(({ char, entry }) => {
            const selected = currentSection
              ? isSelected(currentSection?.id, char)
              : false
            return (
              <AlphabetSelectorChar
                key={`alphabet-selector-${char}`}
                char={char}
                href={entry ? `#${entry.id}` : undefined}
                selected={selected}
                ref={selected ? selectedItem : undefined}
              />
            )
          })}
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
