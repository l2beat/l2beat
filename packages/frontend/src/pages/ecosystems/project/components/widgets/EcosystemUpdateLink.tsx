import { cn } from '~/utils/cn'

export function EcosystemUpdateLink({
  className,
  href,
}: {
  className?: string
  href: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'group rounded-lg bg-gradient-to-tr from-[#8A73FF] via-surface-primary to-[#FE484C] p-2',
        className,
      )}
    >
      <div className="rounded-sm bg-surface-primary px-4 py-5">
        <p className="mb-1 text-subtitle-12 uppercase transition-opacity group-hover:opacity-0">
          Ecosystem Updates
        </p>
        <p className="group-hover:-translate-y-2 origin-left font-bold text-label-value-20 transition-all will-change-transform group-hover:translate-x-4 group-hover:scale-125">
          Explore the latest Ecosystem Updates
        </p>
      </div>
    </a>
  )
}
