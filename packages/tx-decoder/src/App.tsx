import { useState } from 'react'
import { Decoded } from './Decoded'

export function App() {
  const [encoded, setEncoded] = useState('')
  const [toDecode, setToDecode] = useState('')

  return (
    <div className="p-20">
      <textarea
        className="block bg-black"
        value={encoded}
        onChange={(e) => setEncoded(e.target.value)}
      />
      <button onClick={() => setToDecode(encoded)}>Decode</button>
      <div>{toDecode && <Decoded encoded={toDecode as `0x${string}`} />}</div>
    </div>
  )
}
