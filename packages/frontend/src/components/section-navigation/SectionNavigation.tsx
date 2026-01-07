import { Slot } from '@radix-ui/react-slot'
import type { CSSProperties } from 'react'
import { Fragment, useCallback, useEffect, useRef } from 'react'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { useCurrentSection } from '~/hooks/useCurrentSection'
import { cn } from '~/utils/cn'
import { scrollVerticallyToItem } from '~/utils/scrollToItem'

export interface SectionNavigationItem {
  id: string
  title: string
  icon?: React.ReactNode
  subsections?: Omit<SectionNavigationItem, 'subsections'>[]
}

export function SectionNavigation({
  sections,
  style,
  className,
  indexOffset = 0,
}: {
  sections: SectionNavigationItem[]
  className?: string
  style?: CSSProperties
  indexOffset?: number
}) {
  const currentSection = useCurrentSection()
  const currentMenuEntry = useRef<HTMLAnchorElement>(null)
  const menuContainer = useRef<HTMLDivElement>(null)

  const scrollToItem = useCallback(
    (item: HTMLElement, overflowingContainer: HTMLElement) =>
      scrollVerticallyToItem({
        item,
        overflowingContainer,
        behavior: 'smooth',
      }),
    [],
  )

  useEffect(() => {
    if (currentSection && currentMenuEntry.current && menuContainer.current) {
      scrollToItem(currentMenuEntry.current, menuContainer.current)
    }
  }, [scrollToItem, currentSection])

  return (
    <ScrollWithGradient
      className={cn(
        'absolute top-0 flex w-full flex-col gap-3 font-medium text-xs leading-none transition-[top] duration-300',
        className,
      )}
      style={style}
      ref={menuContainer}
    >
      {sections.map((item, i) => {
        const selected =
          currentSection?.id === item.id ||
          !!item.subsections?.some(
            (subsection) => subsection.id === currentSection?.id,
          )

        return (
          <Fragment key={i}>
            <a
              href={`#${item.id}`}
              ref={selected ? currentMenuEntry : null}
              className="group flex flex-row gap-1.5"
              data-selected={selected}
            >
              {item.icon ? (
                <Slot className="size-5 opacity-80 group-hover:opacity-100 group-data-[selected=true]:opacity-100">
                  {item.icon}
                </Slot>
              ) : (
                <NavigationListIndex index={i + indexOffset + 1} />
              )}
              <span
                className={cn(
                  'mt-[3px] text-label-value-14 hover:text-primary',
                  selected ? 'text-primary' : 'text-secondary',
                )}
              >
                {item.title}
              </span>
            </a>
            {item.subsections && (
              <div className="flex flex-col">
                {item.subsections.map((subsection, i) => (
                  <NavigationSubsectionEntry
                    key={i}
                    {...subsection}
                    selected={subsection.id === currentSection?.id}
                  />
                ))}
              </div>
            )}
          </Fragment>
        )
      })}
    </ScrollWithGradient>
  )
}

function NavigationListIndex(props: { index: number }) {
  return (
    <div
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-lg text-center text-label-value-12',
        'bg-surface-tertiary text-secondary group-hover:text-primary',
        'group-data-[selected=true]:group-data-[has-colors=true]/section-wrapper:bg-[image:none] group-data-[selected=true]:group-data-[has-colors=true]/section-wrapper:bg-branding-primary group-data-[selected=true]:bg-linear-to-r group-data-[selected=true]:from-purple-100 group-data-[selected=true]:to-pink-100 group-data-[selected=true]:text-white',
      )}
    >
      <span>{props.index}</span>
    </div>
  )
}

function NavigationSubsectionEntry(props: {
  title: string
  id: string
  selected: boolean
}) {
  return (
    <a
      key={props.id}
      href={`#${props.id}`}
      className="group flex flex-row items-center"
    >
      <div className="flex flex-row gap-3">
        {/* Left side */}
        <div className="flex w-6 flex-col items-center">
          {props.selected && (
            <div className="absolute h-[18px] w-[5px] rounded-full bg-linear-to-r from-purple-100 to-pink-100 group-data-[has-colors=true]/section-wrapper:bg-[image:none] group-data-[has-colors=true]/section-wrapper:bg-branding-primary" />
          )}
          <div className="h-full border-divider border-l" />
        </div>
        {/* Right side */}
        <div
          className={cn(
            'flex-1 pt-0.5 pb-2 transition-opacity hover:opacity-100 group-last:pb-0.5',
            !props.selected && 'opacity-60',
          )}
        >
          {props.title}
        </div>
      </div>
    </a>
  )
}
