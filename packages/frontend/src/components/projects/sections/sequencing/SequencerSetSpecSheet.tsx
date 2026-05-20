import type { ProjectSequencerSetSpec, TableReadyValue } from '@l2beat/config'
import { SentimentText } from '~/components/SentimentText'

interface Props {
  spec: ProjectSequencerSetSpec
}

const SPEC_ROWS = [
  { key: 'slotTime', label: 'Slot time (inclusion baseline)' },
  { key: 'epochTime', label: 'Epoch time' },
  { key: 'sequencerCount', label: 'Number of block producers' },
  { key: 'blockProductionAccess', label: 'Access to block production rights' },
  { key: 'stakePerValidator', label: 'Stake per validator' },
  { key: 'rateLimit', label: 'Rate-limit to join' },
  { key: 'deterministicCrGadget', label: 'Deterministic CR gadget' },
  { key: 'additionalCrGadgets', label: 'Additional CR gadgets' },
] satisfies { key: keyof ProjectSequencerSetSpec; label: string }[]

export function SequencerSetSpecSheet({ spec }: Props) {
  const rows = SPEC_ROWS.map(({ key, label }) => ({
    label,
    value: spec[key],
  }))

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-divider">
      <div className="bg-surface-secondary px-4 py-3 font-bold text-heading-16 md:text-heading-18">
        Sequencer set spec sheet
      </div>
      <dl className="divide-y divide-divider">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 px-4 py-3 md:grid-cols-[minmax(220px,0.42fr)_1fr] md:gap-4"
          >
            <dt className="font-bold text-label-value-13 text-secondary">
              {row.label}
            </dt>
            <dd className="font-medium text-label-value-14">
              <SpecValue value={row.value} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function SpecValue({ value }: { value?: TableReadyValue }) {
  if (!value) return <span className="text-secondary">Not specified</span>

  const content = value.sentiment ? (
    <SentimentText
      sentiment={value.sentiment}
      description={value.description}
      vibrant
      className="font-medium"
    >
      {value.value}
    </SentimentText>
  ) : (
    <span className="text-primary">{value.value}</span>
  )

  return (
    <>
      {content}
      {value.secondLine && (
        <div className="mt-0.5 text-secondary">{value.secondLine}</div>
      )}
    </>
  )
}
