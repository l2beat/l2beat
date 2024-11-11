import clsx from 'clsx'
import { useState } from 'react'
import { isAddress } from 'viem'

export interface SearchProps {
  onSearch: (searchValue: string) => void
  className?: string
}

export function Search({ onSearch, className }: SearchProps) {
  const [error, setError] = useState<string | undefined>()
  const [search, setSearch] = useState('')

  return (
    <form
      className="flex items-center justify-center"
      onSubmit={(e) => {
        e.preventDefault()

        if (search.startsWith('0x') && !isAddress(search)) {
          setError('Invalid address')
          return
        } else if (!search.endsWith('0x') && !search.endsWith('.eth')) {
          setError('Invalid ENS')
          return
        }

        if (search !== '') {
          onSearch(search)
          setError(undefined)
          setSearch('')
        }
      }}
    >
      {error && (
        <label
          className="px-2 font-semibold text-red-600"
          htmlFor="addressOrEns"
        >
          {error}
        </label>
      )}
      <input
        type="text"
        className={clsx(className, error && 'focus:outline-rose-500')}
        placeholder="Input address or ENS name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  )
}
