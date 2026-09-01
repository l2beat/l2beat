import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Skeleton } from '~/components/core/Skeleton'
import { SectionNavigation } from '~/components/section-navigation/SectionNavigation'
import { usePathname } from '~/hooks/usePathname'
import { useRouter } from '~/hooks/useRouter'
import { cn } from '~/utils/cn'
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
    <div className="sticky top-8 w-full">
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
                <SelectTrigger className="max-w-45">
                  <div className="min-w-0 max-w-31 truncate">
                    <SelectValue />
                  </div>
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

        <SectionNavigation
          sections={sections}
          className={
            project.isUnderReview
              ? 'max-h-[calc(100vh-300px)]'
              : 'max-h-[calc(100vh-220px)]'
          }
          style={isHeaderShown ? style : undefined}
        />
      </div>
    </div>
  )
}

export function DesktopProjectNavigationSkeleton({
  itemCount = 7,
}: {
  itemCount?: number
}) {
  return (
    <div className="sticky top-8 w-full" aria-hidden>
      <div className="relative">
        <div className="absolute top-0 flex w-full flex-col gap-3">
          {Array.from({ length: itemCount }).map((_, i) => (
            <div key={i} className="flex flex-row gap-1.5">
              <Skeleton className="size-5 shrink-0 rounded-lg" />
              <Skeleton
                className={cn(
                  'mt-[3px] h-3.5',
                  i % 3 === 0 && 'w-24',
                  i % 3 === 1 && 'w-32',
                  i % 3 === 2 && 'w-20',
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
