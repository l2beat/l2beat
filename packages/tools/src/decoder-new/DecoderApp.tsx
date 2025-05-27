import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Form } from './form/Form'
import { callDecode } from './form/api'
import { CondensedView } from './view/CondensedView'
import { ExpandedView } from './view/ExpandedView'

export function DecoderApp() {
  const [search] = useSearchParams()
  if (search.size !== 0) {
    return <DecodedWrapper search={search} />
  }
  return <Form />
}

function DecodedWrapper({ search }: { search: URLSearchParams }) {
  const result = useQuery({
    queryFn: () => callDecode(search.toString()),
    queryKey: [search.toString()],
  })
  const [condensed, setCondensed] = useState(
    localStorage.getItem('condensed') === 'true',
  )
  function updateCondensed(condensed: boolean) {
    if (condensed) {
      localStorage.setItem('condensed', 'true')
      setCondensed(true)
    } else {
      localStorage.removeItem('condensed')
      setCondensed(false)
    }
  }

  if (result.isPending) {
    return <div className="text-zinc-500">Decoding...</div>
  }

  if (result.error) {
    return <div className="text-red-500">Something went wrong :(</div>
  }

  console.log(condensed, localStorage.getItem('condensed'))

  return (
    <main className="mx-auto max-w-[900px] p-4 pb-20">
      <div className="mb-4 flex">
        <button
          className={clsx(
            'mb-8 block rounded-l-sm border-zinc-900 border-b-4 bg-zinc-800 px-2 py-1 active:mt-1 active:border-b-0',
            !condensed && 'border-zinc-800 bg-zinc-600',
          )}
          onClick={() => updateCondensed(false)}
        >
          Expanded
        </button>
        <button
          className={clsx(
            'mb-8 block rounded-r-sm border-zinc-900 border-b-4 bg-zinc-800 px-2 py-1 active:mt-1 active:border-b-0',
            condensed && 'border-zinc-800 bg-zinc-600',
          )}
          onClick={() => updateCondensed(true)}
        >
          Condensed
        </button>
      </div>
      {condensed ? (
        <CondensedView decoded={result.data} />
      ) : (
        <ExpandedView decoded={result.data} />
      )}
    </main>
  )
}
