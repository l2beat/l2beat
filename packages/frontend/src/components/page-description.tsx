import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'
import { SingleLineText } from './single-line-text'

export function PageDescription({
  description,
  warning,
}: {
  description?: React.ReactElement | string
  warning?: React.ReactElement | string
}) {
  return (
    <div className="flex flex-col pl-0 md:flex-col-reverse md:gap-2 md:pb-4 lg:pl-6">
      {warning && <Warning>{warning}</Warning>}
      {description && (
        <SingleLineText
          textClassName="text-xs font-normal text-secondary"
          className="px-4 py-3 md:p-0"
        >
          {description}
        </SingleLineText>
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
        'flex items-center border border-yellow-700 bg-yellow-200 px-6 py-2 align-top text-[13px] font-medium leading-normal text-yellow-900 md:rounded-lg',
        className,
      )}
    >
      <div className="flex size-5 items-center justify-center">
        <InfoIcon className="mr-2 inline size-4 shrink-0" variant="yellow" />
      </div>
      <span>{children}</span>
    </div>
  )
}
