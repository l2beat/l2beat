import { cn } from '~/utils/cn'
import { SearchBarButton } from './search-bar/search-bar-button'

interface Props {
  children: string
  description?: string
  className?: string
}

export function MainPageHeader({ children, description, className }: Props) {
  return (
    <header
      className={cn(
        'ml-6 flex h-20 items-center justify-between max-lg:hidden',
        className,
      )}
    >
      <div className="flex flex-col justify-center">
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
      </div>
      <SearchBarButton />
    </header>
  )
}
