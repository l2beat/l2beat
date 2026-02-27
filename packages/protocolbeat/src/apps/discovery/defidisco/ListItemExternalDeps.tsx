import { useEffect, useMemo, useState } from 'react'
import type {
  ApiAddressEntry,
  ApiContractTagsResponse,
} from '../../../api/types'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconFolder } from '../../../icons/IconFolder'
import { IconFolderOpened } from '../../../icons/IconFolderOpened'
import { usePanelStore } from '../store/panel-store'
import { AddressEntry } from './AddressEntry'

interface ListItemExternalDepsProps {
  entries: ApiAddressEntry[]
  chain: string
  contractTags: ApiContractTagsResponse | undefined
  onFocus?: () => void
}

export function ListItemExternalDeps({
  entries,
  chain,
  contractTags,
  onFocus,
}: ListItemExternalDepsProps) {
  const [open, setOpen] = useState(true)
  const selected = usePanelStore((state) => state.selected)

  const filteredEntries = entries.filter((entry) => entry.chain === chain)

  const { entityGroups, ungrouped, sortedEntities } = useMemo(() => {
    const groups = new Map<string, ApiAddressEntry[]>()
    const noEntity: ApiAddressEntry[] = []

    for (const entry of filteredEntries) {
      const entity = getEntity(entry.address, contractTags)
      if (entity) {
        const list = groups.get(entity) || []
        list.push(entry)
        groups.set(entity, list)
      } else {
        noEntity.push(entry)
      }
    }

    return {
      entityGroups: groups,
      ungrouped: noEntity,
      sortedEntities: [...groups.keys()].sort(),
    }
  }, [filteredEntries, contractTags])

  const hasEntities = sortedEntities.length > 0

  // Auto-expand when selected address is inside
  useEffect(() => {
    const selectedSet = new Set<string>(selected)
    for (const { address } of filteredEntries) {
      if (selectedSet.has(address)) {
        setOpen(true)
        onFocus?.()
        break
      }
    }
  }, [filteredEntries, selected, onFocus])

  if (filteredEntries.length === 0) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[22px] w-full cursor-pointer select-none items-center gap-1 pl-2 font-medium text-coffee-400 text-sm hover:bg-aux-brown hover:text-coffee-200"
      >
        {open ? (
          <>
            <IconChevronDown />
            <IconFolderOpened />
          </>
        ) : (
          <>
            <IconChevronRight />
            <IconFolder />
          </>
        )}
        <span className="text-aux-orange">External Dependencies</span>
      </button>
      {open && (
        <>
          {hasEntities ? (
            <>
              {sortedEntities.map((entity) => (
                <EntitySubfolder
                  key={entity}
                  entity={entity}
                  entries={entityGroups.get(entity) || []}
                  onFocus={() => {
                    setOpen(true)
                    onFocus?.()
                  }}
                />
              ))}
              {ungrouped
                .toSorted((a, b) => b.type.localeCompare(a.type))
                .map((entry) => (
                  <AddressEntry key={entry.address} entry={entry} />
                ))}
            </>
          ) : (
            <ol>
              {filteredEntries
                .toSorted((a, b) => b.type.localeCompare(a.type))
                .map((entry) => (
                  <AddressEntry key={entry.address} entry={entry} />
                ))}
            </ol>
          )}
        </>
      )}
    </>
  )
}

function EntitySubfolder({
  entity,
  entries,
  onFocus,
}: {
  entity: string
  entries: ApiAddressEntry[]
  onFocus?: () => void
}) {
  const [open, setOpen] = useState(true)
  const selected = usePanelStore((state) => state.selected)

  useEffect(() => {
    const selectedSet = new Set<string>(selected)
    for (const { address } of entries) {
      if (selectedSet.has(address)) {
        setOpen(true)
        onFocus?.()
        break
      }
    }
  }, [entries, selected, onFocus])

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[22px] w-full cursor-pointer select-none items-center gap-1 pl-4 font-medium text-coffee-400 text-sm hover:bg-aux-brown hover:text-coffee-200"
      >
        {open ? (
          <>
            <IconChevronDown />
            <IconFolderOpened />
          </>
        ) : (
          <>
            <IconChevronRight />
            <IconFolder />
          </>
        )}
        <span className="text-aux-orange">{entity}</span>
        <span className="text-coffee-500 text-xs">({entries.length})</span>
      </button>
      {open && (
        <ol>
          {entries
            .toSorted((a, b) => b.type.localeCompare(a.type))
            .map((entry) => (
              <AddressEntry key={entry.address} entry={entry} />
            ))}
        </ol>
      )}
    </>
  )
}

function getEntity(
  address: string,
  contractTags: ApiContractTagsResponse | undefined,
): string | undefined {
  if (!contractTags?.tags) return undefined
  const normalized = address.toLowerCase().replace('eth:', '')
  return contractTags.tags.find(
    (tag) =>
      tag.contractAddress.toLowerCase().replace('eth:', '') === normalized,
  )?.entity
}
