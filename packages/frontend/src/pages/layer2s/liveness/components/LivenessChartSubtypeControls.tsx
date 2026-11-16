import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'

interface Props {
  subtype: TrackedTxsConfigSubtype
  setSubtype: (subtype: TrackedTxsConfigSubtype) => void
  configuredSubtypes: TrackedTxsConfigSubtype[]
}

const VALUES: { value: TrackedTxsConfigSubtype; label: string }[] = [
  { value: 'batchSubmissions', label: 'Tx data' },
  { value: 'proofSubmissions', label: 'Proofs' },
  { value: 'stateUpdates', label: 'State updates' },
]

export function LivenessChartSubtypeControls({
  subtype,
  setSubtype,
  configuredSubtypes,
}: Props) {
  return (
    <RadioGroup
      name="livenessChartSubtype"
      value={subtype}
      onValueChange={setSubtype}
    >
      {VALUES.filter((x) => configuredSubtypes.includes(x.value)).map((x) => (
        <RadioGroupItem key={x.value} value={x.value}>
          {x.label}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  )
}
