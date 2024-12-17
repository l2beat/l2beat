import { useState } from 'react'

export function SimulatorApp() {
  const [value, setValue] = useState('')

  function simulate() {
    console.log('Simulating')
  }

  return (
    <div className="mx-auto max-w-[900px] p-4 pb-20">
      <h1 className="mb-4 font-bold">Rabby to tenderly simulator</h1>
      <textarea
        className="mb-4 block w-full rounded-sm bg-zinc-800 px-2.5 py-1 font-mono text-sm shadow-inner"
        rows={5}
        value={value}
        placeholder="Raw Rabby transaction data (json)"
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="mb-8 rounded-sm border-zinc-900 border-b-4 bg-zinc-800 px-2.5 py-1 active:mt-1 active:border-b-0"
        onClick={simulate}
      >
        Simulate
      </button>
    </div>
  )
}
