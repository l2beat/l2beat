import { Button } from '~/components/core/Button'
import { SUBMIT_PROTOCOL_PATH } from '../submit/links'
import { SproutIcon } from './SproutIcon'

/** Sends projects from the garden to the page that explains how to join it. */
export function SubmitProtocolCallout() {
  return (
    <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-[#cfe3c0] border-dashed bg-surface-primary/70 p-4 max-md:mx-4 md:mt-6 md:flex-row md:items-center md:justify-between md:px-6 md:py-5 dark:border-[#2c3a22]">
      <div>
        <p className="font-bold text-heading-16 md:text-heading-20">
          Want your protocol in the garden?
        </p>
        <p className="mt-1 text-paragraph-13 text-secondary md:text-paragraph-15">
          See what we look for in each crop, then send it in. Reviews are free
          and the reasoning is always published.
        </p>
      </div>
      <Button asChild variant="fill" className="w-full gap-2 md:w-max">
        <a href={SUBMIT_PROTOCOL_PATH}>
          <SproutIcon />
          Submit your protocol
        </a>
      </Button>
    </div>
  )
}
