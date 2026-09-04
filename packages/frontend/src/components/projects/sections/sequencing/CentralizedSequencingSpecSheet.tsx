import type {
  ProjectCentralizedSequencingSpec,
  TableReadyValue,
} from '@l2beat/config'
import { SentimentText } from '~/components/SentimentText'
import {
  CENTRALIZED_SEQUENCING_FIELD_KEYS,
  CENTRALIZED_SEQUENCING_FIELDS,
} from './centralizedSequencingFields'

interface Props {
  spec: ProjectCentralizedSequencingSpec
}

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
          {CENTRALIZED_SEQUENCING_FIELD_KEYS.map((key) => (
            <tr key={key} className="border-divider border-t">
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-bold text-label-value-13 text-secondary md:w-[42%] md:min-w-[220px]"
              >
                {CENTRALIZED_SEQUENCING_FIELDS[key].label}
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
