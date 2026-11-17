import { assert } from '@l2beat/shared-pure'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

const root = document.getElementById('root')
assert(root !== null, 'Root element missing')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
