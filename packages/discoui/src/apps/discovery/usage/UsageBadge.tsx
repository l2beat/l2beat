import clsx from 'clsx'
import { summarizeAddressUsage } from './addressUsage'
import { useAddressUsage } from './useAddressUsage'

export function UsageBadge(props: {
  address: string
  openedProject: string
  sourceProject: string
  isSelected: boolean
}) {
  const usage = useAddressUsage()
  if (usage.data === undefined) {
    return null
  }

  const summary = summarizeAddressUsage(
    usage.data,
    props.address,
    props.openedProject,
    props.sourceProject,
  )
  if (summary.status !== 'duplicated') {
    return null
  }

  return (
    <span
      title={`Also discovered in ${summary.places.map((x) => x.project).join(', ')}`}
      className={clsx(
        'rounded-sm px-1 font-mono text-2xs leading-4',
        props.isSelected
          ? 'bg-black/20 text-black'
          : 'bg-aux-yellow/20 text-aux-yellow',
      )}
    >
      +{summary.places.length}
    </span>
  )
}
