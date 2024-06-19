import { useChartContext } from './chart-context'

export function ChartMilestones() {
  const { columns } = useChartContext()

  return (
    <div className="absolute bottom-0 z-40 w-full group-data-[interactivity-disabled]/chart:hidden">
      {columns.map(
        (c, i) =>
          c.milestone && (
            <ChartMilestone
              key={i}
              x={i / columns.length}
              url={c.milestone.link}
            />
          ),
      )}
    </div>
  )
}

const milestoneSize = 20

function ChartMilestone({
  x,
  url,
}: {
  x: number
  url: string
}) {
  const left = `calc(${x * 100}% - ${milestoneSize / 2}px)`
  const top = -milestoneSize / 2

  return (
    <div
      className="absolute select-none scale-75 md:scale-100"
      style={{ left, top }}
    >
      <a
        href={url}
        target="_blank"
        className="pointer-events-none md:pointer-events-auto"
      >
        <svg
          width={milestoneSize}
          height={milestoneSize}
          view-box={`0 0 ${milestoneSize} ${milestoneSize}`}
          role="img"
          aria-label="Milestone icon"
          className="fill-green-700 stroke-green-500"
        >
          <rect
            x="9.89941"
            y="1.41421"
            width="12"
            height="12"
            rx="1"
            transform="rotate(45 9.89941 1.41421)"
            stroke-width="2"
          />
        </svg>
      </a>
    </div>
  )
}
