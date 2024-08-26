import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { get4ByteSignatures } from './api/FourByte'
import { getOpenChainSignatures } from './api/OpenChain'
import { Value, decode } from './decode'

interface DecodedProps {
  encoded: `0x${string}`
}

export function Decoded(props: DecodedProps) {
  const selector = props.encoded.slice(0, 10)

  const q1 = useQuery({
    queryKey: ['openchain', selector],
    queryFn: () => getOpenChainSignatures(selector),
  })

  const q2 = useQuery({
    queryKey: ['4byte', selector],
    queryFn: () => get4ByteSignatures(selector),
  })

  if (q1.isLoading || q2.isLoading) {
    return <div>Loading...</div>
  }

  const signatures = []
  if (q1.data) {
    signatures.push(...q1.data.map((x) => `function ${x}`))
  }
  if (q2.data) {
    signatures.push(...q2.data.map((x) => `function ${x}`))
  }
  const decoded = decode(props.encoded, signatures)

  const error = q1.error ?? q2.error
  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!decoded) {
    return <div>Unknown</div>
  }

  return (
    <>
      <h2 className="mb-4">
        <span className="font-bold text-lg">{decoded.name}</span>{' '}
        <span className="pl-2 font-mono text-sm">{decoded.signature}</span>
      </h2>
      <ol>
        {decoded.values.map((v, i) => (
          <DecodedValue key={i} value={v} />
        ))}
      </ol>
    </>
  )
}

interface DecodedValueProps {
  value: Value
}

function DecodedValue({ value }: DecodedValueProps) {
  return (
    <li className="mb-4 last:mb-0">
      <div>
        <span className="text-blue-400">{value.stack.join('.')}</span>
        <span className="pl-2 font-mono text-orange-500 text-sm">
          {value.type}
        </span>
      </div>
      {!Array.isArray(value.value) && (
        <SimpleValue type={value.type} value={value.value} />
      )}
      {Array.isArray(value.value) && (
        <ol className="my-1 rounded-sm bg-white bg-opacity-5 px-2.5 py-1">
          {value.value.map((v, i) => (
            <DecodedValue key={i} value={v} />
          ))}
        </ol>
      )}
    </li>
  )
}

interface SimpleValueProps {
  type: string
  value: string | bigint | boolean
}

function SimpleValue({ type, value }: SimpleValueProps) {
  if (typeof value === 'boolean') {
    return <div className="font-mono">{value.toString()}</div>
  }
  if (type === 'string') {
    return (
      <div className="w-full break-words">
        <span className="select-none text-white text-opacity-40">
          {'\u201C'}
        </span>
        <span className="font-serif text-lg">{value.toString()}</span>
        <span className="select-none text-white text-opacity-40">
          {'\u201D'}
        </span>
      </div>
    )
  }
  if (type === 'bytes' && typeof value === 'string') {
    const data = toTxData(value)
    return (
      <div className="font-mono">
        {data && <div>{data.selector}</div>}
        <Parts value={data?.bytes ?? value.slice(2)} />
      </div>
    )
  }
  return <div className="font-mono">{value.toString()}</div>
}

function Parts({ value }: { value: string }) {
  const bytes = toParts(value)
  return (
    <>
      {bytes.map((parts, i) => (
        <div key={i}>
          {parts.map((p, j) => (
            <span
              className={clsx(p.isZero && 'text-white text-opacity-40')}
              key={j}
            >
              {p.value}
            </span>
          ))}
        </div>
      ))}
    </>
  )
}

function toTxData(value: string) {
  if (value.length < 10 || (value.length - 10) % 64 !== 0) {
    return undefined
  }
  return {
    selector: value.slice(2, 10),
    bytes: value.slice(10),
  }
}

function toParts(value: string) {
  const length = Math.ceil(value.length / 64)
  return Array.from({ length }).map((_, i) => {
    const slice = value.slice(i * 64, (i + 1) * 64)
    interface Part {
      value: string
      isZero: boolean
    }
    let part: Part = {
      value: '',
      isZero: false,
    }
    const parts: Part[] = [part]
    for (let i = 0; i < 64; i += 2) {
      const byte = slice.slice(i, i + 2)
      const isZero = byte === '00'
      if (i === 0 || isZero === part.isZero) {
        part.value += byte
        part.isZero = isZero
      } else {
        part = { value: byte, isZero }
        parts.push(part)
      }
    }
    return parts
  })
}
