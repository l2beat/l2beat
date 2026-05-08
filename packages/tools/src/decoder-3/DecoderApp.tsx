import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { create } from 'zustand'
import { Form, type FormValues } from '../decoder-new/form/Form'
import * as API from './api'
import {
  type DecodedValue,
  decodeType,
  type ParsedType,
  parseType,
} from './decode'

export function DecoderApp() {
  const [values, setValues] = useState<FormValues | undefined>()

  const showForm = !values
  const showFetch = values && values.hash && !values.data
  const showDecoded = values && !(values.hash && !values.data)

  return (
    <ChainsContextProvider>
      <SelectorChecker />
      {showForm && <Form onSubmit={setValues} />}
      {showFetch && <FetchTx values={values} setValues={setValues} />}
      {showDecoded && (
        <main className="mx-auto max-w-[1200px] p-12 pb-20">
          <DecodedView
            encoded={values.data as `0x${string}`}
            chainId={values.chainId}
            address={values.address as `0x${string}` | undefined}
          />
        </main>
      )}
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
  registered: Record<`0x${string}`, boolean>
  tooltipId: string
}

interface Actions {
  registerSelector(selector: `0x${string}`): void
  addSignatures(signatures: Signature[]): void
  showTooltip(id: string): void
}

const useStore = create<State & Actions>((set) => ({
  selectors: {},
  registered: {},
  tooltipId: '',
  registerSelector: (selector) =>
    set((state) => {
      if (state.selectors[selector] || state.registered[selector]) {
        return {}
      }
      return {
        registered: { ...state.registered, [selector]: true },
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
  const pendingSelectors = useDebouncedValue(store.registered, 100)
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

interface DecodedViewProps {
  name?: string
  type?: ParsedType
  encoded: `0x${string}`
  chainId: number
  address?: `0x${string}`
}

function DecodedView(props: DecodedViewProps) {
  const store = useStore()
  const [decoded, setDecoded] = useState<DecodedValue>()
  const [moreBytes, setMoreBytes] = useState(false)
  const [lessMembers, setLessMembers] = useState(false)

  useEffect(() => {
    console.log({
      pending: Object.keys(store.registered),
      selectors: Object.keys(store.selectors),
    })
  }, [store.registered, store.selectors])

  useEffect(() => {
    if (decoded?.type.type === 'bytes') {
      const selector = decoded.bytes.slice(0, 10) as `0x${string}`
      store.registerSelector(selector)
    }
  }, [decoded, store.registerSelector])

  useEffect(() => {
    if (props.type) {
      try {
        setDecoded(decodeType(props.type, props.encoded))
        return
      } catch {}
    }
    setDecoded({
      type: parseType('bytes'),
      bytes: props.encoded,
      value: props.encoded,
    })
  }, [props.type, props.encoded, store.selectors])

  useEffect(() => {
    if (!decoded) return
    if (decoded.type.type === 'bytes') {
      const selector = decoded.bytes.slice(0, 10) as `0x${string}`
      const signature = store.selectors[selector]?.[0]
      if (signature) {
        const type = parseType(signature.signature)
        try {
          setDecoded(decodeType(type, decoded.bytes))
        } catch {}
      }
    }
  }, [decoded, store.selectors])

  if (!decoded) return null

  const nameElement = props.name && (
    <>
      <span className="text-zinc-300">.</span>
      <span className="text-green-400">{props.name}</span>
      <span className="text-zinc-300"> = </span>
    </>
  )

  const members = decoded.members && decoded.members.length > 0 && (
    <>
      <button
        className="text-zinc-500"
        onClick={() => setLessMembers(!lessMembers)}
      >
        {lessMembers ? `[+ ${decoded.members.length} items]` : '[-]'}
      </button>
      <ol className={clsx('pl-4', lessMembers && 'hidden')}>
        {decoded.members.map((m, i) => (
          <li key={i}>
            <DecodedView
              name={m.name}
              encoded={m.encoded}
              type={m.type}
              chainId={props.chainId}
            />
          </li>
        ))}
      </ol>
    </>
  )

  if (decoded.type.function) {
    return (
      <div className="group">
        {nameElement}
        <DisplayAddress address={props.address} chainId={props.chainId} />
        <span className="text-zinc-300">.</span>
        <span className="text-orange-400">{decoded.type.name}</span>
        <span className="text-zinc-300">(</span>
        {members}
        <span className="text-zinc-300">)</span>
      </div>
    )
  }

  if (decoded.type.arrayElement) {
    return (
      <div className="group">
        {nameElement}
        <span className="text-zinc-300">[</span>
        {members}
        <span className="text-zinc-300">]</span>
      </div>
    )
  }

  if (decoded.type.tupleElements) {
    return (
      <div className="group">
        {nameElement}
        <span className="text-zinc-300">{'{'}</span>
        {members}
        <span className="text-zinc-300">{'}'}</span>
      </div>
    )
  }

  if (decoded.type.type === 'bytes') {
    if (decoded.bytes.length < 66) {
      return (
        <div>
          {nameElement}
          <code>{decoded.bytes}</code>
        </div>
      )
    }

    if (!moreBytes) {
      return (
        <div>
          {nameElement}
          <code>{decoded.bytes.slice(0, 66)}…</code>
          <button
            className="ml-2 cursor-pointer text-zinc-500"
            onClick={() => setMoreBytes(true)}
          >
            [+ {decoded.bytes.length / 2 - 1} B]
          </button>
        </div>
      )
    }
    const isCallLike = (decoded.bytes.length - 10) % 64 === 0
    return (
      <div>
        {nameElement}
        <button
          className="cursor-pointer text-zinc-500"
          onClick={() => setMoreBytes(false)}
        >
          [-]
        </button>
        <div className="pl-4">
          <span
            className={clsx(
              'block break-all font-mono',
              isCallLike
                ? 'max-w-[74ch] pl-[10ch] indent-[-10ch]'
                : 'max-w-[66ch] pl-[2ch] indent-[-2ch]',
            )}
          >
            {decoded.bytes}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {nameElement}
      <code>{decoded.value}</code>
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
        {start}…{end}
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
