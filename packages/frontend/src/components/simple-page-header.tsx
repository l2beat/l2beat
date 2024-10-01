import { cn } from '~/utils/cn'

interface PageHeaderProps {
  children: string
  description?: string
  className?: string
}

export function SimplePageHeader({
  children,
  description,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'ml-6 flex h-20 flex-col justify-center max-md:hidden',
        className,
      )}
    >
      <h1 className="mb-0.5 text-3xl font-bold">{children}</h1>
      {description && <p className="text-xs text-zinc-500">{description}</p>}
    </header>
  )
}
