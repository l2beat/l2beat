import Link from 'next/link'
import { cn } from '~/utils/cn'

interface Props {
  name: string
  href: string
  className?: string
}

export function EcosystemLearnMoreLink({ name, href, className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative min-h-[100px] select-none overflow-hidden rounded-lg bg-gradient-to-r from-[--ecosystem-primary] via-[--ecosystem-secondary] to-pure-white p-2 md:rounded-xl',
        className,
      )}
    >
      <div className="relative flex h-full flex-col justify-center rounded bg-pure-black px-4 text-pure-white">
        <div className="text-2xs font-medium uppercase transition-opacity group-hover:opacity-0">
          Interested in Ecosystem?
        </div>
        <div className="origin-left text-balance text-lg font-bold !leading-tight transition-all ease-in-out will-change-transform group-hover:-translate-y-2 group-hover:translate-x-4 group-hover:scale-125 sm:text-xl">
          Learn more about {name}
        </div>
      </div>
    </Link>
  )
}
