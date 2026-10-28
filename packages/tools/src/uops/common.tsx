import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router'
import * as API from './api'

export const INPUT_CLASS =
  'block w-full rounded-xs bg-zinc-800 px-2 py-1 font-mono text-sm shadow-inner'

export function buttonClass(disabled: boolean) {
  return clsx(
    'rounded-xs border-zinc-900 border-b-4 bg-zinc-800 px-2.5 py-1',
    disabled && 'cursor-not-allowed opacity-60',
    !disabled && 'active:mt-1 active:border-b-0',
  )
}

export function UopsPage(props: { description: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[1200px] p-4 pb-20">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <h1 className="font-bold">User operations explorer</h1>
        <nav className="flex gap-4 font-mono text-sm">
          <UopsTab to="/uops">block</UopsTab>
          <UopsTab to="/uops/stats">stats</UopsTab>
        </nav>
      </div>
      <p className="mb-6 max-w-[900px] text-sm text-zinc-400">
        {props.description}
      </p>
      {props.children}
    </main>
  )
}

function UopsTab(props: { to: string; children: ReactNode }) {
  return (
    <NavLink
      end
      to={props.to}
      className={({ isActive }) =>
        clsx('underline', isActive ? 'text-orange-500' : 'text-zinc-500')
      }
    >
      {props.children}
    </NavLink>
  )
}

export function useChains() {
  return useQuery({ queryKey: ['uops-chains'], queryFn: API.getChains })
}

export function ChainSelect(props: {
  chains: API.UopsChainInfo[]
  value: string
  disabled?: boolean
  onChange: (chainId: string) => void
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm" htmlFor="uops-chain">
        Chain
      </label>
      <select
        className="rounded-xs bg-zinc-800 px-2 py-1 font-mono text-sm shadow-inner"
        id="uops-chain"
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.chains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ExplorerLink(props: {
  chain: API.UopsChainInfo | undefined
  path: string
  children: ReactNode
}) {
  if (!props.chain?.explorerUrl) {
    return <>{props.children}</>
  }
  return (
    <a
      className="text-orange-500 underline"
      href={`${props.chain.explorerUrl}/${props.path}`}
      target="_blank"
      rel="noreferrer"
    >
      {props.children}
    </a>
  )
}

export function Flags(props: {
  includesBatch?: boolean
  includesUnknown?: boolean
  subject: 'Transaction' | 'Block'
}) {
  return (
    <>
      {props.includesBatch && (
        <span
          className="ml-2 text-orange-400"
          title={`${props.subject} contains batch execution`}
        >
          [batch]
        </span>
      )}
      {props.includesUnknown && (
        <span
          className="ml-2 text-red-500"
          title={`${props.subject} contains unknown smart account implementation`}
        >
          [unknown]
        </span>
      )}
    </>
  )
}

export function Field(props: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-zinc-500">{props.label}</dt>
      <dd className="break-all">{props.children}</dd>
    </>
  )
}

export function FieldList(props: { children: ReactNode }) {
  return (
    <dl className="mb-8 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 font-mono text-sm">
      {props.children}
    </dl>
  )
}
