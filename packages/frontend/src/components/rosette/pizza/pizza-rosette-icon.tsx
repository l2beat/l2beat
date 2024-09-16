import { assert } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { useRosetteTooltipContext } from '../rosette-tooltip-context'
import { type RosetteValue } from '../types'

interface Props {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  background?: boolean
}

export function PizzaRosetteIcon({
  values,
  className,
  isUnderReview,
  background = true,
}: Props) {
  const context = useRosetteTooltipContext()
  const svgRef = useRef(null)

  const [first, second, third, fourth, fifth] = values
  const setContent = context?.setContent
  const content = context?.content

  useOnClickOutside(svgRef, () => setContent?.(undefined))
  useEventListener('scroll', () => setContent?.(undefined))

  assert(first && second && third && fourth && fifth, 'Invalid number of risks')

  const selectRisk = (risk: RosetteValue, side: 'top' | 'bottom') => {
    setContent?.({
      risk,
      side: side,
      sideOffset: side === 'top' ? -65 : -50,
    })
  }

  return (
    <svg
      width="181"
      height="180"
      viewBox="0 0 181 180"
      alt-text="Rosette showing risk summary"
      ref={svgRef}
      onMouseLeave={() => setContent?.(undefined)}
      className={className}
    >
      {background ? (
        <circle
          cx="90.8408"
          cy="90"
          r="90"
          className="fill-gray-100 dark:fill-neutral-700"
        />
      ) : null}
      <path
        d="M80.8589 98.2024C83.4853 97.3765 86.1548 99.3485 86.1374 102.102L85.7291 166.681C85.7139 169.077 83.649 170.912 81.288 170.504C73.3126 169.126 56.0884 165.178 42.7447 155.321C28.2279 144.597 19.9876 129.784 16.6906 122.825C15.6954 120.724 16.8492 118.33 19.0669 117.632L80.8589 98.2024Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(first.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== first.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(first, 'top')}
        onTouchStart={() => selectRisk(first, 'top')}
      />

      <path
        d="M80.4851 82.9885C82.0593 85.2473 80.9768 88.3846 78.3447 89.1921L16.604 108.133C14.3134 108.836 11.9444 107.415 11.6271 105.04C10.555 97.018 9.16596 79.4018 14.5768 63.7194C20.4634 46.6582 32.1303 34.3618 37.7841 29.1327C39.4908 27.5543 42.1203 27.9386 43.4495 29.8458L80.4851 82.9885Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(second.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== second.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(second, 'bottom')}
        onTouchStart={() => selectRisk(second, 'bottom')}
      />

      <path
        d="M94.4599 77.5583C92.8302 79.7773 89.5113 79.7654 87.8975 77.5349L50.0417 25.2126C48.6372 23.2713 49.2175 20.5705 51.3629 19.5036C58.6097 15.8996 74.8347 8.89881 91.4242 8.95819C109.472 9.02278 124.876 16.0963 131.65 19.7596C133.695 20.8655 134.18 23.4783 132.804 25.352L94.4599 77.5583Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(third.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== third.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(third, 'bottom')}
        onTouchStart={() => selectRisk(third, 'bottom')}
      />

      <path
        d="M103.756 89.1339C101.153 88.2379 100.177 85.0657 101.827 82.8615L140.521 31.1566C141.957 29.2382 144.708 28.9889 146.365 30.7199C151.961 36.5668 163.471 49.9752 168.349 65.8316C173.655 83.082 171.483 99.8928 170.001 107.45C169.553 109.731 167.203 110.971 165.005 110.215L103.756 89.1339Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(fourth.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== fourth.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(fourth, 'bottom')}
        onTouchStart={() => selectRisk(fourth, 'bottom')}
      />

      <path
        d="M95.5409 102.181C95.5486 99.428 98.2361 97.4805 100.855 98.3304L162.282 118.265C164.561 119.005 165.685 121.528 164.581 123.655C160.854 130.839 151.878 146.061 138.445 155.795C123.83 166.385 107.218 169.756 99.5872 170.792C97.2836 171.105 95.3511 169.28 95.3577 166.956L95.5409 102.181Z"
        className={cn(
          'transition-opacity',
          sentimentToFillColor(fifth.sentiment),
          isUnderReview && sentimentToFillColor('UnderReview'),
          content && content.risk.name !== fifth.name && 'opacity-20',
        )}
        onMouseEnter={() => selectRisk(fifth, 'top')}
        onTouchStart={() => selectRisk(fifth, 'top')}
      />

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
    </svg>
  )
}
