import { NoDataIcon } from '~/components/NoDataIcon'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'

interface Props {
  name: string
  symbol: string
  isGasToken?: boolean
  syncStatus?: string
}

const MAX_CHARS = 20

export function TokenNameCell({ name, symbol, isGasToken, syncStatus }: Props) {
  return (
    <TwoRowCell>
      <TwoRowCell.First>
        <div>
          {/* tabIndex is required to make the div focusable */}
          <span className="group/token-name relative" tabIndex={0}>
            {name.slice(0, MAX_CHARS).trimEnd()}
            {name.length > MAX_CHARS && <span>&hellip;</span>}
            {name.length > MAX_CHARS && (
              <div className="absolute inset-y-0 hidden bg-primary text-primary-invert group-hover/token-name:block group-focus/token-name:block">
                {name}
              </div>
            )}
          </span>
          <span>{isGasToken && ' (gas)'}</span>
        </div>
        {syncStatus && <NoDataIcon content={syncStatus} />}
      </TwoRowCell.First>
      <TwoRowCell.Second>{symbol}</TwoRowCell.Second>
    </TwoRowCell>
  )
}
