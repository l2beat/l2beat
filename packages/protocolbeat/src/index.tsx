import React from 'react'
import ReactDOM from 'react-dom/client'

import { App as BasicApp } from './App'
import { App as MultiApp } from './discovery-ui/App'

const IS_DISCOVERY_UI = location.pathname.startsWith('/ui')
const App = IS_DISCOVERY_UI ? MultiApp : BasicApp

// biome-ignore lint/style/noNonNullAssertion: We are sure it exists
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
