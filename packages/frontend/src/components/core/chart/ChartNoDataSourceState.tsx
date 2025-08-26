export function ChartNoDataSourceState() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(50%-24px)] z-30 flex select-none flex-col items-center justify-center gap-4 text-center duration-200 dark:from-neutral-900">
      <span className="font-medium text-2xl text-yellow-700 leading-none dark:text-yellow-200">
        Please select at least one data source
      </span>
    </div>
  )
}
