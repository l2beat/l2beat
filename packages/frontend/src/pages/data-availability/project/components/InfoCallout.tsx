import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'

type Props = {
  title: string
  description: string
  className?: string
}

export function InfoCallout({ title, description, className }: Props) {
  return (
    <div
      className={cn(
        '-mx-4 flex h-full flex-col items-center gap-2 bg-blue-300 p-5 md:mx-0 md:rounded-lg md:border md:border-blue-500 lg:gap-1 dark:bg-blue-950 dark:max-md:border-0',
        className,
      )}
    >
      <div className="flex w-full items-center gap-2 font-bold text-lg">
        <InfoIcon className="fill-blue-550" variant="blue" />
        {title}
      </div>
      <div className="text-[13px] leading-4">{description}</div>
    </div>
  )
}
