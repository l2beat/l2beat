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
        'mb-6 ml-6 mt-[18px] flex flex-col justify-center max-md:hidden',
        className,
      )}
    >
      <h1 className="text-3xl font-bold">{children}</h1>
      {description && (
        <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
      )}
    </header>
  )
}
