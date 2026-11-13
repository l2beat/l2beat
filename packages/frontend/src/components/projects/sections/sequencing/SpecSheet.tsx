import type { TableReadyValue } from '@l2beat/config'
import { SentimentText } from '~/components/SentimentText'

export interface SpecSheetRow {
  label: string
  value: TableReadyValue | undefined
}

interface Props {
  title: string
  rows: SpecSheetRow[]
}

export function SpecSheet({ title, rows }: Props) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-divider">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th
              colSpan={2}
              className="bg-surface-secondary px-4 py-3 text-left font-semibold text-heading-16"
            >
              {title}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            // The definition grid's shape: medium term in a 180px column,
            // regular value; stacked on phones.
            <tr
              key={row.label}
              className="border-divider border-t max-md:flex max-md:flex-col"
            >
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-medium text-label-value-14 leading-5 max-md:pb-1 md:w-[212px]"
              >
                {row.label}
              </th>
              <td className="px-4 py-3 align-top text-paragraph-14 max-md:pt-0 md:text-paragraph-15">
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

  // Neutral renders in the default text color, so values without a sentiment
  // look plain but still expose their description as a tooltip.
  return (
    <>
      <SentimentText
        sentiment={value.sentiment ?? 'neutral'}
        description={value.description}
        vibrant
        className="text-left"
      >
        {value.value}
      </SentimentText>
      {value.secondLine && (
        <div className="mt-0.5 text-label-value-13 text-secondary">
          {value.secondLine}
        </div>
      )}
    </>
  )
}
