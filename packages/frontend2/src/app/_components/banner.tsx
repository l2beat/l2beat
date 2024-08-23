import ArrowRight from '../../icons/arrow-right.svg'
import { OutLink } from './out-link'

export function Banner() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 bg-gradient-to-r from-[#7F39B6] to-[#CD1BD3] py-1.5 text-white md:flex-row md:gap-3 dark:text-white">
      <div className="flex gap-1 text-sm">
        <span>New release:</span>
        <span className="font-medium">Fraud-proof wars</span>
      </div>
      <BannerActionButton />
    </div>
  )
}

function BannerActionButton() {
  return (
    <OutLink
      href="https://x.com/l2beat/status/1826617479554310625"
      variant="plain"
      underline={false}
      className="text-white dark:text-white"
    >
      <div className="flex items-center justify-center gap-1 rounded-lg border border-[#9360BC] bg-[#53227A] px-5 py-1 transition-colors duration-200 hover:bg-[#53227A]/80">
        <span className="text-xs font-medium">Give it a read</span>
        <ArrowRight fill="white" width={12} height={12} />
      </div>
    </OutLink>
  )
}
