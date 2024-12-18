import { type ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'

interface ChartLegendProps {
  className?: ClassNameValue
  elements: {
    name: string
    color: ClassNameValue
  }[]
}

export function ChartLegend(props: ChartLegendProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-wrap justify-center gap-2',
        props.className,
      )}
    >
      {props.elements.map((e) => (
        <div key={e.name} className="flex items-center gap-[3px]">
          <div className={cn('size-[10px] rounded-sm', e.color)} />
          <span className="text-2xs font-medium text-secondary">{e.name}</span>
        </div>
      ))}
    </div>
  )
}
