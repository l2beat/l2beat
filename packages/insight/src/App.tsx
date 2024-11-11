import { useState } from 'react'
import { Home } from './Home'
import { Profile } from './Profile'

export function App() {
  // TODO: remove vitalik
  const [query, setQuery] = useState('')

  if (query === '') {
    return <Home onSearch={setQuery} />
  }

  return <Profile query={query} onSearch={setQuery} />
}
