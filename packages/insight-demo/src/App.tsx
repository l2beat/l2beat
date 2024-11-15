import { useState } from 'react'
import { Home } from './Home'
import { Profile } from './Profile'

export function App() {
  const [query, setQuery] = useState('')

  if (query === '') {
    return <Home onSearch={setQuery} />
  }

  return <Profile query={query} onSearch={setQuery} />
}
