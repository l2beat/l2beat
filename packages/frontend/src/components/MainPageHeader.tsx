import { PROJECT_COUNTDOWNS } from '@l2beat/config/build/global/countdowns'
import { UnixTime } from '@l2beat/shared-pure'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import { ShowMoreText } from './ShowMoreText'
import { useRecategorisationPreviewContext } from './recategorisation-preview/RecategorisationPreviewProvider'
import { RecategorisationPreviewSwitch } from './recategorisation-preview/RecategorisationPreviewSwitch'
import { SearchBarButton } from './search-bar/SearchBarButton'

interface Props {
  children: React.ReactElement | string
  className?: string
  description?: React.ReactElement | string
  warning?: React.ReactElement | string
}

export function MainPageHeader({
  children,
  className,
  description,
  warning,
}: Props) {
  const { isScalingMainPage } = useRecategorisationPreviewContext()

  return (
    <div>
      <header
        className={cn(
          'ml-2 flex items-center justify-between py-5 max-lg:hidden',
          (!!description || !!warning) && 'pb-4',
          className,
        )}
      >
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-[26px]">{children}</h1>
        </div>
        <div className="flex items-center gap-5">
          {isScalingMainPage &&
            PROJECT_COUNTDOWNS.otherMigration > UnixTime.now() && (
              <RecategorisationPreviewSwitch />
            )}
          <SearchBarButton />
        </div>
      </header>
      {(!!description || !!warning) && (
        <div className="flex flex-col pl-0 md:flex-col-reverse md:gap-2 md:pb-3 lg:pl-2">
          {warning && <Warning>{warning}</Warning>}
          {description && (
            <ShowMoreText
              pageTitle={typeof children === 'string' ? children : ''}
              textClassName="text-xs font-normal text-secondary"
              className={cn('px-4 pt-3 md:p-0', !warning && 'pt-4')}
            >
              {description}
            </ShowMoreText>
          )}
        </div>
      )}
    </div>
  )
}

interface WarningProps {
  children: React.ReactNode
  className?: string
}

function Warning({ children, className }: WarningProps) {
  return (
    <div
      className={cn(
        'flex items-start border-yellow-700 border-x-0 border-y bg-yellow-200 px-4 py-2 align-top font-medium text-[13px] text-yellow-900 leading-normal md:rounded-lg md:border-x md:px-6',
        className,
      )}
    >
      <div className="hidden size-5 items-center justify-center md:flex">
        <InfoIcon className="mr-2 inline size-4 shrink-0" variant="yellow" />
      </div>
      <span>{children}</span>
    </div>
  )
}
