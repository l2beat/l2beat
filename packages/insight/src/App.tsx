import { tokens } from './schema'

export function App() {
  return (
    <div>
      <h1>Hello World!</h1>
      <pre>
        <code>{JSON.stringify(tokens, null, 2)}</code>
      </pre>
    </div>
  )
}
