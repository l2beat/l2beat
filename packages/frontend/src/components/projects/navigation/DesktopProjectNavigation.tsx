import type { CSSProperties } from 'react'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { useCurrentSection } from '~/hooks/useCurrentSection'
import { usePathname } from '~/hooks/usePathname'
import { useRouter } from '~/hooks/useRouter'
import { SummaryIcon } from '~/icons/Summary'
import { cn } from '~/utils/cn'
import { scrollVerticallyToItem } from '~/utils/scrollToItem'
import { UnderReviewCallout } from '../UnderReviewCallout'
import type { ProjectNavigationSection } from './types'

interface Project {
  title: string
  isUnderReview?: boolean
  slug: string
  icon: string
}
interface ProjectNavigationProps {
  project: Project
  projectVariants?: { title: string; href: string }[]
  sections: ProjectNavigationSection[]
}

export function DesktopProjectNavigation({
  project,
  projectVariants,
  sections,
}: ProjectNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState<number>()
  const [isHeaderShown, setIsHeaderShown] = useState(false)
  const currentSection = useCurrentSection()

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    setHeaderHeight(header.getBoundingClientRect().height)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderShown(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const style = useMemo(() => {
    if (!headerHeight) return undefined
    return {
      top: `${headerHeight + 16}px`,
    }
  }, [headerHeight])

  return (
    <div className="sticky top-8 w-[172px] min-w-[172px]">
      <div className="relative">
        <div
          ref={headerRef}
          className={cn(
            '-z-1 opacity-0 transition-opacity duration-300',
            isHeaderShown && 'opacity-100',
          )}
        >
          <div className="flex flex-row items-center gap-2">
            {project.slug && (
              <img
                width={24}
                height={24}
                src={project.icon}
                alt={`${project.title} logo`}
              />
            )}
            <span className="font-bold text-label-value-18">
              {project.title}
            </span>
          </div>
          {project.isUnderReview && (
            <UnderReviewCallout withoutDescription className="mt-2" />
          )}
          {projectVariants && projectVariants.length > 1 && (
            <div className="mt-2">
              <Select
                defaultValue={
                  projectVariants.find((v) => pathname.startsWith(v.href))?.href
                }
                onValueChange={(value) => {
                  router.push(value)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projectVariants.map((variant) => (
                    <SelectItem key={variant.href} value={variant.href}>
                      {variant.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <ProjectNavigationList
          sections={sections}
          isUnderReview={project.isUnderReview}
          currentSection={currentSection}
          style={isHeaderShown ? style : undefined}
        />
      </div>
    </div>
  )
}

function ProjectNavigationList({
  sections,
  isUnderReview,
  style,
  currentSection,
}: Pick<ProjectNavigationProps, 'sections'> & {
  isUnderReview: boolean | undefined
  currentSection: HTMLElement | undefined
  style?: CSSProperties
}) {
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
    <div
      className={cn(
        'absolute top-0 flex w-[172px] min-w-[172px] flex-col gap-3 overflow-y-auto font-medium text-xs leading-none transition-[top] duration-300',
        isUnderReview
          ? 'max-h-[calc(100vh-300px)]'
          : 'max-h-[calc(100vh-220px)]',
      )}
      style={style}
      ref={menuContainer}
    >
      <a
        href="#"
        className={cn(
          'flex flex-row items-center gap-1.5 transition-colors hover:text-primary',
          currentSection && currentSection.id === 'summary'
            ? 'text-primary'
            : 'text-secondary',
        )}
      >
        <SummaryIcon className="size-5" />
        Summary
      </a>
      {sections.map((section, i) => {
        const selected =
          currentSection?.id === section.id ||
          !!section.subsections?.some(
            (subsection) => subsection.id === currentSection?.id,
          )

        return (
          <Fragment key={i}>
            <a
              href={`#${section.id}`}
              ref={selected ? currentMenuEntry : null}
              className="group flex flex-row items-center gap-1.5"
            >
              <NavigationListIndex index={i + 1} selected={selected} />
              <span
                className={cn(
                  'text-label-value-14 hover:text-primary',
                  selected ? 'text-primary' : 'text-secondary',
                )}
              >
                {section.title}
              </span>
            </a>
            {section.subsections && (
              <div className="flex flex-col">
                {section.subsections.map((subsection, i) => (
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
    </div>
  )
}

function NavigationListIndex(props: { index: number; selected: boolean }) {
  return (
    <div
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded text-center text-label-value-12',
        props.selected
          ? 'bg-linear-to-r from-purple-100 to-pink-100 text-white group-data-[has-colors=true]/section-wrapper:bg-[image:none] group-data-[has-colors=true]/section-wrapper:bg-branding-primary'
          : 'bg-surface-tertiary text-secondary group-hover:text-primary',
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
      className={cn('flex flex-row items-center ')}
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
            'flex-1 pb-3 transition-opacity hover:opacity-100',
            !props.selected && 'opacity-60',
          )}
        >
          {props.title}
        </div>
      </div>
    </a>
  )
}
