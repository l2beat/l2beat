import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { STAY_PRIVATE } from '../stayPrivateCopy'
import { PickerOption, PickerQuestion } from './Picker'

export function AdviceProtocolPicker({
  protocols,
  selected,
  onSelect,
}: {
  protocols: PrivacyAdviceProtocol[]
  selected: string | undefined
  onSelect: (slug: string) => void
}) {
  return (
    <PickerQuestion
      number={1}
      question={STAY_PRIVATE.protocolQuestion}
      note={STAY_PRIVATE.protocolNote}
      className="grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      {protocols.map((protocol) => (
        <PickerOption
          key={protocol.slug}
          name="protocol"
          value={protocol.slug}
          checked={protocol.slug === selected}
          onChange={() => onSelect(protocol.slug)}
          className="flex items-center gap-2 max-md:px-2.5 max-md:py-2"
        >
          <img
            src={protocol.icon}
            alt=""
            width={24}
            height={24}
            className="size-5 shrink-0 rounded-full md:size-6"
          />
          <span className="flex min-w-0 flex-col">
            <span className="font-bold text-label-value-14 leading-tight md:text-label-value-15">
              {protocol.name}
            </span>
            <span className="text-paragraph-12 text-secondary leading-tight">
              {protocol.category}
            </span>
          </span>
        </PickerOption>
      ))}
    </PickerQuestion>
  )
}
