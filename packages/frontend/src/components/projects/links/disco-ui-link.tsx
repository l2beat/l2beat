import Link from 'next/link'
import { navigationMenuTriggerStyle } from '~/components/core/navigation-menu'
import { DiscoUiIcon } from '~/icons/disco-ui'
import { cn } from '~/utils/cn'

export function DiscoUiLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(
        navigationMenuTriggerStyle(),
        'ring-inset ring-brand focus:ring-2',
        'flex h-8 flex-row items-center gap-1.5 px-2.5',
        'bg-gradient-to-r from-[#854220] to-[#DE7B16]',
      )}
    >
      <DiscoUiIcon className="h-[14px] w-[67px] fill-white" />
    </Link>
  )
}
