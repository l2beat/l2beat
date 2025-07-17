import { Banner } from '~/components/Banner'
import { CustomLink } from '~/components/link/CustomLink'
import { externalLinks } from '~/consts/externalLinks'

export function UpcomingDisclaimer() {
  return (
    <Banner type="info" className="mt-4 max-md:rounded-none max-md:border-x-0">
      <p>
        This project is currently in development. Once live, it will be listed
        along with comprehensive information about the risks and the technology.
        Follow us on <CustomLink href={externalLinks.x}>Twitter</CustomLink> to
        stay updated on the latest news regarding this and other projects.
      </p>
    </Banner>
  )
}
