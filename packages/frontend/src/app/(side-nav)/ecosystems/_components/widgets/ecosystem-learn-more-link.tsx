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
        'group relative min-h-[100px] overflow-hidden rounded-xl bg-gradient-to-r from-[--ecosystem-primary] via-[--ecosystem-secondary] to-pure-white p-2',
        className,
      )}
    >
      <div className="relative flex h-full flex-col justify-center rounded bg-pure-black pl-4 text-primary-invert">
        <div className="text-2xs font-medium uppercase transition-opacity group-hover:opacity-0">
          Interested in Ecosystem?
        </div>
        <div className="origin-left text-xl font-bold transition-all will-change-transform group-hover:-translate-y-2 group-hover:translate-x-4 group-hover:scale-125">
          Learn more about {name}
        </div>
      </div>
    </Link>
  )
}
