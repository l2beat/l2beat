import { createContext, use } from 'react'
import { cn } from '~/utils/cn'

/**
 * Set by a compact `BasicTable`: its links' hover background fills the row's
 * height, square, so a hovered cell reads as a slice of the row.
 */
export const CompactTableContext = createContext(false)

export function TableLink({
  href,
  children,
  className,
  ref,
  ...props
}: React.ComponentProps<'a'>) {
  const compact = use(CompactTableContext)
  if (href) {
    return (
      <a
        ref={ref}
        className={cn(
          'md:-mx-3 inline-flex max-h-[52px] min-h-[calc(100%-8px)] w-max items-center rounded transition-colors md:px-3',
          'md:hover:bg-pure-black/5 md:dark:hover:bg-pure-white/10',
          compact && 'h-full max-h-none min-h-0 rounded-none',
          className,
        )}
        href={href}
        {...props}
      >
        {children}
      </a>
    )
  }
  return children
}
