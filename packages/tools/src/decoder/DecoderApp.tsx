import { useState } from 'react'
import { Decoded } from './Decoded'

export function DecoderApp() {
  const [encoded, setEncoded] = useState('')
  const [toDecode, setToDecode] = useState('')

  function onChange(value: string) {
    value = value.replaceAll(/\s+/g, '')
    if (!/^(0x?)?[a-f0-9]*$/i.test(value)) {
      return
    }
    setEncoded(value.toLowerCase())
  }

  return (
    <div className="mx-auto max-w-[900px] p-4 pb-20">
      <h1 className="mb-4 font-bold">Recursive calldata decoder</h1>
      <textarea
        className="mb-4 block w-full rounded-sm bg-zinc-800 px-2.5 py-1 font-mono text-sm shadow-inner"
        rows={5}
        value={encoded}
        placeholder="Hex encoded transaction data. e.g. 0x1337dead..."
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="mb-8 rounded-sm border-zinc-900 border-b-4 bg-zinc-800 px-2.5 py-1 active:mt-1 active:border-b-0"
        onClick={() => setToDecode(encoded)}
      >
        Decode
      </button>
      {toDecode && <Decoded encoded={toDecode as `0x${string}`} />}
    </div>
  )
}
