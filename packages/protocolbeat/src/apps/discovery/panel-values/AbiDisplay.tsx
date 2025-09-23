import { Fragment } from 'react/jsx-runtime'
import type { ApiAbi, ApiAbiEntry } from '../../../api/types'
import * as solidity from '../../../components/editor/languages/solidity'
import { partition } from '../../../utils/partition'
import { AddressDisplay } from './AddressDisplay'
import { Folder } from './Folder'

export function AbiDisplay({ abis }: { abis: ApiAbi[] }) {
  return (
    <ol>
      {abis.map((abi) => (
        <li key={abi.address}>
          <div className="px-5 pt-[3px] pb-0.5 font-mono text-xs">
            <AddressDisplay
              simplified
              value={{
                type: 'address',
                address: abi.address,
                addressType: 'Unknown',
              }}
            />
          </div>
          <AbiCode entries={abi.entries} />
        </li>
      ))}
    </ol>
  )
}

function AbiCode({ entries }: { entries: ApiAbiEntry[] }) {
  const readMarkers = [' view ', ' pure ']

  const [errors, nonErrors] = partition(entries, (e) =>
    e.value.startsWith('error'),
  )
  const [events, nonEvents] = partition(nonErrors, (e) =>
    e.value.startsWith('event'),
  )
  const [read, write] = partition(nonEvents, (e) =>
    readMarkers.some((marker) => e.value.includes(marker)),
  )

  return (
    <div>
      <Folder
        title={`Events (${events.length})`}
        collapsed={events.length === 0}
      >
        <AbiCodeEntries entries={events} />
      </Folder>
      <Folder
        title={`Read Functions (${read.length})`}
        collapsed={read.length === 0}
      >
        <AbiCodeEntries entries={read} />
      </Folder>
      <Folder
        title={`Write Functions (${write.length})`}
        collapsed={write.length === 0}
      >
        <AbiCodeEntries entries={write} />
      </Folder>
      <Folder title={`Errors (${errors.length})`} collapsed={true}>
        <AbiCodeEntries entries={errors} />
      </Folder>
    </div>
  )
}

function AbiCodeEntries({ entries }: { entries: ApiAbiEntry[] }) {
  const content =
    entries.length === 0 ? (
      <code>
        <span className="bg-coffee-400">// No abi</span>
      </code>
    ) : (
      <code>
        {entries.map((entry, i) => (
          <Fragment key={i}>
            {entry.value.split(/\b/).map((word, i) => (
              <span key={i} className={getClassName(word)}>
                {word}
              </span>
            ))}
            {entry.signature && (
              <span className="text-coffee-400"> // {entry.signature}</span>
            )}
            {entry.topic && (
              <span className="text-coffee-400"> // {entry.topic}</span>
            )}
            {i !== entries.length - 1 && <br />}
          </Fragment>
        ))}
      </code>
    )

  return (
    <pre className="overflow-x-auto bg-coffee-900 px-5 py-0.5 font-mono text-xs leading-[18px]">
      {content}
    </pre>
  )
}

function getClassName(word: string) {
  if (solidity.keywords.includes(word)) {
    return 'text-aux-orange'
  }
  if (solidity.typeNames.includes(word)) {
    return 'text-aux-red'
  }
  if (/\(|\)|,/.test(word)) {
    return 'text-coffee-400'
  }
}
