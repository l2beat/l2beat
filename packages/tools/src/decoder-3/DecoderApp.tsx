import { useQuery } from '@tanstack/react-query'
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { create } from 'zustand'
import { Form, type FormValues } from '../decoder-new/form/Form'
import * as API from './api'
import { decodeType } from './decode'

export function DecoderApp() {
  const [values, setValues] = useState<FormValues | undefined>()

  const showForm = !values
  const showFetch = values && values.hash && !values.data
  const showDecoded = values && !(values.hash && !values.data)

  return (
    <ChainsContextProvider>
      {showForm && <Form onSubmit={setValues} />}
      {showFetch && <FetchTx values={values} setValues={setValues} />}
      {showDecoded && <DecodedView values={values} />}
    </ChainsContextProvider>
  )
}

const ChainsContext = createContext<API.Chain[]>([])

function ChainsContextProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryFn: () => API.getChains(),
    queryKey: [],
  })
  return <ChainsContext value={query.data ?? []} children={children} />
}

export function FetchTx(props: {
  values: FormValues
  setValues(values: FormValues): void
}) {
  const query = useQuery({
    queryFn: () =>
      API.getTransaction({
        hash: props.values.hash as `0x${string}`,
        chainId: props.values.chainId || undefined,
      }),
    queryKey: [props.values.chainId, props.values.hash],
  })

  useEffect(() => {
    if (query.data) {
      props.setValues({
        address: query.data.to ?? '',
        chainId: query.data.chainId,
        data: query.data.data,
        hash: query.data.hash,
      })
    }
  }, [query.data])

  if (query.error) {
    return (
      <main className="mx-auto max-w-[1200px] p-12 pb-20">
        <div className="text-red-500">Something went wrong :(</div>
      </main>
    )
  }

  if (query.data === null) {
    return (
      <main className="mx-auto max-w-[1200px] p-12 pb-20">
        Transaction {props.values.hash} not found.
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1200px] p-12 pb-20">
      <div className="text-zinc-500">Loading...</div>
    </main>
  )
}

interface Signature {
  selector: `0x${string}`
  signature: string
  chainId?: number
  address?: `0x${string}`
}

interface State {
  selectors: Record<`0x${string}`, Signature[]>
  pendingSelectors: Record<`0x${string}`, boolean>
  tooltipId: string
}

interface Actions {
  registerSelector(selector: `0x${string}`): void
  addSignatures(signatures: Signature[]): void
  showTooltip(id: string): void
}

const useStore = create<State & Actions>((set) => ({
  selectors: {},
  pendingSelectors: {},
  tooltipId: '',
  registerSelector: (selector) =>
    set((state) => {
      if (state.selectors[selector] || state.pendingSelectors[selector]) {
        return {}
      }
      return {
        pendingSelectors: { ...state.pendingSelectors, [selector]: true },
      }
    }),
  addSignatures: (signatures) =>
    set((state) => {
      const selectors = { ...state.selectors }
      for (const signature of signatures) {
        const array = selectors[signature.selector] ?? []
        if (array.find((x) => x.signature === signature.signature)) continue
        selectors[signature.selector] = [...array, signature]
      }
      return { selectors }
    }),
  showTooltip: (id) =>
    set((state) => ({ tooltipId: state.tooltipId !== id ? id : '' })),
}))

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

function SelectorChecker() {
  const store = useStore()
  const pendingSelectors = useDebouncedValue(store.pendingSelectors, 100)
  const ref = useRef<Record<`0x${string}`, boolean>>({})

  useEffect(() => {
    const toFetch: `0x${string}`[] = []
    for (const s in pendingSelectors) {
      const selector = s as `0x${string}`
      if (!ref.current[selector]) {
        toFetch.push(selector)
      }
    }
    for (const selector of toFetch) {
      ref.current[selector] = true
    }
    if (toFetch.length > 0) {
      API.lookup({ selectors: toFetch, addresses: [] }).then((res) =>
        store.addSignatures(res),
      )
    }
  }, [pendingSelectors, ref, store.addSignatures])

  return null
}

function DecodedView({ values }: { values: FormValues }) {
  const store = useStore()
  const selector = values.data.slice(0, 10) as `0x${string}`
  useEffect(() => {
    if (selector.length === 10) {
      store.registerSelector(selector)
    }
  }, [selector, store.registerSelector])

  useEffect(() => {
    console.log(store.selectors)
  }, [store.selectors])

  const value = useMemo((): ValueToDecode => {
    return {
      hint: 'call',
      raw: values.data as `0x${string}`,
      chainId: values.chainId,
      address: values.address as `0x${string}` | undefined,
    }
  }, [values])

  return (
    <main className="mx-auto max-w-[1200px] p-12 pb-20">
      <SelectorChecker />
      <DecodedValue value={value} />
    </main>
  )
}

interface ValueToDecode {
  hint: Decoder
  name?: string
  raw: `0x${string}`
  chainId: number
  address?: `0x${string}`
}

type Decoder =
  | 'bytes'
  | 'hash'
  | 'number'
  | 'decimal6'
  | 'decimal9'
  | 'decimal18'
  | 'time'
  | 'duration'
  | 'boolean'
  | 'string'
  | 'array'
  | 'tuple'
  | 'call'

function DecodedValue({ value }: { value: ValueToDecode }) {
  const [decoder, setDecoder] = useState<Decoder>('bytes')
  useEffect(() => {
    setDecoder(value.hint)
  }, [value.hint])

  if (decoder === 'call') {
    return <DecodedCall value={value} />
  }

  return (
    <pre>
      <code>{JSON.stringify(value, null, 2)}</code>
    </pre>
  )
}

function DecodedCall({ value }: { value: ValueToDecode }) {
  const store = useStore()
  const selector = value.raw.slice(0, 10) as `0x${string}`
  const signature = store.selectors[selector]?.[0]
  if (!signature) return <div>????</div>
  const decoded = decodeType(signature.signature, value.raw)
  return (
    <div>
      <DisplayAddress address={value.address} chainId={value.chainId} />
      <span className="text-zinc-300">.</span>
      <span className="text-orange-300">{decoded.type.name}</span>
      <span className="text-zinc-300">(</span>
      <span>{decoded.members?.length ?? 0}</span>
      <span className="text-zinc-300">)</span>
    </div>
  )
}

function DisplayAddress(props: {
  address: `0x${string}` | undefined
  chainId: number
}) {
  const state = useStore()
  const tooltipId = useId()
  const chains = useContext(ChainsContext)
  const chain = chains.find((x) => x.chainId === props.chainId)
  if (!props.address) return <span>?</span>

  const start = props.address.slice(0, 8)
  const end = props.address.slice(-8)

  return (
    <span className="relative" onClick={() => state.showTooltip(tooltipId)}>
      {state.tooltipId === tooltipId && (
        <Tooltip>
          <TooltipItem
            onClick={() => navigator.clipboard.writeText(props.address ?? '')}
          >
            Copy
          </TooltipItem>
          {chain && (
            <TooltipItem href={`${chain.explorerUrl}/address/${props.address}`}>
              Explorer
            </TooltipItem>
          )}
        </Tooltip>
      )}
      <span className="cursor-pointer select-none font-mono text-blue-400">
        {chain?.shortName && <small>{chain.shortName}:</small>}
        {start}&#8230;{end}
      </span>
    </span>
  )
}

function Tooltip(props: { children?: ReactNode }) {
  const items = React.Children.toArray(props.children)
  return (
    <div className="-top-8 absolute left-[50%] flex translate-x-[-50%] rounded-md bg-zinc-800 font-sans text-zinc-300">
      {items.flatMap((child, index) =>
        index === items.length - 1
          ? [child]
          : [
              child,
              <span
                key={`separator-${index}`}
                aria-hidden="true"
                className="text-zinc-500"
              >
                |
              </span>,
            ],
      )}
    </div>
  )
}

function TooltipItem(props: {
  children?: ReactNode
  onClick?: () => void
  href?: string
}) {
  if (props.href) {
    return (
      <a
        className="rounded-md px-2 py-px hover:bg-zinc-700"
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.children}
      </a>
    )
  }
  return (
    <button
      className="cusor-pointer rounded-md px-2 py-px hover:bg-zinc-700"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
