import type { ZkCatalogTag } from '@l2beat/config'
import { Badge } from '~/components/badge/Badge'
import { cn } from '~/utils/cn'
import { TechStackTag } from './TechStackTag'

export function TechStackCell({
  tags,
  className,
}: {
  tags: ZkCatalogTag[] | undefined
  className?: string
  labelClassName?: string
  tagWrapperClassName?: string
}) {
  if (!tags || tags.length === 0) {
    return (
      <Badge
        type="gray"
        size="small"
        className="border border-[#656565] bg-[#c2c2c2] py-0.5 text-[13px] text-secondary"
      >
        No final wrap
      </Badge>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-nowrap gap-x-[5px] gap-y-1 overflow-x-auto py-2 md:max-h-16.5 md:min-w-[200px] md:flex-wrap',
        className,
      )}
    >
      {tags.map((tag, i) => (
        <TechStackTag key={`${tag.name}-${i}`} tag={tag} />
      ))}
    </div>
  )
}
