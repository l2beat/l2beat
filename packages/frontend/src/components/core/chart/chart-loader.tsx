import { cn } from '~/utils/cn'

export function ChartLoader({ isLoading }: { isLoading: boolean | undefined }) {
  return (
    <svg
      data-role="chart-loader"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-[58px] z-40 m-auto translate-y-[20%] select-none opacity-40 group-has-[.recharts-legend-wrapper]:top-[66px]',
        !isLoading && 'opacity-0',
      )}
      width="50px"
      height="50px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle cx="30" cy="50" className="fill-blue-700" r="20">
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="1s"
          keyTimes="0;0.5;1"
          values="30;70;30"
          begin="-0.5s"
        />
      </circle>
      <circle cx="70" cy="50" className="fill-red-200" r="20">
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="1s"
          keyTimes="0;0.5;1"
          values="30;70;30"
          begin="0s"
        />
      </circle>
      <circle cx="30" cy="50" className="fill-blue-700" r="20">
        <animate
          attributeName="cx"
          repeatCount="indefinite"
          dur="1s"
          keyTimes="0;0.5;1"
          values="30;70;30"
          begin="-0.5s"
        />
        <animate
          attributeName="fill-opacity"
          values="0;0;1;1"
          calcMode="discrete"
          keyTimes="0;0.499;0.5;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}
