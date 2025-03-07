import { CustomLink } from '~/components/link/custom-link'
import { PageDescription } from '~/components/page-description'
import { externalLinks } from '~/consts/external-links'
import { cn } from '~/utils/cn'

export function BridgesMvpWarning({
  className,
  sidebar,
}: { className?: string; sidebar?: boolean }) {
  if (sidebar) {
    return (
      <PageDescription
        pageTitle="Bridges"
        warning={
          <>
            L2BEAT Bridges is a work in progress. You might find incomplete
            research or inconsistent naming. Join our{' '}
            <CustomLink href={externalLinks.discord}>Discord</CustomLink> to
            suggest improvements!
          </>
        }
      />
    )
  }

  return (
    <div
      className={cn(
        'text-balance bg-yellow-500 p-2 text-center text-base font-medium leading-[1.15] text-black',
        className,
      )}
    >
      L2BEAT Bridges is a work in progress. You might find incomplete research
      or inconsistent naming. Join our{' '}
      <CustomLink href={externalLinks.discord}>Discord</CustomLink> to suggest
      improvements!
    </div>
  )
}
