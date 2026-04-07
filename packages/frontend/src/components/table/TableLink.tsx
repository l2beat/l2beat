import { cn } from '~/utils/cn'

export function TableLink({
  href,
  children,
  className,
  ref,
  ...props
}: React.ComponentProps<'a'>) {
  if (href) {
    return (
      <a
        ref={ref}
        className={cn(
          'md:-mx-3 inline-flex h-[calc(100%-8px)] max-h-[52px] w-max items-center rounded transition-colors md:px-3',
          'md:hover:bg-pure-black/5 md:dark:hover:bg-pure-white/10',
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
