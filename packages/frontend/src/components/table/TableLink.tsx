import { use } from 'react'
import { cn } from '~/utils/cn'
import { QuietTableContext } from './QuietTableContext'

export function TableLink({
  href,
  children,
  className,
  ref,
  ...props
}: React.ComponentProps<'a'>) {
  // In a quiet table the hover fills the row's height, square, so a hovered
  // cell reads as a slice of the row.
  const quiet = use(QuietTableContext)
  if (href) {
    return (
      <a
        ref={ref}
        className={cn(
          'md:-mx-3 inline-flex max-h-[52px] min-h-[calc(100%-8px)] w-max items-center rounded transition-colors md:px-3',
          'md:hover:bg-pure-black/5 md:dark:hover:bg-pure-white/10',
          // From md, where the hover is; a phone's taller cells keep
          // the link's own height.
          quiet && 'md:h-full md:max-h-none md:min-h-0 md:rounded-none',
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
