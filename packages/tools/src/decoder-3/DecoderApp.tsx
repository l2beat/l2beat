import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import {
  createContext,
  type FormEvent,
  Fragment,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { toFunctionSelector } from 'viem'
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
      <APIChecker />
      {showForm && <Form onSubmit={setValues} />}
      {showFetch && <FetchTx values={values} setValues={setValues} />}
      {showDecoded && (
        <main className="mx-auto max-w-[1200px] p-12 pb-20">
          <AbiManager />
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
    queryKey: ['chains'],
  })
  return <ChainsContext value={query.data ?? []} children={children} />
}

export function FetchTx(props: {
  values: FormValues
  setValues(values: FormValues): void
}) {
  const query = useQuery({
    queryFn: () =>
      API.lookupTx({
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
  }, [query.data, props.setValues])

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
  isLocal?: boolean
}

interface State {
  signatures: Record<`0x${string}`, Signature[]>
  requestedSignatures: Record<`0x${string}`, boolean>
  names: Record<`${number}:0x${string}`, string>
  requestedAddresses: Record<`${number}:0x${string}`, boolean>
  preimages: Record<`0x${string}`, string>
  requestedPreimages: Record<`0x${string}`, boolean>
  tooltipId: string
}

interface Actions {
  requestSignature(selector: `0x${string}`): void
  addSignatures(signatures: Signature[]): void
  removeSignature(signature: Signature): void
  requestAddress(chainId: number, address: `0x${string}`): void
  setName(chainId: number, address: `0x${string}`, name: string): void
  requestPreimage(hash: `0x${string}`): void
  setPreimage(hash: `0x${string}`, preimage: string): void
  showTooltip(id: string): void
}

function compareSignatures(a: Signature, b: Signature): number {
  function rank(x: Signature) {
    if (x.isLocal) return 2
    if (x.address) return 1
    return 0
  }
  const aRank = rank(a)
  const bRank = rank(b)
  // higher rank first
  if (aRank > bRank) return -1
  if (aRank < bRank) return 1
  // shorter signature first
  return a.signature.length - b.signature.length
}

const useStore = create<State & Actions>((set) => ({
  signatures: {},
  requestedSignatures: {},
  names: {},
  requestedAddresses: {},
  preimages: {},
  requestedPreimages: {},
  tooltipId: '',
  requestSignature: (selector) =>
    set((state) => {
      if (state.requestedSignatures[selector]) return {}
      return {
        requestedSignatures: { ...state.requestedSignatures, [selector]: true },
      }
    }),
  addSignatures: (newSignatures) =>
    set((state) => {
      const signatures = { ...state.signatures }
      for (const signature of newSignatures) {
        const array = signatures[signature.selector] ?? []
        if (
          array.find(
            (x) =>
              x.signature === signature.signature &&
              x.chainId === signature.chainId &&
              x.address === signature.address &&
              x.isLocal === signature.isLocal,
          )
        )
          continue
        signatures[signature.selector] = [...array, signature].sort(
          compareSignatures,
        )
      }
      return { signatures }
    }),
  removeSignature: (signature) =>
    set((state) => {
      const signatures = { ...state.signatures }
      let array = signatures[signature.selector] ?? []
      array = array.filter(
        (x) =>
          !(
            x.signature === signature.signature &&
            x.chainId === signature.chainId &&
            x.address === signature.address &&
            x.isLocal === signature.isLocal
          ),
      )
      signatures[signature.selector] = array
      return { signatures }
    }),
  requestAddress: (chainId, address) =>
    set((state) => {
      const prefixed: `${number}:0x${string}` = `${chainId}:${address}`
      if (state.requestedAddresses[prefixed]) return {}
      return {
        requestedAddresses: { ...state.requestedAddresses, [prefixed]: true },
      }
    }),
  setName: (chainId, address, name) =>
    set((state) => ({
      names: { ...state.names, [`${chainId}:${address}`]: name },
    })),
  requestPreimage: (hash) =>
    set((state) => {
      if (state.requestedPreimages[hash]) return {}
      return {
        requestedPreimages: { ...state.requestedPreimages, [hash]: true },
      }
    }),
  setPreimage: (hash, preimage) =>
    set((state) => ({ preimages: { ...state.preimages, [hash]: preimage } })),
  showTooltip: (id) =>
    set((state) => ({ tooltipId: state.tooltipId !== id ? id : '' })),
}))

// @ts-ignore
window.useStore = useStore

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

const apiRequested = new Set<string>()

function APIChecker() {
  const store = useStore()

  const requestedSignatures = useDebouncedValue(store.requestedSignatures, 100)
  const requestedAddresses = useDebouncedValue(store.requestedAddresses, 100)
  const requestedPreimages = useDebouncedValue(store.requestedPreimages, 100)

  useEffect(() => {
    const selectorsToFetch: string[] = []
    for (const selector in requestedSignatures) {
      if (!apiRequested.has(selector)) {
        selectorsToFetch.push(selector)
        apiRequested.add(selector)
      }
    }
    if (selectorsToFetch.length === 0) return
    API.lookupSignatures(selectorsToFetch as `0x${string}`[]).then((res) =>
      store.addSignatures(res),
    )
  }, [requestedSignatures, store.addSignatures])

  useEffect(() => {
    const addressesToFetch: string[] = []
    for (const address in requestedAddresses) {
      if (!apiRequested.has(address)) {
        addressesToFetch.push(address)
        apiRequested.add(address)
      }
    }
    for (const prefixed of addressesToFetch) {
      const [left, right] = prefixed.split(':')
      const chainId = Number(left)
      const address = right as `0x${string}`
      API.lookupAddress(chainId, address).then((res) => {
        if (res.name) store.setName(chainId, address, res.name)
        if (res.abi.length > 0) {
          store.addSignatures(
            res.abi.map((x) => ({
              selector: x.selector,
              signature: x.signature,
              address,
              chainId,
            })),
          )
        }
      })
    }
  }, [requestedAddresses, store.addSignatures, store.setName])

  useEffect(() => {
    const preimagesToFetch: string[] = []
    for (const hash in requestedPreimages) {
      if (!apiRequested.has(hash)) {
        preimagesToFetch.push(hash)
        apiRequested.add(hash)
      }
    }
    API.lookupPreimages(preimagesToFetch as `0x${string}`[]).then((res) => {
      for (const { hash, preimage } of res) {
        store.setPreimage(hash, preimage)
      }
    })
  }, [requestedPreimages, store.setPreimage])

  return null
}

interface LocalAbi {
  selector: `0x${string}`
  signature: string
}

function AbiManager() {
  const store = useStore()
  const [localAbis, setLocalAbis] = useState<LocalAbi[]>([])
  const [expanded, setExpanded] = useState(false)
  const [error, setError] = useState('')
  const [input, setInput] = useState('')

  useEffect(() => {
    const abis: LocalAbi[] = JSON.parse(
      localStorage.getItem('l2beat.decoder.abis') ?? '[]',
    )
    setLocalAbis(abis)
    store.addSignatures(abis.map((x) => ({ ...x, isLocal: true })))
  }, [])

  function addAbi(abi: LocalAbi) {
    if (localAbis.some((x) => x.signature === abi.signature)) return
    const newAbis = [...localAbis, abi]
    localStorage.setItem('l2beat.decoder.abis', JSON.stringify(newAbis))
    setLocalAbis(newAbis)
    store.addSignatures([{ ...abi, isLocal: true }])
  }

  function deleteAbi(abi: LocalAbi) {
    const newAbis = localAbis.filter((x) => x.signature !== abi.signature)
    localStorage.setItem('l2beat.decoder.abis', JSON.stringify(newAbis))
    setLocalAbis(newAbis)
    store.removeSignature({ ...abi, isLocal: true })
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    try {
      const selector = toFunctionSelector(input)
      addAbi({ selector, signature: input })
      setError('')
      setInput('')
    } catch {
      setError('Invalid ABI')
    }
  }

  return (
    <div className="mb-4 w-[600px]">
      <button className="text-zinc-500" onClick={() => setExpanded(!expanded)}>
        {expanded ? '[- ABI manager]' : '[+ ABI manager]'}
      </button>
      {expanded && (
        <>
          <form className="mt-2 w-full" onSubmit={(e) => submit(e)}>
            <div className="flex w-full gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. function foo(uint a, address b)"
                className="flex-1 bg-zinc-900 px-2 placeholder:text-zinc-500"
              />
              <button className="text-zinc-500" type="submit">
                [Add]
              </button>
            </div>
            {error && <div className="mt-2 text-red-500">{error}</div>}
          </form>
          <ul className="mt-2 w-full">
            {localAbis.map((abi, i) => (
              <li className="flex w-full items-center gap-2" key={i}>
                <button
                  className="text-zinc-500"
                  onClick={() => deleteAbi(abi)}
                >
                  [delete]
                </button>
                <span className="font-mono text-orange-600">
                  {abi.selector}
                </span>
                <span className="flex-1 text-zinc-200">{abi.signature}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function DecodedView({ value }: { value: DecodedValue }) {
  const store = useStore()
  const [lessMembers, setLessMembers] = useState(false)
  const [decoded, setDecoded] = useState(value)

  useEffect(() => {
    setDecoded(value)
  }, [value])

  useEffect(() => {
    if (decoded.type === 'bytes') {
      const selector = decoded.bytes.slice(0, 10) as `0x${string}`
      store.requestSignature(selector)
      const signatures =
        store.signatures[selector]?.map((x) => x.signature) ?? []
      const newDecoded = decode(
        decoded.bytes,
        signatures,
        decoded.chainId ?? 1,
        decoded.address,
      )
      if (newDecoded) setDecoded(newDecoded)
    }
    if (decoded.type === 'call') {
      const selector = decoded.bytes.slice(0, 10) as `0x${string}`
      const signatures =
        store.signatures[selector]?.map((x) => x.signature) ?? []
      const newDecoded = decode(
        decoded.bytes,
        signatures,
        decoded.chainId ?? 1,
        decoded.address,
      )
      if (newDecoded && newDecoded.functionAbi !== decoded.functionAbi)
        setDecoded(newDecoded)
    }
  }, [decoded, store.requestSignature, store.signatures])

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
    return (
      <div>
        {nameElement}
        <DisplayBytes bytes={decoded.bytes} />
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

function DisplayBytes(props: { bytes: `0x${string}` }) {
  const store = useStore()
  const [moreBytes, setMoreBytes] = useState(false)

  const preimage = store.preimages[props.bytes]

  useEffect(() => {
    if (props.bytes.length === 66) {
      store.requestPreimage(props.bytes)
    }
  }, [props.bytes, store.requestPreimage])

  if (preimage) {
    return (
      <ValueWithTooltip items={[{ name: 'Copy bytes', copy: props.bytes }]}>
        <span className="select-none font-mono text-zinc-500">hash(</span>
        <span className="select-none text-zinc-500">&ldquo;</span>
        <span>{preimage}</span>
        <span className="select-none text-zinc-500">&rdquo;</span>
        <span className="select-none font-mono text-zinc-500">)</span>
      </ValueWithTooltip>
    )
  }

  if (props.bytes.length <= 66) {
    return (
      <ValueWithTooltip items={[{ name: 'Copy', copy: props.bytes }]}>
        <span className="font-mono">{props.bytes}</span>
      </ValueWithTooltip>
    )
  }

  if (!moreBytes) {
    return (
      <>
        <ValueWithTooltip items={[{ name: 'Copy', copy: props.bytes }]}>
          <span className="font-mono">{props.bytes.slice(0, 66)}…</span>
        </ValueWithTooltip>
        <button
          className="ml-2 cursor-pointer text-zinc-500"
          onClick={() => setMoreBytes(true)}
        >
          [+ {props.bytes.length / 2 - 1} B]
        </button>
      </>
    )
  }
  const isCallLike = (props.bytes.length - 10) % 64 === 0
  return (
    <>
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
          {props.bytes}
        </span>
      </div>
    </>
  )
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
          <span className="select-none text-zinc-500">{format}</span>
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
  const store = useStore()
  const name =
    props.chainId && props.address
      ? store.names[`${props.chainId}:${props.address}`]
      : undefined

  const chains = useContext(ChainsContext)
  const chain = chains.find((x) => x.chainId === props.chainId)
  const explorer = chain?.explorerUrl || 'https://etherscan.io'

  useEffect(() => {
    if (props.address && props.chainId) {
      store.requestAddress(props.chainId, props.address)
    }
  }, [props.address, props.chainId, store.requestAddress])

  if (!props.address) return <span>?</span>

  return (
    <ValueWithTooltip
      items={[
        { name: 'Copy', copy: props.address },
        { name: 'Explorer', href: `${explorer}/address/${props.address}` },
        { name: props.address, copy: props.address },
      ]}
    >
      <span
        className={clsx(
          'font-mono',
          props.address === ADDRESS_ZERO ? 'text-zinc-500' : 'text-blue-400',
        )}
      >
        {props.short && (name ? name : props.address.slice(0, 6))}
        {!props.short && (
          <>
            {name} {props.address}
          </>
        )}
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
          {props.items
            .filter((x) => x.onClick || x.copy || x.href)
            .map((item, i) => (
              <Fragment key={i}>
                {i !== 0 && (
                  <span aria-hidden="true" className="text-zinc-500">
                    |
                  </span>
                )}
                {(item.onClick || item.copy) && (
                  <button
                    className="cursor-pointer rounded-md px-1.5 py-px hover:bg-zinc-700"
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
