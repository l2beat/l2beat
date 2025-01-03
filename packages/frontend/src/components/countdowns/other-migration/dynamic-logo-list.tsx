import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'

const OFFSET = 54
const GAP = 10
const LOGO_SIZE = 24

interface Props {
  projects: {
    slug: string
    name: string
  }[]
}
export function DynamicLogoList({ projects }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateVisibleCount = () => {
      const containerWidth = container.offsetWidth

      const count = Math.floor((containerWidth - OFFSET) / (LOGO_SIZE + GAP))
      setVisibleCount(count)
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)

    return () => {
      window.removeEventListener('resize', updateVisibleCount)
    }
  }, [])
  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        style={{
          gap: `${GAP}px`,
        }}
        className="flex items-center overflow-hidden"
      >
        {projects.slice(0, visibleCount).map(({ slug, name }) => (
          <Tooltip key={slug}>
            <TooltipTrigger>
              <Link href={`/projects/${slug}`}>
                <Image
                  src={`/icons/${slug}.png`}
                  alt={name}
                  width={LOGO_SIZE}
                  height={LOGO_SIZE}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
          </Tooltip>
        ))}
        {visibleCount < projects.length && (
          <Tooltip>
            <TooltipTrigger className="flex-none text-2xs text-secondary">
              + {projects.length - visibleCount} more
            </TooltipTrigger>
            <TooltipContent>
              {projects.map(({ name }) => name).join(', ')}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
