import { Button } from '~/components/core/Button'
import { INTEGRATE_CROPS_PATH } from '../submit/links'
import { SproutIcon } from './SproutIcon'

/** For projects that want the CROPS evaluations as data rather than as a page. */
export function IntegrateCropsCallout() {
  return (
    <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-[#cfe3c0] border-dashed bg-surface-primary/70 p-4 max-md:mx-4 md:mt-6 md:flex-row md:items-center md:justify-between md:px-6 md:py-5 dark:border-[#2c3a22]">
      <p className="font-bold text-heading-16 md:text-heading-20">
        Want to inform your users about the CROPS?
      </p>
      <Button asChild variant="fill" className="w-full gap-2 md:w-max">
        <a href={INTEGRATE_CROPS_PATH}>
          <SproutIcon />
          Integrate CROPS
        </a>
      </Button>
    </div>
  )
}
