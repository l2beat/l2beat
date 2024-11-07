import { Input } from '~/app/asset-risks/_components/input'
import { LensIcon } from '~/icons/lens'

interface FilterInputProps {
  filter?: string
  setFilter?: (value: string) => void
}

export function FilterInput(props: FilterInputProps) {
  return (
    <div className="relative">
      <Input
        value={props.filter}
        onChange={
          props.setFilter
            ? (e) => props.setFilter && props.setFilter(e.currentTarget.value)
            : undefined
        }
        placeholder="Search for asset"
        size="sm"
        className="peer w-[min(50vw,250px)] text-sm"
      />
      <button className="pointer-events-none absolute inset-y-0 right-[18px] peer-focus:[&>svg]:fill-white">
        <LensIcon className="size-4 fill-[#74749F] transition-colors duration-200" />
      </button>
    </div>
  )
}
