import React from 'react'
import ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'

const queryClient = new QueryClient()

// biome-ignore lint/style/noNonNullAssertion: We are sure it exists
const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
