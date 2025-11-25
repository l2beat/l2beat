import { cn } from '~/utils/cn'
import { Banner } from './Banner'

export function BigQueryOutageNotice({ className }: { className?: string }) {
  return (
    <Banner type="warning" className={cn('mt-2 mb-2', className)}>
      Data on this page may be temporarily out of date due to third-party
      provider issues. We&apos;re working to resolve this.
    </Banner>
  )
}
