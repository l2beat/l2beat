import { EllipsisText } from '~/components/EllipsisText'
import { NoDataIcon } from '~/components/NoDataIcon'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'

interface Props {
  name: string
  symbol: string
  isGasToken?: boolean
  syncStatus?: string
}

export function TokenNameCell({ name, symbol, isGasToken, syncStatus }: Props) {
  return (
    <TwoRowCell>
      <TwoRowCell.First>
        <div>
          <EllipsisText>{name}</EllipsisText>
          <span>{isGasToken && ' (gas)'}</span>
        </div>
        {syncStatus && <NoDataIcon content={syncStatus} />}
      </TwoRowCell.First>
      <TwoRowCell.Second>{symbol}</TwoRowCell.Second>
    </TwoRowCell>
  )
}
