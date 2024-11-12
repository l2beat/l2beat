import clsx from 'clsx'
import { useState } from 'react'
import { isAddress } from 'viem'

export interface SearchProps {
  onSearch: (searchValue: string) => void
  isHome?: boolean
}

export function Search({ onSearch, isHome }: SearchProps) {
  const [error, setError] = useState<string | undefined>()
  const [search, setSearch] = useState('')

  return (
    <form
      className={clsx(
        'flex items-center justify-center',
        isHome && 'flex-col-reverse gap-4',
      )}
      onSubmit={(e) => {
        e.preventDefault()

        if (search.startsWith('0x') && !isAddress(search)) {
          setError('Invalid address')
          return
        } else if (!search.startsWith('0x') && !search.endsWith('.eth')) {
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
        className={clsx(
          isHome
            ? 'w-[500px] border border-white bg-zinc-900 p-4'
            : 'w-60 border border-white bg-transparent px-4 py-1',
          error && 'focus:outline-rose-500',
        )}
        placeholder="Input address or ENS name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  )
}
