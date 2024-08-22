import { EM_DASH } from '~/consts/characters'
import { OutLink } from './out-link'

export function Banner() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-pink-900 py-1 text-white md:flex-row dark:text-white">
      <div>Our new article about fraud proofs is out</div>
      <div className="hidden px-2 md:block">{EM_DASH}</div>
      <div>
        <OutLink
          href="https://x.com/l2beat/status/1826617479554310625"
          variant="banner"
        >
          give it a read!
        </OutLink>
      </div>
    </div>
  )
}
