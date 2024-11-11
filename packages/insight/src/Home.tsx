import { useState } from 'react'
import LogoDouble from './assets/logo-double.svg'

interface Props {
  onSearch: (query: string) => void
}

export function Home(props: Props) {
  const [search, setSearch] = useState('')
  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center">
      <h1 className="mb-10 text-center font-bold text-3xl">
        <img src={LogoDouble} alt="Insight by L2BEAT" />
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
          className="w-[500px] border border-white bg-zinc-900 p-4"
          placeholder="Input address or ENS name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  )
}
