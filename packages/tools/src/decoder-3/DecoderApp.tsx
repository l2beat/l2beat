import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { create } from 'zustand'
import { Form, type FormValues } from '../decoder-new/form/Form'
import * as API from './api'
import { decodeType } from './decode'

export function DecoderApp() {
  const [values, setValues] = useState<FormValues | undefined>()
  if (!values) return <Form onSubmit={setValues} />
  if (values.hash && !values.data)
    return <FetchTx values={values} setValues={setValues} />
  return <DecodedView values={values} />
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
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
      <main className="mx-auto max-w-[900px] p-4 pb-20">
        <div className="text-red-500">Something went wrong :(</div>
      </main>
    )
  }

  if (query.data === null) {
    return (
      <main className="mx-auto max-w-[900px] p-4 pb-20">
        Transaction {props.values.hash} not found.
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[900px] p-4 pb-20">
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
}

interface Actions {
  registerSelector(selector: `0x${string}`): void
  addSignatures(signatures: Signature[]): void
}

const useStore = create<State & Actions>((set) => ({
  selectors: {},
  pendingSelectors: {},
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
    <main className="mx-auto max-w-[900px] p-4 pb-20">
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
    <main className="mx-auto max-w-[900px] p-4 pb-20">
      <pre>
        <code>{JSON.stringify(value, null, 2)}</code>
      </pre>
    </main>
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
      <span>.</span>
      <span>{decoded.type.name}</span>
      <span>(</span>
      <span>{decoded.members?.length ?? 0}</span>
      <span>)</span>
    </div>
  )
}

function DisplayAddress(props: { address: `0x${string}` | undefined, chainId: number }) {
  return <span>{props.address ?? '?'}</span>
}
