import { cn } from '~/utils/cn'

interface Props {
  children: string
  description?: string
  className?: string
}

export function MainPageHeader({ children, description, className }: Props) {
  return (
    <header
      className={cn(
        'mb-1.5 ml-6 flex h-20 flex-col justify-center max-lg:hidden',
        className,
      )}
    >
      <h1
        className={cn(
          'font-bold',
          description ? 'text-2xl leading-none' : 'text-[26px]',
        )}
      >
        {children}
      </h1>
      {description && (
        <p className="mt-0.5 text-xs text-secondary">{description}</p>
      )}
    </header>
  )
}
