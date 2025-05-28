import Image from 'next/image'
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
    icon: string
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
        {projects.slice(0, visibleCount).map(({ slug, name, icon }) => (
          <Tooltip key={slug}>
            <a href={`/scaling/projects/${slug}`}>
              <TooltipTrigger>
                <Image
                  src={icon}
                  alt={name}
                  width={LOGO_SIZE}
                  height={LOGO_SIZE}
                />
              </TooltipTrigger>
            </a>
            <TooltipContent>{name}</TooltipContent>
          </Tooltip>
        ))}
        {visibleCount < projects.length && (
          <div className="flex-none text-2xs text-secondary">
            +{projects.length - visibleCount} more
          </div>
        )}
      </div>
    </div>
  )
}
