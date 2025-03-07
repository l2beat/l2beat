import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'
import { ShowMoreText } from './show-more-text'

export function PageDescription({
  pageTitle,
  description,
  warning,
}: {
  pageTitle: string
  description?: React.ReactElement | string
  warning?: React.ReactElement | string
}) {
  return (
    <div className="flex flex-col pl-0 md:flex-col-reverse md:gap-2 md:pb-4 lg:pl-6">
      {warning && <Warning>{warning}</Warning>}
      {description && (
        <ShowMoreText
          pageTitle={pageTitle}
          textClassName="text-xs font-normal text-secondary"
          className={cn('px-4 py-3 md:p-0', warning && 'pt-4')}
        >
          {description}
        </ShowMoreText>
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
        'flex items-center border border-yellow-700 bg-yellow-200 px-4 py-2 align-top text-[13px] font-medium leading-normal text-yellow-900 md:rounded-lg md:px-6',
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
