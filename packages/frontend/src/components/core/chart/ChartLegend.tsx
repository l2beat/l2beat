import { type ReactNode, useRef } from 'react'
import { CursorClickIcon } from '~/icons/CursorClick'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../OverflowWrapper'
import { isSeriesSelected, useChart } from './ChartContext'
import { ChartDataIndicator } from './ChartDataIndicator'
import {
  legendOnboardingHintClassName,
  useChartLegendOnboarding,
  useLegendHint,
} from './ChartLegendOnboardingContext'

/** The legend under a chart; items come from the chart meta, in order. */
export function ChartLegend({
  leading,
  align = 'center',
  className,
}: {
  leading?: ReactNode
  align?: 'center' | 'start'
  className?: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const { meta, interactiveLegend } = useChart()
  const { setHasFinishedOnboarding } = useChartLegendOnboarding()
  const { showsHint, keepsRoom } = useLegendHint(interactiveLegend)

  const items = Object.entries(meta).flatMap(([key, config]) =>
    config ? [{ key, config }] : [],
  )
  if (items.length === 0) return null

  return (
    <div
      className={cn(
        'chart-legend relative pt-1',
        keepsRoom && 'mb-3',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max max-w-full items-center',
          align === 'center' && 'mx-auto',
        )}
      >
        {leading}
        {/* the padding fits the focus outline inside the scroll clip, and
            the negative margin hides that padding from the layout */}
        <OverflowWrapper
          ref={stripRef}
          childrenRef={contentRef}
          className="-m-[3px] min-w-0"
          childrenClassName="p-[3px]"
        >
          <div className="flex h-3.5 w-max items-center gap-2" ref={contentRef}>
            {items.map(({ key, config }) => {
              const isHidden = !isSeriesSelected(interactiveLegend, key)
              const Item = interactiveLegend ? 'button' : 'div'
              return (
                <Item
                  key={key}
                  data-chart-legend-item
                  type={interactiveLegend ? 'button' : undefined}
                  aria-pressed={interactiveLegend ? !isHidden : undefined}
                  className={cn(
                    'group/legend-item flex items-center gap-[3px] *:transition-opacity [&>svg]:text-secondary',
                    interactiveLegend &&
                      'cursor-pointer select-none rounded-xs focus-visible:outline-1 focus-visible:outline-brand focus-visible:outline-offset-2',
                    // dims the content only, so the focus outline keeps its contrast
                    isHidden && '*:opacity-50',
                  )}
                  onClick={
                    interactiveLegend
                      ? () => {
                          interactiveLegend.onItemClick(key)
                          if (!interactiveLegend.disableOnboarding) {
                            setHasFinishedOnboarding(true)
                          }
                        }
                      : undefined
                  }
                  // Chrome leaves a partly visible item where it is on focus
                  onFocus={
                    interactiveLegend
                      ? (e) => revealInStrip(stripRef.current, e.currentTarget)
                      : undefined
                  }
                >
                  <ChartDataIndicator
                    type={config.indicatorType}
                    backgroundColor={config.color}
                  />
                  <span
                    className={cn(
                      'text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px] transition-opacity',
                      !isHidden &&
                        interactiveLegend &&
                        'group-hover/legend-item:opacity-50',
                      isHidden && 'line-through',
                    )}
                  >
                    {config.legendLabel ?? config.label}
                  </span>
                </Item>
              )
            })}
          </div>
        </OverflowWrapper>
      </div>
      {showsHint && (
        <div
          className={cn(
            '-bottom-4 pointer-events-none absolute inset-x-0 min-w-44 rounded-xs text-center text-brand text-label-value-12 italic transition-[opacity,scale] ease-out group-hover:scale-[1.15]',
            legendOnboardingHintClassName,
          )}
          data-legend-onboarding-hint=""
        >
          <CursorClickIcon className="-top-0.5 relative inline-block fill-current" />
          Try clicking legend items to toggle data
        </div>
      )}
    </div>
  )
}

/** The width of the strip's edge fades, which a focused item must clear. */
const EDGE_FADE = 30

/**
 * Scrolls the legend strip so `item` clears the edge fades. Not
 * `scrollIntoView`: that scrolls the page too, and browsers focus the
 * clicked item again when the window regains focus, so the page would jump
 * back to the chart.
 */
function revealInStrip(strip: HTMLElement | null, item: HTMLElement) {
  if (!strip) return
  const visible = strip.getBoundingClientRect()
  const { left, right } = item.getBoundingClientRect()
  if (left < visible.left + EDGE_FADE) {
    strip.scrollLeft -= visible.left + EDGE_FADE - left
  } else if (right > visible.right - EDGE_FADE) {
    strip.scrollLeft += right - (visible.right - EDGE_FADE)
  }
}
