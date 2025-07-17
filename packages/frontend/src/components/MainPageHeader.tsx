import { cn } from '~/utils/cn'
import { ShowMoreText } from './ShowMoreText'
import { SearchBarButton } from './search-bar/SearchBarButton'

interface Props {
  children: React.ReactElement | string
  className?: string
  description?: React.ReactElement | string
}

export function MainPageHeader({ children, className, description }: Props) {
  return (
    <div>
      <header
        className={cn(
          'ml-2 flex items-center justify-between pt-[18px] pb-5 max-lg:hidden',
          !!description && 'pb-4',
          className,
        )}
      >
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-[26px]">{children}</h1>
        </div>
        <div className="flex items-center gap-5">
          <SearchBarButton />
        </div>
      </header>
      {!!description && (
        <div className="flex flex-col pl-0 md:flex-col-reverse md:gap-2 md:pb-3 lg:pl-2">
          {description && (
            <ShowMoreText
              pageTitle={typeof children === 'string' ? children : ''}
              textClassName="text-xs font-normal text-secondary"
              className="px-4 pt-4 md:p-0"
            >
              {description}
            </ShowMoreText>
          )}
        </div>
      )}
    </div>
  )
}
