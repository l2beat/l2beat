import { cn } from '~/utils/cn'

export function ExternalLink({
  href,
  className,
  ...rest
}: React.ComponentProps<'a'>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('text-blue-500 underline hover:text-blue-600', className)}
      {...rest}
    />
  )
}
