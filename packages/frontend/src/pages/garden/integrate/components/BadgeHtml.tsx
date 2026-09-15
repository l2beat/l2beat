import { type BadgeOptions, cropsBadgeHtml } from '../badge'

/** Our own literals from badge.ts, injected so what is shown is byte-for-byte what is copied. */
export function BadgeHtml({
  options,
  className,
}: {
  options: BadgeOptions
  className?: string
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: cropsBadgeHtml(options) }}
    />
  )
}
