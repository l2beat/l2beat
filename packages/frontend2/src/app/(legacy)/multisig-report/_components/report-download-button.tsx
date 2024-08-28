import { OutLink } from '~/app/_components/out-link'
import DownloadArrow from '~/icons/download-arrow.svg'
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
    <OutLink
      className={cn(
        'flex items-center justify-center rounded-md bg-pink-900 py-4 text-white transition-colors hover:bg-pink-800 md:w-1/3 md:py-5',
        className,
      )}
      href={fileUrl}
    >
      <DownloadArrow className="mr-3" />
      Download the report
    </OutLink>
  )
}
