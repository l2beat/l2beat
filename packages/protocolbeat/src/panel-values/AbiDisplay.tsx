import { Fragment } from 'react/jsx-runtime'
import type { ApiAbi, ApiAbiEntry } from '../api/types'
import * as solidity from '../panel-code/solidity'
import { AddressDisplay } from './AddressDisplay'

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
          <pre className="overflow-x-auto bg-coffee-900 px-5 py-0.5 font-mono text-xs leading-[18px]">
            <AbiCode entries={abi.entries} />
          </pre>
        </li>
      ))}
    </ol>
  )
}

function AbiCode({ entries }: { entries: ApiAbiEntry[] }) {
  if (entries.length === 0) {
    return (
      <code>
        <span className="bg-coffee-400">// No abi</span>
      </code>
    )
  }

  return (
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
