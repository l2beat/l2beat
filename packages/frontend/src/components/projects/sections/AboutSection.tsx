import { cn } from '~/utils/cn'
import { ReadMore } from '../../ReadMore'

export function AboutSection({
  description,
  className,
}: {
  description: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-1 flex-col gap-2 text-base', className)}>
      <h2 className="text-secondary text-subtitle-12 uppercase max-md:hidden">
        About
      </h2>
      <p className="text-paragraph-14">
        <ReadMore onlyOnMobile>{description}</ReadMore>
      </p>
    </div>
  )
}
