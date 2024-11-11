import clsx from 'clsx'
import { useState } from 'react'
import { Search } from './Search'
import ChevronDown from './assets/chevron-down.svg'
import ChevronRight from './assets/chevron-right.svg'
import LogoSmall from './assets/logo-small.svg'
import Red from './assets/red.svg'
import Yellow from './assets/yellow.svg'
import { useTokens } from './hooks/useTokens'
import { ConnectedEntry, TokenEntry } from './schema'

interface Props {
  query: string
  onSearch: (query: string) => void
}

export function Profile(props: Props) {
  const response = useTokens(props.query)

  return (
    <div className="mx-auto max-w-4xl p-4 pt-10">
      <div className="mb-10 flex items-center justify-between">
        <img
          src={LogoSmall}
          alt="Insight"
          onClick={() => props.onSearch('')}
          className="cursor-pointer"
        />
        <Search onSearch={props.onSearch} />
      </div>
      <h1 className="mb-10 text-xl">Profile of {props.query}</h1>
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-700">
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
      {response.isLoading && (
        <div className="flex h-20 w-full items-center justify-center bg-zinc-950">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-e-transparent border-solid align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
      {response.isError && (
        <div className="flex h-20 w-full items-center justify-center bg-zinc-950 px-4 text-red-600">
          {response.error?.message}
        </div>
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
          'cursor-pointer border-zinc-600 border-t bg-zinc-900 hover:bg-zinc-800',
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
        <td className="w-0 whitespace-pre">{entry.issuer}</td>
        <td className="w-[25%] py-2" />
        <td className="w-0 whitespace-pre py-2 pr-4">
          <img className="mr-1 inline-block" src={Red} alt="High risk" />
          <img className="mr-1 inline-block" src={Yellow} alt="Medium risk" />
          H: {entry.severity.high} M: {entry.severity.medium} L:{' '}
          {entry.severity.low}
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={11} className="h-full bg-black">
            <ExpandedRow entry={entry} />
          </td>
        </tr>
      )}
    </>
  )
}

const severityToColor = {
  low: 'text-[#919191]',
  medium: 'text-[#E1FF00]',
  high: 'text-[#FF0000]',
}

function ExpandedRow({ entry }: { entry: ConnectedEntry }) {
  const address = entry.address.split(':')[1]
  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center gap-6 p-4">
          <div className="relative h-10 w-10 min-w-10">
            <img src={entry.assetLogoUrl} className="h-10 w-10" />
            <img
              src={entry.chainLogoUrl}
              className="-bottom-1.5 -right-1.5 absolute h-6 w-6"
            />
          </div>
          <div>
            <div className="flex items-center gap-[10px]">
              <div className="flex items-end gap-[10px] text-2xl">
                <span className="font-bold">{entry.assetName}</span>
                <div className="text-lg">
                  on&nbsp;
                  <span className="text-[#598BE8] underline">
                    {entry.chainName}
                  </span>
                </div>
              </div>
              <div className="size-[2px] bg-[#919191]" />
              <div className="text-[#919191]">Emitted by {entry.issuer}</div>
            </div>
            <span
              className={clsx(
                'text-sm',
                address === 'native' ? 'text-white' : 'text-[#598BE8]',
              )}
            >
              {address === 'native' ? 'Native token' : address}
            </span>
          </div>
        </div>
        {entry.child && (
          <div className="flex items-center gap-6 pl-9">
            <div className="h-8 w-[2px] gap-2 bg-[#919191]" />
            {entry.child?.bridgeSeverity === 'medium' ? (
              <img
                className="mr-1 inline-block"
                src={Yellow}
                alt="Medium risk"
              />
            ) : entry.child?.bridgeSeverity === 'high' ? (
              <img className="mr-1 inline-block" src={Red} alt="High risk" />
            ) : null}
            <span
              className={clsx(
                entry.child?.bridgeSeverity
                  ? severityToColor[entry.child?.bridgeSeverity]
                  : undefined,
              )}
            >
              {entry.child?.bridgeInfo}
            </span>
          </div>
        )}
      </div>
      {entry.child && <ExpandedRow entry={entry.child.entry} />}
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
