import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'

interface Props {
  children: React.ReactNode
  className?: string
}

export function MainPageWarning({ children, className }: Props) {
  return (
    <div
      className={cn(
        'flex border border-yellow-700 bg-yellow-200 px-6 py-2 align-top text-xs font-medium text-yellow-900 md:rounded-xl',
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
