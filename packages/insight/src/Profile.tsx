import clsx from 'clsx'
import { useState } from 'react'
import { Search } from './Search'
import ChevronDown from './assets/chevron-down.svg'
import ChevronRight from './assets/chevron-right.svg'
import LogoSmall from './assets/logo-small.svg'
import Red from './assets/red.svg'
import Yellow from './assets/yellow.svg'
import { TokensQueryResult, useTokens } from './hooks/useTokens'
import { ConnectedEntry, TokenEntry } from './schema'

interface Props {
  query: string
  onSearch: (query: string) => void
}

export function Profile(props: Props) {
  const response = useTokens(props.query)
  const funds = getFundsAtRisk(response)

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
      <table className="mb-10">
        <thead>
          <tr className="border-b border-b-zinc-600">
            <th className="py-1 pr-2 text-left">Type</th>
            <th className="px-2 py-1 text-right">Amount</th>
            <th className="px-2 py-1 text-left" colSpan={2}>
              Percentage
            </th>
          </tr>
        </thead>
        <tbody>
          <RiskRow
            title="High risk funds"
            value={funds?.highRisk}
            total={funds?.total}
            bgClassName="bg-red-600"
            textClassName="text-red-600"
          />
          <RiskRow
            title="Medium risk funds"
            value={funds?.mediumRisk}
            total={funds?.total}
            bgClassName="bg-yellow-400"
            textClassName="text-yellow-400"
          />
          <RiskRow
            title="Low risk funds"
            value={funds?.lowRisk}
            total={funds?.total}
            bgClassName="bg-zinc-400"
            textClassName="text-zinc-400"
          />
        </tbody>
      </table>
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
      {response.isSuccess && response.data.length === 0 && (
        <div className="flex h-20 w-full items-center justify-center bg-zinc-950 px-4">
          No tokens found
        </div>
      )}
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
            className="block h-4 w-4 min-w-4 rounded-full"
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
              className="relative top-0.5 h-10 w-10 rounded-full"
            />
            <img
              src={entry.chainLogoUrl}
              className="-bottom-0.5 -right-1.5 absolute h-6 w-6 rounded-full"
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
        <td className="w-0 max-w-40 overflow-hidden text-ellipsis whitespace-pre">
          {entry.issuer}
        </td>
        <td className="w-[25%] py-2" />
        <td>
          <div className="flex flex-gap-1 items-center justify-start whitespace-pre py-2 pr-4">
            {new Array(entry.severity.high).fill(0).map((_, i) => (
              <img key={i} className="h-5 w-5" src={Red} alt="High risk" />
            ))}
            {new Array(entry.severity.medium).fill(0).map((_, i) => (
              <img key={i} className="h-5 w-5" src={Yellow} alt="Medium risk" />
            ))}
            {entry.severity.high === 0 &&
              entry.severity.medium === 0 &&
              entry.severity.low > 0 && (
                <span className="text-zinc-400">{entry.severity.low} info</span>
              )}
            {entry.severity.high === 0 &&
              entry.severity.medium === 0 &&
              entry.severity.low === 0 &&
              `No issues`}
          </div>
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
            <div
              className={clsx(
                entry.tokenSeverity
                  ? severityToColor[entry.tokenSeverity]
                  : undefined,
              )}
            >
              {entry.tokenSeverity === 'medium' ? (
                <img
                  className="mr-1 inline-block"
                  src={Yellow}
                  alt="Medium risk"
                />
              ) : entry.tokenSeverity === 'high' ? (
                <img className="mr-1 inline-block" src={Red} alt="High risk" />
              ) : null}
              {entry.tokenInfo}
            </div>
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

function RiskRow(props: {
  title: string
  value?: number
  total?: number
  bgClassName: string
  textClassName: string
}) {
  const percent =
    props.value !== undefined && props.total !== undefined
      ? Math.round((props.value / props.total) * 100)
      : undefined
  return (
    <tr>
      <td className={clsx('py-1 pr-2', props.textClassName)}>{props.title}</td>
      <td className="px-2 py-1 text-right tabular-nums">
        {props.value !== undefined ? `$${formatNumber(props.value, 2)}` : '…'}
      </td>
      <td className="px-2 py-1">{percent !== undefined && percent + '%'}</td>
      <td className="px-2 py-1">
        <div
          className={clsx(props.bgClassName, 'h-5')}
          style={{
            width: percent !== undefined ? 2 * percent + 'px' : 0,
          }}
        ></div>
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
  if (address === 'native') {
    return 'Native token'
  }
  return `${chain}:${address?.slice(0, 6)}…${address?.slice(-4)}`
}

function getFundsAtRisk(response: TokensQueryResult) {
  if (!response.isSuccess) {
    return undefined
  }
  const highRisk = response.data.reduce(
    (acc, entry) => (entry.severity.high > 0 ? acc + entry.balanceUsd : acc),
    0,
  )
  const mediumRisk = response.data.reduce(
    (acc, entry) =>
      entry.severity.high === 0 && entry.severity.medium > 0
        ? acc + entry.balanceUsd
        : acc,
    0,
  )
  const lowRisk = response.data.reduce(
    (acc, entry) =>
      entry.severity.high === 0 && entry.severity.medium === 0
        ? acc + entry.balanceUsd
        : acc,
    0,
  )
  const total = response.data.reduce((acc, entry) => acc + entry.balanceUsd, 0)
  return {
    highRisk,
    mediumRisk,
    lowRisk,
    total,
  }
}
