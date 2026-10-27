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
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toFunctionSelector } from 'viem'
import { create } from 'zustand'
import * as API from './api'
import type { DecodedValue } from './decode'
import { Form, type FormValues } from './form/Form'
import { formatDecimals, formatNumber, getFormatHint } from './format'
import { HashReferencesProvider, useHashReferences } from './HashReferences'
import { findKnownHashes } from './knownHashes'
import {
  type DecoderLink,
  decompressCalldata,
  readLink,
  writeLink,
} from './link'
import { DECODE_AS_PRESETS, decode, decodeAs } from './plugins'
import { SafeHashes } from './SafeHashes'

export function DecoderApp() {
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const link = readLink(search)

  async function openLink(values: FormValues) {
    await navigate(`/decoder?${await writeLink(values)}`)
  }

  return (
    <ChainsContextProvider>
      <APIChecker />
      {!link && <Form onSubmit={(values) => void openLink(values)} />}
      {link?.type === 'invalid' && (
        <Message className="text-red-500">Invalid decoder link.</Message>
      )}
      {link?.type === 'transaction' && <TransactionLoader link={link} />}
      {link?.type === 'calldata' && <CalldataLoader link={link} />}
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

interface Transaction {
  hash?: `0x${string}`
  chainId: number
  to: `0x${string}` | undefined
  data: `0x${string}`
}

function TransactionLoader({
  link,
}: {
  link: Extract<DecoderLink, { type: 'transaction' }>
}) {
  const query = useQuery({
    queryFn: () => API.lookupTx({ hash: link.hash, chainId: link.chainId }),
    queryKey: ['transaction', link.chainId, link.hash],
  })

  if (query.error) {
    return <Message className="text-red-500">Something went wrong :(</Message>
  }
  if (query.data === null) {
    return <Message>Transaction {link.hash} not found.</Message>
  }
  if (!query.data) {
    return <Message className="text-zinc-500">Loading...</Message>
  }
  return <DecodedTransaction transaction={query.data} />
}

function CalldataLoader({
  link,
}: {
  link: Extract<DecoderLink, { type: 'calldata' }>
}) {
  const query = useQuery({
    queryFn: () => decompressCalldata(link.data),
    queryKey: ['calldata', link.data],
    retry: false,
  })

  if (query.error) {
    return <Message className="text-red-500">Invalid decoder link.</Message>
  }
  if (!query.data) {
    return <Message className="text-zinc-500">Loading...</Message>
  }
  return (
    <DecodedTransaction
      transaction={{ chainId: link.chainId, to: link.to, data: query.data }}
    />
  )
}

function DecodedTransaction({ transaction }: { transaction: Transaction }) {
  const value: DecodedValue = useMemo(
    () => ({
      type: 'bytes',
      bytes: transaction.data,
      value: transaction.data,
      chainId: transaction.chainId,
      address: transaction.to,
    }),
    [transaction],
  )

  return (
    <main className="mx-auto max-w-[1200px] p-12 pb-20">
      {transaction.hash && (
        <TransactionHeader
          hash={transaction.hash}
          chainId={transaction.chainId}
        />
      )}
      <AbiManager />
      <HashReferencesProvider>
        <DecodedView value={value} path="transaction" />
      </HashReferencesProvider>
    </main>
  )
}

function TransactionHeader(props: { hash: `0x${string}`; chainId: number }) {
  const chains = useContext(ChainsContext)
  const chain = chains.find((x) => x.chainId === props.chainId)
  const explorer = chain?.explorerUrl || 'https://etherscan.io'
  return (
    <div className="mb-4">
      <span className="text-zinc-500">tx </span>
      <a
        className="break-all font-mono text-blue-400"
        href={`${explorer}/tx/${props.hash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.hash}
      </a>
      <span className="text-zinc-500"> on {chain?.name ?? props.chainId}</span>
    </div>
  )
}

function Message(props: { className?: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[1200px] p-12 pb-20">
      <div className={props.className}>{props.children}</div>
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
  aliases: Record<`${number}:0x${string}`, API.AddressAlias>
  tokens: Record<`${number}:0x${string}`, API.TokenInfo>
  requestedAddresses: Record<`${number}:0x${string}`, boolean>
  preimages: Record<`0x${string}`, API.PreimageResult>
  requestedPreimages: Record<`0x${string}`, boolean>
  tooltipId: string
}

interface Actions {
  requestSignature(selector: `0x${string}`): void
  addSignatures(signatures: Signature[]): void
  removeSignature(signature: Signature): void
  requestAddress(chainId: number, address: `0x${string}`): void
  setName(chainId: number, address: `0x${string}`, name: string): void
  setAlias(
    chainId: number,
    address: `0x${string}`,
    alias: API.AddressAlias,
  ): void
  setToken(chainId: number, address: `0x${string}`, token: API.TokenInfo): void
  requestPreimage(hash: `0x${string}`): void
  setPreimage(preimage: API.PreimageResult): void
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
  aliases: {},
  tokens: {},
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
  setAlias: (chainId, address, alias) =>
    set((state) => ({
      aliases: { ...state.aliases, [`${chainId}:${address}`]: alias },
    })),
  setToken: (chainId, address, token) =>
    set((state) => ({
      tokens: { ...state.tokens, [`${chainId}:${address}`]: token },
    })),
  requestPreimage: (hash) =>
    set((state) => {
      if (state.requestedPreimages[hash]) return {}
      return {
        requestedPreimages: { ...state.requestedPreimages, [hash]: true },
      }
    }),
  setPreimage: (preimage) =>
    set((state) => ({
      preimages: { ...state.preimages, [preimage.hash]: preimage },
    })),
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
    void API.lookupSignatures(selectorsToFetch as `0x${string}`[]).then((res) =>
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
      void API.lookupAddress(chainId, address).then((res) => {
        if (res.name) store.setName(chainId, address, res.name)
        if (res.alias) store.setAlias(chainId, address, res.alias)
        if (res.token) store.setToken(chainId, address, res.token)
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
  }, [
    requestedAddresses,
    store.addSignatures,
    store.setName,
    store.setAlias,
    store.setToken,
  ])

  useEffect(() => {
    const preimagesToFetch: string[] = []
    for (const hash in requestedPreimages) {
      if (!apiRequested.has(hash)) {
        preimagesToFetch.push(hash)
        apiRequested.add(hash)
      }
    }
    void API.lookupPreimages(preimagesToFetch as `0x${string}`[]).then(
      (res) => {
        for (const preimage of res) {
          store.setPreimage(preimage)
        }
      },
    )
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

function DecodedView({ value, path }: { value: DecodedValue; path: string }) {
  const store = useStore()
  const anchor = useId()
  const { target } = useHashReferences()
  const [lessMembers, setLessMembers] = useState(false)
  const [decoded, setDecoded] = useState(value)

  useLayoutEffect(() => {
    if (
      target &&
      (target.path === path ||
        target.path.startsWith(`${path}.`) ||
        target.path.startsWith(`${path}[`))
    ) {
      setLessMembers(false)
    }
  }, [target, path])

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
            <DecodedView
              value={m}
              path={`${path}${/^\d+$/.test(m.name ?? '') ? `[${m.name}]` : `.${m.name ?? i}`}`}
            />
          </li>
        ))}
      </ol>
    </>
  )

  const extra = decoded.extra && (
    <div className="pl-4">
      <span className="text-amber-400">unexpected extra bytes </span>
      <DisplayBytes bytes={decoded.extra} />
    </div>
  )

  if (decoded.type === 'call') {
    return (
      <div
        id={anchor}
        tabIndex={-1}
        className="group scroll-mt-4 rounded-sm focus:outline-1 focus:outline-blue-400 focus:outline-solid"
      >
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
        {extra}
        {decoded.bytes.slice(0, 10).toLowerCase() === '0x6a761202' && (
          <SafeHashes
            key={`${decoded.chainId}:${decoded.address}:${decoded.bytes}`}
            calldata={decoded.bytes}
            address={decoded.address}
            chainId={decoded.chainId}
            path={path}
            anchor={anchor}
          />
        )}
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
        {extra}
      </div>
    )
  }

  if (decoded.type === 'bytes') {
    return (
      <div>
        {nameElement}
        <DisplayBytes bytes={decoded.bytes} />
        {decoded.bytes.length > 66 && (
          <DecodeAs
            bytes={decoded.bytes}
            chainId={decoded.chainId ?? 1}
            address={decoded.address}
            onDecode={setDecoded}
          />
        )}
        <HashMeaning hash={decoded.bytes} chainId={decoded.chainId} />
        {extra}
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
          token={decoded.token}
          chainId={decoded.chainId}
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
        {extra}
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

function DecodeAs(props: {
  bytes: `0x${string}`
  chainId: number
  address: `0x${string}` | undefined
  onDecode(value: DecodedValue): void
}) {
  const presetsId = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    try {
      props.onDecode(decodeAs(input, props.bytes, props.chainId, props.address))
    } catch {
      setError('Cannot decode the bytes as this type.')
    }
  }

  if (!open) {
    return (
      <button
        className="ml-2 cursor-pointer text-zinc-500"
        onClick={() => setOpen(true)}
      >
        [decode as]
      </button>
    )
  }

  return (
    <form className="pl-4" onSubmit={submit}>
      <div className="flex max-w-[600px] gap-2">
        <input
          autoFocus
          list={presetsId}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="address, bytes · (uint a, string b) · function foo(uint a) · multiSend"
          className="flex-1 bg-zinc-900 px-2 placeholder:text-zinc-500"
        />
        <datalist id={presetsId}>
          {DECODE_AS_PRESETS.map((preset) => (
            <option key={preset} value={preset} />
          ))}
        </datalist>
        <button className="text-zinc-500" type="submit">
          [decode]
        </button>
        <button
          className="text-zinc-500"
          type="button"
          onClick={() => setOpen(false)}
        >
          [cancel]
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  )
}

function HashMeaning({
  hash,
  chainId,
}: {
  hash: `0x${string}`
  chainId?: number
}) {
  const { entries, reveal } = useHashReferences()
  const matches = findKnownHashes(entries, hash, chainId)
  if (matches.length === 0) return null

  return (
    <div className="my-1 space-y-2 text-sm" aria-label="Known hash meaning">
      {matches.map((match) => (
        <div
          key={match.id}
          className={clsx(
            'border-l-2 pl-3',
            match.matchedNonce !== undefined
              ? 'border-amber-600'
              : 'border-green-700',
          )}
        >
          <div
            className={
              match.matchedNonce !== undefined
                ? 'text-amber-400'
                : 'text-green-400'
            }
          >
            {match.matchedNonce !== undefined
              ? `Matches Safe transaction with nonce ${match.matchedNonce} (selected nonce: ${match.nonce})`
              : 'Matches calculated Safe transaction hash'}
          </div>
          {match.matchedNonce !== undefined && (
            <div className="text-zinc-400">
              All other transaction fields match. The selected nonce has not
              been changed.
            </div>
          )}
          <DisplayAddress address={match.address} chainId={match.chainId} />
          <span className="text-zinc-400">
            {' '}
            · nonce {match.matchedNonce ?? match.nonce} · chain {match.chainId}
          </span>
          <div className="flex flex-wrap items-center gap-x-3">
            <span className="font-mono text-zinc-500">{match.path}</span>
            <button
              type="button"
              className="min-h-8 text-blue-400 hover:underline"
              aria-label={`View decoded transaction ${match.path}, Safe ${match.address}, matching nonce ${match.matchedNonce ?? match.nonce}`}
              onClick={() => reveal({ path: match.path, anchor: match.anchor })}
            >
              View decoded transaction →
            </button>
          </div>
        </div>
      ))}
    </div>
  )
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
        <span>{preimage.preimage}</span>
        <span className="select-none text-zinc-500">&rdquo;</span>
        <span className="select-none font-mono text-zinc-500">
          ){preimage.minusOne && ' - 1'}
        </span>
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
  token?: `0x${string}`
  chainId?: number
}) {
  const store = useStore()
  const token = props.token
    ? store.tokens[`${props.chainId ?? 1}:${props.token}`]
    : undefined
  const [format, setFormat] = useState('e0')
  useEffect(() => {
    setFormat(token ? 'token' : getFormatHint(props.name ?? ''))
  }, [props.name, token, setFormat])

  return (
    <ValueWithTooltip
      items={[
        { name: 'Copy bytes', copy: props.bytes },
        ...(token
          ? [{ name: token.name, onClick: () => setFormat('token') }]
          : []),
        { name: 'e0', onClick: () => setFormat('e0') },
        { name: 'e6', onClick: () => setFormat('e6') },
        { name: 'e8', onClick: () => setFormat('e8') },
        { name: 'e9', onClick: () => setFormat('e9') },
        { name: 'e18', onClick: () => setFormat('e18') },
        { name: 'date', onClick: () => setFormat('date') },
        { name: 'seconds', onClick: () => setFormat('seconds') },
      ]}
    >
      <span className="font-mono">
        {format === 'token' && token ? (
          <>
            {formatDecimals(props.value, token.decimals)}
            <span className="select-none text-zinc-500"> {token.name}</span>
          </>
        ) : (
          formatNumber(props.value, format)
        )}
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
  const alias =
    props.chainId && props.address
      ? store.aliases[`${props.chainId}:${props.address}`]
      : undefined
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
    <>
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
          {props.short &&
            (name ??
              (alias
                ? `alias${alias.context === 'unknown' ? ' match' : ''}(${alias.name})`
                : props.address.slice(0, 6)))}
          {!props.short && (
            <>
              {name} {props.address}
            </>
          )}
        </span>
      </ValueWithTooltip>
      {alias && !props.short && (
        <span
          className="block pl-4 text-sm text-zinc-400"
          aria-label="L1 address alias"
        >
          ↳{' '}
          {alias.context === 'l2'
            ? 'L2 alias of'
            : 'Matches OP / Arbitrum-style L2 alias of'}{' '}
          <ValueWithTooltip
            items={[
              { name: 'Copy L1 address', copy: alias.address },
              {
                name: 'L1 explorer',
                href: `${chains.find((chain) => chain.chainId === alias.chainId)?.explorerUrl ?? 'https://etherscan.io'}/address/${alias.address}`,
              },
            ]}
          >
            <span className="font-mono text-blue-400">
              {alias.name} {alias.address}
            </span>
          </ValueWithTooltip>{' '}
          · Ethereum
        </span>
      )}
    </>
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
