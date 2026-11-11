import { Checkbox } from '~/components/core/Checkbox'

interface Props {
  name: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function EthereumProjectsOnlyCheckbox({
  name,
  checked,
  onCheckedChange,
}: Props) {
  return (
    <Checkbox
      name={name}
      checked={checked}
      onCheckedChange={(checked) =>
        onCheckedChange(checked === 'indeterminate' ? false : checked)
      }
    >
      <span className="max-lg:hidden">
        Include only projects scaling Ethereum
      </span>
      <span className="lg:hidden">Ethereum scaling projects only</span>
    </Checkbox>
  )
}
