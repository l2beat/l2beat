import { summarizeAddressUsage } from './addressUsage'
import { useAddressUsage } from './useAddressUsage'

export function UsageBadge(props: {
  address: string
  openedProject: string
  sourceProject: string
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
      className="rounded-sm bg-aux-yellow/20 px-1 font-mono text-2xs text-aux-yellow leading-4"
    >
      +{summary.places.length}
    </span>
  )
}
