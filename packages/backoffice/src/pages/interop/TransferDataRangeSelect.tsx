import { Label } from '~/components/core/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import {
  type InteropTransferDataRange,
  parseInteropTransferDataRange,
} from './transferDataRange'

interface TransferDataRangeSelectProps {
  value: InteropTransferDataRange
  onValueChange: (value: InteropTransferDataRange) => void
  disabled?: boolean
}

export function TransferDataRangeSelect({
  value,
  onValueChange,
  disabled = false,
}: TransferDataRangeSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="interop-transfer-data-range" className="sr-only">
        Transfer data range
      </Label>
      <Select
        value={value}
        onValueChange={(nextValue) =>
          onValueChange(parseInteropTransferDataRange(nextValue))
        }
        disabled={disabled}
      >
        <SelectTrigger id="interop-transfer-data-range" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last24h">Last 24 hours</SelectItem>
          <SelectItem value="lastPromoted">
            Last promoted aggregate (24h)
          </SelectItem>
          <SelectItem value="all">All retained data</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
