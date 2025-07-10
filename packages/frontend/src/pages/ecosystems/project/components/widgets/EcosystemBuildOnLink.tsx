import { CustomLink } from '~/components/link/CustomLink'
import { cn } from '~/utils/cn'
import { EcosystemWidget } from './EcosystemWidget'

interface Props {
  name: string
  slug: string
  href: string
  backgroundImage: string
  className?: string
}

export function EcosystemBuildOnLink({
  name,
  href,
  backgroundImage,
  className,
}: Props) {
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
          className="absolute inset-0 origin-left rounded-lg bg-center bg-cover transition-all ease-in-out group-hover:scale-125"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="relative flex h-full flex-col justify-center">
          <div className="font-medium text-2xs uppercase transition-opacity group-hover:opacity-0">
            Ready to join {name}?
          </div>
          <div className="group-hover:-translate-y-2 origin-left text-balance font-bold text-lg leading-tight! transition-all ease-in-out will-change-transform group-hover:translate-x-4 group-hover:scale-125 sm:text-xl">
            Build own chain on {name}
          </div>
        </div>
      </CustomLink>
    </EcosystemWidget>
  )
}
