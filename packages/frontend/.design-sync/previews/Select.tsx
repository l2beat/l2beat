import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@l2beat/frontend'

// Closed trigger — how Select appears inline in a toolbar most of the time.
export function Trigger() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="usd">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">USD</SelectItem>
          <SelectItem value="eth">ETH</SelectItem>
        </SelectContent>
      </Select>
      <Select disabled defaultValue="daily">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function OpenMenu() {
  return (
    <div className="flex justify-center py-4">
      <Select open defaultValue="arbitrum">
        <SelectTrigger className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Rollups</SelectLabel>
            <SelectItem value="arbitrum">Arbitrum One</SelectItem>
            <SelectItem value="optimism">OP Mainnet</SelectItem>
            <SelectItem value="base">Base</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
