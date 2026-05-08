import { clsx } from 'clsx'
import { useReducer } from 'react'
import { INITIAL_STATE, reducer, type State, SUPPORTED_CHAINS } from './state'

export type FormValues = State['values']

export interface FormProps {
  onSubmit(data: FormValues): void
}

export function Form(props: FormProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const hasErrors =
    !!state.errors.hash || !!state.errors.data || !!state.errors.address
  const hasInput = !!state.values.hash || !!state.values.data
  const disabled = hasErrors || !hasInput || state.submitting

  function onSubmit() {
    dispatch({ type: 'submit' })
    props.onSubmit(state.values)
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
              dispatch({
                type: 'set chainId',
                value: Number.parseInt(e.target.value),
              })
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
        <div className="mb-4 flex h-5 items-center gap-2 text-sm before:h-px before:w-full before:bg-zinc-600" />
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
      <FormExamples
        setHash={(hash) => dispatch({ type: 'set hash', value: hash })}
      />
    </main>
  )
}

function FormExamples(props: { setHash: (hash: string) => void }) {
  if (process.env.NODE_ENV === 'production') return null
  const h = (hash: string) => () => props.setHash(hash)
  return (
    <>
      <h2>Examples:</h2>
      <ul>
        <li
          className="cursor-pointer text-blue-400"
          onClick={h(
            '0x079984c56c5670108f5c6f664904178f9b364340351949a42e4637d1f645f770',
          )}
        >
          Arbitrum KelpDAO rescue
        </li>
        <li
          className="cursor-pointer text-blue-400"
          onClick={h(
            '0x4abd06966262345c8c7bc536c65cfb6c250c7f7f75f48aad6f9abf61cad7e965',
          )}
        >
          Scroll SC upgrade
        </li>
      </ul>
    </>
  )
}
