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
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              colSpan={2}
              className="bg-surface-secondary px-4 py-3 text-left font-bold text-heading-16 md:text-heading-18"
            >
              Sequencer set spec sheet
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-divider border-t">
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-bold text-label-value-13 text-secondary md:w-[42%] md:min-w-[220px]"
              >
                {row.label}
              </th>
              <td className="px-4 py-3 align-top font-medium text-label-value-14">
                <SpecValue value={row.value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
