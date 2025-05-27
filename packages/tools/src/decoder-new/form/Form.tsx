import { clsx } from 'clsx'
import { useReducer } from 'react'
import { useNavigate } from 'react-router'
import { getQueryParams } from './api'
import { INITIAL_STATE, SUPPORTED_CHAINS, reducer } from './state'

export function Form() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const hasErrors =
    !!state.errors.hash || !!state.errors.data || !!state.errors.address
  const hasInput = !!state.values.hash || !!state.values.data
  const disabled = hasErrors || !hasInput || state.submitting

  function onSubmit() {
    dispatch({ type: 'submit' })
    let data = (state.values.data as `0x${string}`) || undefined
    if (data !== undefined && data.length > 512) {
      localStorage.setItem('data', data)
      data = '0xLOCALSTORAGE'
    }
    const query = {
      hash: (state.values.hash as `0x${string}`) || undefined,
      data,
      to: (state.values.address as `0x${string}`) || undefined,
      chainId: state.values.chainId || undefined,
    }
    navigate(`/decoder-new/?${getQueryParams(query)}`)
  }

  return (
    <main className="mx-auto max-w-[900px] p-4 pb-20">
      <h1 className="mb-4 font-bold">Transaction data decoder</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <div className="mb-4">
          <label className="mb-1 block text-sm" htmlFor="hash">
            Transaction hash
          </label>
          <input
            className={clsx(
              'block w-full rounded-sm bg-zinc-800 px-2 py-1 font-mono text-sm shadow-inner',
              state.errors.hash && 'text-red-500',
            )}
            placeholder="0x1234... on any supported chain"
            type="text"
            name="hash"
            id="hash"
            value={state.values.hash}
            onChange={(e) =>
              dispatch({ type: 'set hash', value: e.target.value })
            }
          />
          {state.errors.hash && (
            <div className="text-red-500 text-sm">{state.errors.hash}</div>
          )}
        </div>
        <div className="mb-4 flex items-center gap-2 text-sm before:h-px before:w-full before:bg-zinc-600 after:h-px after:w-full after:bg-zinc-600">
          or
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm" htmlFor="data">
            Transaction data
          </label>
          <textarea
            name="data"
            id="data"
            className={clsx(
              'block w-full rounded-sm bg-zinc-800 px-2 py-1 font-mono text-sm shadow-inner',
              state.errors.data && 'text-red-500',
            )}
            rows={5}
            placeholder="Supports hex encoded tx data and json objects from Safe or Rabby."
            value={state.values.data}
            onChange={(e) =>
              dispatch({ type: 'set data', value: e.target.value })
            }
          />
          {state.errors.data && (
            <div className="text-red-500 text-sm">{state.errors.data}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm" htmlFor="to">
            To address
          </label>
          <input
            className={clsx(
              'block w-full rounded-sm bg-zinc-800 px-2 py-1 font-mono text-sm shadow-inner',
              state.errors.address && 'text-red-500',
            )}
            placeholder="0x1234..."
            type="text"
            name="to"
            id="to"
            value={state.values.address}
            onChange={(e) =>
              dispatch({ type: 'set address', value: e.target.value })
            }
          />
          {state.errors.address && (
            <div className="text-red-500 text-sm">{state.errors.address}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm" htmlFor="chainId">
            Chain id
          </label>
          <select
            className="rounded-sm bg-zinc-800 px-2 py-1 font-mono text-sm shadow-inner"
            name="chainId"
            id="chainId"
            value={state.values.chainId}
            onChange={(e) =>
              dispatch({ type: 'set chainId', value: parseInt(e.target.value) })
            }
          >
            {SUPPORTED_CHAINS.map((c) => (
              <option key={c.chainId} value={c.chainId}>
                {c.chainId}: {c.name}
              </option>
            ))}
            <option value={0}>Other / Unknown</option>
          </select>
        </div>
        <div className="mb-4 flex h-5 items-center gap-2 text-sm before:h-px before:w-full before:bg-zinc-600"></div>
        <input
          type="submit"
          value={state.submitting ? 'Decoding' : 'Decode'}
          disabled={disabled}
          className={clsx(
            'mb-8 rounded-sm border-zinc-900 border-b-4 bg-zinc-800 px-2 py-1',
            disabled && 'cursor-not-allowed opacity-60',
            !disabled && 'active:mt-1 active:border-b-0',
          )}
        />
      </form>
    </main>
  )
}
