import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { get4ByteSignatures } from './api/FourByte'
import { getOpenChainSignatures } from './api/OpenChain'
import { SimpleValue } from './components/SimpleValue'
import { ValueHeading } from './components/ValueHeading'
import { Value, decode } from './decode'

interface DecodedProps {
  encoded: `0x${string}`
}

export function Decoded(props: DecodedProps) {
  const selector = props.encoded.slice(0, 10)

  const q1 = useQuery({
    enabled: isValidSelector(selector),
    queryKey: ['openchain', selector],
    queryFn: () => getOpenChainSignatures(selector),
  })

  const q2 = useQuery({
    enabled: isValidSelector(selector),
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

  return (
    <>
      <h2 className="mb-1">
        <span className="font-bold text-lg">{decoded?.name ?? 'Unknown'}</span>{' '}
        <span className="pl-2 font-mono text-sm">{selector}</span>
      </h2>
      {decoded && (
        <ol>
          {decoded.values.map((v, i) => (
            <DecodedValue key={i} value={v} />
          ))}
        </ol>
      )}
    </>
  )
}

interface DecodedValueProps {
  value: Value
}

function DecodedValue({ value }: DecodedValueProps) {
  let options: string[] | undefined
  if (value.type === 'bytes') {
    options = ['raw', 'decoded']
  }
  if (value.type.includes('int')) {
    options = ['decimal', '18', '9', '6', 'time', 'date']
  }

  const [selected, setSelected] = useState(options?.[0])

  return (
    <li className="mb-4 last:mb-0">
      <ValueHeading
        stack={value.stack}
        type={value.type}
        options={options}
        selectedOption={selected}
        onSelect={setSelected}
      />
      {selected === 'decoded' && (
        <div className="my-1 rounded-sm border-zinc-700 border-l-[8px] px-5 py-1">
          <Decoded encoded={value.value as `0x${string}`} />
        </div>
      )}
      {!Array.isArray(value.value) && selected !== 'decoded' && (
        <SimpleValue
          type={value.type}
          value={value.value}
          transform={selected}
        />
      )}
      {Array.isArray(value.value) && selected !== 'decoded' && (
        <ol className="my-1 rounded-sm border-zinc-700 border-l px-5 py-1">
          {value.value.map((v, i) => (
            <DecodedValue key={i} value={v} />
          ))}
        </ol>
      )}
    </li>
  )
}

function isValidSelector(selector: string) {
  return selector.length === 10 && selector !== '0x00000000'
}
