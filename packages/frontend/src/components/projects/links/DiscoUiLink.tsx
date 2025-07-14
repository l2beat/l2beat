import { navigationMenuTriggerStyle } from '~/components/core/NavigationMenu'
import { DiscoUiIcon } from '~/icons/DiscoUi'
import { cn } from '~/utils/cn'

export function DiscoUiLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(
        navigationMenuTriggerStyle(),
        'ring-brand ring-inset focus:ring-2',
        'flex h-8 flex-row items-center gap-1.5 px-2.5',
        'bg-linear-to-r from-[#854220] to-[#DE7B16]',
      )}
    >
      <DiscoUiIcon className="h-[14px] w-[67px] fill-white" />
    </a>
  )
}
