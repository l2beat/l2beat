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
      variant="fill"
      className={cn('w-full py-4 md:w-1/3 md:py-5', className)}
      asChild
    >
      <a href={fileUrl} target="_blank" rel="noreferrer noopener">
        <DownloadArrowIcon className="mr-3 fill-current" />
        Download the report
      </a>
    </Button>
  )
}
