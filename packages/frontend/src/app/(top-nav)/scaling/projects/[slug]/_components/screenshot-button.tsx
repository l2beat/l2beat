'use client'
import html2canvas from 'html2canvas'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import {
  StageBadge,
  getStageTextClassname,
} from '~/components/badge/stage-badge'
import { useActivityChartRenderParams } from '~/components/chart/activity/use-activity-chart-render-params'
import { getChartType } from '~/components/chart/activity/utils/get-chart-type'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { Logo } from '~/components/logo'
import { NotSyncedBanner } from '~/components/not-synced/not-synced-banner'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/pizza-rosette-icon'
import { PizzaRosetteLabels } from '~/components/rosette/pizza/pizza-rosette-labels'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { CircleQuestionMarkIcon } from '~/icons/circle-question-mark'
import type { CostsTableData } from '~/server/features/scaling/costs/get-costs-table-data'
import type { ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'
import { api } from '~/trpc/react'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { getTvsParams } from './value-secured-summary'

interface CaptureComponentProps {
  project: ScalingProjectEntry
}

export default function CaptureComponent({ project }: CaptureComponentProps) {
  const componentRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const hasNotice =
    project.stageConfig.stage !== 'UnderReview' &&
    project.stageConfig.stage !== 'NotApplicable' &&
    !!project.stageConfig.additionalConsiderations
  const tvsParams = getTvsParams(project.header.tvs)

  const handleCaptureClick = async () => {
    if (!componentRef.current) return

    setIsLoading(true)
    console.log('start')
    if (componentRef.current) {
      componentRef.current.style.visibility = 'visible'
      componentRef.current.style.position = 'absolute'
    }

    const canvas = await html2canvas(componentRef.current, {
      height: 900,
      width: 1600,
      logging: false,
      useCORS: true,
      scale: 1,
    })

    if (componentRef.current) {
      componentRef.current.style.visibility = 'hidden'
      componentRef.current.style.position = 'fixed'
    }

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          }
        },
        'image/png',
        1.0,
      )
    })

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ])

    setIsLoading(false)
  }

  return (
    <div className="p-4">
      {/* Hidden component to capture */}
      <div
        ref={componentRef}
        style={{
          visibility: 'visible',
          position: 'fixed',
        }}
        className="bottom-0 left-0 z-[1000] flex h-[900px]  w-[1600px] flex-col items-center justify-between gap-2 bg-gradient-to-br from-black from-30% to-[#F546C1] px-12 py-3 text-brand-black shadow-md"
      >
        <Logo animated={false} className="dark" />
        <div className="flex size-full flex-col rounded-md bg-zinc-100 p-12">
          {/* Header */}
          <div className=" flex h-16 justify-between border-b border-zinc-300 pb-5">
            <div className="flex items-center justify-start gap-3">
              {project.slug && (
                <Image
                  className="size-16"
                  width={60}
                  height={60}
                  src={`/icons/${project.slug}.png`}
                  alt={`${project.name} logo`}
                />
              )}
              <span className="text-4xl font-bold">{project.name}</span>
              <div className="h-full w-px bg-zinc-300" />
              {project.stageConfig.stage !== 'NotApplicable' ? (
                <div className="mx-5 scale-150">
                  <StageBadge
                    stage={project.stageConfig.stage}
                    isAppchain={project.capability === 'appchain'}
                  />
                  {hasNotice && (
                    <CircleQuestionMarkIcon
                      className={cn(
                        'mt-0.5 inline-block size-5 fill-current',
                        getStageTextClassname(project.stageConfig.stage),
                      )}
                    />
                  )}
                </div>
              ) : null}
              <span className="text-2xl font-semibold">
                {project.header.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">TVS:</span>
              {(tvsParams?.breakdown && tvsParams.breakdown.total > 0) ||
              project.isArchived ? (
                <ValueWithPercentageChange
                  className="text-3xl font-bold leading-none md:text-3xl"
                  changeClassName="text-xs font-bold "
                  change={tvsParams.breakdown.totalChange}
                >
                  {formatCurrency(tvsParams.breakdown.total, 'usd')}
                </ValueWithPercentageChange>
              ) : (
                <NoDataBadge />
              )}
            </div>
          </div>
          {/* Body */}
          <div className="mt-8 grid h-full grid-cols-2 grid-rows-4 gap-4">
            <div className="flex">
              {project.header.badges?.map((b) => (
                <div className="shrink-0" key={b}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/badges/${b}.png`}
                    alt={`badge`}
                    className="h-24 w-auto"
                  />
                </div>
              ))}
            </div>
            <UopsSection project={project} />
            <CostsSection project={project} />
            <div className="relative row-span-2 flex flex-col rounded-xl bg-pure-white p-6">
              <span className="text-xl font-bold text-zinc-500">Risks</span>
              <div className={cn('absolute w-[272px] scale-75 p-12')}>
                <PizzaRosetteIcon
                  values={project.header.rosetteValues}
                  isUnderReview={project.underReviewStatus === 'config'}
                />
                <PizzaRosetteLabels
                  values={project.header.rosetteValues}
                  containerSize={272}
                  textRadius={102}
                />
              </div>
            </div>
            <div className="row-span-1 flex flex-col rounded-xl bg-pure-white p-6">
              <span className="text-xl font-bold text-zinc-500">Finality</span>
            </div>
          </div>
        </div>
        <span className="text-3xl font-semibold uppercase text-white">
          The heartbeat of the ecosystem
        </span>
      </div>
      {/* Visible capture button */}
      <div className="flex justify-center">
        <button
          onClick={handleCaptureClick}
          disabled={isLoading}
          className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Processing...
            </>
          ) : (
            'Capture'
          )}
        </button>
      </div>
    </div>
  )
}

function UopsSection({ project }: { project: ScalingProjectEntry }) {
  const { data: chart, isLoading } = api.activity.chart.useQuery({
    range: '30d',
    filter: {
      type: 'projects',
      projectIds: [project.slug],
    },
  })

  const type = getChartType(project.header.category)

  const { columns, valuesStyle, formatYAxisLabel } =
    useActivityChartRenderParams({
      milestones: [],
      chart,
      showMainnet: false,
      metric: 'uops',
      type,
    })

  return (
    <div className="row-span-2 flex flex-col rounded-xl bg-pure-white p-6">
      <span className="text-xl font-bold text-zinc-500">Past Day User Ops</span>
      {project.header.activity ? (
        <ValueWithPercentageChange
          change={project.header.activity.uopsWeeklyChange}
          className="font-medium !leading-none md:text-xl md:font-bold"
          changeClassName="md:text-base md:font-medium !leading-none"
        >
          {project.header.activity.lastDayUops.toFixed(2)}
        </ValueWithPercentageChange>
      ) : (
        <NoDataBadge />
      )}
      <ChartProvider
        columns={columns}
        valuesStyle={valuesStyle}
        formatYAxisLabel={formatYAxisLabel}
        range={'30d'}
        useLogScale
        isLoading={isLoading}
        renderHoverContents={() => null}
      >
        <section className="flex h-[180px] flex-col">
          <Chart className="mt-2" disableHovers />
          {chart?.syncWarning && (
            <NotSyncedBanner content={chart.syncWarning} />
          )}
        </section>
      </ChartProvider>
    </div>
  )
}

const COST_PROPERTIES: {
  id: keyof CostsTableData[string]['usd']
  title: string
  color: string
}[] = [
  {
    id: 'blobs',
    title: 'Blobs',
    color: '#FFBF87',
  },
  {
    id: 'calldata',
    title: 'Calldata',
    color: '#A080FF',
  },
  {
    id: 'overhead',
    title: 'Overhead',
    color: '#FF80D2',
  },
  {
    id: 'compute',
    title: 'Compute',
    color: '#87DBFF',
  },
]

function CostsSection({ project }: { project: ScalingProjectEntry }) {
  const { data } = api.costs.table.useQuery({
    range: '30d',
  })

  if (!data) return null

  const projectCostsData = data[project.slug]

  if (!projectCostsData) return null

  return (
    <div className="row-span-2 flex flex-col rounded-xl bg-pure-white p-6">
      <span className="text-xl font-bold text-zinc-500">
        Last 30 days costs
      </span>
      <span className="text-xl font-bold">
        {formatCurrency(projectCostsData?.usd.total, 'usd')}
      </span>
      <div className="mt-2 flex items-center gap-2">
        {COST_PROPERTIES.map((l) => (
          <div key={l.title} className="flex items-center gap-1">
            <div
              className="size-[10px] rounded-full"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-base font-medium text-zinc-500">
              {l.title}
            </span>
          </div>
        ))}
      </div>
      <div className="flex w-[640px] gap-1">
        {COST_PROPERTIES.map((p) => {
          const data = projectCostsData.usd[p.id]
          if (!data) return null

          return (
            <div
              key={p.id}
              style={{
                backgroundColor: p.color,
                width: `${(data / projectCostsData.usd.total) * 100}%`,
              }}
              className="relative h-10 rounded-full"
            >
              <span className="absolute -bottom-6 left-0 text-base font-bold text-zinc-500">
                {Math.round((data / projectCostsData.usd.total) * 100)}%
              </span>
            </div>
          )
        })}
      </div>
      {projectCostsData.uopsCount && (
        <>
          <span className="mt-8 text-xl font-bold text-zinc-500">
            Last 30 days avg cost per l2 uop
          </span>
          <span className="text-xl font-bold">
            {formatCurrency(
              projectCostsData.usd.total / projectCostsData.uopsCount,
              'usd',
              {
                decimals: 8,
              },
            )}
          </span>
        </>
      )}
    </div>
  )
}

const LoadingSpinner = () => (
  <svg
    className="size-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)
