import { clsx } from 'clsx'
import { useReducer } from 'react'

interface State {
  values: {
    hash: string
    data: string
    address: string
    chainId: string
  }
  errors: {
    hash?: string
    data?: string
    address?: string
  }
}

const INITIAL_STATE: State = {
  values: {
    hash: '',
    data: '',
    address: '',
    chainId: '1',
  },
  errors: {},
}

type Action =
  | { type: 'set hash'; value: string }
  | { type: 'set data'; value: string }
  | { type: 'set address'; value: string }
  | { type: 'set chainId'; value: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set hash': {
      const value = action.value.trim()
      return {
        ...state,
        values: {
          hash: value.toLowerCase(),
          data: '',
          address: '',
          chainId: value === '' ? '1' : '0',
        },
        errors: {
          hash:
            !value || /^0x[a-f\d]{64}$/i.test(value)
              ? undefined
              : 'Invalid transaction hash',
        },
      }
    }
    case 'set data': {
      const value = action.value.trim()
      return {
        ...state,
        values: {
          ...state.values,
          data: value.toLowerCase(),
          hash: '',
          chainId: state.values.hash !== '' ? '1' : state.values.chainId,
        },
        errors: {
          ...state.errors,
          hash: undefined,
          data:
            !value || /^0x([a-f\d]{2})*$/i.test(value)
              ? undefined
              : 'Invalid data',
        },
      }
    }
    case 'set address': {
      const value = action.value.trim()
      return {
        ...state,
        values: {
          ...state.values,
          address: value.toLowerCase(),
          hash: '',
          chainId: state.values.hash !== '' ? '1' : state.values.chainId,
        },
        errors: {
          ...state.errors,
          hash: undefined,
          address:
            !value || /^0x[a-f\d]{40}$/i.test(value)
              ? undefined
              : 'Invalid transaction hash',
        },
      }
    }
    case 'set chainId':
      return {
        ...state,
        values: { ...state.values, chainId: action.value, hash: '' },
        errors: {
          ...state.errors,
          hash: undefined,
        },
      }
  }
}

export function DecoderApp() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  return (
    <div className="mx-auto max-w-[800px] p-4 pb-20">
      <h1 className="mb-4 font-bold">Transaction data decoder</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
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
              dispatch({ type: 'set chainId', value: e.target.value })
            }
          >
            <option value="1">1: Ethereum</option>
            <option value="0">Other / Unknown</option>
          </select>
        </div>
        <div className="mb-4 flex h-5 items-center gap-2 text-sm before:h-px before:w-full before:bg-zinc-600"></div>
        <input
          type="submit"
          value="Decode"
          className="mb-8 rounded-sm border-zinc-900 border-b-4 bg-zinc-800 px-2 py-1 active:mt-1 active:border-b-0"
        />
      </form>
    </div>
  )
}
