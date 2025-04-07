import { CustomLink } from '~/components/link/custom-link'
import { cn } from '~/utils/cn'
import { EcosystemWidget } from './ecosystem-widget'

interface Props {
  name: string
  slug: string
  href: string
  className?: string
}

export function EcosystemBuildOnLink({ name, slug, href, className }: Props) {
  return (
    <EcosystemWidget asChild>
      <CustomLink
        variant="plain"
        href={href}
        className={cn(
          'group relative min-h-[100px] overflow-hidden text-primary-invert no-underline',
          className,
        )}
      >
        <div
          className="absolute inset-0 origin-center rounded-xl bg-cover transition-all group-hover:scale-125"
          style={{ backgroundImage: `url(/ecosystems/${slug}/build-on.png)` }}
        />
        <div className="relative flex h-full flex-col justify-center">
          <div className="text-2xs font-medium uppercase transition-opacity group-hover:opacity-0">
            Ready to join {name}?
          </div>
          <div className="origin-left text-xl font-bold transition-all will-change-transform group-hover:-translate-y-2 group-hover:translate-x-4 group-hover:scale-125">
            Build own chain on {name}
          </div>
        </div>
      </CustomLink>
    </EcosystemWidget>
  )
}
