import type { RefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import { useDevice } from '~/hooks/useDevice'
import { useVisibleSections } from '~/hooks/useVisibleSections'
import { cn } from '~/utils/cn'
import { scrollHorizontallyToItem } from '~/utils/scrollToItem'
import type { SectionNavigationItem } from './SectionNavigation'
import { isSectionSelected } from './SectionNavigation'

interface Props {
  sections: SectionNavigationItem[]
}

export function MobileSectionNavigation({ sections }: Props) {
  const selectedItem = useRef(null)
  const overflowContainer = useRef<HTMLDivElement>(null)

  // Hidden from lg up, but scrolling a hidden list still forces a layout.
  const { isDesktop } = useDevice()
  const visibleIds = useVisibleSections({ enabled: !isDesktop })
  const firstSelectedIndex = sections.findIndex((section) =>
    isSectionSelected(section, visibleIds),
  )

  const scrollToItem = useCallback(
    (item: HTMLLIElement, overflowingContainer: HTMLElement) =>
      scrollHorizontallyToItem({ item, overflowingContainer }),
    [],
  )

  useEffect(() => {
    if (isDesktop || firstSelectedIndex === -1) return
    const item = selectedItem.current
    const container = overflowContainer.current
    if (!item || !container) return
    // Delivered after the browser's own layout, so the offsets read while
    // scrolling are free. Reading them here forced a layout of the whole
    // page inside the commit that mounted this navigation.
    const afterLayout = new ResizeObserver(() => {
      afterLayout.disconnect()
      scrollToItem(item, container)
    })
    afterLayout.observe(container)
    return () => afterLayout.disconnect()
  }, [scrollToItem, firstSelectedIndex, isDesktop])

  if (sections.length === 0) return null

  return (
    <OverflowWrapper
      ref={overflowContainer}
      className="flex justify-center bg-header-primary"
      childrenClassName="w-full"
    >
      <div className="flex items-center justify-between">
        {sections.map((section, i) => {
          return (
            <Item
              key={section.id}
              ref={i === firstSelectedIndex ? selectedItem : null}
              selected={isSectionSelected(section, visibleIds)}
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
        'flex h-10 w-full items-center justify-center whitespace-nowrap border-divider border-b px-4 text-center text-xs transition-colors duration-150 motion-reduce:transition-none',
        selected &&
          'border-current border-b text-brand group-data-[has-colors=true]/section-wrapper:text-branding-primary',
      )}
    >
      {children}
    </a>
  )
}
