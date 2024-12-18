import { CustomLink } from '~/components/link/custom-link'
import { MainPageWarning } from '~/components/main-page-warning'
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
        <CustomLink href={externalLinks.discord}>Discord</CustomLink> to suggest
        improvements!
      </MainPageWarning>
    )
  }

  return (
    <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center text-base font-medium text-black">
      L2BEAT Bridges is a work in progress. You might find incomplete research
      or inconsistent naming. Join our{' '}
      <CustomLink href={externalLinks.discord}>Discord</CustomLink> to suggest
      improvements!
    </p>
  )
}
