import { OutLink } from '~/app/_components/out-link'
import { externalLinks } from '~/consts/external-links'

export function BridgesMvpWarning() {
  return (
    <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center text-base font-medium text-black">
      L2BEAT Bridges is a work in progress. You might find incomplete research
      or inconsistent naming. Join our{' '}
      <OutLink href={externalLinks.discord}>Discord</OutLink> to suggest
      improvements!
    </p>
  )
}
