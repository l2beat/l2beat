import type { CSSProperties } from 'react'
import { Fragment, useCallback, useEffect, useRef } from 'react'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { useDevice } from '~/hooks/useDevice'
import { useVisibleSections } from '~/hooks/useVisibleSections'
import { SummaryIcon } from '~/icons/Summary'
import { cn } from '~/utils/cn'
import { scrollVerticallyToItem } from '~/utils/scrollToItem'

export interface SectionNavigationItem {
  id: string
  title: string
  subsections?: Omit<SectionNavigationItem, 'subsections'>[]
}

export function SectionNavigation({
  sections,
  style,
  className,
}: {
  sections: SectionNavigationItem[]
  className?: string
  style?: CSSProperties
}) {
  const indexOffset = sections.some((section) => section.id === 'summary')
    ? -1
    : 0
  // Mounted inside a `hidden lg:block` wrapper, so below lg only the mobile
  // navigation should measure sections.
  const { isDesktop } = useDevice()
  const visibleIds = useVisibleSections({ enabled: isDesktop })
  const firstSelectedIndex = sections.findIndex((item) =>
    isSectionSelected(item, visibleIds),
  )
  const currentMenuEntry = useRef<HTMLAnchorElement>(null)
  const menuContainer = useRef<HTMLDivElement>(null)

  const scrollToItem = useCallback(
    (item: HTMLElement, overflowingContainer: HTMLElement) =>
      scrollVerticallyToItem({
        item,
        overflowingContainer,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      }),
    [],
  )

  useEffect(() => {
    if (firstSelectedIndex === -1) return
    if (currentMenuEntry.current && menuContainer.current) {
      scrollToItem(currentMenuEntry.current, menuContainer.current)
    }
  }, [scrollToItem, firstSelectedIndex])

  return (
    <ScrollWithGradient
      className={cn(
        'absolute top-0 flex w-full flex-col gap-3 font-medium text-xs leading-none transition-[top] duration-200 ease-in-out motion-reduce:transition-none',
        className,
      )}
      style={style}
      ref={menuContainer}
    >
      {sections.map((item, i) => {
        const selected = isSectionSelected(item, visibleIds)

        return (
          <Fragment key={i}>
            <a
              href={`#${item.id}`}
              ref={i === firstSelectedIndex ? currentMenuEntry : null}
              className="group flex flex-row gap-1.5"
              data-selected={selected}
            >
              {item.id === 'summary' ? (
                <SummaryIcon className="-left-px relative size-5 opacity-80 group-hover:opacity-100 group-data-[selected=true]:opacity-100" />
              ) : (
                <NavigationListIndex index={i + indexOffset + 1} />
              )}
              <span
                className={cn(
                  'mt-[3px] text-label-value-14 transition-colors duration-150 hover:text-primary motion-reduce:transition-none',
                  selected ? 'text-primary' : 'text-secondary',
                )}
              >
                {item.title}
              </span>
            </a>
            {item.subsections && (
              <NavigationSubsections
                subsections={item.subsections}
                visibleIds={visibleIds}
              />
            )}
          </Fragment>
        )
      })}
    </ScrollWithGradient>
  )
}

export function isSectionSelected(
  item: SectionNavigationItem,
  visibleIds: string[],
) {
  return (
    visibleIds.includes(item.id) ||
    !!item.subsections?.some((subsection) => visibleIds.includes(subsection.id))
  )
}

function NavigationListIndex(props: { index: number }) {
  return (
    <div
      className={cn(
        'relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-lg text-center text-label-value-12',
        'bg-surface-tertiary text-secondary transition-colors duration-150 group-hover:text-primary motion-reduce:transition-none',
        'group-data-[selected=true]:text-white',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none',
          'bg-brand',
          'group-data-[selected=true]:opacity-100',
        )}
      />
      <span className="relative">{props.index}</span>
    </div>
  )
}

/**
 * Selected neighbours share one unbroken bar, so a run of visible
 * subsections reads as a single highlighted stretch of the side border.
 */
function NavigationSubsections(props: {
  subsections: Omit<SectionNavigationItem, 'subsections'>[]
  visibleIds: string[]
}) {
  const selected = props.subsections.map((subsection) =>
    props.visibleIds.includes(subsection.id),
  )

  return (
    // Cancels the entries' outer padding, which is there only to make the
    // bar continuous between them.
    <div className="-my-[3px] flex flex-col">
      {props.subsections.map((subsection, i) => (
        <NavigationSubsectionEntry
          key={i}
          {...subsection}
          selected={!!selected[i]}
          joinsAbove={!!selected[i] && !!selected[i - 1]}
          joinsBelow={!!selected[i] && !!selected[i + 1]}
        />
      ))}
    </div>
  )
}

function NavigationSubsectionEntry(props: {
  title: string
  id: string
  selected: boolean
  joinsAbove: boolean
  joinsBelow: boolean
}) {
  return (
    <a href={`#${props.id}`} className="group flex flex-row gap-3">
      <div className="relative flex w-6 justify-center">
        <div className="border-divider border-l" />
        <div
          className={cn(
            'absolute w-[5px] bg-brand',
            'transition-opacity duration-150 ease-out motion-reduce:transition-none',
            props.joinsAbove ? 'top-0' : 'top-0.5 rounded-t-full',
            props.joinsBelow ? 'bottom-0' : 'bottom-0.5 rounded-b-full',
            props.selected ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
      <div
        className={cn(
          'flex-1 py-[5px] transition-opacity duration-150 hover:opacity-100 motion-reduce:transition-none',
          !props.selected && 'opacity-60',
        )}
      >
        {props.title}
      </div>
    </a>
  )
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
