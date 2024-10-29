import React from 'react'
import ReactDOM from 'react-dom/client'

import { NodesApp } from './panel-nodes/NodesApp'
import { DiscoveryApp } from './DiscoveryApp'

const IS_DISCOVERY_UI = location.pathname.startsWith('/ui')
const App = IS_DISCOVERY_UI ? DiscoveryApp : NodesApp

// biome-ignore lint/style/noNonNullAssertion: We are sure it exists
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
