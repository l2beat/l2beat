import { CustomLink } from '~/components/link/CustomLink'
import { cn } from '~/utils/cn'

interface Props {
  name: string
  href: string
  className?: string
  headlineText?: string
  mainText?: string
}

export function EcosystemLearnMoreLink({
  name,
  href,
  className,
  headlineText,
  mainText,
}: Props) {
  return (
    <CustomLink
      variant="plain"
      underline={false}
      href={href}
      className={cn(
        'group relative min-h-[100px] select-none overflow-hidden rounded-lg bg-linear-to-r from-branding-primary via-branding-secondary to-pure-white p-2',
        className,
      )}
    >
      <div className="relative flex h-full flex-col justify-center rounded bg-pure-black px-4 text-pure-white">
        <div className="font-medium text-2xs uppercase transition-opacity group-hover:opacity-0">
          {headlineText ?? 'Interested in learning more about the ecosystem?'}
        </div>
        <div className="group-hover:-translate-y-2 origin-left text-balance font-bold text-lg leading-tight! transition-[translate,scale] ease-in-out group-hover:translate-x-4 group-hover:scale-125 sm:text-xl">
          {mainText ?? `Learn more about ${name}`}
        </div>
      </div>
    </CustomLink>
  )
}
