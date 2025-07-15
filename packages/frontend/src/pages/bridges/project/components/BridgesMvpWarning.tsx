import { Banner } from '~/components/Banner'
import { CustomLink } from '~/components/link/CustomLink'
import { externalLinks } from '~/consts/externalLinks'

export function BridgesMvpWarning({ className }: { className?: string }) {
  return (
    <Banner type="warning" centered className={className}>
      <p>
        L2BEAT Bridges is a work in progress. You might find incomplete research
        or inconsistent naming. Join our{' '}
        <CustomLink href={externalLinks.discord}>Discord</CustomLink> to suggest
        improvements!
      </p>
    </Banner>
  )
}
