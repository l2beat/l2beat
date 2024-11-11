import { useState } from 'react'
import { useTokens } from './hooks/useTokens'
import { TokenEntry } from './schema'

interface Props {
  query: string
  onSearch: (query: string) => void
}

export function Profile(props: Props) {
  const [search, setSearch] = useState('')
  const response = useTokens(props.query)

  return (
    <div className="mx-auto max-w-4xl p-4 pt-10">
      <form
        className="flex items-center justify-end"
        onSubmit={() => search !== '' && props.onSearch(search)}
      >
        <input
          className="w-60 border border-black px-4 py-1"
          type="text"
          placeholder="Input address or ENS name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <h1>Profile of {props.query}</h1>
      <table>
        <thead>
          <tr>
            <th />
            <th />
            <th className="text-right">#</th>
            <th />
            <th className="text-right">Balance</th>
            <th />
            <th className="pl-14 text-left">Token</th>
            <th />
            <th className="text-left">Issuer</th>
            <th />
            <th className="text-left">Risks</th>
          </tr>
        </thead>
        <tbody>
          {response.map((entry, i) => (
            <ProfileRow entry={entry} i={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProfileRow({ entry, i }: { entry: TokenEntry; i: number }) {
  const [open, setOpen] = useState(false)

  return (
    <tr
      key={entry.address}
      className="border-black border-t"
      onClick={() => setOpen(!open)}
    >
      <td className="w-0">{open ? 'V' : '>'}</td>
      <td className="w-[20%]" />
      <td className="w-0">{i + 1}</td>
      <td className="w-[20%]" />
      <td className="w-0">
        <div className="text-right">${formatNumber(entry.balanceUsd, 2)}</div>
        <div className="text-right">{formatNumber(entry.balanceUnits, 4)}</div>
      </td>
      <td className="w-[20%]" />
      <td className="flex w-min gap-4">
        <div className="relative h-10 w-10 min-w-10">
          <img src={entry.assetLogoUrl} className="h-10 w-10" />
          <img
            src={entry.chainLogoUrl}
            className="-bottom-1.5 -right-1.5 absolute h-6 w-6"
          />
        </div>
        <div className="whitespace-pre">
          <div>
            {entry.assetName} on {entry.chainName}
          </div>
          <div>{formatAddress(entry.address)}</div>
        </div>
      </td>
      <td className="w-[20%]" />
      <td className="w-0">{entry.issuer}</td>
      <td className="w-[20%]" />
      <td className="w-0 whitespace-pre">
        {new Array(entry.severity.high)
          .fill('HIGH')
          .concat(new Array(entry.severity.medium).fill('MED'))
          .join(' ')}
      </td>
    </tr>
  )
}

function formatNumber(value: number, decimals: number) {
  const decimalPart = value.toFixed(decimals).slice(-decimals - 1)
  const intPart = new Intl.NumberFormat('en-US', {}).format(Math.floor(value))
  return intPart + decimalPart
}

function formatAddress(value: string) {
  const [chain, address] = value.split(':')
  return `${chain}:${address?.slice(0, 6)}…${address?.slice(-4)}`
}
