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
        underline={false}
        href={href}
        className={cn(
          'group relative min-h-[100px] select-none overflow-hidden text-pure-white',
          className,
        )}
      >
        <div
          className="absolute inset-0 origin-left rounded-lg bg-cover transition-all group-hover:scale-125 md:rounded-xl"
          style={{ backgroundImage: `url(/ecosystems/${slug}/build-on.png)` }}
        />
        <div className="relative flex h-full flex-col justify-center">
          <div className="text-2xs font-medium uppercase transition-opacity group-hover:opacity-0">
            Ready to join {name}?
          </div>
          <div className="origin-left text-balance text-lg font-bold !leading-tight transition-all will-change-transform group-hover:-translate-y-2 group-hover:translate-x-4 group-hover:scale-125 sm:text-xl">
            Build own chain on {name}
          </div>
        </div>
      </CustomLink>
    </EcosystemWidget>
  )
}
