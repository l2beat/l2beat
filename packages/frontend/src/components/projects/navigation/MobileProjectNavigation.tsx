import type { RefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import { useCurrentSection } from '~/hooks/useCurrentSection'
import { cn } from '~/utils/cn'
import { scrollHorizontallyToItem } from '~/utils/scrollToItem'
import type { ProjectNavigationSection } from './types'

interface Props {
  sections: ProjectNavigationSection[]
}

export function MobileProjectNavigation({ sections }: Props) {
  const selectedItem = useRef(null)
  const overflowContainer = useRef<HTMLDivElement>(null)

  const currentSection = useCurrentSection()
  const isSummarySection = currentSection && currentSection.id === 'summary'

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollHorizontallyToItem({ item, overflowingContainer }),
    [],
  )

  useEffect(() => {
    if (!selectedItem.current || !overflowContainer.current || !currentSection)
      return
    scrollToItem(selectedItem.current, overflowContainer.current)
  }, [scrollToItem, currentSection])

  if (sections.length === 0) return null

  return (
    <OverflowWrapper
      ref={overflowContainer}
      className="flex justify-center bg-header-primary"
      childrenClassName="w-full"
    >
      <div className="flex items-center justify-between">
        <Item
          href="#"
          ref={isSummarySection ? selectedItem : null}
          selected={!!isSummarySection}
        >
          Summary
        </Item>
        {sections.map((section) => {
          const selected =
            section.id === currentSection?.id ||
            section.subsections?.some((s) => s.id === currentSection?.id)
          return (
            <Item
              key={section.id}
              ref={selected ? selectedItem : null}
              selected={!!selected}
              href={`#${section.id}`}
            >
              {section.title}
            </Item>
          )
        })}
      </div>
    </OverflowWrapper>
  )
}

function Item({
  ref,
  selected,
  href,
  children,
}: {
  ref: RefObject<null> | null
  selected: boolean
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        'flex h-10 w-full items-center justify-center whitespace-nowrap border-divider border-b px-4 text-center text-xs transition-colors',
        selected &&
          'border-current border-b text-brand group-data-[has-colors=true]/section-wrapper:text-branding-primary',
      )}
    >
      {children}
    </a>
  )
}
