import { TriangleAlertIcon } from 'lucide-react'
import { cn } from '~/utils/cn'

export function ErrorState({
  className,
  cause,
}: {
  className?: string
  cause?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded border border-red-500 bg-red-100 p-2',
        className,
      )}
    >
      <div className="flex min-h-full w-full flex-col items-center justify-center gap-2">
        <div className="flex w-full flex-col items-center justify-center gap-1 font-mono text-aux-red/450 italic">
          <TriangleAlertIcon className="stroke-red-500" />
          Something went wrong
        </div>
        {cause && <pre className="text-sm">{cause}</pre>}
      </div>
    </div>
  )
}
