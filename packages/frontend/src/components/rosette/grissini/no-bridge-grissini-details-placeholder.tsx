import { cn } from '~/utils/cn'
import { sentimentToTextColor } from '~/utils/sentiment'
import { SingleGrissini } from './single-grissini'

const TITLE = 'No bridge'
const DESCRIPTION =
  'Without a DA Bridge, Ethereum has no proof of data availability for this project.'

export function NoBridgeGrissiniDetailsPlaceholder({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-[278px] w-[264px] flex-col items-center justify-center gap-3 rounded-lg bg-header-secondary p-4 text-center',
        className,
      )}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.001 39C22.6243 39 24.751 36.8734 24.751 34.25C24.751 31.6266 22.6243 29.5 20.001 29.5C17.3776 29.5 15.251 31.6266 15.251 34.25C15.251 36.8734 17.3776 39 20.001 39Z"
          fill="#FF0000"
        />
        <path
          d="M23.6954 1H16.3065C16.164 0.999869 16.0229 1.0286 15.8918 1.08446C15.7607 1.14032 15.6423 1.22216 15.5436 1.32504C15.445 1.42791 15.3682 1.5497 15.3179 1.68305C15.2676 1.8164 15.2448 1.95856 15.251 2.10095L16.3065 26.3787C16.3182 26.6507 16.4346 26.9077 16.6313 27.0959C16.828 27.2842 17.0898 27.3891 17.3621 27.3889H22.6399C22.9121 27.3891 23.174 27.2842 23.3707 27.0959C23.5674 26.9077 23.6837 26.6507 23.6954 26.3787L24.751 2.10095C24.7571 1.95856 24.7343 1.8164 24.684 1.68305C24.6337 1.5497 24.557 1.42791 24.4583 1.32504C24.3597 1.22216 24.2412 1.14032 24.1101 1.08446C23.979 1.0286 23.8379 0.999869 23.6954 1Z"
          fill="#FF0000"
        />
      </svg>

      <div className="text-lg font-bold">{TITLE}</div>
      <div className="text-xs font-medium">{DESCRIPTION}</div>
    </div>
  )
}

export function InlinedNoBridgeGrissiniDetailsPlaceholder({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-row items-stretch rounded bg-header-secondary md:h-[5.125rem]',
        className,
      )}
    >
      <SingleGrissini
        sentiment="neutral"
        className="h-full shrink-0 max-md:w-1"
      />
      <div className="flex flex-1 flex-col justify-center gap-1 p-4 md:items-center">
        <div className="text-sm font-bold md:text-lg">{TITLE}</div>
        <div
          className={cn(
            'text-[13px] font-medium leading-none',
            sentimentToTextColor('neutral'),
          )}
        >
          {DESCRIPTION}
        </div>
      </div>
    </div>
  )
}
