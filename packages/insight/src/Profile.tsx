import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { isAddress } from 'viem'
import ChevronDown from './assets/chevron-down.svg'
import ChevronRight from './assets/chevron-right.svg'
import LogoSmall from './assets/logo-small.svg'
import { useTokens } from './hooks/useTokens'
import { ConnectedEntry, TokenEntry } from './schema'

interface Props {
  query: string
  onSearch: (query: string) => void
}

export function Profile(props: Props) {
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const response = useTokens(props.query)

  useEffect(() => {
    if (response.ensStatus.isError) {
      setError(response.ensStatus.error?.message)
    }
  }, [response.isError, response.ensStatus.isError])

  return (
    <div className="mx-auto max-w-4xl p-4 pt-10">
      <div className="mb-10 flex items-center justify-between">
        <img
          src={LogoSmall}
          alt="Insight"
          onClick={() => props.onSearch('')}
          className="cursor-pointer"
        />
        <form
          className="flex items-center justify-end"
          onSubmit={(e) => {
            e.preventDefault()
            if (search.startsWith('0x') && !isAddress(search)) {
              setError('Invalid address')
              return
            } else if (!search.endsWith('0x') && !search.endsWith('.eth')) {
              setError('Invalid ENS')
              return
            }

            if (search !== '') {
              props.onSearch(search)
              setSearch('')
            }
          }}
        >
          {error && (
            <label
              className="px-2 font-semibold text-red-600"
              htmlFor="addressOrEns"
            >
              {error}
            </label>
          )}
          <input
            className={clsx(
              'w-60 border border-white bg-transparent px-4 py-1',
              error && 'focus:outline-rose-500',
            )}
            type="text"
            placeholder="Input address or ENS name"
            value={search}
            name="addressOrEns"
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <h1 className="mb-10 text-xl">Profile of {props.query}</h1>
      <table>
        <thead>
          <tr>
            <th />
            <th className="py-2 text-right">#</th>
            <th />
            <th className="py-2 text-right">Balance</th>
            <th />
            <th className="py-2 pl-14 text-left">Token</th>
            <th />
            <th className="py-2 text-left">Issuer</th>
            <th />
            <th className="py-2 text-left">Risks</th>
          </tr>
        </thead>
        <tbody>
          {response.isSuccess &&
            response.data.map((entry, i) => (
              <ProfileRow key={entry.address} entry={entry} i={i} />
            ))}
        </tbody>
      </table>
      {response.isPending && <div>Loading</div>}
      {response.tokensStatus.isError && (
        <div>{response.tokensStatus.error?.message}</div>
      )}
    </div>
  )
}

function ProfileRow({ entry, i }: { entry: TokenEntry; i: number }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <tr
        key={entry.address}
        className={clsx(
          'cursor-pointer border-zinc-600 border-t hover:bg-zinc-800',
          open && 'bg-zinc-800',
        )}
        onClick={() => setOpen(!open)}
      >
        <td className="w-12 px-4 py-2">
          <img
            src={open ? ChevronDown : ChevronRight}
            className="block h-4 w-4 min-w-4"
            width={16}
            height={16}
          />
        </td>
        <td className="w-0 py-2 text-right text-zinc-400">{i + 1}</td>
        <td className="w-[25%] py-2" />
        <td className="w-0 py-2 tabular-nums">
          <div className="text-right font-semibold text-lg text-yellow-400">
            ${formatNumber(entry.balanceUsd, 2)}
          </div>
          <div className="text-right">
            {formatNumber(entry.balanceUnits, 4)}
          </div>
        </td>
        <td className="w-[25%] py-2" />
        <td className="flex w-min gap-4 py-2">
          <div className="relative h-13 w-10 min-w-10">
            <img
              src={entry.assetLogoUrl}
              className="relative top-0.5 h-10 w-10"
            />
            <img
              src={entry.chainLogoUrl}
              className="-bottom-0.5 -right-1.5 absolute h-6 w-6"
            />
          </div>
          <div className="whitespace-pre">
            <div>
              {entry.assetName} on {entry.chainName}
            </div>
            <div>{formatAddress(entry.address)}</div>
          </div>
        </td>
        <td className="w-[25%] py-2" />
        <td className="w-0">{entry.issuer}</td>
        <td className="w-[25%] py-2" />
        <td className="w-0 whitespace-pre py-2">
          H: {entry.severity.high} M: {entry.severity.medium} L:{' '}
          {entry.severity.low}
        </td>
      </tr>
      {open && (
        <tr className="border-zinc-900 border-t bg-zinc-800">
          <td colSpan={11} className="h-full">
            <ExpandedRow entry={entry} />
          </td>
        </tr>
      )}
    </>
  )
}

function ExpandedRow({ entry }: { entry: ConnectedEntry }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10 min-w-10">
          <img src={entry.assetLogoUrl} className="h-10 w-10" />
          <img
            src={entry.chainLogoUrl}
            className="-bottom-1.5 -right-1.5 absolute h-6 w-6"
          />
        </div>
        <div>
          <div>
            {entry.assetName} on {entry.chainName}
          </div>
          <div>{formatAddress(entry.address)}</div>
        </div>
      </div>
      {entry.child && (
        <div className="mt-4 ml-8 border-gray-300 border-l-2 pl-4">
          <ExpandedRow entry={entry.child.entry} />
        </div>
      )}
    </div>
  )
}

function formatNumber(value: number, decimals: number) {
  const decimalPart = value.toFixed(decimals).slice(-decimals - 1)
  const intPart = new Intl.NumberFormat('en-US', {}).format(Math.floor(value))
  return intPart + decimalPart
}

function formatAddress(value: string) {
  const [chain, address] = value.split(':')
  if (address === 'native') {
    return 'Native token'
  }
  return `${chain}:${address?.slice(0, 6)}…${address?.slice(-4)}`
}
