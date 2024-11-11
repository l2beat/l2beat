import { useState } from 'react'

interface Props {
  onSearch: (query: string) => void
}

export function Home(props: Props) {
  const [search, setSearch] = useState('')
  return (
    <div className="mx-auto max-w-4xl p-4 pt-10">
      <h1 className="mb-10 text-center font-bold text-3xl">
        Insight by L2BEAT
      </h1>
      <form
        className="flex items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault()
          if (search !== '') {
            props.onSearch(search)
          }
        }}
      >
        <input
          type="text"
          className="w-full max-w-sm border border-black p-4"
          placeholder="Input address or ENS name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  )
}
