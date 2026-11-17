import { assert } from '@l2beat/shared-pure'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const root = document.getElementById('root')
assert(root !== null, 'Root element missing')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
