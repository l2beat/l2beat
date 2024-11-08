import { cn } from '~/utils/cn'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[#1F1F38]', className)}
      {...props}
    />
  )
}

export { Skeleton }
