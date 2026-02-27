import clsx from 'clsx'
import type { ApiAddressEntry } from '../../../api/types'
import { AddressIcon } from '../../../components/AddressIcon'
import { toShortenedAddress } from '../../../utils/toShortenedAddress'
import { useGlobalSettingsStore } from '../store/global-settings-store'
import { usePanelStore } from '../store/panel-store'

export function AddressEntry({ entry }: { entry: ApiAddressEntry }) {
  const isSelected = usePanelStore((state) => state.selected === entry.address)
  const select = usePanelStore((state) => state.select)
  const markUnreachableEntries = useGlobalSettingsStore(
    (s) => s.markUnreachableEntries,
  )
  const isGrayedOut = markUnreachableEntries && !entry.isReachable

  return (
    <li
      className={clsx(
        'flex min-h-[22px] cursor-pointer select-none items-center gap-1 whitespace-pre pl-4 text-sm',
        isSelected && 'bg-autumn-300 text-black',
        !isSelected && 'bg-coffee-800 hover:bg-aux-brown',
      )}
      onClick={() => select(entry.address)}
      style={{
        opacity: isGrayedOut ? 0.2 : 1,
        filter: isGrayedOut ? 'grayscale(100%)' : 'none',
      }}
    >
      <div className="mr-[7px] min-h-[22px] border-coffee-600 border-l" />
      <AddressIcon type={entry.type} />
      <span className="overflow-hidden text-ellipsis tabular-nums">
        {entry.name ?? toShortenedAddress(entry.address)}
      </span>
    </li>
  )
}
