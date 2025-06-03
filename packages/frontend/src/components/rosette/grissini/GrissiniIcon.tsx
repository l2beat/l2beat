import { cn } from '~/utils/cn'
import type { RosetteValue } from '../types'
import { GrissiniStick } from './GrissiniStick'

interface Props {
  values: RosetteValue[]
  className?: string
}

const EMPTY: RosetteValue = { name: '', value: '' }
const EMPTY_GRISSINI = [EMPTY, EMPTY, EMPTY]

export function GrissiniIcon({ values, className }: Props) {
  const hasNoBridge = values.length === 0
  const display = hasNoBridge ? EMPTY_GRISSINI : values

  return (
    <div
      className={cn(
        'flex flex-row items-center justify-center gap-1',
        className,
      )}
    >
      {display.map((value, i) => (
        <GrissiniStick
          sentiment={
            hasNoBridge ? 'UnderReview' : (value.sentiment ?? 'neutral')
          }
          key={i}
        />
      ))}
      {hasNoBridge && (
        <div className="absolute flex items-center justify-center">
          <ExclamationIcon />
        </div>
      )}
    </div>
  )
}

function ExclamationIcon() {
  return (
    <svg
      width="6"
      height="24"
      viewBox="0 0 6 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.00073 24C4.65759 24 6.00073 22.6569 6.00073 21C6.00073 19.3431 4.65759 18 3.00073 18C1.34388 18 0.000732422 19.3431 0.000732422 21C0.000732422 22.6569 1.34388 24 3.00073 24Z"
        fill="#FF0000"
      />
      <path
        d="M5.33395 2.85202e-07H0.667283C0.57727 -8.29722e-05 0.488172 0.0180633 0.405361 0.0533447C0.32255 0.0886261 0.247742 0.140312 0.185446 0.205286C0.123151 0.270261 0.0746582 0.347177 0.0428924 0.431399C0.0111266 0.515621 -0.00325393 0.605404 0.00061668 0.695334L0.667283 16.0287C0.674677 16.2005 0.748166 16.3628 0.872398 16.4816C0.99663 16.6005 1.162 16.6668 1.33395 16.6667H4.66728C4.83924 16.6668 5.0046 16.6005 5.12883 16.4816C5.25307 16.3628 5.32656 16.2005 5.33395 16.0287L6.00062 0.695334C6.00449 0.605404 5.99011 0.515621 5.95834 0.431399C5.92657 0.347177 5.87808 0.270261 5.81579 0.205286C5.75349 0.140312 5.67868 0.0886261 5.59587 0.0533447C5.51306 0.0180633 5.42396 -8.29722e-05 5.33395 2.85202e-07Z"
        fill="#FF0000"
      />
    </svg>
  )
}
