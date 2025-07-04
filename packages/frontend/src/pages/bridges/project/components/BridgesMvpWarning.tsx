import { CustomLink } from '~/components/link/CustomLink'
import { externalLinks } from '~/consts/externalLinks'
import { cn } from '~/utils/cn'

export const bridgeWarningContext = (
  <>
    L2BEAT Bridges is a work in progress. You might find incomplete research or
    inconsistent naming. Join our{' '}
    <CustomLink href={externalLinks.discord}>Discord</CustomLink> to suggest
    improvements!
  </>
)

export function BridgesMvpWarning({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'text-balance rounded-b-lg bg-yellow-500 p-2 text-center font-medium text-base text-black leading-[1.15]',
        className,
      )}
    >
      {bridgeWarningContext}
    </div>
  )
}
