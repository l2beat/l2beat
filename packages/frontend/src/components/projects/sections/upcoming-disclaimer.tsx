import { CustomLink } from '~/components/link/custom-link'
import { InfoIcon } from '~/icons/info'
import { Callout } from '../../callout'

export function UpcomingDisclaimer() {
  return (
    <Callout
      className="rounded-none bg-blue-600/20 p-4 max-md:-mx-4 md:mt-16 md:rounded-lg"
      icon={<InfoIcon className="mt-1" variant="blue" />}
      body={
        <>
          <p className="mb-4 leading-snug">
            This project is currently in development. Once live, it will be
            listed along with comprehensive information about the risks and the
            technology.
          </p>

          <p className="leading-snug">
            Follow us on{' '}
            <CustomLink href="https://twitter.com/l2beat">Twitter</CustomLink>{' '}
            to stay updated on the latest news regarding this and other
            projects.
          </p>
        </>
      }
    />
  )
}
