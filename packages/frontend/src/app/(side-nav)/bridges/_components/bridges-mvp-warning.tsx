import { MainPageWarning } from '~/components/main-page-warning'
import { OutLink } from '~/components/out-link'
import { externalLinks } from '~/consts/external-links'

export function BridgesMvpWarning({
  className,
  sidebar,
}: { className?: string; sidebar?: boolean }) {
  if (sidebar) {
    return (
      <MainPageWarning className={className}>
        L2BEAT Bridges is a work in progress. You might find incomplete research
        or inconsistent naming. Join our{' '}
        <OutLink href={externalLinks.discord}>Discord</OutLink> to suggest
        improvements!
      </MainPageWarning>
    )
  }

  return (
    <p className="bg-yellow-500 p-2 text-center text-base font-medium text-black md:my-4 md:rounded-lg">
      L2BEAT Bridges is a work in progress. You might find incomplete research
      or inconsistent naming. Join our{' '}
      <OutLink href={externalLinks.discord}>Discord</OutLink> to suggest
      improvements!
    </p>
  )
}
