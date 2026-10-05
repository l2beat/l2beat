import { useQuery } from '@tanstack/react-query'
import {
  Fragment,
  type KeyboardEvent,
  Component as ReactComponent,
  type ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useIsClient } from '~/hooks/useIsClient'
import { useQueryParam } from '~/hooks/useQueryParam'
import type { DaFlowsProjects } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { buildDaFlowsGraph } from '../buildDaFlowsGraph'
import { DaFlowsCard } from '../DaFlowsCard'
import { DaFlowsPosters } from '../DaFlowsPosters'
import { getDaFlowsUnit } from '../daFlowsUnit'
import { BLOB_BYTES, type BlockLimits, toLabData } from './model'
import { scheduleBatches } from './schedule'
import type { LabVariant } from './types'
import { HUB_VARIANT_ID, LAB_VARIANTS } from './variants'

type Props = DaFlowsProjects & {
  detailsHref: string
  limits: BlockLimits
}

/**
 * Puts every way of drawing who posts blobs side by side, to pick one. The
 * pick is kept in the URL, so a variant can be shared as a link.
 */
export function BlobLab(props: Props) {
  const [variantId, setVariantId] = useQueryParam('viz', HUB_VARIANT_ID, {
    replaceState: true,
  })
  const variant =
    LAB_VARIANTS.find((v) => v.id === variantId) ?? LAB_VARIANTS[0]

  return (
    <section className="max-md:mt-4 md:mt-6">
      <VariantPicker
        selected={variant?.id ?? HUB_VARIANT_ID}
        onSelect={setVariantId}
      />
      {variant?.Component ? (
        <LabCard {...props} variant={variant} />
      ) : (
        <DaFlowsCard
          daLayer={props.daLayer}
          projects={props.projects}
          detailsHref={props.detailsHref}
          className="max-md:mt-0 md:mt-0"
        />
      )}
    </section>
  )
}

function VariantPicker({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  const description = LAB_VARIANTS.find((v) => v.id === selected)?.description

  // Arrow keys step through the variants, as in any radio group, so they can
  // be compared one after another without reaching for the pointer
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowLeft'
          ? -1
          : undefined
    if (step === undefined) return
    event.preventDefault()
    const index = LAB_VARIANTS.findIndex((v) => v.id === selected)
    const count = LAB_VARIANTS.length
    const next = LAB_VARIANTS[(index + step + count) % count]
    if (!next) return
    onSelect(next.id)
    event.currentTarget
      .querySelector<HTMLButtonElement>(`[data-variant="${next.id}"]`)
      ?.focus()
  }

  return (
    <div className="mb-3 flex flex-col gap-2 max-md:px-4 md:mb-4">
      <div
        role="radiogroup"
        aria-label="Visualization"
        onKeyDown={onKeyDown}
        // on a phone the pills run off the edge; the fade says there are more
        className="-mx-1 flex gap-1 overflow-x-auto px-1 py-1 max-md:pr-10 max-md:[mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)]"
      >
        {LAB_VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            data-variant={v.id}
            aria-checked={v.id === selected}
            tabIndex={v.id === selected ? 0 : -1}
            onClick={() => onSelect(v.id)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 font-bold text-label-value-14 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              v.id === selected
                ? 'bg-primary text-primary-invert'
                : 'bg-surface-primary text-secondary hover:text-primary',
            )}
          >
            {v.name}
          </button>
        ))}
      </div>
      <p className="max-w-[72ch] font-medium text-paragraph-14 text-secondary">
        {description}
      </p>
    </div>
  )
}

function LabCard({
  daLayer,
  projects,
  detailsHref,
  limits,
  variant,
}: Props & { variant: LabVariant }) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.da.flows.queryOptions({ daLayerId: daLayer.id }),
  )

  const { targetBlobsPerBlock, maxBlobsPerBlock } = limits
  const lab = useMemo(
    () =>
      data
        ? toLabData(daLayer, projects, data, {
            targetBlobsPerBlock,
            maxBlobsPerBlock,
          })
        : undefined,
    [data, daLayer, projects, targetBlobsPerBlock, maxBlobsPerBlock],
  )
  const batches = useMemo(
    () => (lab ? scheduleBatches(lab.posters, lab.maxBlobsPerBlock) : []),
    [lab],
  )
  // the list reads the same posters the hub would
  const graph = useMemo(
    () =>
      data
        ? buildDaFlowsGraph(
            daLayer,
            projects,
            data,
            Number.POSITIVE_INFINITY,
            BLOB_BYTES,
          )
        : undefined,
    [data, daLayer, projects],
  )

  // variants draw on canvases sized to the screen, which the server has not got
  const isClient = useIsClient()
  const [highlighted, setHighlighted] = useState<string>()
  const toggleHighlighted = useCallback(
    (id: string) =>
      setHighlighted((current) => (current === id ? undefined : id)),
    [],
  )

  const Component = variant.Component
  if (!Component) return null

  return (
    <PrimaryCard
      className={cn(
        'grid grid-cols-1 gap-4',
        !variant.fullWidth && 'lg:grid-cols-[1fr_320px]',
      )}
    >
      <div
        className={cn(
          'relative flex min-w-0 flex-col',
          !variant.fullWidth && 'lg:h-[44rem]',
        )}
      >
        {lab && !isLoading && isClient ? (
          // a fresh start when switching, so no variant inherits another's state
          <VariantBoundary key={variant.id} name={variant.name}>
            <Suspense fallback={<LabSkeleton />}>
              <Component
                data={lab}
                batches={batches}
                highlighted={highlighted}
                onSelect={toggleHighlighted}
              />
            </Suspense>
          </VariantBoundary>
        ) : (
          <LabSkeleton />
        )}
      </div>
      {!variant.fullWidth && (
        <div className="min-w-0 lg:h-[44rem]">
          <DaFlowsPosters
            detailsHref={detailsHref}
            posters={graph?.posters}
            totalPosted={graph?.totalPosted}
            isLoading={isLoading}
            highlighted={highlighted}
            unit={getDaFlowsUnit(daLayer.id)}
            getNodeId={(id) => id}
            onSelect={toggleHighlighted}
          />
        </div>
      )}
    </PrimaryCard>
  )
}

function LabSkeleton() {
  return <Skeleton className="h-[32rem] w-full rounded-lg lg:h-full" />
}

/** Keeps a broken variant from taking the page down with it */
class VariantBoundary extends ReactComponent<
  { name: string; children: ReactNode },
  { error: Error | undefined }
> {
  state = { error: undefined }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error === undefined) return this.props.children
    return (
      <div className="flex h-[32rem] flex-col items-center justify-center gap-2 rounded-lg bg-surface-secondary p-6 text-center lg:h-full">
        <div className="font-bold text-heading-18">
          {this.props.name} could not be drawn
        </div>
        <div className="max-w-[48ch] font-mono text-label-value-12 text-secondary">
          {String(this.state.error)}
        </div>
      </div>
    )
  }
}

/**
 * How to read a variant, under it: what a mark stands for and how fast time
 * runs. One line where it fits; on a phone, one item per line, as wrapped
 * separators would start lines.
 */
export function LabLegend({ items }: { items: ReactNode[] }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-2 font-medium text-label-value-12 text-secondary max-md:hidden">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="text-tertiary">|</span>}
            <span>{item}</span>
          </Fragment>
        ))}
      </div>
      <div className="space-y-1 text-center font-medium text-label-value-14 text-secondary md:hidden">
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </>
  )
}

/** A value in the legend, in the brand color like the hub's legend */
export function LegendValue({ children }: { children: ReactNode }) {
  return <span className="font-bold text-brand">{children}</span>
}
