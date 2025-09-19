import { CustomLink } from '~/components/link/CustomLink'
import { cn } from '~/utils/cn'
import { EcosystemWidget } from './EcosystemWidget'

interface Props {
  name: string
  slug: string
  href: string
  backgroundImage: string
  className?: string
  headlineText?: string
  mainText?: string
}

export function EcosystemBuildOnLink({
  name,
  href,
  backgroundImage,
  className,
  headlineText,
  mainText,
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
          className="absolute inset-0 origin-left rounded-lg bg-center bg-cover transition-[scale] ease-in-out group-hover:scale-125"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="relative flex h-full flex-col justify-center">
          <div className="font-medium text-2xs uppercase transition-opacity group-hover:opacity-0">
            {headlineText ?? `Ready to join ${name}?`}
          </div>
          <div className="group-hover:-translate-y-2 origin-left text-balance font-bold text-lg leading-tight! transition-[translate,scale] ease-in-out group-hover:translate-x-4 group-hover:scale-125 sm:text-xl">
            {mainText ?? `Build your own chain on ${name}`}
          </div>
        </div>
      </CustomLink>
    </EcosystemWidget>
  )
}
