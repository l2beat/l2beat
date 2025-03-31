import { assert } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import type { SvgIconProps } from '~/icons/svg-icon'
import { cn } from '~/utils/cn'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import type { RosetteValue } from '../types'
import { risksToPizzas } from './real-elements/masks'

interface Props {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface' | false
}

export function RealPizzaRosetteIcon({
  values,
  className,
  isUnderReview,
  background = 'header',
}: Props) {
  const context = useRosetteTooltipContext()
  const svgRef = useRef(null)

  const [first, second, third, fourth, fifth] = values
  const setSelectedRisk = context?.setSelectedRisk
  const selectedRisk = context?.selectedRisk

  useOnClickOutside(svgRef, () => setSelectedRisk?.(undefined))
  useEventListener('scroll', () => setSelectedRisk?.(undefined))

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const selectRisk = (risk: RosetteValue) => {
    setSelectedRisk?.(risk)
  }

  const { pizzas, sliceHoverPaths } = risksToPizzas(
    values,
    selectRisk,
    selectedRisk,
  )

  return (
    <RealPizzaSvgFrame
      className={className}
      ref={svgRef}
      onMouseLeave={() => setSelectedRisk?.(undefined)}
    >
      {background && (
        <circle
          cx="90.5461"
          cy="90"
          r="89.566"
          className={cn(
            'stroke-divider stroke-2',
            background === 'header' && 'fill-header-secondary',
            background === 'surface' && 'fill-surface-secondary',
          )}
        />
      )}
      {/* Background slices */}
      <path
        d="M80.6194 98.4019C83.2458 97.576 85.9153 99.548 85.8979 102.301L85.4896 166.881C85.4744 169.277 83.4095 171.112 81.0485 170.704C73.0731 169.325 55.8489 165.377 42.5052 155.52C27.9884 144.797 19.7481 129.984 16.4511 123.024C15.4559 120.923 16.6097 118.529 18.8274 117.832L80.6194 98.4019Z"
        className="fill-gray-400 dark:fill-zinc-700"
      />
      <path
        d="M80.2452 83.1876C81.8194 85.4464 80.7369 88.5838 78.1048 89.3913L16.3642 108.333C14.0735 109.035 11.7046 107.614 11.3872 105.239C10.3151 97.2171 8.9261 79.6009 14.337 63.9185C20.2235 46.8574 31.8905 34.5609 37.5442 29.3319C39.2509 27.7534 41.8805 28.1377 43.2097 30.0449L80.2452 83.1876Z"
        className="fill-gray-400 dark:fill-zinc-700"
      />
      <path
        d="M94.2198 77.7575C92.5901 79.9764 89.2712 79.9646 87.6574 77.734L49.8016 25.4117C48.3971 23.4705 48.9774 20.7697 51.1228 19.7027C58.3696 16.0987 74.5946 9.09794 91.1841 9.15732C109.232 9.22191 124.636 16.2954 131.41 19.9588C133.455 21.0646 133.94 23.6775 132.564 25.5511L94.2198 77.7575Z"
        className="fill-gray-400 dark:fill-zinc-700"
      />
      <path
        d="M103.517 89.3334C100.913 88.4374 99.9376 85.2652 101.587 83.061L140.282 31.3561C141.718 29.4377 144.469 29.1884 146.126 30.9194C151.722 36.7663 163.232 50.1747 168.109 66.0311C173.416 83.2815 171.244 100.092 169.761 107.649C169.314 109.931 166.963 111.171 164.765 110.414L103.517 89.3334Z"
        className="fill-gray-400 dark:fill-zinc-700"
      />
      <path
        d="M95.3017 102.38C95.3095 99.6272 97.9969 97.6798 100.616 98.5296L162.043 118.464C164.322 119.204 165.446 121.727 164.342 123.854C160.615 131.038 151.639 146.26 138.206 155.994C123.591 166.585 106.979 169.955 99.3481 170.991C97.0445 171.304 95.112 169.48 95.1186 167.155L95.3017 102.38Z"
        className="fill-gray-400 dark:fill-zinc-700"
      />
      <path
        d="M95.3017 102.38C95.3095 99.6272 97.9969 97.6798 100.616 98.5296L162.043 118.464C164.322 119.204 165.446 121.727 164.342 123.854C160.615 131.038 151.639 146.26 138.206 155.994C123.591 166.585 106.979 169.955 99.3481 170.991C97.0445 171.304 95.112 169.48 95.1186 167.155L95.3017 102.38Z"
        className="fill-gray-400 dark:fill-zinc-700"
      />

      {/* Keys warning? */}
      {!isUnderReview && (
        <>
          {pizzas.map((pizza, i) => (
            <g key={i}>{pizza}</g>
          ))}
          {sliceHoverPaths.map((sliceHoverPath, i) => (
            <g key={i}>{sliceHoverPath}</g>
          ))}
        </>
      )}
      {isUnderReview ? (
        <>
          <path
            d="M83.0716 109C82.7232 108.999 82.3787 108.927 82.0575 108.792C81.7364 108.657 81.4452 108.459 81.2005 108.21C80.9557 107.962 80.7621 107.668 80.631 107.344C80.4998 107.022 80.4335 106.676 80.4359 106.327C80.4702 99.1983 80.6995 96.3258 82.1254 92.8622C84.0037 88.6563 86.8121 84.9334 90.3381 81.9747C92.9213 79.8572 95.2015 77.3938 97.1144 74.654C98.1529 73.0882 98.762 71.2763 98.8803 69.4003C99.0044 68.3302 98.8852 67.2458 98.5316 66.2283C98.1781 65.2109 97.5995 64.2867 96.8389 63.525C96.0784 62.7632 95.1558 62.1836 94.1399 61.8294C93.1242 61.4754 92.0417 61.356 90.9733 61.4801C85.6229 61.4801 83.6514 65.5881 83.1428 69.6458C83.075 70.2971 82.7707 70.9009 82.2878 71.3424C81.8048 71.7837 81.1768 72.0322 80.5229 72.0404H64.6378C64.2815 72.0374 63.9294 71.9628 63.6025 71.821C63.2756 71.679 62.9804 71.4729 62.7346 71.2145C62.4886 70.9563 62.2973 70.6511 62.1714 70.3171C62.0455 69.9833 61.988 69.6275 62.0021 69.2709C62.3711 58.7847 64.9461 54.1964 69.9593 49.5632C75.0355 44.8717 81.4033 43 90.9733 43C100.741 43 107.028 44.8479 111.99 49.2146C114.676 51.6804 116.783 54.7105 118.162 58.0881C119.54 61.4656 120.157 65.1068 119.966 68.7508C119.975 72.5441 119.091 76.2859 117.385 79.6726C115.136 83.7351 112.243 87.4049 108.82 90.5389L103.904 95.225C100.842 98.2179 99.0717 102.293 98.9725 106.576C98.9178 107.234 98.619 107.849 98.135 108.296C97.6511 108.745 97.017 108.996 96.358 108.999L83.0716 109Z"
            fill="#FFC107"
          />
          <path
            d="M90 138C96.6273 138 102 132.627 102 126C102 119.373 96.6273 114 90 114C83.3725 114 78 119.373 78 126C78 132.627 83.3725 138 90 138Z"
            fill="#FFC107"
          />
        </>
      ) : null}
    </RealPizzaSvgFrame>
  )
}

export function RealPizzaSvgFrame(
  props: SvgIconProps & {
    children?: React.ReactNode
    ref?: React.RefObject<null>
  },
) {
  return (
    <svg width="181" height="180" viewBox="0 0 181 180" fill="none" {...props}>
      {props.children}
    </svg>
  )
}
