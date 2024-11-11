import { useState } from 'react'
import { useTokens } from './useTokens'

interface Props {
  query: string
  onSearch: (query: string) => void
}

export function Profile(props: Props) {
  const [search, setSearch] = useState('')
  const response = useTokens(props.query)

  return (
    <div className="mx-auto max-w-4xl p-4 pt-10">
      <form
        className="flex items-center justify-end"
        onSubmit={() => search !== '' && props.onSearch(search)}
      >
        <input
          className="w-60 border border-black px-4 py-1"
          type="text"
          placeholder="Input address or ENS name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <h1>Profile for {props.query}</h1>
      {response.type === 'loading' && <div>Loading</div>}
      {response.type === 'success' && (
        <pre>
          <code>{JSON.stringify(response.data, null, 2)}</code>
        </pre>
      )}
    </div>
  )
}
