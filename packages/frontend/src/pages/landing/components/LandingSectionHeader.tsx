import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

/** A section's small label, with a link to the whole of it at the right. */
export function LandingSectionHeader({
  title,
  link,
  labelClassName,
}: {
  title: string
  link?: { title: string; href: string; external?: boolean }
  labelClassName: string
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className={cn(labelClassName)}>{title}</h2>
      {link && (
        <a
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer noopener' : undefined}
          className="group inline-flex items-center gap-1.5 font-medium text-label-value-13 text-secondary transition-colors hover:text-primary"
        >
          {link.title}
          <ChevronIcon className="-rotate-90 size-2 fill-current transition-transform group-hover:translate-x-0.5" />
        </a>
      )}
    </div>
  )
}
