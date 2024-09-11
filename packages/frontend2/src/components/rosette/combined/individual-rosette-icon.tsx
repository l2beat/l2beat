import { useRef } from 'react'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { type RosetteValue } from '../types'
import { useIndividualRosetteTooltipContext } from './individual-rosette-tooltip-context'

export type RosetteValueTuple = [
  RosetteValue,
  RosetteValue,
  RosetteValue,
  RosetteValue,
  RosetteValue,
]

interface Props {
  innerValues: RosetteValueTuple
  outerValues: RosetteValueTuple
  isUnderReview?: boolean
  className?: string
  background?: boolean
}

export function IndividualPizzaRosetteIcon({
  innerValues,
  outerValues,
  className,
  isUnderReview,
  background = true,
}: Props) {
  const context = useIndividualRosetteTooltipContext()
  const svgRef = useRef(null)

  const [
    innerSequencerFailure,
    innerProposeFailure,
    innerExitWindow,
    innerDataAvailability,
    innerStateValidation,
  ] = innerValues

  const [
    outerSequencerFailure,
    outerProposeFailure,
    outerExitWindow,
    outerDataAvailability,
    outerStateValidation,
  ] = outerValues

  const setContent = context?.setContent
  const content = context?.content

  useOnClickOutside(svgRef, () => setContent?.(undefined))
  useEventListener('scroll', () => setContent?.(undefined))

  const selectRisk = (
    inner: RosetteValue,
    outer: RosetteValue,
    side: 'top' | 'bottom',
  ) => {
    setContent?.({
      inner,
      outer,
      side,
      // sideOffset: side === 'top' ? -65 : -50,
      sideOffset: 0,
    })
  }

  return (
    <svg
      width="228"
      height="228"
      viewBox="0 0 228 228"
      fill="none"
      alt-text="Rosette showing risk summary"
      ref={svgRef}
      onMouseLeave={() => setContent?.(undefined)}
      className={className}
    >
      {background ? (
        <circle
          cx="114"
          cy="114"
          r="90"
          className="fill-gray-100 dark:fill-neutral-700"
        />
      ) : null}

      <g
        onMouseEnter={() =>
          selectRisk(innerStateValidation, outerStateValidation, 'top')
        }
        onTouchStart={() =>
          selectRisk(innerStateValidation, outerStateValidation, 'top')
        }
        className={cn(
          content &&
            content.inner.name !== innerStateValidation.name &&
            'opacity-20',
          content &&
            content.outer.name !== outerStateValidation.name &&
            'opacity-20',
        )}
      >
        <path
          d="M103.086 106.924C104.655 109.135 103.615 112.235 101.029 113.053L39.3099 132.566C37.0594 133.277 34.7135 131.896 34.3794 129.559C33.238 121.576 31.6762 103.921 36.9671 88.1505C42.7232 70.9934 54.3318 58.577 59.9235 53.3242C61.5926 51.7563 64.1872 52.112 65.5125 53.9795L103.086 106.924Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(innerStateValidation.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />

        <path
          d="M103.086 106.924C104.655 109.135 103.615 112.235 101.029 113.053L64.4441 124.619C62.1936 125.331 59.8518 123.947 59.57 121.603C58.8883 115.936 58.3321 105.644 61.446 96.3631C64.8325 86.2691 71.3512 78.7123 75.2234 74.8722C76.8494 73.2597 79.4431 73.6091 80.7685 75.4767L103.086 106.924Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(outerStateValidation.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />
      </g>

      <g
        onMouseEnter={() =>
          selectRisk(innerSequencerFailure, outerSequencerFailure, 'bottom')
        }
        onTouchStart={() =>
          selectRisk(innerSequencerFailure, outerSequencerFailure, 'bottom')
        }
        className={cn(
          content &&
            content.inner.name !== innerSequencerFailure.name &&
            'opacity-20',
          content &&
            content.outer.name !== outerSequencerFailure.name &&
            'opacity-20',
        )}
      >
        <path
          d="M103.536 121.765C106.124 120.954 108.752 122.898 108.733 125.611L108.271 190.339C108.254 192.7 106.217 194.505 103.891 194.103C95.9455 192.728 78.668 188.772 65.2967 178.877C50.7493 168.113 42.5158 153.242 39.2424 146.304C38.2653 144.233 39.4034 141.874 41.5886 141.189L103.536 121.765Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(outerSequencerFailure.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />
        <path
          d="M103.536 121.765C106.124 120.954 108.752 122.898 108.733 125.611L108.464 163.25C108.447 165.611 106.41 167.412 104.094 166.955C98.5649 165.866 88.8 163.261 81.0795 157.548C72.6832 151.335 67.589 142.974 65.1553 138.171C64.1202 136.129 65.252 133.769 67.4372 133.084L103.536 121.765Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(innerSequencerFailure.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />
      </g>

      <g
        onMouseEnter={() =>
          selectRisk(innerProposeFailure, outerProposeFailure, 'bottom')
        }
        onTouchStart={() =>
          selectRisk(innerProposeFailure, outerProposeFailure, 'bottom')
        }
        className={cn(
          content &&
            content.inner.name !== innerProposeFailure.name &&
            'opacity-20',
          content &&
            content.outer.name !== outerProposeFailure.name &&
            'opacity-20',
        )}
      >
        <path
          d="M119.305 125.512C119.333 122.8 121.995 120.902 124.568 121.758L185.986 142.2C188.226 142.945 189.314 145.441 188.212 147.528C184.449 154.661 175.347 169.87 161.805 179.529C147.072 190.038 130.385 193.273 122.775 194.242C120.503 194.532 118.612 192.72 118.635 190.431L119.305 125.512Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(outerProposeFailure.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />
        <path
          d="M119.305 125.512C119.333 122.8 121.995 120.902 124.568 121.758L158.772 133.142C161.011 133.888 162.094 136.382 160.94 138.441C158.264 143.216 152.981 151.315 145.491 156.658C137.347 162.467 128.232 164.666 123.065 165.486C120.803 165.845 118.908 164.04 118.931 161.75L119.305 125.512Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(innerProposeFailure.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />
      </g>

      <g
        onMouseEnter={() =>
          selectRisk(innerExitWindow, outerExitWindow, 'bottom')
        }
        onTouchStart={() =>
          selectRisk(innerExitWindow, outerExitWindow, 'bottom')
        }
        className={cn(
          content &&
            content.inner.name !== innerExitWindow.name &&
            'opacity-20',
          content &&
            content.outer.name !== outerExitWindow.name &&
            'opacity-20',
        )}
      >
        <path
          d="M126.232 112.63C123.669 111.743 122.713 108.617 124.342 106.448L163.215 54.6899C164.633 52.8027 167.344 52.5629 168.975 54.2698C174.544 60.1013 186.079 73.5589 190.943 89.466C196.234 106.772 194.007 123.624 192.511 131.148C192.065 133.394 189.747 134.613 187.583 133.864L126.232 112.63Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(outerExitWindow.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />

        <path
          d="M126.232 112.63C123.669 111.743 122.713 108.617 124.342 106.448L147.384 75.7675C148.802 73.8803 151.512 73.6449 153.104 75.3877C156.953 79.603 163.389 87.653 166.251 97.015C169.364 107.197 168.453 117.135 167.535 122.511C167.15 124.768 164.836 125.992 162.672 125.243L126.232 112.63Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(innerExitWindow.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />
      </g>

      <g
        className={cn(
          content &&
            content.inner.name !== innerDataAvailability.name &&
            'opacity-20',
          content &&
            content.outer.name !== outerDataAvailability.name &&
            'opacity-20',
        )}
        onMouseEnter={() =>
          selectRisk(innerDataAvailability, outerDataAvailability, 'top')
        }
        onTouchStart={() =>
          selectRisk(innerDataAvailability, outerDataAvailability, 'top')
        }
      >
        <path
          d="M116.646 100.154C115.049 102.341 111.785 102.341 110.187 100.154L72.0192 47.9117C70.6249 46.0032 71.1892 43.3354 73.302 42.276C80.5171 38.6584 96.7709 31.5744 113.417 31.5744C131.526 31.5744 147.001 38.618 153.77 42.2449C155.791 43.3281 156.28 45.9054 154.927 47.7572L116.646 100.154Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(outerDataAvailability.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />

        <path
          d="M116.795 100.212C115.196 102.379 111.956 102.379 110.357 100.212L88.2188 70.2067C86.8071 68.2933 87.3785 65.6095 89.5329 64.6031C94.6379 62.2185 104.005 58.5745 113.576 58.5745C123.983 58.5745 133.023 62.194 137.85 64.579C139.919 65.6013 140.417 68.1948 139.047 70.0519L116.795 100.212Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(innerDataAvailability.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />
      </g>

      <g
        onMouseEnter={() =>
          selectRisk(innerStateValidation, outerStateValidation, 'top')
        }
        onTouchStart={() =>
          selectRisk(innerStateValidation, outerStateValidation, 'top')
        }
        className={cn(
          content &&
            content.inner.name !== innerStateValidation.name &&
            'opacity-20',
          content &&
            content.outer.name !== outerStateValidation.name &&
            'opacity-20',
        )}
      >
        <path
          d="M103.086 106.924C104.655 109.135 103.615 112.235 101.029 113.053L39.3099 132.566C37.0594 133.277 34.7135 131.896 34.3794 129.559C33.238 121.576 31.6762 103.921 36.9671 88.1505C42.7232 70.9934 54.3318 58.577 59.9235 53.3242C61.5926 51.7563 64.1872 52.112 65.5125 53.9795L103.086 106.924Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(innerStateValidation.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />

        <path
          d="M103.086 106.924C104.655 109.135 103.615 112.235 101.029 113.053L64.4441 124.619C62.1936 125.331 59.8518 123.947 59.57 121.603C58.8883 115.936 58.3321 105.644 61.446 96.3631C64.8325 86.2691 71.3512 78.7123 75.2234 74.8722C76.8494 73.2597 79.4431 73.6091 80.7685 75.4767L103.086 106.924Z"
          className={cn(
            'transition-opacity',
            sentimentToFillColor(outerStateValidation.sentiment),
            isUnderReview && sentimentToFillColor('UnderReview'),
          )}
        />
      </g>

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

      <circle
        cx="113.576"
        cy="113.574"
        r="52"
        stroke-width="10"
        className="stroke-gray-100 dark:stroke-neutral-700"
      />
    </svg>
  )
}
