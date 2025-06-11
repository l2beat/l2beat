import React from 'react'
import ReactDOM from 'react-dom/client'

import { DiscoveryApp } from './DiscoveryApp'

// biome-ignore lint/style/noNonNullAssertion: We are sure it exists
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DiscoveryApp />
  </React.StrictMode>,
)
