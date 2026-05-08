import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import React, {
  createContext,
  Fragment,
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
import type { DecodedValue } from './decode'
import { formatNumber, getFormatHint } from './format'
import { decode } from './plugins'

export function DecoderApp() {
  const [values, setValues] = useState<FormValues | undefined>()

  const showForm = !values
  const showFetch = values && values.hash && !values.data

  const value: DecodedValue | undefined = useMemo(() => {
    if (!values) return undefined
    return {
      type: 'bytes',
      bytes: values.data as `0x${string}`,
      value: values.data as `0x${string}`,
      chainId: values.chainId,
      address: values.address as `0x${string}`,
    }
  }, [values])

  const showDecoded = values && value && !(values.hash && !values.data)

  return (
    <ChainsContextProvider>
      <SelectorChecker />
      {showForm && <Form onSubmit={setValues} />}
      {showFetch && <FetchTx values={values} setValues={setValues} />}
      {showDecoded && (
        <main className="mx-auto max-w-[1200px] p-12 pb-20">
          <DecodedView value={value} />
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

function DecodedView({ value }: { value: DecodedValue }) {
  const store = useStore()
  const [moreBytes, setMoreBytes] = useState(false)
  const [lessMembers, setLessMembers] = useState(false)
  const [decoded, setDecoded] = useState(value)

  useEffect(() => {
    setDecoded(value)
  }, [value])

  useEffect(() => {
    if (decoded.type === 'bytes') {
      const selector = decoded.bytes.slice(0, 10) as `0x${string}`
      store.registerSelector(selector)
      const signatures =
        store.selectors[selector]?.map((x) => x.signature) ?? []
      const newDecoded = decode(
        decoded.bytes,
        signatures,
        decoded.chainId ?? 1,
        decoded.address,
      )
      if (newDecoded) setDecoded(newDecoded)
    }
  }, [decoded, store.registerSelector, store.selectors])

  if (!decoded) return null

  const nameElement = value.name && (
    <>
      <span className="text-zinc-300">.</span>
      <span className="text-green-400">{value.name}</span>
      <span className="text-zinc-300"> = </span>
    </>
  )

  const members = decoded.members && decoded.members.length > 0 && (
    <>
      <button
        className="text-zinc-500"
        onClick={() => setLessMembers(!lessMembers)}
      >
        {!lessMembers && '[-]'}
        {lessMembers && decoded.members.length === 1 && '[+ 1 member]'}
        {lessMembers &&
          decoded.members.length > 1 &&
          `[+ ${decoded.members.length} members]`}
      </button>
      <ol className={clsx('pl-4', lessMembers && 'hidden')}>
        {decoded.members.map((m, i) => (
          <li key={i}>
            <DecodedView value={m} />
          </li>
        ))}
      </ol>
    </>
  )

  if (decoded.type === 'call') {
    return (
      <div className="group">
        {nameElement}
        <DisplayAddress
          short
          address={decoded.address}
          chainId={decoded.chainId}
        />
        <span className="text-zinc-300">.</span>
        <ValueWithTooltip
          items={[
            { name: 'Copy bytes', copy: decoded.bytes },
            { name: 'Copy selector', copy: decoded.bytes.slice(0, 10) },
            { name: 'Copy abi', copy: decoded.functionAbi },
          ]}
        >
          <span className="text-orange-400">{decoded.functionName}</span>
        </ValueWithTooltip>
        <span className="text-zinc-300">(</span>
        {members}
        <span className="text-zinc-300">)</span>
      </div>
    )
  }

  if (decoded.type === 'array' || decoded.type === 'tuple') {
    const isTuple = decoded.type === 'tuple'
    return (
      <div className="group">
        {nameElement}
        <span className="text-zinc-300">{isTuple ? '{' : '['}</span>
        {members}
        <span className="text-zinc-300">{isTuple ? '}' : ']'}</span>
      </div>
    )
  }

  if (decoded.type === 'bytes') {
    if (decoded.bytes.length <= 66) {
      return (
        <div>
          {nameElement}
          <ValueWithTooltip items={[{ name: 'Copy', copy: decoded.bytes }]}>
          <span className='font-mono'>{decoded.bytes}</span>
          </ValueWithTooltip>
        </div>
      )
    }

    if (!moreBytes) {
      return (
        <div>
          {nameElement}
          <ValueWithTooltip items={[{ name: 'Copy', copy: decoded.bytes }]}>
          <span className='font-mono'>{decoded.bytes.slice(0, 66)}…</span>
          </ValueWithTooltip>
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

  if (decoded.type === 'address') {
    return (
      <div>
        {nameElement}
        <DisplayAddress address={decoded.bytes} chainId={decoded.chainId} />
      </div>
    )
  }

  if (decoded.type === 'number') {
    return (
      <div>
        {nameElement}
        <DisplayNumber
          name={value.name}
          bytes={decoded.bytes}
          value={decoded.value}
        />
      </div>
    )
  }

  if (decoded.type === 'string') {
    return (
      <div>
        {nameElement}
        <ValueWithTooltip items={[{ name: 'Copy bytes', copy: decoded.bytes }]}>
          <span className="select-none text-zinc-500">&ldquo;</span>
          <span>{decoded.value}</span>
          <span className="select-none text-zinc-500">&rdquo;</span>
        </ValueWithTooltip>
      </div>
    )
  }

  if (decoded.type === 'bool') {
    return (
      <div>
        {nameElement}
        <ValueWithTooltip items={[{ name: 'Copy bytes', copy: decoded.bytes }]}>
          <span className="font-mono">{decoded.value}</span>
        </ValueWithTooltip>
      </div>
    )
  }
}

function DisplayNumber(props: {
  name?: string
  bytes: `0x${string}`
  value: string
}) {
  const [format, setFormat] = useState('e0')
  useEffect(() => {
    setFormat(getFormatHint(props.name ?? ''))
  }, [props.name, setFormat])

  return (
    <ValueWithTooltip
      items={[
        { name: 'Copy bytes', copy: props.bytes },
        { name: 'e0', onClick: () => setFormat('e0') },
        { name: 'e6', onClick: () => setFormat('e6') },
        { name: 'e8', onClick: () => setFormat('e8') },
        { name: 'e18', onClick: () => setFormat('e18') },
        { name: 'date', onClick: () => setFormat('date') },
        { name: 'seconds', onClick: () => setFormat('seconds') },
      ]}
    >
      <span className="font-mono">
        {formatNumber(props.value, format)}
        {format.startsWith('e') && format !== 'e0' && (
          <span className="text-zinc-500">{format}</span>
        )}
      </span>
    </ValueWithTooltip>
  )
}

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

function DisplayAddress(props: {
  address: `0x${string}` | undefined
  chainId: number | undefined
  short?: boolean
}) {
  const chains = useContext(ChainsContext)
  const chain = chains.find((x) => x.chainId === props.chainId)
  const explorer = chain?.explorerUrl || 'https://etherscan.io'
  if (!props.address) return <span>?</span>

  return (
    <ValueWithTooltip
      items={[
        { name: 'Copy', copy: props.address },
        { name: 'Explorer', href: `${explorer}/address/${props.address}` },
      ]}
    >
      <span
        className={clsx(
          'font-mono',
          props.address === ADDRESS_ZERO ? 'text-zinc-500' : 'text-blue-400',
        )}
      >
        {props.short ? <>{props.address.slice(0, 6)}</> : props.address}
      </span>
    </ValueWithTooltip>
  )
}

interface ValueWithTooltipProps {
  children: ReactNode
  items: {
    name: string
    onClick?: () => void
    copy?: string
    href?: string
  }[]
}

function ValueWithTooltip(props: ValueWithTooltipProps) {
  const tooltipId = useId()
  const state = useStore()
  return (
    <span className="relative" onClick={() => state.showTooltip(tooltipId)}>
      {state.tooltipId === tooltipId && (
        <div className="-top-8 absolute left-[50%] flex translate-x-[-50%] whitespace-nowrap rounded-md bg-zinc-800 font-sans text-zinc-300">
          {props.items.filter(x => x.onClick || x.copy || x.href).map((item, i) => (
            <Fragment key={i}>
              {i !== 0 && (
                <span aria-hidden="true" className="text-zinc-500">
                  |
                </span>
              )}
              {(item.onClick || item.copy) && (
                <button
                  className="cusor-pointer rounded-md px-1.5 py-px hover:bg-zinc-700"
                  onClick={
                    item.onClick ??
                    (() => navigator.clipboard.writeText(item.copy ?? ''))
                  }
                >
                  {item.name}
                </button>
              )}
              {item.href && (
                <a
                  className="rounded-md px-1.5 py-px hover:bg-zinc-700"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </a>
              )}
            </Fragment>
          ))}
        </div>
      )}
      <span className="cursor-pointer hover:bg-zinc-800">{props.children}</span>
    </span>
  )
}
