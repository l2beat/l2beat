import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { useState } from 'react'
import { simulate } from './simulate'

export function SimulatorApp() {
  const [value, setValue] = useState('')
  const mutation = useMutation({
    mutationFn: (data: string) => simulate(JSON.parse(data)),
  })

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
        disabled={mutation.isPending}
        className={clsx(
          'mb-8 rounded-sm border-zinc-900 border-b-4 bg-zinc-800 px-2.5 py-1 active:mt-1 active:border-b-0',
          mutation.isPending && 'opacity-60',
        )}
        onClick={() => mutation.mutate(value)}
      >
        Simulate
      </button>
      {mutation.isError && (
        <p className="text-red-600">{mutation.error.message}</p>
      )}
      {mutation.isSuccess && 'link' in mutation.data && (
        <p>
          <a
            className="text-orange-500 underline"
            href={mutation.data.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            View simulation on tenderly
          </a>
        </p>
      )}
      {mutation.isSuccess && 'data' in mutation.data && (
        <pre className="text-mono text-red-600">
          <code>{JSON.stringify(mutation.data.data, null, 2)}</code>
        </pre>
      )}
    </div>
  )
}
