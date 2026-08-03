import type {
  ProjectCentralizedSequencingSpec,
  TableReadyValue,
} from '@l2beat/config'
import { SentimentText } from '~/components/SentimentText'

interface Props {
  spec: ProjectCentralizedSequencingSpec
}

const SPEC_ROWS = [
  { key: 'trustedPreconfirmation', label: 'Trusted preconfirmation' },
  { key: 'trustedOrdering', label: 'Trusted ordering' },
  { key: 'sequencer', label: 'Sequencer' },
  { key: 'proverAndStateProposer', label: 'Prover and state proposer' },
  {
    key: 'realtimeCensorshipResistance',
    label: 'Real-time censorship resistance',
  },
  { key: 'forcedInclusion', label: 'Forced inclusion' },
  { key: 'inclusionDelay', label: 'Inclusion delay' },
  { key: 'inclusionMechanics', label: 'Inclusion mechanics' },
  { key: 'exitDelay', label: 'Exit delay' },
  { key: 'exitEconomics', label: 'Exit economics' },
] satisfies {
  key: keyof ProjectCentralizedSequencingSpec
  label: string
}[]

export function CentralizedSequencingSpecSheet({ spec }: Props) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-divider">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              colSpan={2}
              className="bg-surface-secondary px-4 py-3 text-left font-bold text-heading-16 md:text-heading-18"
            >
              Centralized sequencing spec sheet
            </th>
          </tr>
        </thead>
        <tbody>
          {SPEC_ROWS.map(({ key, label }) => (
            <tr key={key} className="border-divider border-t">
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-bold text-label-value-13 text-secondary md:w-[42%] md:min-w-[220px]"
              >
                {label}
              </th>
              <td className="px-4 py-3 align-top font-medium text-label-value-14">
                <SpecValue value={spec[key]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SpecValue({ value }: { value: TableReadyValue }) {
  return (
    <>
      <SentimentText
        sentiment={value.sentiment ?? 'neutral'}
        description={value.description}
        vibrant
        className="font-medium"
      >
        {value.value}
      </SentimentText>
      {value.secondLine && (
        <div className="mt-0.5 text-secondary">{value.secondLine}</div>
      )}
    </>
  )
}
