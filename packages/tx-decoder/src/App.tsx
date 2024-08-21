import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <div>Value: {count}</div>
    </>
  )
}
