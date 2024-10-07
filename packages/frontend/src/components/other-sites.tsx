import Link from 'next/link'
import { cn } from '~/utils/cn'

export function OtherSites() {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 md:flex-row',
        'my-10 px-4 py-6 md:my-20 md:px-10',
        'md:rounded-xl',
        'bg-gradient-to-r from-purple-100/40 via-pink-100/40 to-red-200/40',
      )}
    >
      <span className="text-center text-lg font-medium md:text-left">
        Want to learn more about the different approaches to upgradeability?
      </span>
      <Link className="text-lg font-bold underline" href="/multisig-report">
        Check our report
      </Link>
    </div>
  )
}
