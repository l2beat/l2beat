import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { get4ByteSignatures } from './api/FourByte'
import { SimpleValue } from './components/SimpleValue'
import { ValueHeading } from './components/ValueHeading'
import type { Value } from './decode/DecodedResult'
import { decode } from './decode/decode'

interface DecodedProps {
  encoded: `0x${string}`
}

export function Decoded(props: DecodedProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [customAbi, setCustomAbi] = useState<string | undefined>()

  const selector = props.encoded.slice(0, 10)

  const query = useQuery({
    enabled: isValidSelector(selector),
    queryKey: ['4byte', selector],
    queryFn: () => get4ByteSignatures(selector),
  })

  if (query.isLoading) {
    return <div>Loading...</div>
  }

  const signatures = []
  if (query.data) {
    signatures.push(...query.data.map((x) => `function ${x}`))
  }
  const decoded = customAbi
    ? decode(props.encoded, [customAbi])
    : decode(props.encoded, signatures)

  if (query.error) {
    return <div>Error: {query.error.message}</div>
  }

  const name =
    decoded?.type === 'function'
      ? decoded.name
      : decoded?.type === 'parameters'
        ? 'Custom parameters'
        : 'Unknown'

  const info = customAbi || selector

  return (
    <>
      <h2 className="mb-1">
        <span className="font-bold text-lg">{name}</span>{' '}
        <span className="pl-2 font-mono text-sm">{info}</span>
      </h2>
      {decoded.type === 'error' && (
        <div>
          <div className="mb-2 flex gap-2">
            <input
              ref={inputRef}
              className="block w-full rounded-sm bg-zinc-800 px-2.5 py-1 font-mono text-sm shadow-inner"
              placeholder="Input custom ABI"
            />
            <button
              className="rounded-sm border-zinc-900 border-b-4 bg-zinc-800 px-2.5 py-1 active:mt-1 active:border-b-0"
              onClick={() => setCustomAbi(inputRef.current?.value)}
            >
              Decode
            </button>
            <select
              className="rounded-sm border-zinc-900 border-b-4 bg-zinc-800 px-2.5 py-1 active:mt-1 active:border-b-0"
              value={customAbi}
              onChange={(e) => setCustomAbi(e.target.value)}
            >
              <option value="">Use plugin</option>
              <option value="plugin:multisend">multiSend</option>
              <option value="(address, address, uint256, uint256, uint256, bytes)">
                scheduleBatch
              </option>
              <option value="function upgrade((address, address, bytes32)[])">
                OPCM upgrade
              </option>
            </select>
          </div>
          {customAbi ? (
            <div className="text-red-600 text-xs">
              Cannot decode with provided ABI. See console for details.
            </div>
          ) : (
            <ol className="list-decimal pl-4 text-xs">
              <li>
                <span className="text-zinc-400">function</span>{' '}
                <code>function foo(address, uint)</code>
              </li>
              <li>
                <span className="text-zinc-400">a tuple</span>{' '}
                <code>(address, uint[], string)</code>
              </li>
              <li>
                <span className="text-zinc-400">multiple parameters</span>{' '}
                <code>address, bytes</code>
              </li>
            </ol>
          )}
        </div>
      )}
      {decoded && decoded?.type !== 'error' && (
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
        address={value.type === 'address' ? (value.value as string) : undefined}
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
