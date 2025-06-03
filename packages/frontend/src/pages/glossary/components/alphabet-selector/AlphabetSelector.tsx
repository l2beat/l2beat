import { useCallback, useRef } from 'react'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'

import { useCurrentSection } from '~/hooks/useCurrentSection'
import { scrollHorizontallyToItem } from '~/utils/scrollToItem'
import { startsWithNumber } from '~/utils/startsWithLetterOrNumber'
import { glossarySectionTreshold } from '../consts'
import { AlphabetSelectorChar } from './AlphabetSelectorChar'

const OPTIONS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface Props<T> {
  entries: T[]
}

export function AlphabetSelector<T extends { id: string }>(props: Props<T>) {
  const overflowContainer = useRef<HTMLDivElement>(null)
  const currentSection = useCurrentSection(glossarySectionTreshold)

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollHorizontallyToItem({ item, overflowingContainer }),
    [],
  )

  const optionsWithEntry = getOptionsWithEntry(props.entries)

  return (
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
              ref={(node) => {
                if (node && selected && overflowContainer.current) {
                  scrollToItem(node, overflowContainer.current)
                }
              }}
            />
          )
        })}
      </ul>
    </OverflowWrapper>
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
