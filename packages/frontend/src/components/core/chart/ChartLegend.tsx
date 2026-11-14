import { type ReactNode, type RefObject, useEffect, useRef } from 'react'
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

/**
 * The most keys that wrap to more rows. A longer legend, e.g. one key per
 * project, stays one scrolling row: wrapped, it would be taller than the
 * chart.
 */
const MAX_WRAPPED_ITEMS = 12

/**
 * The legend under a chart; items come from the chart meta, in order. Up to
 * 12 keys wrap to more rows, so every key stays on screen.
 */
export function ChartLegend({
  leading,
  align = 'center',
  className,
}: {
  leading?: ReactNode
  align?: 'center' | 'start'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const { meta, interactiveLegend } = useChart()
  const { setHasFinishedOnboarding } = useChartLegendOnboarding()
  const { showsHint, keepsRoom } = useLegendHint(interactiveLegend)

  const items = Object.entries(meta).flatMap(([key, config]) =>
    config ? [{ key, config }] : [],
  )
  const wraps = items.length <= MAX_WRAPPED_ITEMS
  useWrappedLegendHeight(ref, items.length > 0 && wraps)
  if (items.length === 0) return null

  const keys = items.map(({ key, config }) => {
    const isHidden = !isSeriesSelected(interactiveLegend, key)
    const Item = interactiveLegend ? 'button' : 'div'
    return (
      <Item
        key={key}
        data-chart-legend-item
        type={interactiveLegend ? 'button' : undefined}
        aria-pressed={interactiveLegend ? !isHidden : undefined}
        className={cn(
          'group/legend-item flex h-3.5 items-center gap-[3px] *:transition-opacity [&>svg]:text-secondary',
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
          interactiveLegend && !wraps
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
            'text-nowrap font-medium text-2xs text-primary leading-none tracking-[-0.2px] transition-opacity',
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
  })

  return (
    <div
      ref={ref}
      className={cn(
        'chart-legend relative pt-1',
        keepsRoom && 'mb-3',
        className,
      )}
    >
      {wraps ? (
        <div
          className={cn(
            'flex flex-wrap items-center gap-2',
            align === 'center' && 'justify-center',
          )}
        >
          {leading}
          {keys}
        </div>
      ) : (
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
            <div
              className="flex h-3.5 w-max items-center gap-2"
              ref={contentRef}
            >
              {keys}
            </div>
          </OverflowWrapper>
        </div>
      )}
      {showsHint && (
        <div
          className={cn(
            '-bottom-4 pointer-events-none absolute inset-x-0 min-w-44 rounded-xs text-center text-brand-deep text-label-value-12 transition-[opacity,scale] ease-out group-hover:scale-[1.15]',
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

/** A one-row legend's height: `pt-1` and a 14px row. */
const ONE_ROW_HEIGHT = 18
const LEGEND_HEIGHT_PROPERTY = '--chart-legend-height'

/**
 * Gives a wrapped legend's height to its chart container as
 * `--chart-legend-height`. The container grows by the extra rows instead of
 * shrinking the plot, and the watermark and milestones keep their place
 * above the plot's bottom. One row leaves the property unset: the
 * container's fallback is that height, and the chart is not restyled.
 */
function useWrappedLegendHeight(
  ref: RefObject<HTMLDivElement | null>,
  wraps: boolean,
) {
  useEffect(() => {
    const legend = ref.current
    const container = legend?.closest<HTMLElement>('[data-chart-container]')
    if (!wraps || !legend || !container) return
    const observer = new ResizeObserver(([entry]) => {
      const height = entry?.borderBoxSize[0]?.blockSize
      if (height === undefined || height === ONE_ROW_HEIGHT) {
        container.style.removeProperty(LEGEND_HEIGHT_PROPERTY)
      } else {
        container.style.setProperty(LEGEND_HEIGHT_PROPERTY, `${height}px`)
      }
    })
    observer.observe(legend, { box: 'border-box' })
    return () => {
      observer.disconnect()
      container.style.removeProperty(LEGEND_HEIGHT_PROPERTY)
    }
  }, [ref, wraps])
}
