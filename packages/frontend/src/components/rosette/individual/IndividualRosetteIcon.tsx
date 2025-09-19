import { useRef } from 'react'
import { useEventListener } from '~/hooks/useEventListener'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { PizzaElementLink } from '../pizza/PizzaElementLink'
import type { RosetteValue } from '../types'
import { useIndividualRosetteTooltipContext } from './IndividualRosetteTooltipContext'

export type RosetteValueTuple = [
  sequencerFailure: RosetteValue,
  stateValidation: RosetteValue,
  dataAvailability: RosetteValue,
  exitWindow: RosetteValue,
  proposerFailure: RosetteValue,
]

interface Props {
  l2: {
    name: string
    risks: RosetteValueTuple
  }
  l3: {
    name: string
    risks: RosetteValueTuple
  }
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface'
  disableSectionLinking?: boolean
}

export function IndividualPizzaRosetteIcon({
  l2,
  l3,
  className,
  isUnderReview,
  background = 'header',
  disableSectionLinking,
}: Props) {
  const context = useIndividualRosetteTooltipContext()
  const svgRef = useRef(null)

  const [
    innerSequencerFailure,
    innerStateValidation,
    innerDataAvailability,
    innerExitWindow,
    innerProposeFailure,
  ] = l2.risks

  const [
    outerSequencerFailure,
    outerStateValidation,
    outerDataAvailability,
    outerExitWindow,
    outerProposeFailure,
  ] = l3.risks

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
      innerProjectName: l2.name,
      outer,
      outerProjectName: l3.name,
      side,
      // sideOffset: side === 'top' ? -65 : -50,
      sideOffset: 0,
    })
  }

  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      alt-text="Rosette showing risk summary"
      ref={svgRef}
      onMouseLeave={() => setContent?.(undefined)}
      className={cn(className)}
    >
      <defs>
        <clipPath id="outer-clip">
          <rect width="180" height="180" rx="90" />
        </clipPath>
        <clipPath id="inner-clip">
          <rect
            x="73.0898"
            y="-23.5745"
            width="162.422"
            height="162.422"
            rx="81.2112"
            transform="rotate(36.4535 73.0898 -23.5745)"
          />
        </clipPath>
      </defs>

      <g clipPath="url(#outer-clip)">
        <circle
          cx="90"
          cy="90"
          r="90"
          className={cn(
            'stroke-2 stroke-divider',
            background === 'header' && 'fill-header-secondary',
            background === 'surface' && 'fill-surface-secondary',
          )}
        />

        <g clipPath="url(#inner-clip)">
          <PizzaElementLink
            elementValue={outerSequencerFailure}
            disableSectionLinking={disableSectionLinking}
          >
            <g
              onMouseEnter={() =>
                selectRisk(
                  innerSequencerFailure,
                  outerSequencerFailure,
                  'bottom',
                )
              }
              onTouchStart={() =>
                selectRisk(
                  innerSequencerFailure,
                  outerSequencerFailure,
                  'bottom',
                )
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
                d="M80.1197 98.1908C82.7076 97.3794 85.3357 99.3241 85.3164 102.036L84.8545 166.765C84.8377 169.125 82.8003 170.931 80.4746 170.529C72.5287 169.154 55.2512 165.197 41.8799 155.303C27.3325 144.539 19.099 129.668 15.8256 122.729C14.8485 120.658 15.9867 118.3 18.1718 117.615L80.1197 98.1908Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    outerSequencerFailure.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
              <path
                d="M80.1195 98.1906C82.7074 97.3792 85.3355 99.3239 85.3162 102.036L85.0476 139.676C85.0308 142.036 82.9929 143.837 80.6771 143.381C75.1482 142.291 65.3833 139.686 57.6628 133.973C49.2666 127.76 44.1723 119.4 41.7386 114.597C40.7035 112.554 41.8354 110.195 44.0206 109.509L80.1195 98.1906Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    innerSequencerFailure.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={outerProposeFailure}
            disableSectionLinking={disableSectionLinking}
          >
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
                d="M95.8885 101.938C95.9165 99.2258 98.5781 97.3273 101.151 98.1838L162.57 118.625C164.809 119.371 165.897 121.866 164.796 123.954C161.033 131.086 151.931 146.295 138.389 155.955C123.656 166.464 106.969 169.699 99.3581 170.668C97.0864 170.957 95.195 169.146 95.2186 166.856L95.8885 101.938Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    outerProposeFailure.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
              <path
                d="M95.8887 101.938C95.9167 99.2258 98.5783 97.3272 101.152 98.1837L135.355 109.568C137.595 110.313 138.678 112.808 137.524 114.867C134.847 119.641 129.564 127.741 122.075 133.083C113.93 138.892 104.816 141.091 99.6481 141.911C97.3864 142.27 95.4911 140.465 95.5148 138.175L95.8887 101.938Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    innerProposeFailure.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={outerExitWindow}
            disableSectionLinking={disableSectionLinking}
          >
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
                d="M102.815 89.0557C100.252 88.1686 99.2962 85.0421 100.925 82.8735L139.798 31.1155C141.216 29.2282 143.928 28.9884 145.558 30.6953C151.128 36.5269 162.663 49.9844 167.526 65.8915C172.817 83.1978 170.59 100.049 169.094 107.574C168.648 109.82 166.33 111.039 164.166 110.29L102.815 89.0557Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(outerExitWindow.sentiment ?? 'neutral'),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />

              <path
                d="M102.815 89.0558C100.252 88.1687 99.2962 85.0422 100.925 82.8736L123.968 52.1931C125.385 50.3059 128.095 50.0705 129.687 51.8133C133.537 56.0286 139.972 64.0786 142.834 73.4406C145.947 83.6223 145.037 93.5606 144.119 98.9362C143.733 101.194 141.419 102.417 139.255 101.668L102.815 89.0558Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(innerExitWindow.sentiment ?? 'neutral'),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={outerDataAvailability}
            disableSectionLinking={disableSectionLinking}
          >
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
                d="M93.3478 76.656C91.7501 78.8477 88.4808 78.8477 86.8831 76.656L48.7521 24.3486C47.3618 22.4413 47.9253 19.7777 50.0343 18.7178C57.2394 15.0966 73.4815 8.00005 90.1154 8.00005C108.212 8.00005 123.676 15.0564 130.435 18.6869C132.452 19.7706 132.94 22.3436 131.591 24.1941L93.3478 76.656Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    outerDataAvailability.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />

              <path
                d="M93.3779 76.6375C91.7791 78.8044 88.5392 78.8044 86.9404 76.6375L64.8022 46.6322C63.3904 44.7188 63.9619 42.035 66.1163 41.0287C71.2213 38.6441 80.5884 35 90.1592 35C100.566 35 109.606 38.6195 114.433 41.0045C116.502 42.0268 117.001 44.6203 115.63 46.4774L93.3779 76.6375Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    innerDataAvailability.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

          <PizzaElementLink
            elementValue={outerStateValidation}
            disableSectionLinking={disableSectionLinking}
          >
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
                d="M79.6957 83.0363C81.2478 85.2605 80.1834 88.3517 77.591 89.1488L15.1534 108.347C12.8974 109.04 10.5622 107.639 10.2458 105.3C9.15861 97.2612 7.71374 79.4261 13.1797 63.5516C19.1266 46.2807 30.9507 33.8483 36.6192 28.6114C38.3013 27.0574 40.8936 27.4331 42.2042 29.3111L79.6957 83.0363Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    outerStateValidation.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />

              <path
                d="M79.6957 83.0368C81.2478 85.2609 80.1834 88.3521 77.591 89.1492L43.0253 99.7772C40.7693 100.471 38.4389 99.0687 38.1824 96.7224C37.5864 91.2696 37.1808 81.5764 40.1853 72.8508C43.4526 63.3618 49.6174 56.2582 53.3567 52.5825C54.9899 50.9772 57.5809 51.3463 58.8914 53.2243L79.6957 83.0368Z"
                className={cn(
                  'transition-opacity',
                  sentimentToFillColor(
                    innerStateValidation.sentiment ?? 'neutral',
                  ),
                  isUnderReview && sentimentToFillColor('UnderReview'),
                )}
              />
            </g>
          </PizzaElementLink>

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
            cx="90.1592"
            cy="90"
            r="52"
            className={cn(
              background === 'header' && 'stroke-header-secondary',
              background === 'surface' && 'stroke-surface-secondary',
            )}
            strokeWidth="10"
          />
        </g>
      </g>
    </svg>
  )
}
