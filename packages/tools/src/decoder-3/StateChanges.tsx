import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { readState } from './api'
import type { DecodedValue } from './decode'
import { compareState, type StateChange, type StateRead } from './stateDiff'

export function StateChanges(props: {
  reads: StateRead[]
  address: `0x${string}`
  chainId: number
  renderValue(value: DecodedValue): ReactNode
}) {
  const calls = props.reads.map((read) => read.data)
  const query = useQuery({
    queryKey: ['read-state', props.chainId, props.address.toLowerCase(), calls],
    queryFn: () => readState(props.chainId, props.address, calls),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  })
  const changes =
    query.data && !query.isFetching
      ? props.reads.flatMap((read, i) =>
          compareState(read, query.data.results[i] ?? null),
        )
      : undefined

  return (
    <section
      aria-label="State changes"
      className="my-3 max-w-[900px] rounded-sm border border-zinc-700 bg-zinc-900 p-4 text-sm"
    >
      <h3 className="mb-2 font-semibold text-zinc-200">State changes</h3>
      {query.isFetching && (
        <p role="status" className="text-zinc-400">
          Reading current state from RPC…
        </p>
      )}
      {query.isError && !query.isFetching && (
        <p role="alert" className="text-red-400">
          Could not read current state from RPC.
        </p>
      )}
      {changes && query.data && (
        <>
          <p className="mb-2 text-zinc-400">
            Compared with the onchain state at block {query.data.blockNumber}.
            Earlier calls in the same transaction are not applied.
          </p>
          <table>
            <tbody>
              {changes.map((change) => (
                <tr key={change.label} className="align-top">
                  <td className="py-0.5 pr-4 font-mono text-zinc-300">
                    {change.label}
                  </td>
                  <td className={clsx('py-0.5 pr-4', statusColor(change))}>
                    {status(change)}
                  </td>
                  <td className="py-0.5">
                    {change.changed && change.current && (
                      <div>{props.renderValue(change.current)}</div>
                    )}
                    <div>
                      {change.changed && (
                        <span className="text-zinc-500">
                          {change.requirement ? 'must be ' : '→ '}
                        </span>
                      )}
                      {props.renderValue(change.next)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <button
        type="button"
        disabled={query.isFetching}
        onClick={() => void query.refetch()}
        className="mt-2 min-h-8 text-blue-400 disabled:opacity-50"
      >
        {query.isFetching ? 'Reading RPC…' : 'Refresh RPC state'}
      </button>
    </section>
  )
}

function status(change: StateChange) {
  if (change.changed === undefined) return 'could not read'
  if (change.requirement) {
    return change.changed
      ? 'required, not met: the call reverts'
      : 'required, met'
  }
  return change.changed ? 'changes' : 'unchanged'
}

function statusColor(change: StateChange) {
  if (change.requirement && change.changed) return 'text-red-400'
  if (change.requirement && change.changed === false) return 'text-green-400'
  return change.changed === false ? 'text-zinc-500' : 'text-amber-400'
}
