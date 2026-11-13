import { Button } from '~/components/core/Button'
import { DownloadArrowIcon } from '~/icons/DownloadArrow'
import { cn } from '~/utils/cn'

interface ReportDownloadButtonProps {
  fileUrl: string
  className?: string
}

export function ReportDownloadButton({
  fileUrl,
  className,
}: ReportDownloadButtonProps) {
  return (
    <Button
      asChild
      variant="fill"
      className={cn('w-full gap-2 sm:w-max', className)}
    >
      <a href={fileUrl} target="_blank" rel="noreferrer noopener">
        <DownloadArrowIcon className="fill-current" />
        Download the report
      </a>
    </Button>
  )
}
